import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.jsx',
            ssr: 'resources/js/ssr.jsx',
            refresh: true,
        }),
        react(),
    ],
    server: {
        host: '127.0.0.1',
        port: 5173,
        strictPort: false,
        hmr: {
            host: '127.0.0.1',
        },
    },
    ssr: {
        noExternal: ['@inertiajs/server', 'three', '@react-three/fiber', '@react-three/drei'],
    },
    optimizeDeps: {
        include: ['three', '@react-three/fiber', '@react-three/drei'],
    },
});
