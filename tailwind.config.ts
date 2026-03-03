import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        ws: {
          dune: "var(--ws-dune)",
          white: "var(--ws-white)",
          green: "var(--ws-green)",
          "green-muted": "var(--ws-green-muted)",
          "surface-0": "var(--ws-surface-0)",
          "surface-1": "var(--ws-surface-1)",
          "surface-2": "var(--ws-surface-2)",
          amber: "var(--ws-amber)",
          red: "var(--ws-red)",
          "text-primary": "var(--ws-text-primary)",
          "text-secondary": "var(--ws-text-secondary)",
          "text-muted": "var(--ws-text-muted)",
          border: "var(--ws-border)",
        },
      },
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      }
    },
  },
  plugins: [],
};
export default config;
