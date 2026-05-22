require("dotenv").config();
const mongoose = require("mongoose");
const Blog = require("./models/blog");
const config = require("./utils/config");

const seedBlogs = [
  {
    title: "Getting Started with Node.js",
    author: "Ryan Dahl",
    url: "https://nodejs.org/en/learn/getting-started/introduction-to-nodejs",
    likes: 42,
  },
  {
    title: "Why I Love React",
    author: "Dan Abramov",
    url: "https://overreacted.io/why-i-love-react/",
    likes: 87,
  },
  {
    title: "MongoDB Schema Design Best Practices",
    author: "Lauren Schaefer",
    url: "https://www.mongodb.com/developer/products/mongodb/schema-design-anti-pattern-summary/",
    likes: 65,
  },
  {
    title: "Clean Code Principles",
    author: "Robert C. Martin",
    url: "https://github.com/ryanmcdermott/clean-code-javascript",
    likes: 120,
  },
  {
    title: "REST API Design Rules",
    author: "Mark Masse",
    url: "https://restfulapi.net/rest-api-design-tutorial-with-example/",
    likes: 33,
  },
  {
    title: "Mastering Async/Await in JavaScript",
    author: "Mariko Kosaka",
    url: "https://javascript.info/async-await",
    likes: 58,
  },
  {
    title: "The Joy of Functional Programming",
    author: "Eric Elliott",
    url: "https://medium.com/javascript-scene/the-rise-and-fall-and-rise-of-functional-programming-composable-software-c2d91b424c8c",
    likes: 76,
  },
  {
    title: "CSS Grid: A Complete Guide",
    author: "Chris Coyier",
    url: "https://css-tricks.com/snippets/css/complete-guide-grid/",
    likes: 91,
  },
];

const run = async () => {
  try {
    await mongoose.connect(config.MONGODB_URI, { family: 4 });
    console.log("connected to MongoDB");

    await Blog.deleteMany({});
    console.log("cleared existing blogs");

    const inserted = await Blog.insertMany(seedBlogs);
    console.log(`inserted ${inserted.length} blogs`);
  } catch (err) {
    console.error("seed error:", err.message);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

run();
