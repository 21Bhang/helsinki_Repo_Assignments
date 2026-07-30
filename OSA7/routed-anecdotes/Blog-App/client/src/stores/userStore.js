import { create } from 'zustand'

const useUserStore = create(set => ({
  user: null,
  login: username => set({ user: { username } }),
  logout: () => set({ user: null }),
}))

export default useUserStore
