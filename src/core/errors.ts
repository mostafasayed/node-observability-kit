export type ErrorCode =
    | "BAD_REQUEST"
    | "UNAUTHORIZED"
    | "FORBIDDEN"
    | "NOT_FOUND"
    | "CONFLICT"
    | "RATE_LIMITED"
    | "INTERNAL_ERROR";

export interface AppErrorOptions {
    code: ErrorCode;
    message: string;
    statusCode: number;
    isOperational?: boolean;
    details?: unknown;
    cause?: unknown;
}

/**
 * AppError is a controlled/expected error (validation, auth, not found, etc.)
 * These should be safe to expose (message) if operational.
 */
export class AppError extends Error {
    public readonly code: ErrorCode;
    public readonly statusCode: number;
    public readonly isOperational: boolean;
    public readonly details?: unknown;

    constructor(options: AppErrorOptions) {
        super(options.message);
        this.name = "AppError";
        this.code = options.code;
        this.statusCode = options.statusCode;
        this.isOperational = options.isOperational ?? true;
        this.details = options.details;

        // Keep original cause if provided (Node 16+ pattern)
        if (options.cause) (this as any).cause = options.cause;
    }
}

export function isAppError(err: unknown): err is AppError {
    return err instanceof AppError;
}