import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, (process as any).cwd(), '');
  return {
    plugins: [react()],
    base: './', // Ensures assets are loaded relatively, fixing the 404 error
    define: {
      'process.env.API_KEY': JSON.stringify(env.API_KEY),
      'process.env': {} // Polyfill process.env to prevent runtime crashes
    }
  };
});