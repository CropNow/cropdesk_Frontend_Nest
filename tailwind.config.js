
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      colors: {
        accent: '#00FF00',
        sage: '#749272',
        medium: '#498A46',
        primary: '#41933D',

        // CSS variable-backed theme colors
        bgMain: 'var(--bg-main)',
        bgCard: 'var(--bg-card)',
        bgCardHover: 'var(--bg-card-hover)',
        bgSidebar: 'var(--bg-sidebar)',
        bgInput: 'var(--bg-input)',

        textPrimary: 'var(--text-primary)',
        textSecondary: 'var(--text-secondary)',
        textMuted: 'var(--text-muted)',
        textHeading: 'var(--text-heading)',
        textBody: 'var(--text-body)',
        textLabel: 'var(--text-label)',
        textHint: 'var(--text-hint)',

        borderColor: 'var(--border-color)',
        borderSubtle: 'var(--border-subtle)',
        cardBorder: 'var(--card-border)',
        cardBg: 'var(--card-bg)',

        accentPrimary: 'var(--accent-primary)',
        accentSecondary: 'var(--accent-secondary)',
        accentGlow: 'var(--accent-glow)',
        accentCyan: 'var(--accent-cyan)',
        accentPurple: 'var(--accent-purple)',
        accentAmber: 'var(--accent-amber)',
        accentRose: 'var(--accent-rose)',

        glassBg: 'var(--glass-bg)',
        glassBorder: 'var(--glass-border)',
      }
    },
  },
  plugins: [],
}
