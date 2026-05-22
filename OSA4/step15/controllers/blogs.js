const blogsRouter = require("express").Router();
const Blog = require("../models/blog");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({});
  response.json(blogs);
});

blogsRouter.post("/", async (request, response) => {
  const blog = new Blog(request.body);
  const saved = await blog.save();
  response.status(201).json(saved);
});

blogsRouter.delete("/:id", async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id);
  response.status(204).end();
});

blogsRouter.put("/:id", async (request, response) => {
  const { title, author, url, likes } = request.body;

  const updated = await Blog.findByIdAndUpdate(
    request.params.id,
    { title, author, url, likes },
    { new: true, runValidators: true, context: "query" },
  );

  if (updated) {
    response.json(updated);
  } else {
    response.status(404).end();
  }
});

module.exports = blogsRouter;
