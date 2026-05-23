import tailwindcss from '@tailwindcss/vite'

const appBaseURL = process.env.NUXT_APP_BASE_URL || process.env.VITE_PUBLIC_BASE || '/luminous/'

export default defineNuxtConfig({
  css: ['../src/style.css'],
  app: {
    baseURL: appBaseURL,
    head: {
      htmlAttrs: {
        lang: 'zh-CN',
      },
    },
    pageTransition: {
      name: 'route-shift',
      mode: 'out-in',
    },
  },
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || process.env.VITE_API_BASE_URL || '',
    },
  },
  vite: {
    plugins: [tailwindcss()],
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
  },
})
