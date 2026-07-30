import { create } from 'zustand'
import blogService from '../services/blogs'
import useNotificationStore from './notificationStore'

const useBlogStore = create((set, get) => ({
  blogs: [],
  loading: false,

  // Exercise 7.12 — fetch the list of blogs from the backend into the store.
  setBlogsFromServer: async () => {
    set({ loading: true })
    try {
      const blogs = await blogService.getAll()
      set({ blogs, loading: false })
    } catch (err) {
      set({ loading: false })
      useNotificationStore
        .getState()
        .notify(`Could not load blogs: ${err.message}`, 'error')
    }
  },

  // Exercise 7.12 — create a new blog post on the backend and add it to the
  // store. The logged-in user (for optimistic display) is passed in by the
  // component.
  addBlog: async (newBlog, user) => {
    const created = await blogService.create(newBlog)
    // attach the user object so the UI can show who created it immediately
    const withUser = {
      ...created,
      user: user
        ? { id: user.id, username: user.username, name: user.name }
        : null,
    }
    set({ blogs: get().blogs.concat(withUser) })
    return created
  },

  // Exercise 7.13 — increment likes via the backend and update the store.
  likeBlog: async (blog) => {
    const updated = {
      ...blog,
      likes: blog.likes + 1,
      user: blog.user ? blog.user.id : blog.user,
    }
    const returned = await blogService.update(blog.id, updated)
    set({
      blogs: get().blogs.map((b) => (b.id === blog.id ? returned : b)),
    })
    return returned
  },

  // Exercise 7.13 — remove a blog. Returns true on success.
  removeBlog: async (id) => {
    await blogService.remove(id)
    set({ blogs: get().blogs.filter((b) => b.id !== id) })
  },

  // Fetch a single blog (used by the single-blog view, includes comments).
  getBlog: async (id) => {
    return await blogService.getOne(id)
  },

  // Like a single blog and return the updated blog (used by the single-blog
  // view so the page can reflect the new like count immediately).
  likeBlogById: async (blog) => {
    const updated = {
      ...blog,
      likes: blog.likes + 1,
      user: blog.user ? blog.user.id : blog.user,
    }
    const returned = await blogService.update(blog.id, updated)
    // keep the list store in sync too
    set({
      blogs: get().blogs.map((b) => (b.id === blog.id ? returned : b)),
    })
    return returned
  },

  // Add a comment to a blog and return the updated blog (with comments).
  addComment: async (id, content) => {
    const returned = await blogService.addComment(id, content)
    set({
      blogs: get().blogs.map((b) => (b.id === id ? returned : b)),
    })
    return returned
  },

  // convenience selector used by the list page to render sorted blogs
  sortedBlogs: () => [...get().blogs].sort((a, b) => b.likes - a.likes),
}))

export default useBlogStore
