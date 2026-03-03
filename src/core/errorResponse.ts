import { isAppError } from "./errors.js";

export interface ErrorResponse {
    success: false;
    error: {
        code: string;
        message: string;
        details?: unknown;
    };
    requestId?: string;
}

export interface NormalizeErrorInput {
    err: unknown;
    requestId?: string;
    isProd: boolean;
}

export function normalizeError({
    err,
    requestId,
    isProd,
}: NormalizeErrorInput): { statusCode: number; body: ErrorResponse } {
    // Default fallback
    let statusCode = 500;
    let code = "INTERNAL_ERROR";
    let message = "Something went wrong";
    let details: unknown = undefined;

    if (isAppError(err)) {
        statusCode = err.statusCode;
        code = err.code;
        message = err.message;
        details = err.details;
    } else if (!isProd && err instanceof Error) {
        // In dev only, expose a bit more
        message = err.message || message;
    }

    const body: ErrorResponse = {
        success: false,
        error: {
            code,
            message,
            ...(details !== undefined ? { details } : {}),
        },
        ...(requestId ? { requestId } : {}),
    };

    return { statusCode, body };
}