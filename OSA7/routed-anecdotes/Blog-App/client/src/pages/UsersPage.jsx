import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import usersService from '../services/users'

const UsersPage = () => {
  const [users, setUsers] = useState([])

  useEffect(() => {
    usersService
      .getAll()
      .then(setUsers)
      .catch(() => setUsers([]))
  }, [])

  return (
    <div>
      <h2 className="page-title">Users</h2>
      <table className="users-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Username</th>
            <th>Blogs created</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>
                <Link to={`/users/${u.id}`}>{u.name}</Link>
              </td>
              <td>{u.username}</td>
              <td>{u.blogs.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default UsersPage
