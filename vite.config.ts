import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:3001',
      '/images': 'http://localhost:3001'
    }
  },
  build: {
    outDir: 'dist' // 👈 ensures build output is in 'dist' folder
  },
  base: './' // 👈 ensures relative paths work correctly in production
});
