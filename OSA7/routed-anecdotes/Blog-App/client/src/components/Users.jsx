import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import useBlogStore from '../stores/blogStore'

const Users = () => {
  const { users, fetchUsers } = useBlogStore()

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  return (
    <div>
      <h2>Users</h2>
      <table className="users-table">
        <thead>
          <tr>
            <th></th>
            <th>blogs created</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>
                <Link to={`/users/${user.id}`}>{user.username || user.name}</Link>
              </td>
              <td>{user.blogs.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Users
