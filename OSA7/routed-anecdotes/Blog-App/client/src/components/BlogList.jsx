const BlogList = ({ blogs, handleLike, handleDelete }) => {
  if (blogs.length === 0) {
    return <p>No blogs yet. Create one!</p>;
  }

  return (
    <div>
      {blogs.map((blog) => (
        <div key={blog.id} className="blog-card">
          <h3>
            {blog.title}{" "}
            <span style={{ fontSize: "0.8em", color: "#666" }}>
              - {blog.author}
            </span>
          </h3>
          <p>
            likes: {blog.likes}
            <button
              className="btn btn-primary"
              onClick={() => handleLike(blog)}
            >
              like
            </button>
            <button
              className="btn btn-danger"
              onClick={() => handleDelete(blog.id)}
            >
              delete
            </button>
          </p>
        </div>
      ))}
    </div>
  );
};

export default BlogList;
