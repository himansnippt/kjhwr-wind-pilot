/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#0B0F17',
          card: '#111827',
          border: '#1F2937',
          accent: '#10B981',      // Emerald Green for Wind / Renewable
          forecast: '#60A5FA',    // Sky Blue for Forecast
          actual: '#34D399',      // Bright Mint for Actual
          error: '#F87171',       // Soft Red for Error
          warning: '#FBBF24'
        }
      }
    },
  },
  plugins: [],
}
