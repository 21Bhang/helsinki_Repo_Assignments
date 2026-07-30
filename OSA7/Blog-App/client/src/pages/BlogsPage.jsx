import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import useBlogStore from '../store/blogStore'

const BlogsPage = () => {
  const blogs = useBlogStore((s) => s.blogs)
  const setBlogsFromServer = useBlogStore((s) => s.setBlogsFromServer)
  const sortedBlogs = useBlogStore((s) => s.sortedBlogs)

  useEffect(() => {
    setBlogsFromServer()
  }, [setBlogsFromServer])

  return (
    <div>
      <h2 className="page-title">Blogs</h2>
      <ul className="blog-list">
        {sortedBlogs().map((blog) => (
          <li className="blog-item" key={blog.id}>
            <span className="blog-item__title">
              <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default BlogsPage
