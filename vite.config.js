import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/berlinmetro/',
  server: {
    // большие бинарные файлы подложки не отслеживаем (scripts/fetch_basemap.ps1 пишет их, пока Vite работает)
    watch: { ignored: ['**/public/tiles/**', '**/public/fonts/**', '**/.tools/**'] },
  },
})
