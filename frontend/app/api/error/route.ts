import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabase";
import { fingerprintError } from "../../../lib/fingerprint";
import { normalizeMessage, normalizeStack } from "../../../lib/normalize";

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, x-trace-api-key",
    },
  });
}

export async function POST(req: Request) {
  // Move this to the top so it's available for all returns
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, x-trace-api-key",
  };

  try {
    const body = await req.json();
    const apiKey = req.headers.get("x-trace-api-key");

    const rawMessage = typeof body.message === "string" ? body.message : "Unknown error";
    const rawStack = typeof body.stack === "string" ? body.stack : null;
    
    const normalizedMessage = normalizeMessage(rawMessage);
    const normalizedStack = normalizeStack(rawStack);
    const fingerprint = fingerprintError(normalizedMessage, normalizedStack);

    if (!apiKey) {
      // ✅ ADDED HEADERS HERE
      return NextResponse.json({ error: "Missing API key" }, { status: 401, headers: corsHeaders });
    }

    const { data: project, error: projectError } = await supabase
      .from("projects")
      .select("id")
      .eq("api_key", apiKey)
      .single();

    if (!project || projectError) {
      // ✅ ADDED HEADERS HERE
      return NextResponse.json({ error: "Invalid API key" }, { status: 401, headers: corsHeaders });
    }

    const projectId = project.id;

    // Find or create error
    const { data: existingError } = await supabase
      .from("errors")
      .select("id")
      .eq("fingerprint", fingerprint)
      .maybeSingle();

    let errorRow = existingError;

    if (!errorRow) {
      const { data: newError, error: insertError } = await supabase
        .from("errors")
        .insert({
          project_id: projectId,
          raw_message: rawMessage,
          raw_stack: rawStack,
          normalized_message: normalizedMessage,
          normalized_stack: normalizedStack,
          fingerprint,
        })
        .select("id")
        .single();

      if (insertError || !newError) {
        console.error("Error insert failed:", insertError);
        // ✅ ADDED HEADERS HERE
        return NextResponse.json({ error: insertError?.message }, { status: 500, headers: corsHeaders });
      }

      errorRow = newError;

      // ✅ Send to Python backend for AI analysis (async, non-blocking)
      analyzeErrorWithAI(errorRow.id, rawMessage, rawStack).catch(err => {
        console.error("AI analysis failed:", err);
      });
    }

    // Insert occurrence
    const { error: occurrenceError } = await supabase
      .from("occurrences")
      .insert({
        project_id: projectId,
        error_id: errorRow.id,
        environment: body.environment || "dev",
        commit_sha: "local",
      });

    if (occurrenceError) {
      console.error("Occurrence insert failed:", occurrenceError);
      // ✅ ADDED HEADERS HERE
      return NextResponse.json({ error: occurrenceError.message }, { status: 500, headers: corsHeaders });
    }

    // ✅ ADDED HEADERS HERE
    return NextResponse.json({ status: "stored" }, { status: 200, headers: corsHeaders });
  } catch (err) {
    console.error("Unhandled POST /api/error failure:", err);
    // ✅ ADDED HEADERS HERE
    return NextResponse.json({ error: "Internal server error" }, { status: 500, headers: corsHeaders });
  }
}

// ✅ Function to call Python backend (Unchanged)
async function analyzeErrorWithAI(
  errorId: string,
  message: string,
  stack: string | null
) {
  try {
    const response = await fetch("http://localhost:8000/analyze-error", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        error_id: errorId,
        message,
        stack,
      }),
    });

    if (!response.ok) {
      throw new Error(`AI analysis failed: ${response.status}`);
    }

    const result = await response.json();
    console.log("✅ AI analysis complete:", result);

    // Store suggestions in database
    await supabase
      .from("errors")
      .update({
        ai_suggestion: result.suggestion,
        ai_analyzed_at: new Date().toISOString(),
      })
      .eq("id", errorId);

  } catch (error) {
    console.error("Failed to analyze error with AI:", error);
    throw error; // This throw is caught by the .catch() up in the POST function
  }
}