import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Ensures paths work correctly on Vercel
  server: {
    host: true
  },
  build: {
    outDir: 'dist', // This is the folder Vercel is looking for!
    emptyOutDir: true,
  }
})