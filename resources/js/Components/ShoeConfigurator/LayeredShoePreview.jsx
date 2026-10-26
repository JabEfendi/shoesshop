import { useEffect, useMemo, useRef, useState } from 'react';
import { useShoeStore } from './useShoeStore';

/* ================================================================
 * LayeredShoePreview
 * Render gambar sepatu berlapis (layered 2D photos) dengan fallback
 * SVG otomatis jika file PNG belum tersedia / belum di-export.
 *
 * Cara kerja:
 *  - Baca layer_config.json berdasarkan product slug
 *  - Untuk setiap layer:
 *      • Coba load file PNG sesuai pilihan user
 *      • Jika PNG tidak ada → render SVG shape dengan warna hex
 *      • Susun dengan z-index sesuai urutan layer
 *  - Jika base_photo aktif di config → foto produk jadi background
 *  - Setiap perubahan opsi di configurator panel → layer langsung update
 * ================================================================ */

const LAYER_CONFIG_CACHE = {};

async function loadLayerConfig(modelSlug) {
    if (!modelSlug) return null;
    if (LAYER_CONFIG_CACHE[modelSlug]) return LAYER_CONFIG_CACHE[modelSlug];
    try {
        const r = await fetch(`/assets/images/layers/${modelSlug}/layer_config.json`);
        if (!r.ok) throw new Error('HTTP ' + r.status);
        const cfg = await r.json();
        LAYER_CONFIG_CACHE[modelSlug] = cfg;
        return cfg;
    } catch (e) {
        console.warn('[LayeredShoePreview] Gagal load layer_config untuk:', modelSlug, e);
        return null;
    }
}

function useFileExists() {
    const cacheRef = useRef({});
    return async function exists(url) {
        if (!url) return false;
        if (cacheRef.current[url] != null) return cacheRef.current[url];
        try {
            const r = await fetch(url, { method: 'HEAD' });
            cacheRef.current[url] = r.ok;
            return r.ok;
        } catch {
            cacheRef.current[url] = false;
            return false;
        }
    };
}

