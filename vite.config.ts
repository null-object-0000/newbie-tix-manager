import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  base: process.env.NODE_ENV === "production" ? "/newbie-tix-manager/" : "/",
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    proxy: {
      '/api/freeimage': {
        target: 'https://freeimage.host',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/freeimage/, '/api')
      }
    }
  }
})
