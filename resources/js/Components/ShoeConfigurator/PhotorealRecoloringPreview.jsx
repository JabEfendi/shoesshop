import { useEffect, useMemo, useRef, useState } from 'react';
import { useShoeStore } from './useShoeStore';

/* ================================================================
 * PhotorealRecoloringPreview
 * ================================================================
 * TEKNOLOGI: HSL Luminance-Preserving Recoloring (Canvas 2D Pixel Shader)
 *
 * KEGUNAAN: User punya 1 FOTO UTUH sepatu + per-region mask
 *   (mask = gambar PNG hitam-putih/alpha, bagian putih = area bagian itu,
 *    hitam = area lain). User GAK PERLU potong foto jadi 6 PNG terpisah.
 *   Cukup buat mask (atau pakai auto-generated SVG mask placeholder saya).
 *
 * CARA KERJA PER-PIXEL (real-time):
 *   1. Load base foto (mis: boots.jpeg)
 *   2. Untuk SETIAP region (sole / insole / upper / laces / hw / stitch):
 *      a. Load MASK region itu (grayscale/alpha).
 *      b. Untuk tiap pixel di base foto:
 *         • Jika mask pixel PUTIH (alpha>threshold):
 *           → RGB base → convert ke HSL
 *           → GANTI H (warna) = HEX pilihan user → convert ke HSL ambil H
 *           → OPSIONAL sesuaikan S (kejenuhan)
 *           → ** SIMPAN L (Luminance / brightness) ASLI DARI FOTO **
 *             ← ini RAHASIA realisme: shadow, highlight, tekstur kulit,
 *               kerutan, lekukan SEMUA TERTAHAN karena L tidak diganti!
 *           → convert HSL baru → RGB kembali
 *         • Jika mask pixel HITAM: lewatkan (tidak diapa-apakan)
 *   3. Susun hasilnya di canvas utama (user lihat 1 gambar final).
 *
 * FALLBACK: Jika file mask PNG belum di-upload (belum dibuat user),
 *   otomatis generate SVG mask berbasis bounding-box layer yang smooth
 *   (bukan kotak keras) pakai bezier curve, agar langsung bisa demo tanpa
 *   user buka Photoshop dulu.
 * ================================================================ */

/* -------- Color utils: RGB <-> HSL -------- */
function rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s;
    const l = (max + min) / 2;
    if (max === min) { h = s = 0; }
    else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
            default: h = 0;
        }
        h /= 6;
    }
    return [h, s, l];
}
function hue2rgb(p, q, t) {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
}
function hslToRgb(h, s, l) {
    let r, g, b;
    if (s === 0) { r = g = b = l; }
    else {
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}
function hexToHsl(hex) {
    if (!hex) return null;
    const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!m) return null;
    const r = parseInt(m[1], 16), g = parseInt(m[2], 16), b = parseInt(m[3], 16);
    return rgbToHsl(r, g, b);
}

/* -------- Load image helper -------- */
function loadImage(src) {
    return new Promise((resolve, reject) => {
        if (!src) return reject('no src');
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = (e) => reject(e);
        img.src = src;
    });
}

/* -------- Generate smooth SVG masks as fallback (tanpa perlu upload PNG mask) -------- */
/*
 * Kita bikin bezier path SVG lalu render ke canvas di memori untuk jadi mask.
 * Tujuannya: langsung bisa demo, user belom bikin mask PNG pun mode sudah
 * berfungsi dengan approximation yang smooth (bukan kotak).
 */
