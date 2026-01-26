import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath, URL } from 'url';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api-proxy': {
        target: 'https://ggespl.com/api',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api-proxy/, ''),
        configure: (proxy, _options) => {
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log(`[Proxy] ${req.method} ${req.url} -> ${proxyReq.path}`);

            // Aggressively strip sensitive/problematic headers
            const sensitiveConfig = ['authorization', 'cookie', 'origin', 'referer', 'sec-fetch-site', 'sec-fetch-mode', 'sec-fetch-dest', 'sec-ch-ua', 'sec-ch-ua-mobile', 'sec-ch-ua-platform'];
            sensitiveConfig.forEach(header => {
              proxyReq.removeHeader(header);
              proxyReq.removeHeader(header.charAt(0).toUpperCase() + header.slice(1)); // Title case just in case
            });

            // Also generic removal for any sec- header to be safe, as WAFs dislike mismatched sec-ch-ua vs User-Agent
            const currentHeaders = proxyReq.getHeaders();
            Object.keys(currentHeaders).forEach(key => {
              if (key.toLowerCase().startsWith('sec-')) {
                proxyReq.removeHeader(key);
              }
            });

            // Spoof minimal valid headers
            proxyReq.setHeader('Origin', 'https://ggespl.com');
            proxyReq.setHeader('Referer', 'https://ggespl.com/');
            proxyReq.setHeader('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0 Safari/537.36');

            console.log('[Proxy] Outgoing Headers:', proxyReq.getHeaders());
          });
        },
      },
    },
  },
});
