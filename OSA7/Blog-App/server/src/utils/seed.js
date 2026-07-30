// Seed the MongoDB database with demo users, blogs, and comments so the app
// matches the reference design screenshots on first run.
//
// Run with:  node src/utils/seed.js
require('dotenv').config()
require('express-async-errors')

const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const User = require('../models/user')
const Blog = require('../models/blog')

const seed = async () => {
  await mongoose.connect(process.env.MONGODB_URI)
  console.log('Connected to MongoDB for seeding')

  // Wipe existing demo data so seeding is idempotent.
  await Blog.deleteMany({})
  await User.deleteMany({})
  console.log('Cleared existing users and blogs')

  const makeUser = async (username, name, password) => {
    const passwordHash = await bcrypt.hash(password, 10)
    const user = new User({ username, name, passwordHash, blogs: [] })
    await user.save()
    return user
  }

  const matti = await makeUser('mluukkai', 'Matti Luukkainen', 'salainen')
  const outi = await makeUser('ousavola', 'Outi Savolainen', 'salainen')
  const arto = await makeUser('hellas', 'Arto Hellas', 'salainen')
  const root = await makeUser('root', 'Superuser', 'sekret')

  const makeBlog = async (
    title,
    author,
    url,
    likes,
    user,
    comments = []
  ) => {
    const blog = new Blog({
      title,
      author,
      url,
      likes,
      user: user._id,
      comments: comments.map((c) => ({ content: c })),
    })
    const saved = await blog.save()
    user.blogs = user.blogs.concat(saved._id)
    await user.save()
    return saved
  }

  // Matti's blogs (3) — including the SRP one from the screenshot
  await makeBlog(
    'The Single Responsibility Principle',
    'Robert C. Martin',
    'https://blog.cleancoder.com/uncle-bob/2014/05/08/SingleResponsibilityPrinciple.html',
    5,
    matti,
    ['a must read', 'a true classic', 'has this still meaning in the LLM era?']
  )
  await makeBlog(
    'React patterns',
    'Michael Chan',
    'https://reactpatterns.com/',
    7,
    matti
  )
  await makeBlog(
    'Type wars',
    'Robert C. Martin',
    'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    2,
    matti
  )

  // Outi's blogs (2)
  await makeBlog(
    'Go To Statement Considered Harmful',
    'Edsger W. Dijkstra',
    'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    5,
    outi
  )
  await makeBlog(
    'Canonical equivalence in React components',
    'Outi Savolainen',
    'https://example.com/canonical-equivalence',
    10,
    outi
  )

  // Arto's blog (1)
  await makeBlog(
    'First class tests',
    'Robert C. Martin',
    'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.html',
    10,
    arto
  )

  console.log('Seeded users: mluukkai, ousavola, hellas, root (pw: sekret)')
  console.log('Seeded 6 blogs with comments on the SRP post')
  await mongoose.connection.close()
  console.log('Done. Connection closed.')
}

seed().catch((err) => {
  console.error('Seeding failed:', err)
  process.exit(1)
})
