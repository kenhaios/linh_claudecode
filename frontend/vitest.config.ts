// Vitest configuration for Ha Linh Vietnamese Astrology Frontend
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/tests/setup.ts'],
    css: true,
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    exclude: ['node_modules', 'dist', '.idea', '.git', '.cache'],
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/tests/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/index.ts'
      ]
    },
    // Vietnamese timezone for tests
    env: {
      TZ: 'Asia/Ho_Chi_Minh',
      VITE_DEFAULT_LANGUAGE: 'vi',
      VITE_DEFAULT_TIMEZONE: 'Asia/Ho_Chi_Minh'
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@shared': path.resolve(__dirname, '../shared')
    }
  }
});