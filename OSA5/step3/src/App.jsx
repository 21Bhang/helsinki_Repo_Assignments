import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import BlogForm from "./components/BlogForm";
import blogService from "./services/blogs";
import loginService from "./services/login";

const STORAGE_KEY = "loggedBloglistUser";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

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

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const loggedUser = await loginService.login({ username, password });
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(loggedUser));
      blogService.setToken(loggedUser.token);
      setUser(loggedUser);
      setUsername("");
      setPassword("");
    } catch (exception) {
      console.error("wrong credentials", exception);
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem(STORAGE_KEY);
    blogService.setToken(null);
    setUser(null);
  };

  const handleCreateBlog = async (newBlog) => {
    try {
      const created = await blogService.create(newBlog);
      setBlogs(blogs.concat(created));
    } catch (exception) {
      console.error("failed to create blog", exception);
    }
  };

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <form onSubmit={handleLogin}>
          <div>
            <label>
              username
              <input
                type="text"
                value={username}
                name="Username"
                onChange={({ target }) => setUsername(target.value)}
              />
            </label>
          </div>
          <div>
            <label>
              password
              <input
                type="password"
                value={password}
                name="Password"
                onChange={({ target }) => setPassword(target.value)}
              />
            </label>
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <h2>blogs</h2>
      <p>
        {user.name} logged in{" "}
        <button type="button" onClick={handleLogout}>
          logout
        </button>
      </p>
      <BlogForm createBlog={handleCreateBlog} />
      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </div>
  );
};

export default App;
