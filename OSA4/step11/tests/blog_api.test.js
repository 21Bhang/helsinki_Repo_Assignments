const { test, after, beforeEach } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const helper = require("./test_helper");
const Blog = require("../models/blog");

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});
  await Blog.insertMany(helper.initialBlogs);
});

test("blogs are returned as json", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test("all blogs are returned", async () => {
  const response = await api.get("/api/blogs");

  assert.strictEqual(response.body.length, helper.initialBlogs.length);
});

test("if likes is missing, it defaults to 0", async () => {
  const newBlog = {
    title: "No likes here",
    author: "Anonymous",
    url: "http://example.com",
  };

  const response = await api.post("/api/blogs").send(newBlog).expect(201);

  assert.strictEqual(response.body.likes, 0);
});

after(async () => {
  await mongoose.connection.close();
});
