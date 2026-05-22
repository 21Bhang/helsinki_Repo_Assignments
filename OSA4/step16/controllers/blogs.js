const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", {
    username: 1,
    name: 1,
  });
  response.json(blogs);
});

blogsRouter.post("/", async (request, response) => {
  const body = request.body;

  // 4.17: pick the first user in the DB as the creator
  const user = await User.findOne({});
  if (!user) {
    return response
      .status(400)
      .json({ error: "no users in db; create a user first" });
  }

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
