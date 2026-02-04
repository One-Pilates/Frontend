export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        main: "#F77433",
        subMain: "#FFCC9C",
        fontMain: "#FAFBFC",
        hidebar: "#161B22",
        background: "#0D1117",
        component: "#1B1F26",
        fontSec: "#C9D1D9",
      },
      animation: {
        fadeIn: 'fadeIn 0.2s ease-in-out',
        slideUp: 'slideUp 0.3s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      backgroundColor: {
        'light': '#ffffff',
        'dark': '#0D1117',
        'dark-secondary': '#161B22',
        'dark-component': '#1B1F26',
      },
      textColor: {
        'light': '#1a1a1a',
        'dark': '#FAFBFC',
        'dark-secondary': '#8B949E',
      },
    },
  },
  plugins: [],
};
