import { useState, useEffect } from "react";
import {
  Routes,
  Route,
  Link as RouterLink,
  Navigate,
  useNavigate,
  useMatch,
} from "react-router-dom";
import {
  AppBar,
  Box,
  Button,
  Container,
  Toolbar,
  Typography,
} from "@mui/material";
import Blog from "./components/Blog";
import BlogDetail from "./components/BlogDetail";
import BlogForm from "./components/BlogForm";
import LoginForm from "./components/LoginForm";
import Notification from "./components/Notification";
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
    <Box>
      <Typography variant="h4" component="h2" sx={{ my: 2 }}>
        blogs
      </Typography>
      {[...blogs]
        .sort((a, b) => (b.likes ?? 0) - (a.likes ?? 0))
        .map((blog) => (
          <Blog key={blog.id} blog={blog} />
        ))}
    </Box>
  );

  const CreateBlogView = () => (
    <Box>
      <Typography variant="h4" component="h2" sx={{ my: 2 }}>
        create new blog
      </Typography>
      <BlogForm createBlog={handleCreateBlog} />
    </Box>
  );

  const LoginView = () => (
    <Box>
      <Typography variant="h4" component="h2" sx={{ my: 2 }}>
        Log in to application
      </Typography>
      <LoginForm
        username={username}
        password={password}
        handleUsernameChange={({ target }) => setUsername(target.value)}
        handlePasswordChange={({ target }) => setPassword(target.value)}
        handleSubmit={handleLogin}
      />
    </Box>
  );

  return (
    <Container maxWidth="md">
      <AppBar position="static" sx={{ mb: 2 }}>
        <Toolbar variant="dense">
          <Button color="inherit" component={RouterLink} to="/">
            blogs
          </Button>
          {user && (
            <Button color="inherit" component={RouterLink} to="/create">
              create new blog
            </Button>
          )}
          <Box sx={{ flexGrow: 1 }} />
          {user ? (
            <>
              <Typography variant="body2" sx={{ mr: 2 }}>
                {user.name} logged in
              </Typography>
              <Button color="inherit" onClick={handleLogout}>
                logout
              </Button>
            </>
          ) : (
            <Button color="inherit" component={RouterLink} to="/login">
              login
            </Button>
          )}
        </Toolbar>
      </AppBar>

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
