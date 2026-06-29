const router = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");

// 5.18: end-to-end test helper for OSA5 Playwright tests.
// Only mounted when NODE_ENV === "test" (see app.js).
router.post("/reset", async (request, response) => {
  await Blog.deleteMany({});
  await User.deleteMany({});
  response.status(204).end();
});

module.exports = router;
