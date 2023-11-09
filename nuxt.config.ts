// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  colorMode: {
    preference: "light",
  },
  devtools: { enabled: true },
  modules: ["@nuxt/ui", "@nuxtjs/color-mode"],
  runtimeConfig: {
    public: {
      apiUrl: process.env.API_URL || "http://localhost:3000",
    },
  },
});
