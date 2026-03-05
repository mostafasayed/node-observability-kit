import express from "express";
import {
    AppError,
    createLogger,
    expressCorrelationMiddleware,
    expressErrorHandler,
    expressHealthHandler,
    expressReadinessHandler,
    expressRequestTimingMiddleware,
} from "../src/index.js";

const app = express();
const logger = createLogger();

app.use(expressCorrelationMiddleware(logger));
app.use(expressRequestTimingMiddleware({ slowThresholdMs: 300 }));
app.use(expressRequestTimingMiddleware({ slowThresholdMs: 300 }));

app.get("/health", expressHealthHandler());
app.get(
    "/ready",
    expressReadinessHandler({
        checks: {
            database: async () => {
                // simulate DB check
                return;
            },
        },
    })
);


app.get("/", async (req, res) => {
    req.log?.info("Handling root request");
    res.json({ requestId: req.requestId });
});

app.get("/slow", async (req, res) => {
    await new Promise((r) => setTimeout(r, 500));
    res.json({ requestId: req.requestId, slow: true });
});

app.get("/bad", () => {
    throw new AppError({
        code: "BAD_REQUEST",
        message: "Invalid input",
        statusCode: 400,
        details: { field: "name" },
    });
});

app.get("/boom", () => {
    throw new Error("Unexpected crash");
});

app.use(expressErrorHandler());

app.listen(3000, () => {
    logger.info("Server running on port 3000");
});