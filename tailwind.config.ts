import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#101820",
        card: "#1B2730",
        border: "#30414B",
        tealAccent: "#45C4B0",
        "tealAccent-hover": "#3bb29f",
        mainText: "#E8EEF2",
        secondaryText: "#9BAAB4",
        successGreen: "#79C9A5",
        errorRed: "#E27D7D",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
