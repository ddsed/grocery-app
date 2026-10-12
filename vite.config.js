// vite.config.js — build settings, plus the PWA plugin that makes the app
// installable and lets it start without internet.

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  // The app lives at ddsed.github.io/grocery-app/
  base: '/grocery-app/',

  build: {
    chunkSizeWarningLimit: 1000, // Firebase alone is ~700 KB; this is expected
  },

  plugins: [
    react(),

    VitePWA({
      // 'prompt': when a new version is deployed, show our "Refresh" banner
      // instead of silently swapping the app while someone is using it
      registerType: 'prompt',

      // Extra files from /public to make available offline
      includeAssets: ['apple-touch-icon.png'],

      // The "web app manifest": tells phones the app's name, icon, and colors
      manifest: {
        name: 'Our Groceries',
        short_name: 'Groceries', // shown under the home screen icon
        description: 'Our shared grocery lists',
        start_url: '/grocery-app/', // where the app opens
        scope: '/grocery-app/', // pages that belong to the app
        display: 'standalone', // full screen, no browser bars
        theme_color: '#845ef7', // status bar / title bar color (Android)
        background_color: '#fff9db', // splash screen while loading (Android)
        icons: [
          { src: 'pwa-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512.png', sizes: '512x512', type: 'image/png' },
          // "maskable": Android may crop the icon into a circle or squircle;
          // the cart sits in the safe middle area so nothing gets cut off
          { src: 'pwa-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
    }),
  ],
});
