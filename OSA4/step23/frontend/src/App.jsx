import { useEffect, useState } from "react";
import * as api from "./services/api.js";
import AuthForm from "./components/AuthForm.jsx";
import BlogForm from "./components/BlogForm.jsx";
import Blog from "./components/Blog.jsx";
import Notification from "./components/Notification.jsx";

const STORAGE_KEY = "bloglistUser";

const App = () => {
  const [user, setUser] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [notif, setNotif] = useState({ message: null, type: "success" });

  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) setUser(JSON.parse(raw));
  }, []);

  useEffect(() => {
    api.getBlogs().then(setBlogs).catch(showError);
  }, []);

  const showSuccess = (message) => {
    setNotif({ message, type: "success" });
    setTimeout(() => setNotif({ message: null }), 4000);
  };

  const showError = (err) => {
    setNotif({ message: err.message || String(err), type: "error" });
    setTimeout(() => setNotif({ message: null }), 5000);
  };

  const handleLogin = async (credentials) => {
    try {
      const loggedIn = await api.login(credentials);
      // decode id from JWT payload (base64 middle segment) so we know who we are
      const payload = JSON.parse(atob(loggedIn.token.split(".")[1]));
      const fullUser = { ...loggedIn, id: payload.id };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(fullUser));
      setUser(fullUser);
      showSuccess(`welcome ${fullUser.username}`);
    } catch (err) {
      showError(err);
    }
  };

  const handleSignup = async (data) => {
    try {
      await api.signup(data);
      showSuccess(`account created for ${data.username}, please log in`);
    } catch (err) {
      showError(err);
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem(STORAGE_KEY);
    setUser(null);
    showSuccess("logged out");
  };

  const handleCreate = async (blog) => {
    try {
      const created = await api.createBlog(blog, user.token);
      setBlogs(blogs.concat(created));
      showSuccess(`added "${created.title}"`);
    } catch (err) {
      showError(err);
    }
  };

  const handleLike = async (blog) => {
    try {
      const updated = await api.updateBlog(
        blog.id,
        {
          title: blog.title,
          author: blog.author,
          url: blog.url,
          likes: (blog.likes || 0) + 1,
        },
        user?.token,
      );
      setBlogs(
        blogs.map((b) => (b.id === updated.id ? { ...b, ...updated } : b)),
      );
    } catch (err) {
      showError(err);
    }
  };

  const handleDelete = async (blog) => {
    if (!window.confirm(`Remove "${blog.title}"?`)) return;
    try {
      await api.deleteBlog(blog.id, user.token);
      setBlogs(blogs.filter((b) => b.id !== blog.id));
      showSuccess("blog removed");
    } catch (err) {
      showError(err);
    }
  };

  const sorted = [...blogs].sort((a, b) => (b.likes || 0) - (a.likes || 0));

  return (
    <div className="container">
      <h1>Bloglist</h1>
      <Notification message={notif.message} type={notif.type} />

      {!user ? (
        <AuthForm onLogin={handleLogin} onSignup={handleSignup} />
      ) : (
        <>
          <div className="card row">
            <span>
              Logged in as <strong>{user.username}</strong>
            </span>
            <button className="secondary" onClick={handleLogout}>
              log out
            </button>
          </div>
          <BlogForm onCreate={handleCreate} />
        </>
      )}

      <h2>Blogs</h2>
      {sorted.length === 0 && <p className="muted">No blogs yet.</p>}
      {sorted.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          currentUser={user}
          onLike={handleLike}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
};

export default App;
