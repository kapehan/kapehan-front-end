/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./src/**/*.{js,jsx,ts,tsx,css}",
    "./components/**/*.{js,jsx,ts,tsx,css}",
    "./app/**/*.{js,jsx,ts,tsx,css}",
  ],
  plugins: {
    "tailwindcss-animate": {},
  },
};
