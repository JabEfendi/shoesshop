import { cpSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const copyPublicAssets = {
    name: 'copy-public-assets',
    closeBundle() {
        const source = resolve('public/assets');
        const destination = resolve('dist/assets');
        const faviconSource = resolve('public/favicon.svg');
        const faviconDestination = resolve('dist/favicon.svg');

        if (existsSync(source)) {
            cpSync(source, destination, {
                recursive: true,
                filter: (path) => !path.includes('/3d-models/') && !path.includes('\\3d-models\\'),
            });
        }

        if (existsSync(faviconSource)) {
            cpSync(faviconSource, faviconDestination);
        }
    },
};

export default defineConfig({
    plugins: [react(), copyPublicAssets],
    resolve: {
        alias: {
            '@inertiajs/react': resolve('resources/js/static/inertia.jsx'),
        },
    },
    publicDir: false,
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    three: ['three', '@react-three/fiber', '@react-three/drei'],
                },
            },
        },
    },
});
