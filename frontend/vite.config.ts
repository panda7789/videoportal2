import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import svgrPlugin from 'vite-plugin-svgr';
import importMetaEnv from '@import-meta-env/unplugin';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteTsconfigPaths(),
    svgrPlugin(),
    importMetaEnv.vite({
      env: '.env',
      example: '.env.example',
    }),
  ],
  server: {
    host: true,
    port: 80,
    watch: {
      usePolling: true,
    },
  },
});
