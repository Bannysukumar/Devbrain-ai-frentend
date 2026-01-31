import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Proxy target for local dev (avoids CORS when frontend runs on localhost:3000).
// Set VITE_API_BASE_URL=/api in .env to use this proxy.
const proxyTarget = process.env.VITE_PROXY_TARGET ?? 'https://malaysiantradenets.com'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: proxyTarget,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        secure: true,
      },
    },
  },
})
