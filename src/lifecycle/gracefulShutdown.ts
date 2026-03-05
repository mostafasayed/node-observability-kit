import type { Server } from "http";
import type { ObservabilityLogger } from "../logger/createLogger.js";

export interface ShutdownOptions {
    server: Server;
    logger?: ObservabilityLogger;
    timeoutMs?: number;
    onShutdown?: () => Promise<void> | void;
}

export function setupGracefulShutdown(options: ShutdownOptions) {
    const {
        server,
        logger,
        timeoutMs = 10000,
        onShutdown
    } = options;

    let shuttingDown = false;

    const shutdown = async (signal: string) => {
        if (shuttingDown) return;
        shuttingDown = true;

        logger?.info({ signal }, "Shutdown signal received");

        // Stop accepting new connections
        server.close(async (err) => {
            if (err) {
                logger?.error({ err }, "Error during server close");
                process.exit(1);
            }

            try {
                if (onShutdown) {
                    await onShutdown();
                }

                logger?.info("Shutdown complete");

                process.exit(0);
            } catch (shutdownErr) {
                logger?.error({ shutdownErr }, "Shutdown tasks failed");
                process.exit(1);
            }
        });

        // Force exit if shutdown takes too long
        setTimeout(() => {
            logger?.error("Shutdown timeout reached. Forcing exit.");
            process.exit(1);
        }, timeoutMs).unref();
    };

    process.on("SIGTERM", shutdown);
    process.on("SIGINT", shutdown);
}