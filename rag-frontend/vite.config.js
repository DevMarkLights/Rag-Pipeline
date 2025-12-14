import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/rag",
  server: {
    port: 3002,      // 👈 choose your port
    strictPort: true // fail if port is taken
  }
})
