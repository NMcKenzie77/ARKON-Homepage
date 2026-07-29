import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '/src/main.jsx': fileURLToPath(new URL('./src/production-main.jsx', import.meta.url))
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false
  }
});
