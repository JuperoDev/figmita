import tailwindcss from '@tailwindcss/vite'
import Aura from '@primevue/themes/aura'

export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },

  // Custom library components are compiled from pasted templates at runtime
  vue: {
    runtimeCompiler: true,
  },

  modules: [
    '@pinia/nuxt',
    'nuxt-security',
    '@primevue/nuxt-module',
  ],

  primevue: {
    options: {
      ripple: true,
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: '.dark',
        },
      },
    },
  },

  security: {
    headers: {
      contentSecurityPolicy: false,
    },
  },

  vite: {
    plugins: [
      tailwindcss(),
    ],
  },

  css: ['~/assets/css/main.css', 'primeflex/primeflex.css'],
})
