import { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import BlogForm from "./components/BlogForm";
import LoginForm from "./components/LoginForm";
import Notification from "./components/Notification";
import Togglable from "./components/Togglable";
import blogService from "./services/blogs";
import loginService from "./services/login";

const STORAGE_KEY = "loggedBloglistUser";
const NOTIFICATION_TIMEOUT_MS = 5000;

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [notification, setNotification] = useState(null);

  const blogFormRef = useRef();

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem(STORAGE_KEY);
    if (loggedUserJSON) {
      const storedUser = JSON.parse(loggedUserJSON);
      setUser(storedUser);
      blogService.setToken(storedUser.token);
    }
  }, []);

  const notify = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), NOTIFICATION_TIMEOUT_MS);
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const loggedUser = await loginService.login({ username, password });
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(loggedUser));
      blogService.setToken(loggedUser.token);
      setUser(loggedUser);
      setUsername("");
      setPassword("");
      notify(`welcome ${loggedUser.name}`);
    } catch (_exception) {
      notify("wrong username or password", "error");
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem(STORAGE_KEY);
    blogService.setToken(null);
    setUser(null);
    notify("logged out");
  };

  const handleCreateBlog = async (newBlog) => {
    try {
      const created = await blogService.create(newBlog);
      setBlogs(blogs.concat(created));
      notify(`a new blog "${created.title}" by ${created.author} added`);
      blogFormRef.current?.toggleVisibility();
      return true;
    } catch (exception) {
      const message =
        exception.response?.data?.error ?? "failed to create blog";
      notify(message, "error");
      return false;
    }
  };

  const handleLike = async (updatedBlog) => {
    try {
      const returned = await blogService.update(updatedBlog.id, updatedBlog);
      // 5.9: the backend PUT response does not populate the user reference,
      // so we preserve the original user object from the blog being updated
      // to keep the author's name visible without a full refresh.
      const original = blogs.find((b) => b.id === returned.id);
      const merged = { ...returned, user: original?.user ?? returned.user };
      setBlogs(blogs.map((b) => (b.id === merged.id ? merged : b)));
    } catch (exception) {
      const message =
        exception.response?.data?.error ?? "failed to update blog";
      notify(message, "error");
    }
  };

  const handleDelete = async (blog) => {
    const confirmed = window.confirm(
      `Remove blog "${blog.title}" by ${blog.author}?`,
    );
    if (!confirmed) return;
    try {
      await blogService.remove(blog.id);
      setBlogs(blogs.filter((b) => b.id !== blog.id));
      notify(`removed "${blog.title}"`);
    } catch (exception) {
      const message =
        exception.response?.data?.error ?? "failed to remove blog";
      notify(message, "error");
    }
  };

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification notification={notification} />
        <LoginForm
          username={username}
          password={password}
          handleUsernameChange={({ target }) => setUsername(target.value)}
          handlePasswordChange={({ target }) => setPassword(target.value)}
          handleSubmit={handleLogin}
        />
      </div>
    );
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification notification={notification} />
      <p>
        {user.name} logged in{" "}
        <button type="button" onClick={handleLogout}>
          logout
        </button>
      </p>
      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
        <BlogForm createBlog={handleCreateBlog} />
      </Togglable>
      {[...blogs]
        .sort((a, b) => (b.likes ?? 0) - (a.likes ?? 0))
        .map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            handleLike={handleLike}
            handleDelete={handleDelete}
            currentUsername={user.username}
          />
        ))}
    </div>
  );
};

export default App;
