const { test, describe } = require("node:test");
const assert = require("node:assert");
const listHelper = require("../utils/list_helper");
const blogs = require("./blogs_fixture");

describe("favorite blog", () => {
  test("of empty list is null", () => {
    assert.strictEqual(listHelper.favoriteBlog([]), null);
  });

  test("of a single blog is that blog", () => {
    const one = [{ title: "only", author: "me", likes: 3 }];
    assert.deepStrictEqual(listHelper.favoriteBlog(one), {
      title: "only",
      author: "me",
      likes: 3,
    });
  });

  test("of the bigger list is the one with most likes", () => {
    assert.deepStrictEqual(listHelper.favoriteBlog(blogs), {
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      likes: 12,
    });
  });
});
