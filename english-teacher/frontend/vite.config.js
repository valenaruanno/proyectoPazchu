import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Optimizaciones de build
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Eliminar console.log en producción
        drop_debugger: true,
      },
    },
    // Optimizar chunks
    rollupOptions: {
      output: {
        manualChunks: {
          // Separar vendor de código de la app
          vendor: ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
    // Aumentar límite de advertencia de tamaño
    chunkSizeWarningLimit: 1000,
  },
  // Optimización de servidor dev
  server: {
    hmr: {
      overlay: true,
    },
  },
})
