const { test, describe } = require("node:test");
const assert = require("node:assert");
const listHelper = require("../utils/list_helper");
const blogs = require("./blogs_fixture");

describe("most blogs", () => {
  test("of empty list is null", () => {
    assert.strictEqual(listHelper.mostBlogs([]), null);
  });

  test("returns the author with most blogs", () => {
    assert.deepStrictEqual(listHelper.mostBlogs(blogs), {
      author: "Robert C. Martin",
      blogs: 3,
    });
  });
});
