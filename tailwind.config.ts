import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-syne)", "sans-serif"],
        mono: ["var(--font-dm-mono)", "monospace"],
      },
      colors: {
        bg: {
          DEFAULT: "#0a0a0f",
          2: "#0f0f18",
          3: "#141420",
        },
        card: {
          DEFAULT: "#11111c",
          2: "#16162a",
        },
        border: {
          DEFAULT: "rgba(255,255,255,0.07)",
          2: "rgba(255,255,255,0.12)",
        },
        accent: {
          DEFAULT: "#00e5a0",
          2: "#0090ff",
          3: "#ff6b35",
        },
        text: {
          DEFAULT: "#f0f0f8",
          2: "#8888aa",
          3: "#555577",
        },
        success: "#00e5a0",
        warn: "#f5a623",
        danger: "#ff4757",
      },
      animation: {
        "pulse-slow": "pulse 3s ease-in-out infinite",
        "slide-up": "slideUp 0.4s ease forwards",
        "fade-in": "fadeIn 0.3s ease forwards",
      },
      keyframes: {
        slideUp: {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
