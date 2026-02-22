export interface TraceAIConfig {
    apiKey: string;
    environment: string;
    endpoint?: string;
}
export interface NormalizedError {
    message: string;
    stack?: string;
    name?: string;
}
