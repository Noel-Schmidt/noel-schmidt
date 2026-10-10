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
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
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
