import express from "express";
import { createLogger, expressCorrelationMiddleware } from "../src/index.js";

const app = express();
const logger = createLogger();

app.use(expressCorrelationMiddleware(logger));

app.get("/", (req, res) => {
    req.log?.info("Handling root request");
    res.json({ requestId: req.requestId });
});

app.listen(3000, () => {
    logger.info("Server running on port 3000");
});