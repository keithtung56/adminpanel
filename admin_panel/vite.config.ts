import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    react(),
    svgr({
      svgrOptions: {
        // svgr options
      },
    })
  ],
  resolve: {
    alias: {
      '@mui/styled-engine': '@mui/styled-engine-sc'
    },
  },
  build: {
    chunkSizeWarningLimit: 1500,
  }
})
