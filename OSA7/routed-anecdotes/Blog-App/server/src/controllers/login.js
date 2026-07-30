const express = require('express')
const bcrypt = require('bcryptjs')
const User = require('../models/user')
const { tokenFor } = require('../auth')

const router = express.Router()

// POST /api/login — authenticate and return a JWT
router.post('/', async (req, res) => {
  const { username, password } = req.body
  const user = await User.findOne({ username })
  const passwordCorrect =
    user === null ? false : await bcrypt.compare(password, user.passwordHash)

  if (!(user && passwordCorrect)) {
    return res.status(401).json({ error: 'invalid username or password' })
  }

  return res.status(200).json({
    token: tokenFor(user),
    username: user.username,
    name: user.name,
    id: user.id,
  })
})

module.exports = router
