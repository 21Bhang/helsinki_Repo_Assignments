import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import useBlogStore from '../stores/blogStore'

const UserDetail = () => {
  const { id } = useParams()
  const { currentUser, fetchUser } = useBlogStore()

  useEffect(() => {
    fetchUser(id)
  }, [id, fetchUser])

  if (!currentUser) return <p>Loading user...</p>

  return (
    <div>
      <h2>{currentUser.username || currentUser.name}</h2>
      <h3>Added blogs:</h3>
      <ul>
        {currentUser.blogs.map(blog => (
          <li key={blog.id}>{blog.title}</li>
        ))}
      </ul>
    </div>
  )
}

export default UserDetail
