import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"]
      },
      boxShadow: {
        glow: "0 0 34px rgba(99, 102, 241, 0.35)",
        gold: "0 0 30px rgba(251, 191, 36, 0.35)"
      }
    }
  },
  plugins: []
};

export default config;
