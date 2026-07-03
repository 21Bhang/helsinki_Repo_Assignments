import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom", // 🚀 Enables mock browser DOM environment
    globals: true,
  },
});
