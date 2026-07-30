import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Notification from './components/Notification'
import ErrorBoundary from './components/ErrorBoundary'
import BlogsPage from './pages/BlogsPage'
import BlogViewPage from './pages/BlogViewPage'
import NewBlogPage from './pages/NewBlogPage'
import UsersPage from './pages/UsersPage'
import UserDetailPage from './pages/UserDetailPage'
import LoginPage from './pages/LoginPage'
import NotFound from './pages/NotFound'

const App = () => {
  const location = useLocation()
  const boundaryKey = location.pathname + location.search

  return (
    <>
      <Navbar />
      <main className="container">
        <Notification />
        {/* Error boundary wraps the routed content but NOT the navbar */}
        <ErrorBoundary key={boundaryKey}>
          <Routes>
            <Route path="/" element={<BlogsPage />} />
            <Route path="/blogs/:id" element={<BlogViewPage />} />
            <Route path="/new" element={<NewBlogPage />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/users/:id" element={<UserDetailPage />} />
            <Route path="/login" element={<LoginPage />} />
            {/* Exercise 7.9: splat route catches every non-existing path */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ErrorBoundary>
      </main>
    </>
  )
}

export default App
