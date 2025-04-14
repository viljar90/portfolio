module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'], // Scan component files for Tailwind classes
  darkMode: 'class',
  theme: {
    extend: {
      fontSize: {
        '6xl': '4rem', // Existing default sizes in Tailwind
        '7xl': '5rem',
        '8xl': '6rem',
        '9xl': '7rem', // Custom size for larger fonts
        '10xl': '8rem',
        '11xl': '9rem',
        '12xl': '10rem',
      },
      colors: {
        customDark: '#111827',
        customLight: '#e8eaee',
      },
    },
  },
  plugins: [],
};