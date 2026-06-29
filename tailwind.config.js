/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Satoshi-Variable", "Satoshi-Regular", "General Sans",
          "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif",
        ],
        mono: ['"JetBrains Mono"', "ui-monospace", "SFMono-Regular", "monospace"],
      },

      /* Sharp, enterprise border radius — max 16px */
      borderRadius: {
        btn: "8px",
        input: "10px",
        card: "12px",
        panel: "12px",
        dialog: "14px",
        max: "16px",
      },

      /* Strict spacing scale */
      spacing: {
        "1": "4px",
        "2": "8px",
        "3": "12px",
        "4": "16px",
        "5": "20px",
        "6": "24px",
        "8": "32px",
        "12": "48px",
      },

      colors: {
        accent: "#16C47F",
        sage: "#12B372",

        /* CSS variable-backed theme colors */
        bgMain: "var(--bg-main)",
        bgCard: "var(--bg-card)",
        bgCardHover: "var(--bg-card-hover)",
        bgSidebar: "var(--bg-sidebar)",
        bgInput: "var(--bg-input)",

        textPrimary: "var(--text-primary)",
        textSecondary: "var(--text-secondary)",
        textMuted: "var(--text-muted)",
        textHeading: "var(--text-heading)",
        textBody: "var(--text-body)",
        textLabel: "var(--text-label)",
        textHint: "var(--text-hint)",

        borderColor: "var(--border-color)",
        borderSubtle: "var(--border-subtle)",
        cardBorder: "var(--card-border)",
        cardBg: "var(--card-bg)",

        accentPrimary: "var(--accent-primary)",
        accentHover: "var(--accent-hover)",
        accentSecondary: "var(--accent-secondary)",
        accentGlow: "var(--accent-glow)",

        success: "var(--success)",
        warning: "var(--warning)",
        danger: "var(--danger)",

        glassBg: "var(--glass-bg)",
        glassBorder: "var(--glass-border)",
      },

      boxShadow: {
        card: "var(--shadow-card)",
        elevated: "var(--shadow-elevated)",
      },
    },
  },
  plugins: [],
};
