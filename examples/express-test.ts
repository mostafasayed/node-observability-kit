import express from "express";
import {
    createLogger,
    expressCorrelationMiddleware,
    expressRequestTimingMiddleware,
} from "../src/index.js";

const app = express();
const logger = createLogger();

app.use(expressCorrelationMiddleware(logger));
app.use(expressRequestTimingMiddleware({ slowThresholdMs: 300 }));

app.get("/", async (req, res) => {
    req.log?.info("Handling root request");
    res.json({ requestId: req.requestId });
});

app.get("/slow", async (req, res) => {
    await new Promise((r) => setTimeout(r, 500));
    res.json({ requestId: req.requestId, slow: true });
});

app.listen(3000, () => {
    logger.info("Server running on port 3000");
});