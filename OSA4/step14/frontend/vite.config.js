import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Build output goes to ../build so the Express backend can serve it.
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "../build",
    emptyOutDir: true,
  },
  server: {
    port: 5173,
    proxy: {
      "/api": "http://localhost:3003",
    },
  },
});
