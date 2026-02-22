from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from dotenv import load_dotenv
import os
import httpx

load_dotenv()

# -------------------- APP --------------------
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------- ENV --------------------
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
if not GOOGLE_API_KEY:
    raise RuntimeError("GOOGLE_API_KEY missing")

# -------------------- MODELS --------------------
class ErrorAnalysisRequest(BaseModel):
    error_id: str
    message: str
    stack: Optional[str] = None

class ErrorAnalysisResponse(BaseModel):
    error_id: str
    suggestion: str
    confidence: float

# -------------------- GEMINI FLASH (REST) --------------------
GEMINI_FLASH_URL = (
"https://generativelanguage.googleapis.com/v1beta/models/"
    "gemini-2.5-flash:generateContent")

async def call_gemini_flash(prompt: str) -> str:
    async with httpx.AsyncClient(timeout=30) as client:
        resp = await client.post(
            GEMINI_FLASH_URL,
            params={"key": GOOGLE_API_KEY},
            json={
                "contents": [
                    {
                        "parts": [{"text": prompt}]
                    }
                ]
            }
        )

        if resp.status_code != 200:
            raise RuntimeError(resp.text)

        return resp.json()["candidates"][0]["content"]["parts"][0]["text"]

# -------------------- ROUTES --------------------
@app.post("/analyze-error", response_model=ErrorAnalysisResponse)
async def analyze_error(req: ErrorAnalysisRequest):
    try:
        prompt = f"""
You are an expert software engineer analyzing runtime errors.

Error Message:
{req.message}

Stack Trace:
{req.stack or "No stack trace available"}

Provide:
1. Root cause (2–3 sentences)
2. Fix suggestions with code
3. Prevention best practices

Use markdown. Do NOT wrap your entire response inside ```markdown backticks.
"""

        suggestion = await call_gemini_flash(prompt)

        return ErrorAnalysisResponse(
            error_id=req.error_id,
            suggestion=suggestion,
            confidence=0.85,
        )

    except Exception as e:
        # 🟢 ADD THIS PRINT STATEMENT SO WE CAN SEE THE REAL ERROR
        print(f"🔥 GEMINI CRASH REASON: {str(e)}") 
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health():
    return {"status": "ok", "model": "gemini-1.5-flash"}

# -------------------- RUN --------------------
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
