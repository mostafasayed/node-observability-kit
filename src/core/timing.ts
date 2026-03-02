export interface TimingResult {
    durationMs: number;
}

export function measureDurationMs(startHrTime: bigint, endHrTime: bigint): number {
    // hrtime is nanoseconds
    const ns = endHrTime - startHrTime;
    return Number(ns) / 1_000_000;
}