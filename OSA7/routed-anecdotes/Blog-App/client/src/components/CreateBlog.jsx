import { useField } from '../hooks/useField'
import useUserStore from '../stores/userStore'

const CreateBlog = ({ addBlog }) => {
  const title = useField('text')
  const author = useField('text')
  const url = useField('text')
  const { user } = useUserStore()

  const handleSubmit = e => {
    e.preventDefault()
    addBlog({
      title: title.value,
      author: author.value,
      url: url.value,
      userId: user?.id,
    })
    title.reset()
    author.reset()
    url.reset()
  }

  return (
    <div className="form-container">
      <h2>Create a new blog</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>title:</label>
          <input {...title.input} required />
        </div>
        <div className="form-group">
          <label>author:</label>
          <input {...author.input} required />
        </div>
        <div className="form-group">
          <label>url:</label>
          <input {...url.input} required />
        </div>
        <button type="submit" className="btn btn-primary">
          create
        </button>
      </form>
    </div>
  )
}

export default CreateBlog
