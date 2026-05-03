/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // 🌙 Base Colors
        'bg-global': 'hsl(var(--bg-global))',
        'bg-card': 'hsl(var(--bg-card))',
        'bg-sidebar-admin': 'hsl(var(--bg-sidebar-admin))',
        'bg-sidebar-dg': 'hsl(var(--bg-sidebar-dg))',
        'bg-sidebar-dir': 'hsl(var(--bg-sidebar-dir))',
        'bg-header': 'hsl(var(--bg-header))',
        'bg-border': 'hsl(var(--bg-border))',

        // 📝 Text
        'text-primary': 'hsl(var(--text-primary))',
        'text-secondary': 'hsl(var(--text-secondary))',
        'text-tertiary': 'hsl(var(--text-tertiary))',

        // 🎯 Accent principal
        'accent-main': 'hsl(var(--accent-main))',
        'accent-hover': 'hsl(var(--accent-hover))',

        // 📊 Semantic
        success: 'hsl(var(--success))',
        error: 'hsl(var(--error))',
        warning: 'hsl(var(--warning))',
      },
    },
  },
  plugins: [],
}

