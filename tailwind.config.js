const colors = require('tailwindcss/colors');

module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      opacity: ['group-hover'],
    },
    colors: {
      sky: colors.sky,
      blue: colors.blue,
      amber: colors.amber,
      white: colors.white,
      gray: colors.gray,
      red: colors.red,
      green: colors.green,
      yellow: colors.yellow,
      blueGray: colors.blueGray,
      coolGray: colors.coolGray,
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
