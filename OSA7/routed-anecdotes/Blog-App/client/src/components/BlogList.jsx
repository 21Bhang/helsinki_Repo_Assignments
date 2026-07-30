import useBlogStore from '../stores/blogStore'

const BlogList = ({ blogs }) => {
  const { likeBlog, deleteBlog } = useBlogStore()

  if (blogs.length === 0) {
    return <p>No blogs yet. Create one!</p>
  }

  const handleLike = async blog => {
    try {
      await likeBlog(blog.id)
    } catch (error) {
      console.error('Failed to like blog', error)
    }
  }

  const handleDelete = async id => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      try {
        await deleteBlog(id)
      } catch (error) {
        console.error('Failed to delete blog', error)
      }
    }
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
            <button className="btn btn-primary" onClick={() => handleLike(blog)}>
              like
            </button>
            <button className="btn btn-danger" onClick={() => handleDelete(blog.id)}>
              delete
            </button>
          </p>
        </div>
      ))}
    </div>
  )
}

export default BlogList
