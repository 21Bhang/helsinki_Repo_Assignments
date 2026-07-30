import { create } from 'zustand'
import blogService from '../services/blogs'

const useBlogStore = create(set => ({
  blogs: [],
  users: [],
  currentUser: null,
  fetchBlogs: async () => {
    const blogs = await blogService.getAll()
    set({ blogs })
  },
  fetchUsers: async () => {
    const response = await fetch('http://localhost:3001/api/users')
    const users = await response.json()
    set({ users })
  },
  fetchUser: async id => {
    const response = await fetch(`http://localhost:3001/api/users/${id}`)
    const user = await response.json()
    set({ currentUser: user })
  },
  createBlog: async content => {
    const newBlog = await blogService.create(content)
    set(state => ({ blogs: [...state.blogs, newBlog] }))
    return newBlog
  },
  likeBlog: async id => {
    const blog = useBlogStore.getState().blogs.find(b => b.id === id)
    const updatedBlog = await blogService.update(id, { ...blog, likes: blog.likes + 1 })
    set(state => ({
      blogs: state.blogs.map(b => (b.id !== id ? updatedBlog : b)),
    }))
  },
  deleteBlog: async id => {
    await blogService.remove(id)
    set(state => ({ blogs: state.blogs.filter(b => b.id !== id) }))
  },
}))

export default useBlogStore
