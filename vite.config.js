import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/eventhub-website/',
  plugins: [react()],
  build: {
    outDir: 'dist', // Make sure this matches your GitHub Pages setting
    assetsDir: 'assets'
  }
})