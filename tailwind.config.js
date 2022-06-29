/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin');

module.exports = {
  mode: 'jit',
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      serif: ['"Noto Serif"', 'serif'],
      sans: ['"Questrial"', 'sans-serif'],
    },
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms'),
    plugin(({ addBase, theme }) => {
      addBase({
        'p': {
          color: "black",
          fontFamily: theme('fontFamily.serif'),
        },
        'h1': {
          fontSize: theme('fontSize.5xl'),
          fontFamily: theme('fontFamily.sans'),
          color: "black",
        },
        'h2': {
          fontSize: theme('fontSize.3xl'),
          fontFamily: theme('fontFamily.sans'),
          color: "black",
        },
        'h3': {
          fontSize: theme('fontSize.2xl'),
          fontFamily: theme('fontFamily.sans'),
          color: "black",
        },
        'h4': {
          fontSize: theme('fontSize.xl'),
          fontFamily: theme('fontFamily.sans'),
          color: "black",
        },
        'h5': {
          fontSize: theme('fontSize.lg'),
          fontFamily: theme('fontFamily.sans'),
          color: "black",
        },
      })
    })
  ],
}
