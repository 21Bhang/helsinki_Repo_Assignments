const { test, describe } = require("node:test");
const assert = require("node:assert");
const listHelper = require("../utils/list_helper");

test("dummy returns one", () => {
  assert.strictEqual(listHelper.dummy([]), 1);
});

describe("total likes", () => {
  const listWithOneBlog = [
    {
      _id: "5a422aa71b54a676234d17f8",
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf",
      likes: 5,
      __v: 0,
    },
  ];

  const blogs = [
    { title: "a", author: "x", url: "", likes: 7 },
    { title: "b", author: "y", url: "", likes: 5 },
    { title: "c", author: "z", url: "", likes: 12 },
  ];

  test("of empty list is zero", () => {
    assert.strictEqual(listHelper.totalLikes([]), 0);
  });

  test("when list has only one blog, equals the likes of that", () => {
    assert.strictEqual(listHelper.totalLikes(listWithOneBlog), 5);
  });

  test("of a bigger list is calculated right", () => {
    assert.strictEqual(listHelper.totalLikes(blogs), 24);
  });
});
