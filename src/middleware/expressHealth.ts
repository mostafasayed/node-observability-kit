import type { Request, Response } from "express";
import { runHealthChecks, HealthOptions } from "../core/health.js";

export function expressHealthHandler() {
    return function (_req: Request, res: Response) {
        res.json({
            status: "ok",
            uptime: process.uptime(),
            timestamp: new Date().toISOString(),
        });
    };
}

export function expressReadinessHandler(options?: HealthOptions) {
    return async function (_req: Request, res: Response) {
        const results = await runHealthChecks(options);

        const hasError = results.some((r) => r.status === "error");

        res.status(hasError ? 503 : 200).json({
            status: hasError ? "error" : "ok",
            checks: results,
            uptime: process.uptime(),
            timestamp: new Date().toISOString(),
        });
    };
}