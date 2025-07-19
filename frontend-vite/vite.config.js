import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 1234,
    proxy: {
      '/mangas': { // Forward /mangas to backend
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  },
  resolve: {
    alias: {
      "~": "/src",
    },
  },
  root: ".",
  publicDir: "public",
});