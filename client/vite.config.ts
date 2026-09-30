import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  server: {
    port: 5173,
    // En dev, /api va al backend: la cookie de sesión es first-party (SameSite=Lax)
    proxy: {
      '/api': 'http://localhost:4000',
      '/sitemap.xml': 'http://localhost:4000',
    },
  },
  build: {
    target: 'es2020',
    // three/R3F no va en manualChunks: así solo se descarga con el import() lazy del Hero
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          motion: ['framer-motion'],
        },
      },
    },
  },
});
