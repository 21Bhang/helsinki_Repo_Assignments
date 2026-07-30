const express = require('express')
const Blog = require('../models/blog')
const User = require('../models/user')
const { requireAuth } = require('../auth')

const router = express.Router()

// GET /api/blogs — list all blogs, populated with the creator's user info.
router.get('/', async (_req, res) => {
  const blogs = await Blog.find({}).populate('user', {
    username: 1,
    name: 1,
  })
  res.json(blogs)
})

// POST /api/blogs — create a blog (requires auth). The blog is also pushed
// onto the creating user's blogs array.
router.post('/', requireAuth, async (req, res) => {
  const { title, author, url, likes } = req.body

  if (!title || !url) {
    return res.status(400).json({ error: 'title and url are required' })
  }

  const user = await User.findById(req.user.id)

  const blog = new Blog({
    title,
    author,
    url,
    likes: likes || 0,
    user: user._id,
    comments: [],
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  await savedBlog.populate('user', { username: 1, name: 1 })
  return res.status(201).json(savedBlog)
})

// GET /api/blogs/:id — fetch a single blog (used by the single-blog view,
// including its comments).
router.get('/:id', async (req, res) => {
  const blog = await Blog.findById(req.params.id).populate('user', {
    username: 1,
    name: 1,
  })
  if (!blog) {
    return res.status(404).json({ error: 'blog not found' })
  }
  return res.json(blog)
})

// PUT /api/blogs/:id — update a blog (used for liking).
router.put('/:id', async (req, res) => {
  const { title, author, url, likes } = req.body
  const updated = await Blog.findByIdAndUpdate(
    req.params.id,
    { title, author, url, likes },
    { new: true, runValidators: true, context: 'query' }
  ).populate('user', { username: 1, name: 1 })
  if (!updated) {
    return res.status(404).json({ error: 'blog not found' })
  }
  return res.json(updated)
})

// POST /api/blogs/:id/comments — add a comment to a blog.
router.post('/:id/comments', async (req, res) => {
  const { content } = req.body
  if (!content || !content.trim()) {
    return res.status(400).json({ error: 'comment content is required' })
  }
  const blog = await Blog.findById(req.params.id)
  if (!blog) {
    return res.status(404).json({ error: 'blog not found' })
  }
  blog.comments = blog.comments.concat({ content: content.trim() })
  await blog.save()
  await blog.populate('user', { username: 1, name: 1 })
  return res.status(201).json(blog)
})

// DELETE /api/blogs/:id — delete a blog (requires auth + ownership).
router.delete('/:id', requireAuth, async (req, res) => {
  const blog = await Blog.findById(req.params.id)
  if (!blog) {
    return res.status(404).json({ error: 'blog not found' })
  }
  if (!blog.user || blog.user.toString() !== req.user.id) {
    return res
      .status(403)
      .json({ error: 'only the creator can delete this blog' })
  }
  await Blog.findByIdAndDelete(req.params.id)
  await User.findByIdAndUpdate(req.user.id, {
    $pull: { blogs: blog._id },
  })
  return res.status(204).end()
})

module.exports = router
