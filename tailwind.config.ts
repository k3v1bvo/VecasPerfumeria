import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        emerald: {
          950: "#030f0c",
          900: "#061813",
          850: "#09221b",
          800: "#0e2d24",
          750: "#133a2e",
          700: "#1a493a",
          600: "#24614e",
        },
        gold: {
          50: "#fdfbf3",
          100: "#faf4df",
          200: "#f4e6b5",
          300: "#ecd283",
          400: "#e5c068",
          500: "#d4af37",
          600: "#b89028",
          700: "#93701d",
          800: "#77571b",
          900: "#63471a",
        },
        stamp: {
          wine: "#5f1828",
          wineBorder: "#d4af37",
        }
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "Georgia", "serif"],
        sans: ["var(--font-montserrat)", "system-ui", "sans-serif"],
        display: ["var(--font-playfair)", "serif"],
      },
      boxShadow: {
        'gold-glow': '0 0 25px -5px rgba(212, 175, 55, 0.35)',
        'gold-glow-lg': '0 0 45px -5px rgba(212, 175, 55, 0.45)',
        'emerald-glass': '0 20px 50px rgba(0, 0, 0, 0.5), inset 0 1px 1px rgba(212, 175, 55, 0.2)',
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #f7e6a7 0%, #d4af37 50%, #a8811d 100%)',
        'gold-gradient-hover': 'linear-gradient(135deg, #fff0be 0%, #e2be4a 50%, #be9426 100%)',
        'emerald-radial': 'radial-gradient(circle at 50% 20%, #11362b 0%, #061813 60%, #030f0c 100%)',
        'hero-glow': 'radial-gradient(circle at 80% 30%, rgba(212, 175, 55, 0.15) 0%, transparent 60%)',
      },
      borderRadius: {
        'squircle': '1.25rem',
        'squircle-lg': '1.75rem',
      }
    },
  },
  plugins: [],
};
export default config;
