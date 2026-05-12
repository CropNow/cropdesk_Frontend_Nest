import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    sourcemap: false,
    rollupOptions: {
      output: {
        // Split heavy vendor libs into their own chunks so the dashboard bundle
        // is not blocked by parsing framer-motion / icon set / charting code.
        manualChunks: (id) => {
          if (!id.includes('node_modules')) return undefined;
          // Order matters: match more specific packages before bare `react/`. Use a
          // path-separator regex so Windows back-slashes also match — otherwise React
          // and ReactDOM can land in different chunks and trigger "Invalid hook call".
          if (/[\\/]react-dom[\\/]/.test(id)) return 'vendor-react';
          if (/[\\/]react-router/.test(id)) return 'vendor-router';
          if (/[\\/]react[\\/]/.test(id)) return 'vendor-react';
          if (id.includes('framer-motion')) return 'vendor-motion';
          if (id.includes('lucide-react')) return 'vendor-icons';
          if (id.includes('recharts') || id.includes('d3-')) return 'vendor-charts';
          return 'vendor';
        },
      },
    },
  },
})
