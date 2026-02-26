import { createLogger } from "../src/index.js";

const logger = createLogger();

logger.info("Base logger");

const requestLogger = logger.withContext({ requestId: "abc-123" });

requestLogger.info("Request scoped log");
requestLogger.info("Getting data from database");