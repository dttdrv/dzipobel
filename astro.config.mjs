import { defineConfig, fontProviders } from "astro/config";

export default defineConfig({
  site: "https://dzipobel.wiki",
  output: "static",
  fonts: [
    {
      name: "Literata",
      cssVariable: "--font-literata",
      provider: fontProviders.google(),
      weights: [400, 700],
      styles: ["normal"],
      subsets: ["latin", "cyrillic"],
      fallbacks: ["Georgia", "serif"],
    },
    {
      name: "Manrope",
      cssVariable: "--font-manrope",
      provider: fontProviders.google(),
      weights: [400, 500, 600, 700],
      styles: ["normal"],
      subsets: ["latin", "cyrillic"],
      fallbacks: ["system-ui", "sans-serif"],
    },
  ],
});
