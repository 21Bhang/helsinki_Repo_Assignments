const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const middleware = require("../utils/middleware");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", {
    username: 1,
    name: 1,
  });
  response.json(blogs);
});

// 4.22: userExtractor applied per-route
blogsRouter.post("/", middleware.userExtractor, async (request, response) => {
  const body = request.body;
  const user = request.user;

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user._id,
  });

  const saved = await blog.save();
  user.blogs = user.blogs.concat(saved._id);
  await user.save();

  response.status(201).json(saved);
});

blogsRouter.delete(
  "/:id",
  middleware.userExtractor,
  async (request, response) => {
    const blog = await Blog.findById(request.params.id);
    if (!blog) {
      return response.status(404).end();
    }

    // 4.21: only the creator can delete
    if (blog.user.toString() !== request.user._id.toString()) {
      return response
        .status(403)
        .json({ error: "only the blog creator can delete this blog" });
    }

    await Blog.findByIdAndDelete(request.params.id);
    response.status(204).end();
  },
);

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
