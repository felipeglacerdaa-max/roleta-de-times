/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "#f5f5f5", // define sua cor personalizada, nao sei o pq esta funcionando
      },
    },
  },
  plugins: [],
}
