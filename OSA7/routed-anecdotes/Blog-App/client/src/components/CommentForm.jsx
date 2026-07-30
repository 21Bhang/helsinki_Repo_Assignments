import { useState } from 'react'
import blogService from '../services/blogs'
import useBlogStore from '../stores/blogStore'

const CommentForm = ({ blogId }) => {
  const [comment, setComment] = useState('')
  const { fetchBlogs } = useBlogStore()

  const handleSubmit = async e => {
    e.preventDefault()
    if (!comment) return

    await blogService.addComment(blogId, comment)
    setComment('')
    fetchBlogs() // Refresh blogs to show new comment
  }

  return (
    <form onSubmit={handleSubmit} className="comment-form">
      <input
        type="text"
        placeholder="add a comment"
        value={comment}
        onChange={e => setComment(e.target.value)}
      />
      <button type="submit" className="btn btn-primary">
        add
      </button>
    </form>
  )
}

export default CommentForm
