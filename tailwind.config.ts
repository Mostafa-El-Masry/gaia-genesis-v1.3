import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  blocklist: ["[-:T]"],
  theme: {
    extend: {},
  },
  plugins: [typography()],
} satisfies Config;
