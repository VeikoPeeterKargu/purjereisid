import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  base: '/purjereisid/',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        mainRu: resolve(__dirname, 'index-ru.html'),
        kontakt: resolve(__dirname, 'kontakt.html'),
        kontaktRu: resolve(__dirname, 'kontakt-ru.html'),
        blogiKreekas: resolve(__dirname, 'blogi/purjereis-kreekas-2026.html'),
      },
    },
  },
})
