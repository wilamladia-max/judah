import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ["'DM Mono'", "monospace"],
        serif: ["'Playfair Display'", "Georgia", "serif"],
      },
      colors: {
        brand: {
          50:  "#fdf8f1",
          100: "#f9f0e0",
          200: "#ecdfc9",
          300: "#ddd3c3",
          400: "#c0a87a",
          500: "#b5813a",
          600: "#8a5e28",
          700: "#7a4a10",
          800: "#2c1a08",
          900: "#1a0e03",
        },
      },
    },
  },
  plugins: [],
};

export default config;
