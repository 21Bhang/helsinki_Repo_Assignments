// Single-blog view (route /blogs/:id). The matched blog is resolved
// in App via useMatch and passed in as a prop, so this component stays
// presentational and easy to test.
const BlogDetail = ({
  blog,
  handleLike,
  handleDelete,
  currentUsername,
  isLoggedIn,
}) => {
  const onLike = () => {
    handleLike({
      ...blog,
      likes: (blog.likes ?? 0) + 1,
      user: blog.user?.id ?? blog.user,
    });
  };

  const canDelete = currentUsername && blog.user?.username === currentUsername;

  return (
    <div className="blog-detail">
      <h2>
        {blog.title} {blog.author}
      </h2>
      <div>
        <a href={blog.url}>{blog.url}</a>
      </div>
      <div>
        likes {blog.likes}{" "}
        {isLoggedIn && (
          <button type="button" onClick={onLike}>
            like
          </button>
        )}
      </div>
      {blog.user && <div>added by {blog.user.name}</div>}
      {canDelete && (
        <button type="button" onClick={() => handleDelete(blog)}>
          remove
        </button>
      )}
    </div>
  );
};

export default BlogDetail;