/* -------- SVG Fallback Shapes -------- */
function SoleShape({ hex, model = 'leather-boot' }) {
    const w = 700, h = 600;
    const color = hex || '#1a1a1a';
    const isChelsea = model === 'chelsea-boot';
    return (
        <svg viewBox={`0 0 ${w} ${h}`} className="w-100 h-100" preserveAspectRatio="xMidYMax meet">
            <defs>
                <linearGradient id={`soleGrad-${hex}-${model}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity="0.95" />
                    <stop offset="100%" stopColor={color} stopOpacity="1" />
                </linearGradient>
            </defs>
            <path
                d={isChelsea
                    ? 'M 90 470 Q 60 480 70 510 L 100 560 Q 120 585 200 590 L 520 588 Q 600 580 625 545 L 650 480 Q 660 468 620 472 Z'
                    : 'M 80 460 Q 40 478 55 520 L 85 570 Q 110 595 210 595 L 510 592 Q 595 582 620 550 L 648 475 Q 662 460 618 466 Z'}
                fill={`url(#soleGrad-${hex}-${model})`}
                stroke="rgba(0,0,0,0.35)"
                strokeWidth="2"
            />
            {/* Lug pattern for commando-like (generic texture) */}
            <g fill="rgba(255,255,255,0.06)">
                {Array.from({ length: isChelsea ? 10 : 12 }).map((_, i) => (
                    <rect key={i}
                        x={110 + i * 45}
                        y="558"
                        width="14"
                        height="14"
                        rx="3"
                    />
                ))}
            </g>
        </svg>
    );
}

function InsoleShape({ hex }) {
    const color = hex || '#2b2b2b';
    return (
        <svg viewBox="0 0 700 600" className="w-100 h-100" preserveAspectRatio="xMidYMax meet">
            <defs>
                <linearGradient id="insoleGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity="0.85" />
                    <stop offset="100%" stopColor={color} stopOpacity="0.98" />
                </linearGradient>
            </defs>
            <path
                d="M 125 472 Q 90 485 100 512 L 128 555 Q 150 575 220 578 L 490 575 Q 555 565 572 540 L 592 480 Q 600 472 570 476 Z"
                fill="url(#insoleGrad)"
                stroke="rgba(0,0,0,0.25)"
                strokeWidth="1.5"
            />
            {/* stitching line on insole */}
            <path
                d="M 140 522 L 555 514"
                fill="none"
                stroke="rgba(255,255,255,0.12)"
                strokeWidth="1.5"
                strokeDasharray="4 5"
            />
        </svg>
    );
}

function UpperShape({ hex, model = 'leather-boot' }) {
    const color = hex || '#4a2c1a';
    const isChelsea = model === 'chelsea-boot';
    return (
        <svg viewBox="0 0 700 600" className="w-100 h-100" preserveAspectRatio="xMidYMax meet">
            <defs>
                <linearGradient id={`upperGrad-${model}`} x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity="0.86" />
                    <stop offset="50%" stopColor={color} stopOpacity="1" />
                    <stop offset="100%" stopColor={color} stopOpacity="0.9" />
                </linearGradient>
                <filter id={`leatherTex-${model}`}>
                    <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="3" />
                    <feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.08 0" />
                    <feComposite in2="SourceGraphic" operator="in" />
                </filter>
            </defs>
            {isChelsea ? (
                <g>
                    <path
                        d="M 128 475
                           Q 108 458 130 400 L 155 290 Q 175 245 245 245 L 380 248
                           Q 455 250 475 295 L 515 420
                           Q 530 462 500 478 L 200 480 Q 152 482 128 475 Z"
                        fill={`url(#upperGrad-${model})`}
                        stroke="rgba(0,0,0,0.35)"
                        strokeWidth="2"
                        filter={`url(#leatherTex-${model})`}
                    />
                    {/* Elastic side panels */}
                    <path
                        d="M 170 340 Q 180 332 205 332 L 205 435 Q 180 437 168 430 Z"
                        fill={color}
                        opacity="0.72"
                        stroke="rgba(0,0,0,0.35)"
                        strokeWidth="1.5"
                    />
                    <path
                        d="M 448 340 Q 436 332 412 332 L 412 435 Q 436 437 448 430 Z"
                        fill={color}
                        opacity="0.72"
                        stroke="rgba(0,0,0,0.35)"
                        strokeWidth="1.5"
                    />
                </g>
            ) : (
                <g>
                    {/* Main upper body */}
                    <path
                        d="M 125 478
                           Q 100 458 118 408 L 142 275
                           Q 165 208 242 188
                           L 330 180 L 355 145
                           Q 368 115 398 110 L 432 110
                           Q 460 114 466 142 L 468 220
                           Q 470 270 492 320 L 528 428
                           Q 538 468 505 480 L 198 482
                           Q 148 482 125 478 Z"
                        fill={`url(#upperGrad-${model})`}
                        stroke="rgba(0,0,0,0.35)"
                        strokeWidth="2"
                        filter={`url(#leatherTex-${model})`}
                    />
                    {/* Shaft top line */}
                    <path
                        d="M 230 196 Q 275 187 350 187 L 362 150 Q 374 128 398 126 L 430 126 Q 452 128 457 148 L 456 215"
                        fill="none"
                        stroke="rgba(0,0,0,0.45)"
                        strokeWidth="1.8"
                    />
                    {/* Tongue */}
                    <path
                        d="M 295 260 L 295 175 L 412 175 L 412 265 Q 412 288 352 290 Q 305 290 295 260 Z"
                        fill={color}
                        opacity="0.9"
                        stroke="rgba(0,0,0,0.3)"
                        strokeWidth="1.2"
                    />
                    {/* Toe cap stitching */}
                    <path
                        d="M 150 412 Q 175 380 235 375 L 235 450 Q 190 454 150 444 Z"
                        fill="none"
                        stroke="rgba(0,0,0,0.45)"
                        strokeWidth="1.4"
                        strokeDasharray="5 4"
                    />
                    {/* Counter stitching */}
                    <path
                        d="M 482 360 Q 505 388 500 438 Q 475 446 438 442 L 438 370 Z"
                        fill="none"
                        stroke="rgba(0,0,0,0.45)"
                        strokeWidth="1.4"
                        strokeDasharray="5 4"
                    />
                </g>
            )}
        </svg>
    );
}

function LacesShape({ hex }) {
    const color = hex || '#4a2c1a';
    const lacePts = [
        [275, 225, 435, 225],
        [278, 252, 432, 252],
        [282, 280, 428, 280],
        [286, 308, 424, 308],
        [290, 336, 420, 336],
        [294, 364, 416, 364],
    ];
    return (
        <svg viewBox="0 0 700 600" className="w-100 h-100" preserveAspectRatio="xMidYMax meet">
            <g stroke={color} strokeWidth="4" strokeLinecap="round" fill="none">
                {lacePts.map(([x1, y1, x2, y2], i) => (
                    <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />
                ))}
            </g>
            {/* Criss cross pattern (visual hint) */}
            <g stroke={color} strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.82">
                {lacePts.slice(0, -1).map(([x1, y1, x2, y2], i) => {
                    const [nx1, ny1, nx2, ny2] = lacePts[i + 1];
                    return (
                        <g key={`x-${i}`}>
                            <line x1={x1 + 20} y1={y1} x2={nx2 - 20} y2={ny2} />
                            <line x1={x2 - 20} y1={y1} x2={nx1 + 20} y2={ny2} />
                        </g>
                    );
                })}
            </g>
        </svg>
    );
}

function EyeletsShape({ hex }) {
    const color = hex || '#c0c0c0';
    const cxL = 250;
    const cxR = 460;
    const ys = [215, 242, 270, 298, 326, 354];
    return (
        <svg viewBox="0 0 700 600" className="w-100 h-100" preserveAspectRatio="xMidYMax meet">
            <defs>
                <radialGradient id="metalGrad" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#fff" stopOpacity="0.9" />
                    <stop offset="60%" stopColor={color} stopOpacity="1" />
                    <stop offset="100%" stopColor={color} stopOpacity="1" />
                </radialGradient>
            </defs>
            <g>
                {ys.map((y, i) => (
                    <g key={i}>
                        <circle cx={cxL} cy={y} r="10" fill="url(#metalGrad)" stroke="rgba(0,0,0,0.6)" strokeWidth="1.5" />
                        <circle cx={cxL} cy={y} r="4" fill="rgba(0,0,0,0.85)" />
                        <circle cx={cxR} cy={y} r="10" fill="url(#metalGrad)" stroke="rgba(0,0,0,0.6)" strokeWidth="1.5" />
                        <circle cx={cxR} cy={y} r="4" fill="rgba(0,0,0,0.85)" />
                    </g>
                ))}
            </g>
        </svg>
    );
}

function PullTabShape({ hex }) {
    const color = hex || '#2a2a2a';
    return (
        <svg viewBox="0 0 700 600" className="w-100 h-100" preserveAspectRatio="xMidYMax meet">
            <defs>
                <linearGradient id="pullGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity="0.9" />
                    <stop offset="100%" stopColor={color} stopOpacity="1" />
                </linearGradient>
            </defs>
            {/* Back pull tab (chelsea) */}
            <path
                d="M 450 250 Q 442 230 455 220 L 485 220 Q 500 230 490 250 L 492 282 Q 488 292 472 290 L 464 288 Q 450 288 450 250 Z"
                fill="url(#pullGrad)"
                stroke="rgba(0,0,0,0.4)"
                strokeWidth="1.8"
            />
            {/* Small loop */}
            <ellipse cx="472" cy="232" rx="12" ry="5" fill="none" stroke={color} strokeWidth="1.8" opacity="0.7" />
        </svg>
    );
}

function StitchingShape({ hex, model = 'leather-boot' }) {
    const color = hex || null;
    const isChelsea = model === 'chelsea-boot';
    /* If match color → derive semi-transparent white/black depending on bg;
       otherwise use explicit hex. */
    const strokeColor = color || 'rgba(0,0,0,0.35)';
    return (
        <svg viewBox="0 0 700 600" className="w-100 h-100" preserveAspectRatio="xMidYMax meet">
            <g fill="none" stroke={strokeColor} strokeWidth="1.8" strokeDasharray="5 4">
                {isChelsea ? (
                    <>
                        <path d="M 130 472 Q 155 478 200 478 L 500 476 Q 555 470 590 478" />
                        <path d="M 165 320 L 165 432" />
                        <path d="M 452 320 L 452 432" />
                    </>
                ) : (
                    <>
                        <path d="M 128 475 Q 155 480 200 480 L 505 478 Q 555 472 602 478" />
                        <path d="M 152 414 Q 178 382 238 378 L 238 450 Q 190 454 152 445 Z" />
                        <path d="M 484 362 Q 508 390 500 438 Q 475 446 438 442 L 438 370 Z" />
                        <path d="M 298 245 L 298 366" opacity="0.5" />
                        <path d="M 410 245 L 410 366" opacity="0.5" />
                    </>
                )}
            </g>
        </svg>
    );
}

function ShapeFromKey({ key, hex, model }) {
    switch (key) {
        case 'sole':
        case 'sole_chelsea':
            return <SoleShape hex={hex} model={model === 'chelsea-boot' ? 'chelsea-boot' : 'leather-boot'} />;
        case 'insole':
        case 'insole_chelsea':
            return <InsoleShape hex={hex} />;
        case 'upper_leather_boot':
        case 'upper_chelsea':
            return <UpperShape hex={hex} model={model === 'chelsea-boot' ? 'chelsea-boot' : 'leather-boot'} />;
        case 'laces':
            return <LacesShape hex={hex} />;
        case 'eyelets':
            return <EyeletsShape hex={hex} />;
        case 'pull_tab':
            return <PullTabShape hex={hex} />;
        case 'stitch_lines':
            return <StitchingShape hex={hex} model={model === 'chelsea-boot' ? 'chelsea-boot' : 'leather-boot'} />;
        default:
            return null;
    }
}

/* -------- Per-layer renderer: tries PNG, falls back to SVG -------- */
function Layer({ def, option, modelSlug, baseRoot }) {
    const [pngSrc, setPngSrc] = useState(null);
    const [pngOk, setPngOk] = useState(false);
    const fileExists = useFileExists();

    const { file, hex } = option || {};
    const expectedUrl = baseRoot && file ? `${baseRoot}/${def.folder}/${file}` : null;

    useEffect(() => {
        let cancelled = false;
        if (!expectedUrl) {
            setPngSrc(null);
            setPngOk(false);
            return;
        }
        (async () => {
            const ok = await fileExists(expectedUrl);
            if (!cancelled) {
                setPngSrc(ok ? expectedUrl : null);
                setPngOk(ok);
            }
        })();
        return () => { cancelled = true; };
    }, [expectedUrl, fileExists]);

    const blend = def.blend_mode && def.blend_mode.startsWith('multiply')
        ? 'multiply'
        : 'normal';

    const useMultiplyTint = !pngOk && def.blend_mode && def.blend_mode.startsWith('multiply') && hex;

    return (
        <div
            className="layered-layer position-absolute inset-0 d-flex align-items-end justify-content-center px-4"
            style={{
                zIndex: def.z_index || 1,
                opacity: def.opacity ?? 1,
                mixBlendMode: useMultiplyTint ? 'multiply' : blend,
                pointerEvents: 'none',
            }}
        >
            {pngOk && pngSrc ? (
                <img src={pngSrc}
                    alt={option?.label || def.layer_key}
                    className="w-100 h-100"
                    style={{ objectFit: 'contain' }}
                    draggable={false}
                />
            ) : (
                <ShapeFromKey
                    key={def.fallback_shape}
                    shape
                    hex={hex}
                    model={modelSlug}
                >
                    {null}
                </ShapeFromKey>
            )}
        </div>
    );
}

export default function LayeredShoePreview({
    productSlug,
    className = '',
    showOverlayInfo = true,
    onLayersReady,
}) {
    const [config, setConfig] = useState(null);
    const [loading, setLoading] = useState(true);
    const selected = useShoeStore(s => s.selected);
    const slugFromStore = useShoeStore(s => s.productSlug);
    const model = productSlug || slugFromStore || 'leather-boot';

    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        loadLayerConfig(model).then(cfg => {
            if (!cancelled) {
                setConfig(cfg);
                setLoading(false);
                if (typeof onLayersReady === 'function') onLayersReady(cfg);
            }
        });
        return () => { cancelled = true; };
    }, [model, onLayersReady]);

    const baseRoot = `/assets/images/layers/${model}`;
    const meta = config?._meta || null;
    const usePhotoBg = meta?.use_photo_as_bg && meta?.base_photo;

    const layersSorted = useMemo(() => {
        if (!config?.layers) return [];
        return [...config.layers].sort((a, b) => (a.z_index || 0) - (b.z_index || 0));
    }, [config]);

    return (
        <div className={`layered-shoe-preview position-relative w-100 h-100 ${className}`}
            style={{
                background: usePhotoBg
                    ? `linear-gradient(135deg, #f7f3eb 0%, #ebe5d8 100%)`
                    : 'linear-gradient(135deg,#e9e7e3,#d6d0c4)',
                overflow: 'hidden',
                borderRadius: 0,
            }}
        >
            {/* Base product photo (jika dikonfigurasi) — jadi lapisan paling bawah */}
            {usePhotoBg && (
                <div className="position-absolute inset-0 d-flex align-items-end justify-content-center px-4"
                    style={{ zIndex: 1, opacity: 0.88 }}>
                    <img src={meta.base_photo}
                        alt={`${model} base`}
                        className="w-100 h-100"
                        style={{ objectFit: 'contain', filter: 'saturate(1.05)' }}
                        draggable={false}
                    />
                </div>
            )}

            {/* Subtle studio platform */}
            <div className="position-absolute inset-0 d-flex align-items-end justify-content-center"
                style={{ zIndex: 2, pointerEvents: 'none' }}>
                <div className="mb-1"
                    style={{
                        width: '72%',
                        height: 22,
                        borderRadius: '50%',
                        background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.28) 0%, rgba(0,0,0,0) 72%)',
                        filter: 'blur(4px)',
                    }}
                />
            </div>

            {/* Per-layer rendering */}
            {loading && (
                <div className="position-absolute inset-0 d-flex align-items-center justify-content-center"
                    style={{ zIndex: 100 }}>
                    <div className="text-center p-4">
                        <div className="spinner-border text-leather mb-2" role="status" style={{ width: 36, height: 36 }}>
                            <span className="sr-only">Loading layered config...</span>
                        </div>
                        <div style={{ fontSize: 13, color: '#7c7569' }}>
                            <i className="fas fa-layer-group mr-1"></i>
                            Menyiapkan lapisan preview 2D...
                        </div>
                    </div>
                </div>
            )}

            {!loading && !config && (
                <div className="position-absolute inset-0 d-flex align-items-center justify-content-center p-4"
                    style={{ zIndex: 100 }}>
                    <div className="text-center">
                        <i className="fas fa-triangle-exclamation fa-2x text-warning mb-2"></i>
                        <div style={{ fontSize: 13, color: '#7c7569' }}>
                            Konfigurasi layer belum tersedia untuk model ini.
                        </div>
                    </div>
                </div>
            )}

            {!loading && config && layersSorted.map((layerDef) => {
                const sel = selected?.[layerDef.category];
                const optionKey = sel?.name || layerDef.defaults_to;
                const option = layerDef.options?.[optionKey]
                    || Object.values(layerDef.options || {})[0];
                return (
                    <Layer
                        key={layerDef.layer_key}
                        def={layerDef}
                        option={option}
                        modelSlug={model}
                        baseRoot={baseRoot}
                    />
                );
            })}

            {/* Mode badge (top right) */}
            {showOverlayInfo && !loading && config && (
                <div className="position-absolute"
                    style={{ top: 12, right: 12, zIndex: 200 }}>
                    <span className="badge badge-dark px-2 py-1"
                        style={{ fontSize: 11, letterSpacing: 0.3 }}>
                        <i className="fas fa-layer-group mr-1 text-warning"></i>
                        2D LAYERED MODE · {layersSorted.length} lapisan
                    </span>
                </div>
            )}

            {/* Bottom info (left) */}
            {showOverlayInfo && !loading && config && (
                <div className="position-absolute"
                    style={{ bottom: 12, left: 12, zIndex: 200 }}>
                    <span className="badge badge-light text-dark px-2 py-1"
                        style={{ fontSize: 11 }}>
                        <i className="fas fa-palette mr-1 text-leather"></i>
                        Ganti opsi di panel kanan → lapisan otomatis update
                    </span>
                </div>
            )}
        </div>
    );
}

export { LayeredShoePreview, loadLayerConfig };
