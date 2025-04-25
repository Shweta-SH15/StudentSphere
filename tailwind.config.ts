
import type { Config } from "tailwindcss";

export default {
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
          DEFAULT: "#22c55e", // Green like ZBS Capital
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#ef4444", // Red like ZBS Tech
          foreground: "#ffffff",
        },
        tertiary: {
          DEFAULT: "#3b82f6", // Blue like ZBS Reports
          foreground: "#ffffff",
        },
        accent: {
          green: "rgba(34, 197, 94, 0.1)",
          orange: "rgba(239, 68, 68, 0.1)",
          blue: "rgba(59, 130, 246, 0.1)",
          purple: "rgba(168, 85, 247, 0.1)",
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)"
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0'
          },
          to: {
            height: 'var(--radix-accordion-content-height)'
          }
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)'
          },
          to: {
            height: '0'
          }
        },
        'swipe-right': {
          '0%': { transform: 'translateX(0) rotate(0)' },
          '100%': { transform: 'translateX(300px) rotate(15deg)', opacity: '0' }
        },
        'swipe-left': {
          '0%': { transform: 'translateX(0) rotate(0)' },
          '100%': { transform: 'translateX(-300px) rotate(-15deg)', opacity: '0' }
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'swipe-right': 'swipe-right 0.5s forwards',
        'swipe-left': 'swipe-left 0.5s forwards',
        'fade-in': 'fade-in 0.3s ease-out'
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
