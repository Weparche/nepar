import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  // Production demo lives at https://app.nepar.hr/zoyya/
  base: process.env.VITE_BASE_PATH || '/zoyya/',
  plugins: [react(), tailwindcss()],
})