function svgMaskDataUriFor(category, width = 1200, height = 900, model = 'leather-boot') {
    const w = width, h = height;
    let svg;
    switch (category) {
        case 'sole':
            // Bottom 22% area, smooth curve sesuai kontur sole
            svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}">
                <defs><linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#000" stop-opacity="0"/>
                    <stop offset="18%" stop-color="#fff" stop-opacity="1"/>
                    <stop offset="100%" stop-color="#fff" stop-opacity="1"/>
                </linearGradient></defs>
                <path fill="url(#sg)" d="M ${w*0.02} ${h*0.72}
                    C ${w*0.06} ${h*0.62}, ${w*0.12} ${h*0.60}, ${w*0.22} ${h*0.60}
                    L ${w*0.78} ${h*0.57}
                    C ${w*0.86} ${h*0.57}, ${w*0.93} ${h*0.58}, ${w*0.97} ${h*0.62}
                    L ${w*0.97} ${h*0.98}
                    L ${w*0.02} ${h*0.98} Z"/>
                <path fill="#fff" opacity="0.95" d="M ${w*0.03} ${h*0.78}
                    L ${w*0.97} ${h*0.76} L ${w*0.97} ${h*0.98} L ${w*0.03} ${h*0.98} Z"/>
            </svg>`;
            break;
        case 'insole':
            // Top of sole → inside area, 18%-28% height
            svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}">
                <path fill="#fff" d="M ${w*0.08} ${h*0.68}
                    C ${w*0.12} ${h*0.60}, ${w*0.20} ${h*0.58}, ${w*0.30} ${h*0.58}
                    L ${w*0.72} ${h*0.56}
                    C ${w*0.80} ${h*0.56}, ${w*0.88} ${h*0.58}, ${w*0.92} ${h*0.62}
                    L ${w*0.92} ${h*0.74}
                    C ${w*0.86} ${h*0.72}, ${w*0.78} ${h*0.71}, ${w*0.66} ${h*0.72}
                    L ${w*0.28} ${h*0.73}
                    C ${w*0.20} ${h*0.74}, ${w*0.12} ${h*0.74}, ${w*0.08} ${h*0.71} Z"/>
            </svg>`;
            break;
        case 'material_upper':
            // Bagian utama kulit upper (luas)
            svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}">
                <path fill="#fff" d="M ${w*0.05} ${h*0.70}
                    C ${w*0.02} ${h*0.55}, ${w*0.08} ${h*0.38}, ${w*0.15} ${h*0.28}
                    L ${w*0.30} ${h*0.20}
                    Q ${w*0.45} ${h*0.14}, ${w*0.50} ${h*0.10}
                    L ${w*0.58} ${h*0.05}
                    C ${w*0.63} ${h*0.03}, ${w*0.70} ${h*0.06}, ${w*0.72} ${h*0.13}
                    L ${w*0.72} ${h*0.28}
                    C ${w*0.76} ${h*0.34}, ${w*0.78} ${h*0.42}, ${w*0.82} ${h*0.52}
                    L ${w*0.92} ${h*0.64}
                    C ${w*0.95} ${h*0.68}, ${w*0.94} ${h*0.71}, ${w*0.90} ${h*0.72}
                    L ${w*0.10} ${h*0.72}
                    C ${w*0.07} ${h*0.72}, ${w*0.05} ${h*0.72}, ${w*0.05} ${h*0.70} Z"/>
                <!-- Exclude laces & tongue area (middle strip) -->
                <path fill="#000" d="M ${w*0.35} ${h*0.18}
                    L ${w*0.60} ${h*0.18}
                    L ${w*0.62} ${h*0.52}
                    L ${w*0.36} ${h*0.52} Z"/>
            </svg>`;
            break;
        case 'laces':
            // Strip tengah tempat tali
            svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}">
                <path fill="#fff" d="M ${w*0.33} ${h*0.16}
                    Q ${w*0.48} ${h*0.12}, ${w*0.62} ${h*0.16}
                    L ${w*0.64} ${h*0.56}
                    Q ${w*0.48} ${h*0.60}, ${w*0.32} ${h*0.56} Z"/>
                <!-- Loose ends / knot top -->
                <ellipse cx="${w*0.52}" cy="${h*0.11}" rx="${w*0.08}" ry="${h*0.04}" fill="#fff"/>
                <path d="M ${w*0.60} ${h*0.11} Q ${w*0.72} ${h*0.05}, ${w*0.78} ${h*0.12}" stroke="#fff" stroke-width="18" fill="none"/>
                <path d="M ${w*0.58} ${h*0.11} Q ${w*0.70} ${h*0.20}, ${w*0.76} ${h*0.22}" stroke="#fff" stroke-width="18" fill="none"/>
            </svg>`;
            break;
        case 'hardware':
            // 2 kolom eyelet bulat
            svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}">
                ${[0.21, 0.28, 0.35, 0.42, 0.49].map(yPct => `
                    <circle cx="${w*0.32}" cy="${h*yPct}" r="${w*0.022}" fill="#fff"/>
                    <circle cx="${w*0.32}" cy="${h*yPct}" r="${w*0.032}" fill="#fff" opacity="0.6"/>
                    <circle cx="${w*0.64}" cy="${h*yPct}" r="${w*0.022}" fill="#fff"/>
                    <circle cx="${w*0.64}" cy="${h*yPct}" r="${w*0.032}" fill="#fff" opacity="0.6"/>
                `).join('')}
            </svg>`;
            break;
        case 'stitching':
            // Jahitan perimeter + jahitan toe cap + quarter
            svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}">
                <!-- perimeter -->
                <path fill="none" stroke="#fff" stroke-width="22" stroke-linecap="round"
                    d="M ${w*0.06} ${h*0.70}
                    C ${w*0.03} ${h*0.55}, ${w*0.08} ${h*0.38}, ${w*0.15} ${h*0.28}
                    L ${w*0.30} ${h*0.20} Q ${w*0.45} ${h*0.14}, ${w*0.50} ${h*0.10}
                    L ${w*0.58} ${h*0.05} C ${w*0.63} ${h*0.03}, ${w*0.70} ${h*0.06}, ${w*0.72} ${h*0.13}
                    L ${w*0.72} ${h*0.28} C ${w*0.76} ${h*0.34}, ${w*0.78} ${h*0.42}, ${w*0.82} ${h*0.52}
                    L ${w*0.92} ${h*0.64} C ${w*0.95} ${h*0.68}, ${w*0.94} ${h*0.71}, ${w*0.90} ${h*0.72}
                    L ${w*0.10} ${h*0.72} C ${w*0.07} ${h*0.72}, ${w*0.05} ${h*0.72}, ${w*0.05} ${h*0.70} Z"/>
                <!-- toe cap stitch -->
                <path fill="none" stroke="#fff" stroke-width="18"
                    d="M ${w*0.09} ${h*0.60} Q ${w*0.18} ${h*0.50}, ${w*0.28} ${h*0.48} L ${w*0.28} ${h*0.68} Q ${w*0.20} ${h*0.69}, ${w*0.09} ${h*0.65} Z"/>
                <!-- quarter stitch -->
                <path fill="none" stroke="#fff" stroke-width="16" stroke-linecap="round"
                    d="M ${w*0.80} ${h*0.18} Q ${w*0.82} ${h*0.36}, ${w*0.79} ${h*0.50}"/>
            </svg>`;
            break;
        default:
            svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}"><rect width="${w}" height="${h}" fill="#000"/></svg>`;
    }
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

