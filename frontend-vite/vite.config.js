// frontend-vite/vite.config.js
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ mode }) => {
  // Charge les variables d’environnement selon le mode (development, production, etc.)
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    server: {
      https: (() => {
        if (mode !== 'development') return false;
        try {
          return {
            key: readFileSync(path.resolve(__dirname, '../backend/localhost-key.pem')),
            cert: readFileSync(path.resolve(__dirname, '../backend/localhost.pem'))
          };
        } catch (e) {
          console.warn('Certificats HTTPS non trouvés → serveur en HTTP');
          return false;
        }
      })(),
      port: 1234,
      proxy: mode === 'development' ? {
        '/api': {
          target: 'https://localhost:5000',
          changeOrigin: true,
          secure: false, // accepte le cert self-signed
        },
      } : undefined, // pas de proxy en build production → on utilise VITE_BACKEND_URL
    },
    resolve: {
      alias: {
        '~': path.resolve(__dirname, 'src')
      }
    },
    define: {
      // Expose l’URL au frontend au moment du build
      'import.meta.env.VITE_API_URL': JSON.stringify(env.VITE_BACKEND_URL || '/api')
    }
  };
});