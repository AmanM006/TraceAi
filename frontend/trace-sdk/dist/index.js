import { sendError } from "./transport";
let config = null;
export const TraceAI = {
    init(options) {
        var _a, _b;
        if (typeof window === "undefined")
            return;
        config = {
            apiKey: options.apiKey,
            environment: (_a = options.environment) !== null && _a !== void 0 ? _a : "prod",
            endpoint: (_b = options.endpoint) !== null && _b !== void 0 ? _b : "/api/error", // ✅ Default to relative
        };
        window.addEventListener("error", event => {
            TraceAI.capture(event.error);
        });
        window.addEventListener("unhandledrejection", event => {
            TraceAI.capture(event.reason);
        });
        console.log("✅ TraceAI initialized:", config.environment);
    },
    capture(error) {
        if (!config) {
            console.warn("⚠️ TraceAI.capture called before init");
            return;
        }
        sendError(error, config);
    },
};
