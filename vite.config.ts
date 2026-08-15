import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    reportCompressedSize: false,
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL('./index.html', import.meta.url)),
        icons: fileURLToPath(new URL('./icons.html', import.meta.url)),
      },
      output: {
        manualChunks: {
          // GSAP is only needed once the user scrolls — keep it out of the
          // critical path so the hero paints as fast as possible.
          motion: ['gsap'],
        },
      },
    },
  },
})
