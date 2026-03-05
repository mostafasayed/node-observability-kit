export type HealthStatus = "ok" | "error";

export interface HealthCheckResult {
    name: string;
    status: HealthStatus;
    error?: string;
}

export type HealthCheck = () => Promise<void>;

export interface HealthOptions {
    checks?: Record<string, HealthCheck>;
}

export async function runHealthChecks(
    options?: HealthOptions
): Promise<HealthCheckResult[]> {
    if (!options?.checks) return [];

    const results: HealthCheckResult[] = [];

    for (const [name, check] of Object.entries(options.checks)) {
        try {
            await check();

            results.push({
                name,
                status: "ok",
            });
        } catch (err) {
            results.push({
                name,
                status: "error",
                error: err instanceof Error ? err.message : "unknown error",
            });
        }
    }

    return results;
}