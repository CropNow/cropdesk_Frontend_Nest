
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
        // Outfit is loaded in src/index.css. Keep Tailwind's font-sans aligned
        // so utility classes match the actual font on the page.
        sans: ['Outfit', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        // Brand palette: Tailwind Slate + Emerald 700 (human-curated, sunlight-readable)
        accent: '#34D399',  /* Emerald 400 — was #00FF00 (neon, eye strain) */
        sage: '#5C7A5A',    /* Slightly deeper than #749272 for contrast */
        medium: '#3F7A3D',  /* Was #498A46 — denser for outdoor legibility */
        primary: '#2F7A2C', /* Was #41933D — darker brand green for sunlight */

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
