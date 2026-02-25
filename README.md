# node-observability-kit

A modular, production-focused observability layer for Node.js applications (framework-agnostic, Express adapter first).

## v0.1.0 scope (planned)
- Structured logging
- Correlation IDs
- Centralized error handling
- Request timing metrics
- Health/readiness endpoints
- Production-safe defaults

## Planned modules / APIs
- Logger: `createLogger`
- Middleware: `correlation`, `requestTiming`, `errorHandler`
- Health: `createHealthHandler`
- Lifecycle: `setupGracefulShutdown`
- Core: `createObservability`

## Out of scope (v0.1.0)
- OpenTelemetry integration
- Prometheus exporters
- Sentry integration
- Distributed tracing
- Log shipping adapters

## Development
- `npm run dev` — `tsx watch src/index.ts`
- `npm run build` — `tsc` (via dual build scripts)
- `npm run prepublishOnly` — `npm run build`
