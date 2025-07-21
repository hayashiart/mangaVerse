import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { readFileSync } from 'fs';

export default defineConfig({
  plugins: [react()],
  server: process.env.NODE_ENV === 'development' ? {
    https: {
      key: readFileSync(process.env.VITE_HTTPS_KEY || '/home/seblin/mangaVerse/manga-scan/backend/localhost-key.pem'),
      cert: readFileSync(process.env.VITE_HTTPS_CERT || '/home/seblin/mangaVerse/manga-scan/backend/localhost.pem')
    },
    port: 1234,
    proxy: {
      '/mangas': { target: 'https://localhost:5000', changeOrigin: true, secure: false },
      '/api': { target: 'https://localhost:5000', changeOrigin: true, secure: false }
    }
  } : {},
  resolve: {
    alias: {
      '~': '/src',
    },
  },
  root: '.',
  publicDir: 'public',
});