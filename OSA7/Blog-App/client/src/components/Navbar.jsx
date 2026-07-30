import { Link, NavLink, useNavigate } from 'react-router-dom'
import useUserStore from '../store/userStore'
import useNotificationStore from '../store/notificationStore'

const Navbar = () => {
  const user = useUserStore((s) => s.user)
  const logout = useUserStore((s) => s.logout)
  const notify = useNotificationStore((s) => s.notify)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    notify('You have been logged out')
    navigate('/login')
  }

  const linkClass = ({ isActive }) => `header__link${isActive ? ' active' : ''}`

  return (
    <header className="header">
      <Link to="/" className="header__brand">
        Blog App
      </Link>
      <nav className="header__nav">
        <NavLink to="/" end className={linkClass}>
          blogs
        </NavLink>
        <NavLink to="/users" className={linkClass}>
          users
        </NavLink>
        {user ? (
          <>
            <NavLink to="/new" className={linkClass}>
              new blog
            </NavLink>
            <button
              className="header__link"
              onClick={handleLogout}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
              }}
            >
              logout
            </button>
          </>
        ) : (
          <NavLink to="/login" className={linkClass}>
            login
          </NavLink>
        )}
      </nav>
    </header>
  )
}

export default Navbar
