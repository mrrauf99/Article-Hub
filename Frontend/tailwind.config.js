/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#2563EB",
        accent: "#38BDF8",
        dark: "#020617",
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: true,
  },
};
