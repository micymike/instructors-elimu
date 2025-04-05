import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    mainFields: ['module', 'jsnext:main', 'jsnext', 'main']
  },
  css: {
    postcss: './postcss.config.cjs'
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
    }
  },
  optimizeDeps: {
    include: ['@vitejs/plugin-react', 'react-parallax-tilt']
  },
  server: {
    port: process.env.PORT || 3001,
    host: true
  }
});
