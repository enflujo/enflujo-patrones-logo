import { defineConfig } from 'vite';

export default defineConfig({
  base: '/enflujo-patrones-logo',
  server: {
    port: 3000,
  },
  publicDir: 'estaticos',
  build: {
    outDir: 'publico',
    assetsDir: 'recursos',
    sourcemap: true,
  },
});
