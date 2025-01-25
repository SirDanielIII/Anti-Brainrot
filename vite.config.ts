import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import {resolve} from 'path';

export default defineConfig({
    plugins: [react()],
    build: {
        outDir: 'dist',
        rollupOptions: {
            input: {
                index: resolve(__dirname, 'index.html'), // Usually popup.html but it's index.html for us
                background: resolve(__dirname, 'src/background.ts'), // Background script
            },
            output: {
                entryFileNames: '[name].js', // Keeps 'background.ts' in the output
                chunkFileNames: '[name]-[hash].js',
                assetFileNames: '[name]-[hash][extname]', // Ensures CSS and other assets are hashed
            }
        }
    }
});
