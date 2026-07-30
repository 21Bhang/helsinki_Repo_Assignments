import { create } from 'zustand'

const useNotificationStore = create((set, get) => ({
  message: null,
  type: 'success',
  _timer: null,

  notify: (message, type = 'success', timeout = 5000) => {
    // clear any previously scheduled auto-dismiss
    const prev = get()._timer
    if (prev) clearTimeout(prev)

    const timer = setTimeout(() => {
      set({ message: null, _timer: null })
    }, timeout)

    set({ message, type, _timer: timer })
  },

  clear: () => {
    const prev = get()._timer
    if (prev) clearTimeout(prev)
    set({ message: null, type: 'success', _timer: null })
  },
}))

export default useNotificationStore
