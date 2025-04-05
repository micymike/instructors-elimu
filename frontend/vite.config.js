import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { nodeResolve } from '@rollup/plugin-node-resolve';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    nodeResolve({
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
      moduleDirectories: ['node_modules']
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    }
  },
  css: {
    postcss: './postcss.config.cjs'
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      external: ['react-parallax-tilt']
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
