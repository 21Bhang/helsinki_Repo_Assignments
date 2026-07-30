import { create } from 'zustand'
import loginService from '../services/login'
import blogService from '../services/blogs'
import persistentUser from '../services/persistentUser'

const initial = persistentUser.getUser()
if (initial && initial.token) {
  blogService.setToken(initial.token)
}

const useUserStore = create((set) => ({
  user: initial,

  // Exercise 7.14 — authenticate, persist the user, and prime blogService.
  login: async ({ username, password }) => {
    const user = await loginService.login({ username, password })
    persistentUser.saveUser(user)
    blogService.setToken(user.token)
    set({ user })
    return user
  },

  // Exercise 7.14 — clear the user from store, storage, and blogService.
  logout: () => {
    persistentUser.removeUser()
    blogService.setToken(null)
    set({ user: null })
  },

  setUser: (user) => set({ user }),
}))

export default useUserStore
