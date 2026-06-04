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
        serif: ["'IBM Plex Serif'", "Georgia", "serif"],
        sans: ["'IBM Plex Sans'", "system-ui", "sans-serif"],
        mono: ["'IBM Plex Mono'", "'Fira Code'", "monospace"],
      },
      colors: {
        paper: "#faf9f7",
        ink: "#1a1a18",
        muted: "#6b6b65",
        border: "#e2e0db",
        accent: "#e6ffe6",
        "accent-light": "#e6ffe6",
        "accent-border": "#a7d8a7",
        "accent-strong": "#166534",
        "code-bg": "#f4f3f0",
      },
      maxWidth: {
        content: "780px",
        wide: "1100px",
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: "none",
          },
        },
      },
    },
  },
  plugins: [],
};

export default config;
