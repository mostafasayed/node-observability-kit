export interface LoggerOptions {
    level?: "info" | "debug" | "warn" | "error";
    pretty?: boolean;
}

export interface LoggerContext {
    requestId?: string;
    [key: string]: unknown;
}

export interface RequestTimingOptions {
    slowThresholdMs?: number;
}

export interface ObservabilityOptions {
    logger?: LoggerOptions;
    slowThresholdMs?: number;
}