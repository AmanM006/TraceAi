import { sendError } from "./transport";
import { TraceAIConfig } from "./types";

let config: TraceAIConfig | null = null;

export const TraceAI = {
  init(options: { 
    apiKey: string; 
    environment?: string;
    endpoint?: string; // ✅ Optional
  }) {
    if (typeof window === "undefined") return;
    
    config = {
      apiKey: options.apiKey,
      environment: options.environment ?? "prod",
      endpoint: options.endpoint ?? "/api/error", // ✅ Default to relative
    };

    window.addEventListener("error", event => {
      TraceAI.capture(event.error);
    });

    window.addEventListener("unhandledrejection", event => {
      TraceAI.capture(event.reason);
    });

    console.log("✅ TraceAI initialized:", config.environment);
  },

  capture(error: unknown) {
    if (!config) {
      console.warn("⚠️ TraceAI.capture called before init");
      return;
    }
    sendError(error, config);
  },
};