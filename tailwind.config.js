/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    minWidth: {
      "45%": "45%",
      "55%": "55%",
      "65%": "65%",
      "75%": "75%",
      "90%": "90%",
      "95%": "95%",
    },
    minHeight: {
      "98vh": "98vh",
      "90%": "90%",
    },
    extend: {
      screens: {
        'non-mobile': { 'min': '640px' },
      },
      animation: {
        'check': 'check 0.5s ease-in-out 0s infinite',
        'x': 'x 0.5s ease-in-out 0s infinite'
      }
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
