import { cpSync, createReadStream, existsSync, statSync } from 'node:fs';
import { extname, resolve, sep } from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const copyPublicAssets = {
    name: 'copy-public-assets',
    configureServer(server) {
        const publicRoot = resolve('public');

        server.middlewares.use((request, response, next) => {
            const pathname = new URL(request.url || '/', 'http://localhost').pathname;
            if (!pathname.startsWith('/assets/') && !pathname.startsWith('/3d-assets/')) return next();

            const filePath = resolve(publicRoot, `.${decodeURIComponent(pathname)}`);
            if (!filePath.startsWith(`${publicRoot}${sep}`) || !existsSync(filePath)) return next();

            const stats = statSync(filePath);
            if (!stats.isFile()) return next();

            const contentTypes = {
                '.glb': 'model/gltf-binary',
                '.gltf': 'model/gltf+json',
                '.json': 'application/json',
                '.jpeg': 'image/jpeg',
                '.jpg': 'image/jpeg',
                '.png': 'image/png',
                '.webp': 'image/webp',
            };
            response.statusCode = 200;
            response.setHeader('Content-Type', contentTypes[extname(filePath).toLowerCase()] || 'application/octet-stream');
            response.setHeader('Content-Length', stats.size);
            response.setHeader('Accept-Ranges', 'bytes');
            if (request.method === 'HEAD') return response.end();
            createReadStream(filePath).pipe(response);
        });
    },
    closeBundle() {
        const source = resolve('public/assets');
        const destination = resolve('dist/assets');
        const modelsSource = resolve('public/3d-assets');
        const modelsDestination = resolve('dist/3d-assets');
        const faviconSource = resolve('public/favicon.svg');
        const faviconDestination = resolve('dist/favicon.svg');

        if (existsSync(source)) {
            cpSync(source, destination, {
                recursive: true,
                filter: (path) => !path.includes('/3d-models/') && !path.includes('\\3d-models\\'),
            });
        }

        if (existsSync(modelsSource)) {
            cpSync(modelsSource, modelsDestination, { recursive: true });
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
