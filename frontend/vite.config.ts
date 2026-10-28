import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// O backend Spring não tem CORS configurado, então o Vite faz o proxy:
// o front chama /api/... e o dev server repassa para http://localhost:8080/...
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api': {
        target: process.env.API_URL ?? 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
