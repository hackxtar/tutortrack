import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâ€”file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Ignore backend and database files to prevent page reloads on SQLite writes
      watch: {
        ignored: ['**/backend/**', '**/*.db', '**/*.db-wal', '**/*.db-shm'],
      },
      // Proxy API requests to the Express backend
      proxy: {
        '/api': {
          target: 'https://refreshing-recreation-production-85e2.up.railway.app',
          changeOrigin: true,
        },
      },
    },
  };
});
