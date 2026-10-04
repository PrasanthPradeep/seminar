import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      workbox: {
        // Precache the app shell so the presentation works fully offline.
        globPatterns: ['**/*.{js,css,html,png}'],
      },
      manifest: {
        name: 'Model Context Protocol (MCP) — Technical Seminar',
        short_name: 'MCP Seminar',
        description: 'Technical seminar presentation: Model Context Protocol — Architecture and Contextual Interoperability for AI Systems.',
        start_url: '.',
        display: 'standalone',
        orientation: 'landscape',
        background_color: '#F4F3EE',
        theme_color: '#C15F3C',
        icons: [
          {
            src: 'icons/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'icons/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'icons/maskable-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
    }),
  ],
  server: {
    allowedHosts: ['sassy-duly-flock.ngrok-free.dev'],
    watch: {
      usePolling: true,
    },
  },
})
