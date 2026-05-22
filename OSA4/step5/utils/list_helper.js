const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0);
};

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null;

  const top = blogs.reduce((best, blog) =>
    blog.likes > best.likes ? blog : best,
  );

  return {
    title: top.title,
    author: top.author,
    likes: top.likes,
  };
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
};
