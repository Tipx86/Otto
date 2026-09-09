import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],

  server: {
    host: true,       // Expose to local network / mobile devices
    port: 5173
  },

  build: {
    // Generate source maps for debugging (optional — remove for smaller bundles)
    sourcemap: false,

    // Chunk splitting — keeps initial bundle small (improves Google PageSpeed)
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'vendor-react';
          }
          if (id.includes('node_modules/lucide-react')) {
            return 'vendor-lucide';
          }
          if (id.includes('node_modules/canvas-confetti')) {
            return 'vendor-confetti';
          }
        }
      }
    },

    // Warn if any individual chunk exceeds 500kb
    chunkSizeWarningLimit: 500,

    // Target modern browsers (smaller output, faster execution)
    target: 'es2020',

    // Ensure assets are hashed for cache busting
    assetsInlineLimit: 4096,
  },

  // Optimise dependencies during dev
  optimizeDeps: {
    include: ['react', 'react-dom', 'lucide-react', 'canvas-confetti']
  }
});
