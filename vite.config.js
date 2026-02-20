import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  base: '/purjereisid/',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        kontakt: resolve(__dirname, 'kontakt.html'),
      },
    },
  },
})
