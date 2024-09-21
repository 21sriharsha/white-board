/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        'inset-left-white': 'inset 10px 0 10px -8px rgba(255, 255, 255, 1)',
      },
    },
  },
  plugins: [],
}