import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('.', import.meta.url));

// Все страницы сайта — отдельные точки входа (многостраничная сборка).
const pages = ['index', 'privacy', 'terms', 'offer', 'rules', 'cookies', '404'];

export default defineConfig({
  // Относительные пути: сборку можно выкладывать и в корень домена, и в подпапку (GitHub Pages).
  base: './',
  build: {
    rollupOptions: {
      input: Object.fromEntries(pages.map((p) => [p, resolve(root, `${p}.html`)]))
    }
  }
});
