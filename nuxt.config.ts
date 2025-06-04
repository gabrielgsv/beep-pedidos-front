// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  colorMode: {
    preference: "light",
  },
  devtools: { enabled: true },
  modules: [
    "@nuxt/ui",
    "@nuxtjs/color-mode",
    "@pinia/nuxt",
    "@nuxtjs/google-fonts",
    "@nuxt/image"
  ],
  googleFonts: {
    families: {
      Manrope: true,
    },
  },
  runtimeConfig: {
    public: {
      apiUrl: process.env.API_URL || "http://localhost:3000",
    },
  },
  css: ["@/assets/main.css"],
  plugins: [{ src: "~/plugins/lottie", mode: "client" }],
});