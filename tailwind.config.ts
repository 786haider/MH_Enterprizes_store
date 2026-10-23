import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: { DEFAULT: "#071D3A", 2: "#102C50" },
        gold: { DEFAULT: "#B58A35", dark: "#8F6A22", light: "#E9D9B4" },
        paper: "#F6F7F9", ink: "#252B36", muted: "#687386", line: "#E4E7EC",
      },
      fontFamily: { serif: ["var(--font-serif)", "Georgia", "serif"], sans: ["var(--font-sans)", "system-ui", "sans-serif"] },
      boxShadow: { soft: "0 1px 2px rgba(7,29,58,.06), 0 8px 24px -12px rgba(7,29,58,.18)" },
    },
  },
  plugins: [],
};
export default config;
