import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { copyFileSync, mkdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

// Routed pages inside the React app that need their own URL on GitHub Pages.
// Pages has no SPA fallback, so each route gets a copy of index.html.
const ROUTED_PAGES = ['recruitment']

function routedPages() {
  return {
    name: 'routed-pages',
    closeBundle() {
      const dist = resolve(__dirname, 'dist')
      for (const route of ROUTED_PAGES) {
        mkdirSync(resolve(dist, route), { recursive: true })
        copyFileSync(resolve(dist, 'index.html'), resolve(dist, route, 'index.html'))
      }
    },
  }
}

export default defineConfig({
  plugins: [react(), routedPages()],
  base: '/',
})
