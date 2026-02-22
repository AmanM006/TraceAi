import { TraceAIConfig } from "./types";

export async function sendError(
  error: unknown,
  config: TraceAIConfig
) {
  const payload = {
    message: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : null,
    environment: config.environment,
  };

  try {
    console.log("📤 Sending error to /api/error", payload);
    
    const response = await fetch(config.endpoint || "/api/error", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-trace-api-key": config.apiKey,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("❌ Error response:", response.status, text);
      return;
    }

    const data = await response.json();
    console.log("✅ Error sent successfully:", data);
    
  } catch (err) {
    console.error("❌ TraceAI fetch failed:", err);
  }
}