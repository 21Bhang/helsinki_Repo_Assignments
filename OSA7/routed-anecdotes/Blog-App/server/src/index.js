require("dotenv").config();
require("express-async-errors");

const express = require("express");
const cors = require("cors");
const path = require("path");

const { connect } = require("./utils/db");
const { tokenExtractor } = require("./auth");
const blogsRouter = require("./controllers/blogs");
const usersRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");

const app = express();

app.use(cors());
app.use(express.json());

// Attach the decoded token (if any) to every request.
app.use(tokenExtractor);

// Serve static frontend files from the local dist folder
const distPath = path.join(__dirname, "..", "dist");
app.use(express.static(distPath));

// REST API routes
app.use("/api/login", loginRouter);
app.use("/api/users", usersRouter);
app.use("/api/blogs", blogsRouter);

// Health check
app.get("/api/health", (_req, res) => res.send("ok"));

// Catch-all: any non-API GET request falls back to the SPA index.html so that
// client-side routing (React Router) works on refresh / deep links.
app.get("*", (req, res, next) => {
  if (req.method === "GET" && !req.path.startsWith("/api")) {
    return res.sendFile(path.join(distPath, "index.html"), (err) => {
      if (err) next(err);
    });
  }
  next();
});

// Centralized error handler
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error(err.message);

  if (err.name === "CastError" && err.kind === "ObjectId") {
    return res.status(400).json({ error: "malformatted id" });
  }
  if (err.name === "ValidationError") {
    return res.status(400).json({ error: err.message });
  }
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({ error: "token missing or invalid" });
  }
  if (err.name === "TokenExpiredError") {
    return res.status(401).json({ error: "token expired" });
  }
  return res.status(500).json({ error: "something went wrong" });
});

const PORT = process.env.PORT;

const start = async () => {
  await connect();
  app.listen(PORT, () => {
    console.log(`BlogList backend running on port ${PORT}`);
  });
};

start().catch((err) => {
  console.error("Failed to start server:", err.message);
  process.exit(1);
});

module.exports = app;
