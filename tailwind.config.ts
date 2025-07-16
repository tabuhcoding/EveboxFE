import type { Config } from "tailwindcss";
// const { nextui } = require("@nextui-org/react");

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    // "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    // "./src/pages/components/**/*.{js,ts,jsx,tsx,mdx}",
    // "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    // "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    // "./node_modules/react-tailwindcss-datepicker/dist/index.esm.{js,ts}",
    // "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        sans: ['var(--font-montserrat)', 'sans-serif'],
      }
    },
    fontWeight: {
      thin: "100",
      hairline: "100",
      extralight: "200",
      light: "300",
      normal: "400",
      medium: "500",
      semibold: "600",
      bold: "700",
      extrabold: "800",
      "extra-bold": "800",
      black: "900",
    },
  },
  plugins: [
    // nextui()
  ],
};
export default config;