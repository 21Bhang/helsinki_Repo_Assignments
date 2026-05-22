import { useEffect, useState } from "react";

const API_URL = "/api/blogs";

const Blog = ({ blog }) => (
  <article className="blog-card">
    <header className="blog-card__header">
      <h2 className="blog-card__title">{blog.title}</h2>
    </header>
    <p className="blog-card__author">by {blog.author || "Unknown"}</p>
    <a
      className="blog-card__link"
      href={blog.url}
      target="_blank"
      rel="noopener noreferrer"
    >
      Read article
    </a>
  </article>
);

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(API_URL)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => setBlogs(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const sorted = [...blogs].sort((a, b) => b.likes - a.likes);

  return (
    <div className="app">
      <header className="app__header">
        <h1 className="app__title">Greenleaf Blogs</h1>
        <p className="app__subtitle">
          A small, fresh collection of posts worth reading.
        </p>
      </header>

      <main className="app__main">
        {loading && <p className="app__status">Loading blogs...</p>}
        {error && (
          <p className="app__status app__status--error">
            Failed to load blogs: {error}
          </p>
        )}
        {!loading && !error && (
          <section className="blog-grid">
            {sorted.map((blog) => (
              <Blog key={blog.id} blog={blog} />
            ))}
          </section>
        )}
      </main>
    </div>
  );
};

export default App;