/* -------- The Component -------- */
export default function PhotorealRecoloringPreview({
    productSlug,
    className = '',
    showOverlayInfo = true,
    onReady,
}) {
    const canvasRef = useRef(null);
    const baseImgRef = useRef(null);
    const masksCacheRef = useRef({});   // { category: ImageBitmap | HTMLCanvasElement }
    const configRef = useRef(null);
    const selectedRef = useRef(null);
    const basePhotoRef = useRef(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [config, setConfig] = useState(null);
    const [maskStatus, setMaskStatus] = useState({}); // category: 'custom' | 'fallback'
    const selected = useShoeStore(s => s.selected);
    const slugFromStore = useShoeStore(s => s.productSlug);
    const model = productSlug || slugFromStore || 'leather-boot';

    useEffect(() => { selectedRef.current = selected; }, [selected]);

    /* --- Step 1: Load config & base photo --- */
    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        (async () => {
            try {
                const r = await fetch(`/assets/images/layers/${model}/layer_config.json`);
                if (!r.ok) throw new Error('Config HTTP ' + r.status);
                const cfg = await r.json();
                if (cancelled) return;
                configRef.current = cfg;
                setConfig(cfg);

                const photoUrl = cfg._meta?.base_photo;
                if (!photoUrl) throw new Error('Tidak ada base_photo di layer_config._meta');
                const img = await loadImage(photoUrl);
                if (cancelled) return;
                basePhotoRef.current = img;
                setLoading(false);
                if (typeof onReady === 'function') onReady(cfg);

                // Schedule first render immediately
                requestAnimationFrame(() => composite());
            } catch (e) {
                console.error('[PhotorealRecoloring] error:', e);
                if (!cancelled) setError(e.message || String(e));
                setLoading(false);
            }
        })();
        return () => { cancelled = true; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [model]);

    /* --- Step 2: Load / generate mask per category --- */
    async function ensureMask(category, maskFolder, width, height) {
        if (masksCacheRef.current[category]) return masksCacheRef.current[category];
        // Try PNG mask file first
        const customPngUrl = maskFolder
            ? `/assets/images/layers/${model}/${maskFolder}/masks/${category}.png`
            : null;
        let img = null;
        let mode = 'fallback';
        if (customPngUrl) {
            try {
                img = await loadImage(customPngUrl);
                mode = 'custom';
            } catch (_) { img = null; }
        }
        if (!img) {
            // Fallback: generate SVG mask, render ke canvas
            const dataUri = svgMaskDataUriFor(category, width, height, model);
            img = await loadImage(dataUri);
            mode = 'fallback';
        }
        // Render to fixed-size canvas mask for fast lookup
        const mc = document.createElement('canvas');
        mc.width = width;
        mc.height = height;
        const mctx = mc.getContext('2d');
        mctx.drawImage(img, 0, 0, width, height);
        masksCacheRef.current[category] = mc;
        setMaskStatus(prev => ({ ...prev, [category]: mode }));
        return mc;
    }

    /* --- Step 3: Composite (core pixel shader) --- */
    const composite = async () => {
        const canvas = canvasRef.current;
        const baseImg = basePhotoRef.current;
        const cfg = configRef.current;
        if (!canvas || !baseImg || !cfg) return;

        // Setup canvas W/H match image aspect, use high-ish resolution
        const maxW = 1400;
        const ratio = baseImg.naturalWidth / baseImg.naturalHeight;
        const cw = Math.min(maxW, baseImg.naturalWidth);
        const ch = Math.round(cw / ratio);
        if (canvas.width !== cw || canvas.height !== ch) {
            canvas.width = cw;
            canvas.height = ch;
        }
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        // Reset: draw base photo
        ctx.drawImage(baseImg, 0, 0, cw, ch);
        const baseData = ctx.getImageData(0, 0, cw, ch);
        const pix = baseData.data; // Uint8ClampedArray: [R,G,B,A, R,G,B,A, ...]

        // Backup original luminance map for multi-region correctness (prevent region overwrite)
        // We draw each region by re-reading from ORIGINAL base pixel (plus previous region's edits? we apply in order).
        // To avoid overwriting, for each region we first read FROM original pix, then write to working buffer.
        // Simpler approach: start from original, apply each region tint IN ORDER (sole → insole → upper → laces → hw → stitch).
        // That way stitch (last) is on top of upper (which is below), etc. Correct layering!

        const sorted = [...(cfg.layers || [])].sort((a, b) => (a.z_index || 0) - (b.z_index || 0));

        for (const layerDef of sorted) {
            const cat = layerDef.category;
            const sel = selectedRef.current?.[cat];
            const optionKey = sel?.name || layerDef.defaults_to;
            const option = layerDef.options?.[optionKey] || Object.values(layerDef.options || {})[0];
            if (!option) continue;
            const hex = option.hex; // from layer_config (note: config uses "hex" key, store uses "hex_color" later)
            const targetHex = sel?.hex_color || hex;
            if (!targetHex && cat !== 'stitching') continue;

            const targetHsl = targetHex ? hexToHsl(targetHex) : null; // [h,s,l]
            if (!targetHsl && cat !== 'stitching') continue;

            const maskFolder = cfg._meta ? (
                `angles/${cfg._meta.view_angle || 'front-3q'}`
            ) : null;
            const maskCanvas = await ensureMask(cat, maskFolder, cw, ch);
            const mctx2 = maskCanvas.getContext('2d');
            const maskData = mctx2.getImageData(0, 0, cw, ch);
            const mpix = maskData.data;

            const blendOpacity = (layerDef.opacity ?? 1) * 0.98;
            const sMul = typeof sel?.saturation === 'number' ? sel.saturation : 1.0;

            // Pixel shader loop
            for (let i = 0; i < pix.length; i += 4) {
                const aMask = mpix[i + 3]; // alpha of mask (0..255)
                if (aMask <= 1) continue; // outside mask: skip
                const maskFactor = (aMask / 255) * blendOpacity;
                if (maskFactor < 0.01) continue;

                const R = pix[i], G = pix[i + 1], B = pix[i + 2];
                const [hOrig, sOrig, lOrig] = rgbToHsl(R, G, B);

                let newH, newS, newL = lOrig; // KEEP LUMINANCE (TEXTURE / SHADOW / HIGHLIGHT)

                if (cat === 'stitching' && !targetHsl) {
                    // Match mode: contrast with pixel
                    newH = hOrig;
                    newS = 0; // grayscale
                    newL = lOrig > 0.5 ? Math.max(0, lOrig - 0.35) : Math.min(1, lOrig + 0.35);
                } else {
                    newH = targetHsl[0];
                    // Pertahankan separuh variasi saturasi asli agar tekstur tidak flat
                    newS = Math.max(0, Math.min(1, targetHsl[1] * sMul * 0.6 + sOrig * 0.4));
                }

                const [nR, nG, nB] = hslToRgb(newH, newS, newL);
                // Blend dengan original pixel (factor mask edge feathering / soft edge)
                pix[i]     = Math.round(R * (1 - maskFactor) + nR * maskFactor);
                pix[i + 1] = Math.round(G * (1 - maskFactor) + nG * maskFactor);
                pix[i + 2] = Math.round(B * (1 - maskFactor) + nB * maskFactor);
                // Alpha remains pix[i+3] (unchanged, base photo opaque)
            }
        }
        ctx.putImageData(baseData, 0, 0);
    };

    // Re-composite whenever selected changes
    useEffect(() => {
        if (!loading && !error) {
            const t = requestAnimationFrame(() => composite());
            return () => cancelAnimationFrame(t);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selected, loading, error]);

    const baseUrl = config?._meta?.base_photo;
    const layerCount = config?.layers?.length || 0;
    const customCount = Object.values(maskStatus).filter(x => x === 'custom').length;
    const fallbackCount = layerCount - customCount;

    return (
        <div className={`photoreal-recolor-preview position-relative w-100 h-100 ${className}`}
            style={{
                background: 'linear-gradient(135deg, #f7f3eb 0%, #ebe5d8 100%)',
                overflow: 'hidden',
            }}
        >
            {loading && (
                <div className="position-absolute inset-0 d-flex align-items-center justify-content-center"
                    style={{ zIndex: 100 }}>
                    <div className="text-center p-4">
                        <div className="spinner-border text-leather mb-2" role="status" style={{ width: 36, height: 36 }}>
                            <span className="sr-only">Loading photoreal recoloring engine...</span>
                        </div>
                        <div style={{ fontSize: 13, color: '#7c7569' }}>
                            <i className="fas fa-wand-magic-sparkles mr-1"></i>
                            Menyiapkan Photo Colorizer Engine...
                        </div>
                    </div>
                </div>
            )}

            {!loading && error && (
                <div className="position-absolute inset-0 d-flex align-items-center justify-content-center p-4"
                    style={{ zIndex: 100 }}>
                    <div className="text-center">
                        <i className="fas fa-circle-exclamation fa-2x text-danger mb-2"></i>
                        <div style={{ fontSize: 13, color: '#7c7569' }}>
                            Photo Recoloring gagal dimuat.
                        </div>
                        <div style={{ fontSize: 12, color: '#a29b8d', marginTop: 4 }}>
                            {String(error)}
                        </div>
                    </div>
                </div>
            )}

            {!loading && !error && (
                <div className="position-absolute inset-0 d-flex align-items-center justify-content-center p-2"
                    style={{ zIndex: 2 }}>
                    <canvas ref={canvasRef}
                        className="w-100 h-100"
                        style={{ objectFit: 'contain', filter: 'drop-shadow(0 30px 40px rgba(60,40,10,0.18))' }}
                    />
                </div>
            )}

            {/* Soft studio shadow below shoe */}
            <div className="position-absolute inset-0 d-flex align-items-end justify-content-center"
                style={{ zIndex: 1, pointerEvents: 'none' }}>
                <div className="mb-1" style={{
                    width: '72%',
                    height: 22,
                    borderRadius: '50%',
                    background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.28) 0%, rgba(0,0,0,0) 72%)',
                    filter: 'blur(4px)',
                }} />
            </div>

            {/* Mode Badge */}
            {showOverlayInfo && !loading && !error && (
                <div className="position-absolute" style={{ top: 12, right: 12, zIndex: 200 }}>
                    <span className="badge badge-primary px-2 py-1" style={{ fontSize: 11, letterSpacing: 0.3 }}>
                        <i className="fas fa-wand-magic-sparkles mr-1 text-warning"></i>
                        PHOTO HSL RECOLOR · {layerCount} region
                    </span>
                </div>
            )}

            {/* Mask info */}
            {showOverlayInfo && !loading && !error && fallbackCount > 0 && (
                <div className="position-absolute" style={{ bottom: 12, left: 12, zIndex: 200 }}>
                    <span className="badge badge-light text-dark px-2 py-1" style={{ fontSize: 11 }}>
                        <i className="fas fa-shapes mr-1 text-warning"></i>
                        Mask: {customCount} custom · {fallbackCount} auto-generated (smooth bezier)
                    </span>
                </div>
            )}
            {showOverlayInfo && !loading && !error && fallbackCount === 0 && layerCount > 0 && (
                <div className="position-absolute" style={{ bottom: 12, left: 12, zIndex: 200 }}>
                    <span className="badge badge-success px-2 py-1" style={{ fontSize: 11 }}>
                        <i className="fas fa-check-circle mr-1"></i>
                        Semua mask kustom aktif ({customCount}/{layerCount})
                    </span>
                </div>
            )}

            {showOverlayInfo && baseUrl && (
                <div className="position-absolute" style={{ bottom: 12, right: 12, zIndex: 200 }}>
                    <span className="badge badge-light text-dark px-2 py-1" style={{ fontSize: 10.5 }}>
                        <i className="fas fa-image mr-1 text-leather"></i>
                        Base: {baseUrl.split('/').pop()}
                    </span>
                </div>
            )}
        </div>
    );
}

export { PhotorealRecoloringPreview, rgbToHsl, hslToRgb, hexToHsl, svgMaskDataUriFor };
