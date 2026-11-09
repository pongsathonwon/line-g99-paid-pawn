import { defineConfig } from 'vitest/config'
import type { Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from "path";

// `npm run dev:mock` (mode "mock"): fake LINE login and fake APIs from
// src/dev-mock, for working on screens without LINE. Never used by `build`.
const devMockPlugin = (): Plugin => ({
  name: "g99-dev-mock",
  transformIndexHtml: (html) =>
    html.replace(
      '<script type="module" src="/src/main.tsx"></script>',
      '<script type="module" src="/src/dev-mock/install.ts"></script>' +
        '<script type="module" src="/src/main.tsx"></script>',
    ),
});

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  define: {
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
  },
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),
    tailwindcss(),
    ...(mode === "mock" ? [devMockPlugin()] : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      ...(mode === "mock"
        ? { "@line/liff": path.resolve(__dirname, "./src/dev-mock/liff.ts") }
        : {}),
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
          'heavy-vendor': ['qrcode', 'html-to-image', '@line/liff'],
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
  test: {
    globals: true,
    environment: "happy-dom",
    setupFiles: "./test-setup.ts",
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      include: ['src/**/*.{js,jsx,ts,tsx}'],
      exclude: [
        'node_modules/',
        'src/**/*.test.{js,jsx,ts,tsx}',
        'src/**/*.spec.{js,jsx,ts,tsx}',
        'src/**/*.d.ts',
        'src/main.tsx',
        'src/vite-env.d.ts',
        'src/test',
        'src/dev-mock'
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },
  },
}));
