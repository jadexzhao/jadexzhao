import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Project Pages subpath. Must stay /jadexzhao/duck-farm/ (not /duck-farm/).
  base: '/jadexzhao/duck-farm/',
})
