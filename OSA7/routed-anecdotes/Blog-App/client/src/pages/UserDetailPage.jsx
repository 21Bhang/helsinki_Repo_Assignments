import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import usersService from '../services/users'

const UserDetailPage = () => {
  const { id } = useParams()
  const [user, setUser] = useState(null)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    usersService
      .getOne(id)
      .then(setUser)
      .catch(() => setNotFound(true))
  }, [id])

  if (notFound) {
    return (
      <div>
        <Link to="/users" className="back-link">
          ← back to users
        </Link>
        <p className="muted">This user could not be found.</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div>
        <Link to="/users" className="back-link">
          ← back to users
        </Link>
        <p className="muted">Loading…</p>
      </div>
    )
  }

  return (
    <div>
      <Link to="/users" className="back-link">
        ← back to users
      </Link>
      <div className="user-detail">
        <div className="user-detail__name">{user.name}</div>
        <div className="user-detail__added">added blogs</div>
        <div className="user-detail__blogs-heading">Blogs</div>
        <ul className="user-detail__list">
          {user.blogs.map((b) => (
            <li key={b.id}>
              <Link to={`/blogs/${b.id}`}>{b.title}</Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default UserDetailPage
