import { useState } from "react";

const blogStyle = {
  paddingTop: 10,
  paddingLeft: 2,
  border: "solid",
  borderWidth: 1,
  marginBottom: 5,
};

const Blog = ({ blog, handleLike, handleDelete, currentUsername }) => {
  const [visible, setVisible] = useState(false);

  const toggleVisibility = () => setVisible(!visible);

  const onLike = () => {
    handleLike({
      ...blog,
      likes: (blog.likes ?? 0) + 1,
      user: blog.user?.id ?? blog.user,
    });
  };

  const canDelete = currentUsername && blog.user?.username === currentUsername;

  return (
    <div style={blogStyle} className="blog">
      <div>
        {blog.title} {blog.author}{" "}
        <button type="button" onClick={toggleVisibility}>
          {visible ? "hide" : "view"}
        </button>
      </div>
      {visible && (
        <div>
          <div>{blog.url}</div>
          <div>
            likes {blog.likes}{" "}
            <button type="button" onClick={onLike}>
              like
            </button>
          </div>
          {blog.user && <div>{blog.user.name}</div>}
          {canDelete && (
            <button type="button" onClick={() => handleDelete(blog)}>
              remove
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Blog;
