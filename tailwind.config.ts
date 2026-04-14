import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      colors: {
        leaf: {
          50: "#f0fdf0",
          100: "#dcfcdc",
          200: "#bbf7bb",
          300: "#86ef86",
          400: "#4ade4a",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
          800: "#166534",
          900: "#14532d",
          950: "#052e16",
        },
        earth: {
          50: "#faf7f2",
          100: "#f2ebe0",
          200: "#e5d5bf",
          300: "#d4b896",
          400: "#c19570",
          500: "#b07a55",
          600: "#9a6448",
          700: "#7f503c",
          800: "#694336",
          900: "#57392e",
          950: "#2f1d17",
        },
        sage: {
          50: "#f4f9f4",
          100: "#e6f2e7",
          200: "#cce4cf",
          300: "#a4cda9",
          400: "#74af7c",
          500: "#4e9058",
          600: "#3b7344",
          700: "#315c38",
          800: "#2a4a2f",
          900: "#243d28",
          950: "#0f2013",
        },
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease forwards",
        "slide-up": "slideUp 0.3s ease forwards",
        "pulse-soft": "pulseSoft 2s ease-in-out infinite",
        "spin-slow": "spin 3s linear infinite",
        wiggle: "wiggle 0.5s ease-in-out",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
