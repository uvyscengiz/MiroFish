import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@locales': path.resolve(__dirname, '../locales')
    }
  },
  server: {
    port: 3000,
    open: true,
    allowedHosts: process.env.VITE_ALLOWED_HOSTS?.split(',') || true,
    proxy: {
      '/api': {
        target: process.env.VITE_API_PROXY_URL || 'http://localhost:5001',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
