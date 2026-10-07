export function resolveStaticAssetViteDevUrl(url) {
    if (!url || typeof url !== 'string') return url;
    // NOTE: Sejak server.php custom Laravel router (root proyek) support HTTP RANGE 206 Partial Content,
    // semua static file (GLB 65MB+, texture HD, dll) di-serve langsung via PHP artisan port APP_URL tanpa
    // perlu lewat Vite static (yang kadang 404 untuk file public non-manifest).
    // Kembalikan URL relative apa adanya (mis: /3d-assets/leather-boot-optimized.glb) →
    // otomatis di-request ke APP_URL origin (port 8000/8001),
    // custom server.php handle Range bytes request dengan 206 OK untuk Three.js GLTFLoader.
    if (import.meta.env.DEV) return url;
    if (import.meta.env.PROD) return url;
    return url;
}

export function resolveHeadRequestViteDevUrl(url) {
    return resolveStaticAssetViteDevUrl(url);
}

export default resolveStaticAssetViteDevUrl;
