import { useNavigate, Link } from 'react-router-dom'
import useBlogStore from '../store/blogStore'
import useUserStore from '../store/userStore'
import useNotificationStore from '../store/notificationStore'
import useField from '../hooks/useField'

const NewBlogPage = () => {
  const title = useField('text', { placeholder: 'Blog title' })
  const author = useField('text', { placeholder: 'Author name' })
  const url = useField('text', { placeholder: 'https://...' })

  const addBlog = useBlogStore((s) => s.addBlog)
  const user = useUserStore((s) => s.user)
  const notify = useNotificationStore((s) => s.notify)
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      const created = await addBlog(
        { title: title.value, author: author.value, url: url.value, likes: 0 },
        user
      )
      notify(`A new blog "${created.title}" by ${created.author} added`)
      title.reset()
      author.reset()
      url.reset()
      navigate(`/blogs/${created.id}`)
    } catch (err) {
      notify(`Could not add blog: ${err.message}`, 'error')
    }
  }

  if (!user) {
    return (
      <div>
        <p className="muted">
          You must be logged in to create a blog.{' '}
          <Link to="/login">Log in</Link>
        </p>
      </div>
    )
  }

  return (
    <div>
      <h2 className="page-title">Create new</h2>
      <form className="form" onSubmit={handleSubmit} style={{ maxWidth: 420 }}>
        <div className="field">
          <label>title</label>
          <input {...title.asProps} />
        </div>
        <div className="field">
          <label>author</label>
          <input {...author.asProps} />
        </div>
        <div className="field">
          <label>url</label>
          <input {...url.asProps} />
        </div>
        <div className="form-actions">
          <button className="btn" type="submit">
            create
          </button>
        </div>
      </form>
    </div>
  )
}

export default NewBlogPage
