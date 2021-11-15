const colors = require('tailwindcss/colors');

module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      opacity: ['group-hover'],
      padding: {
        '1/2': '50%',
      },
      height: {
        '1/12': '8.333333%',
        '7/12': '58.333333%',
        '11/12': '91.666667%',
        '1/9': '11.111112%',
      },
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
      black: colors.black,
      indigo: colors.indigo,
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
