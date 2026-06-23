import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    // increase warning limit to avoid noisy chunk-size warnings for portfolio builds
    chunkSizeWarningLimit: 1000,
  },
});
