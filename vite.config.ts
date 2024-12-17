import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    host: true,
    port: 5173
  },
  build: {
    sourcemap: true,
    outDir: 'dist'
  },
  define: {
    'process.env.APP_NAME': JSON.stringify('Sandra HR'),
    'process.env.APP_DESCRIPTION': JSON.stringify('AI-Powered Recruitment Platform')
  }
});