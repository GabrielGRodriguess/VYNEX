/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-green': '#A3FF12',
        'brand-primary': '#2563EB',
        'brand-secondary': '#1E40AF',
        'bg-main': '#F1F5F9',
        'text-main': '#0F172A',
        'border-main': '#E2E8F0',
      }
    },
  },

  plugins: [],
}
