import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
    // Set base to the root path for Cloud Run / Custom Domain deployment.
    // This makes all asset paths relative to /
    base: '/',
    build: {
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'index.html'),
          serena: resolve(__dirname, 'serena.html')
        }
      }
    }
})
