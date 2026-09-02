import typography from "@tailwindcss/typography";
import animate from "tailwindcss-animate";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#2563EB",
        accent: "#38BDF8",
        dark: "#020617",

        // "Ink & Moss" design tokens — the app-wide palette for Guest, Auth,
        // and the User/Admin panels, applied via the font-ui/font-editorial +
        // these color utilities.
        paper: {
          DEFAULT: "#FAFAF7",
          raised: "#FFFFFF",
        },
        ink: {
          DEFAULT: "#1B1B18",
          muted: "#5B5B54",
          faint: "#6B6B63",
          950: "#14140F",
          900: "#1D1D17",
          800: "#2A2A22",
        },
        hairline: {
          DEFAULT: "#E4E1D8",
          strong: "#D3CFC0",
          dark: "rgba(250, 250, 247, 0.12)",
        },
        moss: {
          50: "#F1F6F2",
          100: "#E4EEE7",
          200: "#C7DCCD",
          300: "#A9CAB3",
          400: "#4F8A69",
          500: "#356B4C",
          600: "#2C6B4F",
          700: "#1E4B39",
          800: "#193D2E",
          900: "#143024",
        },
        danger: "#B91C1C",
        "danger-deep": "#991B1B",
        "review-amber": {
          bg: "#FFFBEB",
          text: "#78350F",
          ring: "#FDE68A",
        },
        "rejected-red": {
          bg: "#FEF2F2",
          text: "#991B1B",
          ring: "#FECACA",
        },
      },
      fontFamily: {
        // Guest/Auth only — applied via explicit font-editorial / font-ui
        // classes on redesigned surfaces. The Tailwind default `sans` stays
        // untouched so User/Admin typography is unaffected.
        editorial: ["Newsreader", "Georgia", "serif"],
        ui: ['"Public Sans"', "system-ui", "sans-serif"],
      },
      animation: {
        shimmer: "shimmer 2s infinite",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float": "float 6s ease-in-out infinite",
      },
      keyframes: {
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
    },
  },
  plugins: [typography, animate],
  corePlugins: {
    preflight: true,
  },
};
