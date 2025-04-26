// tailwind.config.cjs
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "Space Grotesk", ...defaultTheme.fontFamily.sans],
        title: ["Space Grotesk", "sans-serif"],
      },
      colors: {
        // Example custom colors (adjust as needed)
        primary: "#14b8a6", // Teal 500
        "primary-hover": "#0d9488", // Teal 600
        "dark-bg": "#0f172a", // Slate 900
        "light-text": "#e2e8f0", // Slate 200
        "medium-text": "#94a3b8", // Slate 400
      },
      // Example: Add subtle animations
      keyframes: {
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        fadeInUp: "fadeInUp 0.5s ease-out forwards",
      },
    },
  },
  plugins: [],
};
