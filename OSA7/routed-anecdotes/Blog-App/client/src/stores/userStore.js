import { create } from 'zustand'
import persistentUser from '../services/persistentUser'

const useUserStore = create(set => ({
  user: persistentUser.getUser(),
  login: async username => {
    // Mock backend call to ensure user exists and get their ID
    const response = await fetch('http://localhost:3001/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, name: username }),
    })
    const userData = await response.json()
    persistentUser.saveUser(userData)
    set({ user: userData })
  },
  logout: () => {
    persistentUser.removeUser()
    set({ user: null })
  },
}))

export default useUserStore
