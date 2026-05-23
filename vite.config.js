import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import tresCompilerOptions from '@tresjs/core/template-compiler-options'

export default defineConfig({
  // Default to GitHub repo path, allow override for other deployments.
  base: process.env.VITE_PUBLIC_BASE || '/luminous/',
  plugins: [vue(tresCompilerOptions), tailwindcss()],
  server: {
    proxy: {
      '/api': 'http://localhost:3030',
      '/downloads': 'http://localhost:3030',
      '/media': 'http://localhost:3030',
      '/healthz': 'http://localhost:3030',
    },
  },
  build: {
    target: 'es2020',
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) {
            return undefined
          }

          if (id.includes('@tresjs/core')) {
            return 'scene-tres'
          }

          if (id.includes('\\three\\') || id.includes('/three/')) {
            return 'scene-three'
          }

          if (id.includes('gsap') || id.includes('lenis')) {
            return 'motion'
          }

          if (id.includes('vue-router') || id.includes('\\vue\\') || id.includes('/vue/')) {
            return 'framework'
          }

          return undefined
        },
      },
    },
  },
  esbuild: {
    target: 'es2020',
    treeShaking: true,
  },
  optimizeDeps: {
    include: ['vue', 'vue-router', 'gsap', 'lenis'],
  },
})
