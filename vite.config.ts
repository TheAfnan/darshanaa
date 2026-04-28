import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


// https://vite.dev/config/
// Use '/' for Vercel, '/darshanaa/' for GitHub Pages
export default defineConfig({
  base: process.env.GITHUB_PAGES ? '/darshanaa/' : '/',
  plugins: [react()],
  optimizeDeps: {
    // Prebundle face-api to avoid duplicate runtime packages and speed up dev
    include: ['face-api.js'],
  },
  server: {
    port: 5173,
    strictPort: false,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
              return 'vendor-react';
            }
            if (id.includes('firebase')) {
              return 'vendor-firebase';
            }
            if (id.includes('framer-motion')) {
              return 'vendor-motion';
            }
            if (id.includes('lucide-react')) {
              return 'vendor-icons';
            }
            if (id.includes('face-api.js')) {
              return 'vendor-faceapi';
            }
            // Group other node_modules into a general vendor chunk
            return 'vendor';
          }
        }
      }
    }
  },
})

