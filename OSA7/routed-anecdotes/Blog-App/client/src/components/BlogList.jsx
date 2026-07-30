const BlogList = ({ blogs }) => {
  if (blogs.length === 0) {
    return <p>No blogs yet. Create one!</p>
  }

  return (
    <div>
      {blogs.map(blog => (
        <div key={blog.id} className="blog-card">
          <h3>
            {blog.title} <span style={{ fontSize: '0.8em', color: '#666' }}>- {blog.author}</span>
          </h3>
          <p>
            likes: {blog.likes}
            {/* Buttons will be added in step 3 */}
          </p>
        </div>
      ))}
    </div>
  )
}

export default BlogList
