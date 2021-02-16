const path = require('path');

module.exports = {
  purge: [
    path.resolve(__dirname, 'src/**/*.{vue,js,ts,jsx,tsx}'),
    path.resolve(__dirname, 'layout/**/*.{vue,js,ts,jsx,tsx}'),
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {},
  plugins: [],
};
