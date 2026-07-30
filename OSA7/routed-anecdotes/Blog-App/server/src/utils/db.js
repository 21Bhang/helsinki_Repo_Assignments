// MongoDB connection helper. Reads MONGODB_URI from the environment (see
// .env) and connects once at startup.
const mongoose = require('mongoose')

const connect = async () => {
  const uri = process.env.MONGODB_URI
  if (!uri) {
    throw new Error('MONGODB_URI is not defined in the environment')
  }
  await mongoose.connect(uri)
  console.log('Connected to MongoDB')
}

module.exports = { connect }
