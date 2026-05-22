const { test, describe } = require("node:test");
const assert = require("node:assert");
const listHelper = require("../utils/list_helper");
const blogs = require("./blogs_fixture");

describe("most likes", () => {
  test("of empty list is null", () => {
    assert.strictEqual(listHelper.mostLikes([]), null);
  });

  test("returns the author with most total likes", () => {
    assert.deepStrictEqual(listHelper.mostLikes(blogs), {
      author: "Edsger W. Dijkstra",
      likes: 17,
    });
  });
});
