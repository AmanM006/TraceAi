"use client";

import { useEffect } from "react";
import { TraceAI } from "@traceai/sdk";

export function TraceAIProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_TRACE_API_KEY;
    
    if (!apiKey) {
      console.error("❌ NEXT_PUBLIC_TRACE_API_KEY is missing!");
      return;
    }

    console.log("🚀 [TraceAI] Initializing...");
    
    TraceAI.init({
      apiKey,
      environment: "dev",
    });

    console.log("✅ [TraceAI] Ready");
  }, []);

  return <>{children}</>;
}