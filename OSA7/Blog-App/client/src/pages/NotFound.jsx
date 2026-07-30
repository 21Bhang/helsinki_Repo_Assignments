import { Link } from 'react-router-dom'

const NotFound = () => (
  <div className="not-found">
    <h1>404</h1>
    <p>Page not found</p>
    <Link to="/" className="btn">
      Back to blogs
    </Link>
  </div>
)

export default NotFound
