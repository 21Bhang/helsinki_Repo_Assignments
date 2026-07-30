import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import blogService from "./services/blogs";
import ErrorBoundary from "./components/ErrorBoundary";
import NotFound from "./components/NotFound";
import BlogList from "./components/BlogList";
import CreateBlog from "./components/CreateBlog";
import "./App.css";

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
        <header className="header">
          <h1>Blog App</h1>
        </header>

        <div className="container">
          {notification && (
            <div
              className={`notification ${notification.isError ? "error" : "success"}`}
            >
              {notification.message}
            </div>
          )}

          <nav className="nav">
            <Link to="/">blogs</Link>
            <Link to="/create">create new</Link>
          </nav>

          <ErrorBoundary>
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
              <Route
                path="/create"
                element={<CreateBlog addBlog={addBlog} />}
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </ErrorBoundary>
        </div>
      </div>
    </Router>
  );
};

export default App;
