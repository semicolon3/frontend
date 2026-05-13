import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: 'https://port-0-legal-ai-mp2pi1ad2d46dc8d.sel3.cloudtype.app',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
