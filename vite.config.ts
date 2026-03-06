import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      base: '/presupuesto/',
      server: {
        port: 3000,
        host: '0.0.0.0',
        proxy: {
          // Cada vez que una petición empiece por /api, la mandamos a Django
          '/api': {
            target: 'http://127.0.0.1:8000',
            changeOrigin: true,
            // Opcional: si en Django NO pusiste el prefijo /api/ en urls.py,
            // podrías quitarlo aquí, pero como acordamos ponerlo, déjalo así.
            // rewrite: (path) => path.replace(/^\/api/, '') 
          },
          // También añade el admin para poder entrar desde el puerto 3000
          '/admin': {
            target: 'http://127.0.0.1:8000',
            changeOrigin: true,
          },
          // Y los estáticos de Django para que el admin se vea bien
          '/django_static': {
            target: 'http://127.0.0.1:8000',
            changeOrigin: true,
          }
        }
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      build: {
        rollupOptions: {
          output: {
            entryFileNames: `assets/[name].js`,
            chunkFileNames: `assets/[name].js`,
            assetFileNames: `assets/[name].[ext]`
          }
        }
      }
    };
});
