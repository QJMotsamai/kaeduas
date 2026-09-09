import { defineConfig } from 'vite';

export default defineConfig({
  // Relative base → the built site works at ANY path: GitHub Pages subpath,
  // Cloudflare Pages root, anywhere.
  base: './',
  build: {
    target: 'es2020',
    assetsInlineLimit: 0,
    cssCodeSplit: false
  },
  server: {
    host: true,
    port: 5173,
    allowedHosts: true
  },
  preview: {
    host: true,
    port: 4173,
    allowedHosts: true
  }
});
