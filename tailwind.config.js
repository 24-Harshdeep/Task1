/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // updated primary to user's preferred RGB (9,191,248) — keeps same role as previous cyan
        primary: 'rgb(9,191,248)',
        secondary: '#007EA7',
        background: '#FFFFFF',
        card: '#F8FAFC',
        textPrimary: '#1E293B',
        textSecondary: '#64748B',
        success: '#22C55E',
        warning: '#EAB308',
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}

