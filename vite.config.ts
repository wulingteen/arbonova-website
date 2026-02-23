import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
    // Set base to the GitHub repo name for GitHub Pages deployment.
    // This makes all asset paths relative to /arbonova-website/
    base: '/arbonova-website/',
    build: {
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'index.html'),
          jenny: resolve(__dirname, 'jenny.html')
        }
      }
    }
})
