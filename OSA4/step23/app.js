const express = require("express");
const path = require("path");
const fs = require("fs");
const cors = require("cors");
const mongoose = require("mongoose");
const config = require("./utils/config");
const logger = require("./utils/logger");
const middleware = require("./utils/middleware");
const blogsRouter = require("./controllers/blogs");
const usersRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");

const app = express();

logger.info("connecting to", config.MONGODB_URI);

mongoose
  .connect(config.MONGODB_URI, { family: 4 })
  .then(() => logger.info("connected to MongoDB"))
  .catch((error) =>
    logger.error("error connecting to MongoDB:", error.message),
  );

app.use(cors());
app.use(express.json());
app.use(middleware.requestLogger);
app.use(middleware.tokenExtractor);

// Serve the production frontend build (if it has been deployed via `npm run build`)
const distPath = path.join(__dirname, "dist");
const hasFrontend = fs.existsSync(path.join(distPath, "index.html"));
if (hasFrontend) {
  app.use(express.static(distPath));
  logger.info("serving frontend from", distPath);
}

app.use("/api/blogs", blogsRouter);
app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);

// SPA fallback: any non-/api GET returns index.html so client-side routing works
if (hasFrontend) {
  app.get(/^\/(?!api).*/, (request, response) => {
    response.sendFile(path.join(distPath, "index.html"));
  });
}

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
