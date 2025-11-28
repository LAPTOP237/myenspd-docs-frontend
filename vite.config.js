import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    open: false,
    // ✅ Configuration du Proxy pour éviter CORS
    proxy: {
      '/api': {
        target: 'https://myenspd-docs-backend.onrender.com/',  // Votre backend
        changeOrigin: true,
        secure: false,
        // Optionnel : rewrite si votre backend n'a pas /api
        // rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },

  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});