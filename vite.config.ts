import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const DEFAULT_API_BASE_URL = 'https://port-0-legal-ai-mp2pi1ad2d46dc8d.sel3.cloudtype.app'

function normalizeBaseUrl(value: string | undefined): string {
  const trimmed = value?.trim()
  if (!trimmed) return DEFAULT_API_BASE_URL

  return trimmed.replace(/\/+$/, '')
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiBaseUrl = normalizeBaseUrl(env.VITE_API_BASE_URL)

  return {
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        '/api': {
          target: apiBaseUrl,
          changeOrigin: true,
          secure: false,
          headers: {
            Origin: apiBaseUrl,
          },
        },
      },
    },
  }
})
