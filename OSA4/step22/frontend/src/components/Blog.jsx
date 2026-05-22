import { useState } from "react";

const Blog = ({ blog, currentUser, onLike, onDelete }) => {
  const [expanded, setExpanded] = useState(false);

  const ownerId = blog.user && (blog.user.id || blog.user._id || blog.user);
  const isOwner =
    currentUser && ownerId && ownerId.toString() === currentUser.id;

  return (
    <div className="card blog">
      <div className="row">
        <strong>{blog.title}</strong>
        <button className="secondary" onClick={() => setExpanded((v) => !v)}>
          {expanded ? "hide" : "view"}
        </button>
      </div>
      <div className="muted">by {blog.author || "unknown"}</div>

      {expanded && (
        <div style={{ marginTop: "0.75rem" }}>
          <div>
            <a href={blog.url} target="_blank" rel="noreferrer">
              {blog.url}
            </a>
          </div>
          <div>
            likes: <strong>{blog.likes}</strong>{" "}
            <button onClick={() => onLike(blog)}>like</button>
          </div>
          {blog.user && blog.user.name && (
            <div className="muted">added by {blog.user.name}</div>
          )}
          {isOwner && (
            <div className="blog-actions">
              <button className="danger" onClick={() => onDelete(blog)}>
                remove
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Blog;
