/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#1e1553",
          light: "#2e1a8f",
        },
        maritime: {
          blue: "#0e4a8f",
        },
      },
      fontFamily: {
        serif: ["\"Playfair Display\"", "Georgia", "Cambria", "Times New Roman", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
