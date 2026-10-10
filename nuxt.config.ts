import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  css: ['~/assets/css/tailwind.css'],

  app: {
    head: {
      htmlAttrs: {
        lang: 'en',
      },
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon.png' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
      ],
    },
  },

  components: {
    dirs: [
      { path: '~/components/global', global: true, extensions: ['vue'] },
      { path: '~/components', extensions: ['vue'] },
    ],
  },

  vite: {
    optimizeDeps: {
      include: ['lucide-vue-next'],
    },
    plugins: [tailwindcss()],
  },
})
