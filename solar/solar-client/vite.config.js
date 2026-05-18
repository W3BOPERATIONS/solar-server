import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom', 'zustand'],
          charts: ['apexcharts', 'react-apexcharts', 'chart.js', 'react-chartjs-2', 'react-google-charts'],
          documents: ['html2pdf.js', 'xlsx'],
          'ui-vendor': ['lucide-react', 'react-icons', 'react-select', 'sweetalert2'],
        },
      },
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});
