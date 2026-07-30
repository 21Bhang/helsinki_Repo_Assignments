import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import useNotificationStore from './stores/notificationStore'
import useBlogStore from './stores/blogStore'
import ErrorBoundary from './components/ErrorBoundary'
import NotFound from './components/NotFound'
import BlogList from './components/BlogList'
import CreateBlog from './components/CreateBlog'
import './App.css'

const App = () => {
  const { message, type, setNotification } = useNotificationStore()
  const { blogs, fetchBlogs, createBlog } = useBlogStore()

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

  return (
    <Router>
      <div>
        <header className="header">
          <h1>Blog App</h1>
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
