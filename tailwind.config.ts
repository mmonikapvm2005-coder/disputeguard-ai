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
        brand: {
          50: "#eef8ff",
          100: "#d8eeff",
          500: "#0070ba", // PayPal Blue
          600: "#005ea6",
          700: "#004780",
          900: "#002047",
        },
        paypalGold: {
          400: "#ffc439",
          500: "#f0b429",
          600: "#d99b1a",
        }
      },
    },
  },
  plugins: [],
};
export default config;
