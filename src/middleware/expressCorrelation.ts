import { Request, Response, NextFunction } from "express";
import { resolveRequestId, CorrelationOptions } from "../core/correlation.js";
import { ObservabilityLogger } from "../logger/createLogger.js";

export function expressCorrelationMiddleware(
    logger: ObservabilityLogger,
    options?: CorrelationOptions
) {
    return function (req: Request, res: Response, next: NextFunction) {
        const requestId = resolveRequestId(req.headers as Record<string, unknown>, options);

        req.requestId = requestId;

        res.setHeader("x-request-id", requestId);

        req.log = logger.withContext({ requestId });

        next();
    };
}