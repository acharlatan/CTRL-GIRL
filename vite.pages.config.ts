import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

export default defineConfig({
  root: 'pages',
  base: '/CTRL-GIRL/',
  publicDir: '../public',
  resolve: { alias: { '@': resolve(__dirname, '.') } },
  plugins: [react(), {
    name: 'pages-compatibility',
    enforce: 'pre',
    transform(code, id) {
      if (id.endsWith('/app/globals.css')) return code.replace("url('/hero.png')", "url('../public/hero.png')");
      if (id.endsWith('/app/page.tsx')) return code.replace('async function review(){', "async function review(){setError('AI feedback is not available on this GitHub Pages version yet. Your draft is saved on this device.');return;");
    },
  }],
  build: { outDir: '../pages-dist', emptyOutDir: true },
});
