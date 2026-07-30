import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import useBlogStore from '../store/blogStore'
import useUserStore from '../store/userStore'
import useNotificationStore from '../store/notificationStore'
import useField from '../hooks/useField'

const BlogViewPage = () => {
  const { id } = useParams()
  const [blog, setBlog] = useState(null)
  const comment = useField('text', { placeholder: 'add a comment' })
  const [notFound, setNotFound] = useState(false)

  const getBlog = useBlogStore((s) => s.getBlog)
  const likeBlogById = useBlogStore((s) => s.likeBlogById)
  const addComment = useBlogStore((s) => s.addComment)
  const removeBlog = useBlogStore((s) => s.removeBlog)
  const user = useUserStore((s) => s.user)
  const notify = useNotificationStore((s) => s.notify)

  useEffect(() => {
    getBlog(id)
      .then((b) => setBlog(b))
      .catch(() => setNotFound(true))
  }, [id, getBlog])

  const handleLike = async () => {
    try {
      const updated = await likeBlogById(blog)
      setBlog(updated)
      notify(`You liked "${updated.title}"`)
    } catch (err) {
      notify(`Could not like blog: ${err.message}`, 'error')
    }
  }

  const handleAddComment = async (event) => {
    event.preventDefault()
    if (!comment.value.trim()) return
    try {
      const updated = await addComment(blog.id, comment.value.trim())
      setBlog(updated)
      comment.reset()
      notify('Comment added')
    } catch (err) {
      notify(`Could not add comment: ${err.message}`, 'error')
    }
  }

  const handleRemove = async () => {
    if (!window.confirm(`Remove "${blog.title}"?`)) return
    try {
      await removeBlog(blog.id)
      notify(`Removed "${blog.title}"`)
      window.location.href = '/'
    } catch (err) {
      notify(`Could not remove blog: ${err.message}`, 'error')
    }
  }

  if (notFound) {
    return (
      <div>
        <Link to="/" className="back-link">
          ← back to blogs
        </Link>
        <p className="muted">This blog could not be found.</p>
      </div>
    )
  }

  if (!blog) {
    return (
      <div>
        <Link to="/" className="back-link">
          ← back to blogs
        </Link>
        <p className="muted">Loading…</p>
      </div>
    )
  }

  const canRemove =
    user && blog.user && (blog.user.id === user.id || blog.user === user.id)

  return (
    <div className="blog-view">
      <Link to="/" className="back-link">
        ← back to blogs
      </Link>

      <h1 className="blog-view__title">{blog.title}</h1>
      <div className="blog-view__author">by {blog.author}</div>

      <div className="blog-view__url">
        <a href={blog.url} target="_blank" rel="noreferrer">
          {blog.url}
        </a>
      </div>

      <div className="blog-view__addedby">
        Added by{' '}
        {blog.user && typeof blog.user === 'object'
          ? blog.user.name || blog.user.username
          : 'unknown'}
      </div>

      <div className="blog-view__likes">
        <strong>{blog.likes}</strong> likes{' '}
        <button className="btn" onClick={handleLike}>
          like
        </button>
      </div>

      {canRemove && (
        <div className="blog-view__remove">
          <button className="btn btn--danger" onClick={handleRemove}>
            remove
          </button>
        </div>
      )}

      <hr className="divider" />

      <div className="comments">
        <div className="comments__heading">comments</div>
        <div className="comments__count">
          {blog.comments && blog.comments.length > 0
            ? `${blog.comments.length} comment${
                blog.comments.length === 1 ? '' : 's'
              }`
            : 'no comments yet'}
        </div>
        <form className="comment-form" onSubmit={handleAddComment}>
          <input className="text-input" {...comment.asProps} />
          <button className="btn" type="submit">
            add comment
          </button>
        </form>
        {blog.comments && blog.comments.length > 0 ? (
          <ul className="comment-list">
            {blog.comments.map((c) => (
              <li key={c.id || c.content}>{c.content}</li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  )
}

export default BlogViewPage
