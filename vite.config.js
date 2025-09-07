import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Listen on all addresses
    port: 4173, // Railway uses this port
    allowedHosts: [
      'cbc-frontend-production.up.railway.app',
      'localhost',
      '127.0.0.1'
    ]
  },
  preview: {
    host: true,
    port: 4173,
    allowedHosts: [
      'cbc-frontend-production.up.railway.app',
      'localhost', 
      '127.0.0.1'
    ]
  }
})