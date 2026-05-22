const _ = require("lodash");

const dummy = (blogs) => 1;

const totalLikes = (blogs) => blogs.reduce((sum, blog) => sum + blog.likes, 0);

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null;
  const top = blogs.reduce((best, blog) =>
    blog.likes > best.likes ? blog : best,
  );
  return { title: top.title, author: top.author, likes: top.likes };
};

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null;

  const counts = _.countBy(blogs, "author");
  const author = _.maxBy(_.keys(counts), (a) => counts[a]);

  return { author, blogs: counts[author] };
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
};
