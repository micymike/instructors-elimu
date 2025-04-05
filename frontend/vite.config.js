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
      // Additional Rollup options if needed
    }
  },
  optimizeDeps: {
    include: ['@vitejs/plugin-react', 'react-parallax-tilt']
  },
  server: {
    port: process.env.PORT || 3001,
    host: true
  },
  preview: {
    port: process.env.PORT || 3001,
    host: true,
    allowedHosts: [
      'elimu-instructor-fr.onrender.com',
      'localhost',
      '127.0.0.1'
    ]
  }
});
