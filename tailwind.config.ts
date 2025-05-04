import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        midnight_green: {
          DEFAULT: "#004e64",
          100: "#001014",
          200: "#002029",
          300: "#00303d",
          400: "#004052",
          500: "#004e64",
          600: "#0090b8",
          700: "#0acaff",
          800: "#5cdcff",
          900: "#adedff",
        },
        pacific_cyan: {
          DEFAULT: "#00a5cf",
          100: "#00212a",
          200: "#004354",
          300: "#00647d",
          400: "#0086a7",
          500: "#00a5cf",
          600: "#0ecfff",
          700: "#4adbff",
          800: "#87e7ff",
          900: "#c3f3ff",
        },
        persian_green: {
          DEFAULT: "#25a18e",
          100: "#07201d",
          200: "#0f4139",
          300: "#166156",
          400: "#1d8273",
          500: "#25a18e",
          600: "#34d1b9",
          700: "#67dccb",
          800: "#9ae8dc",
          900: "#ccf3ee",
        },
        light_green: {
          DEFAULT: "#7ae582",
          100: "#0c3b0f",
          200: "#17761e",
          300: "#23b02c",
          400: "#40d94a",
          500: "#7ae582",
          600: "#95ea9b",
          700: "#b0efb4",
          800: "#caf5cd",
          900: "#e5fae6",
        },
        old_rose: {
          DEFAULT: "#cb807d",
          100: "#2f1413",
          200: "#5d2725",
          300: "#8c3b38",
          400: "#b8514d",
          500: "#cb807d",
          600: "#d59896",
          700: "#e0b2b0",
          800: "#eaccca",
          900: "#f5e5e5",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
