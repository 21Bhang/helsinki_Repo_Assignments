import { Link } from "react-router-dom";

const blogStyle = {
  paddingTop: 10,
  paddingLeft: 2,
  border: "solid",
  borderWidth: 1,
  marginBottom: 5,
};

// Step 5.25: list items become plain links to the single-blog view.
// All like / delete logic now lives in BlogDetail.
const Blog = ({ blog }) => (
  <div style={blogStyle} className="blog">
    <Link to={`/blogs/${blog.id}`}>
      {blog.title} {blog.author}
    </Link>
  </div>
);

export default Blog;
