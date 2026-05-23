import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Get backend port from environment or use default
const backendPort = process.env.VITE_BACKEND_PORT || 5000

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: `http://localhost:${backendPort}`,
        changeOrigin: true,
      },
      '/health': {
        target: `http://localhost:${backendPort}`,
        changeOrigin: true,
      },
    },
  },
})
