import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        serif: ["Spectral", "Georgia", "serif"],
      },
      colors: {
        navy: {
          DEFAULT: "#000137",
          light: "#2f3192",
        },
      },
    },
  },
  plugins: [],
};

export default config;
