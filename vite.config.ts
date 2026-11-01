import { defineConfig } from 'vitest/config';

export default defineConfig({
  base: './',
  build: { outDir: 'dist', target: 'es2020' },
  test: { globals: true, include: ['tests/**/*.test.ts'], testTimeout: 120000 },
});
