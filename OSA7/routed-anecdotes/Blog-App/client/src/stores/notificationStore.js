import { create } from "zustand";

const useNotificationStore = create((set) => ({
  message: null,
  type: "success",
  setNotification: (message, type = "success") => {
    set({ message, type });
    setTimeout(() => set({ message: null, type: "success" }), 5000);
  },
}));

export default useNotificationStore;
