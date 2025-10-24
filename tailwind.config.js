/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "faith-blue": "#1e3a8a",     // deep spiritual blue
        "faith-purple": "#6d28d9",   // royal purple
        "faith-gold": "#facc15",     // gold tone for buttons
        "faith-cream": "#fdf6ec",    // warm background cream
      },
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
      },
    },
  },
  plugins: [],
};
