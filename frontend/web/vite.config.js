import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server:{
    allowedHosts: ['goodlang.beampie.com'],
    //proxy:{ '/translations': 'http://localhost:3000' }
  }
})
