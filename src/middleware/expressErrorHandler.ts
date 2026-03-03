import type { Request, Response, NextFunction } from "express";
import { normalizeError } from "../core/errorResponse.js";
import { isAppError } from "../core/errors.js";

export interface ExpressErrorHandlerOptions {
    /**
     * If true, include error stack in logs (recommended).
     */
    logStack?: boolean;
}

export function expressErrorHandler(options?: ExpressErrorHandlerOptions) {
    const isProd = process.env.NODE_ENV === "production";
    const logStack = options?.logStack ?? true;

    // Express error middleware MUST have 4 args
    return function (err: unknown, req: Request, res: Response, _next: NextFunction) {
        const requestId = req.requestId;

        const { statusCode, body } = normalizeError({ err, requestId, isProd });

        const log = req.log;

        // Logging strategy:
        // - AppError (operational): warn
        // - Unknown/programming: error
        const isOperational = isAppError(err) ? err.isOperational : false;

        const logPayload: Record<string, unknown> = {
            requestId,
            statusCode,
            errorCode: body.error.code,
        };

        if (!isProd && err instanceof Error) {
            logPayload.message = err.message;
            if (logStack) logPayload.stack = err.stack;
        }

        if (log) {
            if (isOperational) log.warn(logPayload, "Operational error");
            else log.error(logPayload, "Unhandled error");
        }

        res.status(statusCode).json(body);
    };
}