import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/core': path.resolve(__dirname, './src/core'),
      '@/features': path.resolve(__dirname, './src/features'),
      '@/shared': path.resolve(__dirname, './src/shared'),
      '@/ui': path.resolve(__dirname, './src/ui'),
      '@/assets': path.resolve(__dirname, './src/assets'),
    },
  },
  optimizeDeps: {
    include: ['pixi.js'],
  },
  server: {
    port: 3000,
  },
})