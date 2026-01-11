import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from "path";


// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],

      },
    }),
    tailwindcss(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // React core
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          // Large UI libraries
          'ui-vendor': ['@headlessui/react', 'lucide-react', '@iconify/react'],
          // Form and validation
          'form-vendor': ['react-hook-form', '@hookform/resolvers', 'zod'],
          // Data fetching and state management
          'query-vendor': ['@tanstack/react-query', 'axios'],
          // Utility libraries
          'util-vendor': ['class-variance-authority', 'clsx', 'tailwind-merge'],
          // Heavy libraries (QR, screenshot, LIFF)
          'heavy-vendor': ['qrcode', 'html2canvas', '@line/liff'],
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './test-setup.ts',
    coverage: {
      include: ["packages/**/src/**.{js,jsx,ts,tsx}"],
    },
  },
});
