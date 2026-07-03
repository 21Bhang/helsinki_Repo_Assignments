import { create } from "zustand";

export const useNotificationStore = create((set) => ({
  message: "",
  actions: {
    // Sets the alert text and schedules its deletion after 5000ms
    showNotification: (text) => {
      set({ message: text });
      setTimeout(() => {
        set({ message: "" });
      }, 5000);
    },
  },
}));
