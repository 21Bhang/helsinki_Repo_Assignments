import { useState, useEffect } from "react";
import {
  Routes,
  Route,
  Link,
  Navigate,
  useNavigate,
  useMatch,
} from "react-router-dom";
import { Container } from "@mui/material";
import Blog from "./components/Blog";
import BlogDetail from "./components/BlogDetail";
import BlogForm from "./components/BlogForm";
import LoginForm from "./components/LoginForm";
import Notification from "./components/Notification";
import blogService from "./services/blogs";
import loginService from "./services/login";

const STORAGE_KEY = "loggedBloglistUser";
const NOTIFICATION_TIMEOUT_MS = 5000;

const navStyle = {
  background: "#eee",
  padding: 8,
  marginBottom: 12,
};

const linkStyle = { marginRight: 10 };

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [notification, setNotification] = useState(null);

  const navigate = useNavigate();

  const blogMatch = useMatch("/blogs/:id");
  const matchedBlog = blogMatch
    ? blogs.find((b) => b.id === blogMatch.params.id)
    : null;

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
      navigate("/");
    } catch (_exception) {
      notify("wrong username or password", "error");
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem(STORAGE_KEY);
    blogService.setToken(null);
    setUser(null);
    notify("logged out");
    navigate("/");
  };

  const handleCreateBlog = async (newBlog) => {
    try {
      const created = await blogService.create(newBlog);
      setBlogs(blogs.concat(created));
      notify(`a new blog "${created.title}" by ${created.author} added`);
      navigate("/");
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
      navigate("/");
    } catch (exception) {
      const message =
        exception.response?.data?.error ?? "failed to remove blog";
      notify(message, "error");
    }
  };

  const BlogListView = () => (
    <div>
      <h2>blogs</h2>
      {[...blogs]
        .sort((a, b) => (b.likes ?? 0) - (a.likes ?? 0))
        .map((blog) => (
          <Blog key={blog.id} blog={blog} />
        ))}
    </div>
  );

  const CreateBlogView = () => (
    <div>
      <h2>create new blog</h2>
      <BlogForm createBlog={handleCreateBlog} />
    </div>
  );

  const LoginView = () => (
    <div>
      <h2>Log in to application</h2>
      <LoginForm
        username={username}
        password={password}
        handleUsernameChange={({ target }) => setUsername(target.value)}
        handlePasswordChange={({ target }) => setPassword(target.value)}
        handleSubmit={handleLogin}
      />
    </div>
  );

  return (
    <Container maxWidth="md">
      <nav style={navStyle}>
        <Link to="/" style={linkStyle}>
          blogs
        </Link>
        {user && (
          <Link to="/create" style={linkStyle}>
            create new blog
          </Link>
        )}
        {user ? (
          <span>
            {user.name} logged in{" "}
            <button type="button" onClick={handleLogout}>
              logout
            </button>
          </span>
        ) : (
          <Link to="/login" style={linkStyle}>
            login
          </Link>
        )}
      </nav>

      <Notification notification={notification} />

      <Routes>
        <Route
          path="/"
          element={user ? <BlogListView /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/login"
          element={user ? <Navigate to="/" replace /> : <LoginView />}
        />
        <Route
          path="/create"
          element={user ? <CreateBlogView /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/blogs/:id"
          element={
            matchedBlog ? (
              <BlogDetail
                blog={matchedBlog}
                handleLike={handleLike}
                handleDelete={handleDelete}
                currentUsername={user?.username}
                isLoggedIn={!!user}
              />
            ) : (
              <p>blog not found</p>
            )
          }
        />
      </Routes>
    </Container>
  );
};

export default App;
