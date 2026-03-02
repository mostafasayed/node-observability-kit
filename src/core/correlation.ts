import { randomUUID } from "crypto";

export interface CorrelationOptions {
    headerName?: string;
}

export function resolveRequestId(
    headers: Record<string, unknown>,
    options?: CorrelationOptions
): string {
    const headerName = (options?.headerName || "x-request-id").toLowerCase();

    const existingId =
        typeof headers[headerName] === "string"
            ? headers[headerName]
            : undefined;

    return existingId || randomUUID();
}