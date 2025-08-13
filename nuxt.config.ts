// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@nuxt/ui',
    '@nuxt/icon'
  ],
  runtimeConfig: {
    public: {
      discordClientId: process.env.NUXT_PUBLIC_DISCORD_CLIENT_ID,
      discordRedirectUri: process.env.NUXT_PUBLIC_DISCORD_REDIRECT_URI
    }
  },
  app: {
    baseURL: '/'
  },
  devServer: {
    host: '0.0.0.0',
    port: 3000
  },
  nitro: {
    dev: false,
    sourceMap: false
  }
})
  