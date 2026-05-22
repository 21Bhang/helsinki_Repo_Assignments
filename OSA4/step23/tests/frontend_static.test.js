const { test, after, before, describe } = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");

const api = supertest(app);

const distIndex = path.join(__dirname, "..", "dist", "index.html");

// Only run these tests if the frontend has actually been built/deployed.
const hasFrontend = fs.existsSync(distIndex);

describe("frontend (dist) is served", { skip: !hasFrontend }, () => {
  before(() => {
    if (!hasFrontend) return;
  });

  test("GET / returns the index.html shell", async () => {
    const response = await api
      .get("/")
      .expect(200)
      .expect("Content-Type", /text\/html/);

    assert.match(response.text, /<div id="root">/);
  });

  test("SPA fallback returns index.html for unknown non-api routes", async () => {
    const response = await api
      .get("/some/client-side/route")
      .expect(200)
      .expect("Content-Type", /text\/html/);

    assert.match(response.text, /<div id="root">/);
  });

  test("unknown /api routes still return JSON 404", async () => {
    await api
      .get("/api/does-not-exist")
      .expect(404)
      .expect("Content-Type", /application\/json/);
  });
});

after(async () => {
  await mongoose.connection.close();
});
