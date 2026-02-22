export declare const TraceAI: {
    init(options: {
        apiKey: string;
        environment?: string;
        endpoint?: string;
    }): void;
    capture(error: unknown): void;
};
