/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'dark-bg': '#0d0d0d',
        'dark-sidebar': '#1a1a1a',
        'dark-chat': '#121212',
        'dark-text': '#e5e5e5',
        'dark-border': '#2a2a2a',
        'dark-hover': '#2d2d2d',
        'dark-input': '#1f1f1f',
        'online': '#10b981',
        'offline': '#6b7280',
      },
    },
  },
  plugins: [],
}