import type { Request, Response, NextFunction } from "express";
import { measureDurationMs } from "../core/timing.js";

export interface RequestTimingOptions {
    slowThresholdMs?: number;
}

export function expressRequestTimingMiddleware(options?: RequestTimingOptions) {
    const slowThresholdMs = options?.slowThresholdMs ?? 1000;

    return function (req: Request, res: Response, next: NextFunction) {
        const start = process.hrtime.bigint();

        res.on("finish", () => {
            const end = process.hrtime.bigint();
            const durationMs = measureDurationMs(start, end);

            const log = req.log;
            if (!log) return;

            const payload = {
                requestId: req.requestId,
                method: req.method,
                path: req.originalUrl || req.url,
                statusCode: res.statusCode,
                durationMs: Math.round(durationMs),
            };

            if (durationMs >= slowThresholdMs) {
                log.warn(payload, "Slow request");
            } else {
                log.info(payload, "Request completed");
            }
        });

        next();
    };
}