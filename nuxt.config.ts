import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
    compatibilityDate: '2025-07-15',
    devtools: { enabled: true },
    css: ['~/assets/css/tailwind.css'],

    app: {
        head: {
            htmlAttrs: {
                lang: 'en',
                class: 'dark',
            },
            link: [
                { rel: 'icon', type: 'image/png', href: '/favicon.png' },
                { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
                { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
            ],
        },
    },

    vite: {
        plugins: [
            tailwindcss(),
        ],
    },

    shadcn: {
        prefix: '',
        componentDir: './app/components/ui'
    },

    modules: ['shadcn-nuxt', '@tresjs/nuxt'],
})