import useBlogStore from '../stores/blogStore'
import CommentForm from './CommentForm'

const BlogList = ({ blogs }) => {
  const { likeBlog, deleteBlog } = useBlogStore()

  if (blogs.length === 0) {
    return <p>No blogs yet. Create one!</p>
  }

  const handleLike = async blog => {
    try {
      await likeBlog(blog.id)
    } catch (error) {
      console.error(error)
    }
  }

  const handleDelete = async id => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      try {
        await deleteBlog(id)
      } catch (error) {
        console.error(error)
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

          <div className="comments-section">
            <h4>Comments:</h4>
            <CommentForm blogId={blog.id} />
            <ul className="comments-list">
              {blog.comments && blog.comments.map((c, i) => <li key={i}>{c.text}</li>)}
            </ul>
          </div>
        </div>
      ))}
    </div>
  )
}

export default BlogList
