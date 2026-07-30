import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import blogService from "./services/blogs";

const BlogList = ({ blogs, handleLike, handleDelete }) => (
  <div>
    {blogs.map((blog) => (
      <div key={blog.id} className="blog">
        <h3>
          {blog.title}{" "}
          <span style={{ fontSize: "0.8em" }}>- {blog.author}</span>
        </h3>
        <p>
          likes: {blog.likes}{" "}
          <button onClick={() => handleLike(blog)}>like</button>
        </p>
        <button onClick={() => handleDelete(blog.id)}>delete</button>
      </div>
    ))}
  </div>
);

const CreateBlog = ({ addBlog }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    addBlog({ title, author, url });
    setTitle("");
    setAuthor("");
    setUrl("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create a new blog</h2>
      <div>
        title:{" "}
        <input value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div>
        author:{" "}
        <input value={author} onChange={(e) => setAuthor(e.target.value)} />
      </div>
      <div>
        url: <input value={url} onChange={(e) => setUrl(e.target.value)} />
      </div>
      <button type="submit">create</button>
    </form>
  );
};

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  const showNotification = (message, isError = false) => {
    setNotification({ message, isError });
    setTimeout(() => setNotification(null), 5000);
  };

  const addBlog = async (blogObject) => {
    try {
      const returnedBlog = await blogService.create(blogObject);
      setBlogs(blogs.concat(returnedBlog));
      showNotification(
        `A new blog "${returnedBlog.title}" by ${returnedBlog.author} added`,
      );
    } catch (error) {
      showNotification(
        error.response?.data?.error || "Failed to create blog",
        true,
      );
    }
  };

  const handleLike = async (blog) => {
    try {
      const updatedBlog = { ...blog, likes: blog.likes + 1 };
      const returnedBlog = await blogService.update(blog.id, updatedBlog);
      setBlogs(blogs.map((b) => (b.id !== blog.id ? b : returnedBlog)));
    } catch (error) {
      showNotification("Failed to like blog", true);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      try {
        await blogService.remove(id);
        setBlogs(blogs.filter((b) => b.id !== id));
        showNotification("Blog deleted successfully");
      } catch (error) {
        showNotification("Failed to delete blog", true);
      }
    }
  };

  return (
    <Router>
      <div>
        {notification && (
          <div
            className={`notification ${notification.isError ? "error" : ""}`}
          >
            {notification.message}
          </div>
        )}
        <h1>Bloglist</h1>
        <nav style={{ marginBottom: "20px" }}>
          <Link to="/" style={{ marginRight: "15px" }}>
            blogs
          </Link>
          <Link to="/create">create new</Link>
        </nav>
        <Routes>
          <Route
            path="/"
            element={
              <BlogList
                blogs={blogs}
                handleLike={handleLike}
                handleDelete={handleDelete}
              />
            }
          />
          <Route path="/create" element={<CreateBlog addBlog={addBlog} />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
