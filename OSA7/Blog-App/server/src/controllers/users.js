const express = require('express')
const bcrypt = require('bcryptjs')
const User = require('../models/user')
const Blog = require('../models/blog')

const router = express.Router()

// POST /api/users — create a new account
router.post('/', async (req, res) => {
  const { username, name, password } = req.body

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: 'username and password are required' })
  }
  if (username.length < 3 || password.length < 3) {
    return res
      .status(400)
      .json({
        error: 'username and password must be at least 3 characters long',
      })
  }

  const existing = await User.findOne({ username })
  if (existing) {
    return res.status(400).json({ error: 'expected `username` to be unique' })
  }

  const passwordHash = await bcrypt.hash(password, 10)
  const user = new User({ username, name, passwordHash })
  const savedUser = await user.save()
  return res.status(201).json(savedUser)
})

// GET /api/users — list all users with the blogs they have created
router.get('/', async (_req, res) => {
  const users = await User.find({}).populate('blogs', {
    title: 1,
    author: 1,
    url: 1,
    likes: 1,
  })
  res.json(users)
})

// GET /api/users/:id — a single user with their blogs (user detail page)
router.get('/:id', async (req, res) => {
  const user = await User.findById(req.params.id).populate('blogs', {
    title: 1,
    author: 1,
    url: 1,
    likes: 1,
  })
  if (!user) {
    return res.status(404).json({ error: 'user not found' })
  }
  return res.json(user)
})

module.exports = router
