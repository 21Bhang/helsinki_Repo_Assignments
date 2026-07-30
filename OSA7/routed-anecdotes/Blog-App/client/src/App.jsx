import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import useNotificationStore from './stores/notificationStore'
import useBlogStore from './stores/blogStore'
import useUserStore from './stores/userStore'
import ErrorBoundary from './components/ErrorBoundary'
import NotFound from './components/NotFound'
import BlogList from './components/BlogList'
import CreateBlog from './components/CreateBlog'
import Login from './components/Login'
import './App.css'

const App = () => {
  const { message, type, setNotification } = useNotificationStore()
  const { blogs, fetchBlogs, createBlog } = useBlogStore()
  const { user, logout } = useUserStore()

  useEffect(() => {
    fetchBlogs()
  }, [fetchBlogs])

  const handleAddBlog = async blogObject => {
    try {
      const newBlog = await createBlog(blogObject)
      setNotification(`A new blog "${newBlog.title}" by ${newBlog.author} added`, 'success')
    } catch (error) {
      setNotification(error.response?.data?.error || 'Failed to create blog', 'error')
    }
  }

  // If no user is logged in, show login screen
  if (!user) {
    return (
      <div>
        <header className="header">
          <h1>Blog App</h1>
        </header>
        <div className="container">
          <Login />
        </div>
      </div>
    )
  }

  return (
    <Router>
      <div>
        <header
          className="header"
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
        >
          <h1>Blog App</h1>
          <span style={{ fontSize: '0.9rem' }}>Logged in as: {user.username}</span>
          <button className="btn btn-danger" onClick={logout} style={{ padding: '5px 10px' }}>
            logout
          </button>
        </header>

        <div className="container">
          {message && <div className={`notification ${type}`}>{message}</div>}

          <nav className="nav">
            <Link to="/">blogs</Link>
            <Link to="/create">create new</Link>
          </nav>

          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<BlogList blogs={blogs} />} />
              <Route path="/create" element={<CreateBlog addBlog={handleAddBlog} />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </ErrorBoundary>
        </div>
      </div>
    </Router>
  )
}

export default App
