const { test, after, before, beforeEach, describe } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const supertest = require("supertest");
const bcrypt = require("bcrypt");
const app = require("../app");
const helper = require("./test_helper");
const Blog = require("../models/blog");
const User = require("../models/user");

const api = supertest(app);

describe("blog api", () => {
  let token = null;

  before(async () => {
    await User.deleteMany({});
    await User.init();
    const passwordHash = await bcrypt.hash("sekret", 10);
    await new User({ username: "root", name: "Root", passwordHash }).save();

    const login = await api
      .post("/api/login")
      .send({ username: "root", password: "sekret" });
    token = login.body.token;
  });

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

  test("a valid blog can be added with token", async () => {
    const newBlog = {
      title: "Auth required",
      author: "JWT",
      url: "http://example.com/jwt",
      likes: 3,
    };

    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const blogs = await helper.blogsInDb();
    assert.strictEqual(blogs.length, helper.initialBlogs.length + 1);
  });

  test("adding a blog fails with 401 if no token is provided", async () => {
    const newBlog = {
      title: "No token",
      author: "Nobody",
      url: "http://example.com/no-token",
      likes: 0,
    };

    const response = await api.post("/api/blogs").send(newBlog).expect(401);
    assert.match(response.body.error, /token/i);

    const blogs = await helper.blogsInDb();
    assert.strictEqual(blogs.length, helper.initialBlogs.length);
  });
});

after(async () => {
  await mongoose.connection.close();
});
