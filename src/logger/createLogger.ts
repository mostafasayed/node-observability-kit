import pino, { Logger } from "pino";
import { LoggerOptions, LoggerContext } from "../types/index.js";

export interface ObservabilityLogger extends Logger {
    withContext(context: LoggerContext): ObservabilityLogger;
}

export function createLogger(options?: LoggerOptions): ObservabilityLogger {
    const isProd = process.env.NODE_ENV === "production";

    const baseLogger = pino({
        level: options?.level || (isProd ? "info" : "debug"),
        transport:
            !isProd && options?.pretty !== false
                ? {
                    target: "pino-pretty",
                    options: {
                        colorize: true,
                        translateTime: "SYS:standard",
                        ignore: "pid,hostname"
                    }
                }
                : undefined,
        redact: {
            paths: ["req.headers.authorization", "password"],
            remove: true
        }
    }) as ObservabilityLogger;

    baseLogger.withContext = function (
        context: LoggerContext
    ): ObservabilityLogger {
        return baseLogger.child(context) as ObservabilityLogger;
    };

    return baseLogger;
}