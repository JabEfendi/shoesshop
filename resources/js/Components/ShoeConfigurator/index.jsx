import { Component, useEffect, useRef, useState } from 'react';
import { ShoeConfiguratorCanvas } from './ShoeModel';
import { ConfiguratorPanel } from './ConfiguratorPanel';
import { LayeredShoePreview } from './LayeredShoePreview';
import PhotorealRecoloringPreview from './PhotorealRecoloringPreview';
import { useShoeStore } from './useShoeStore';
import { resolveHeadRequestViteDevUrl } from './resolveAssetUrl';

class CanvasErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, errorMsg: null };
    }
    static getDerivedStateFromError(error) {
        return { hasError: true, errorMsg: error?.message || String(error) };
    }
    componentDidCatch(error, info) {
        console.warn('[CanvasErrorBoundary] 3D canvas error ditangkap (tidak crash whole app):', error, info);
    }
    render() {
        if (this.state.hasError) {
            return (
                <div className="h-100 w-100 d-flex align-items-center justify-content-center text-industrial-500 p-4">
                    <div className="text-center">
                        <i className="fas fa-triangle-exclamation fa-3x mb-3 text-warning"></i>
                        <div className="mb-2 font-weight-bold text-industrial-800">Model 3D belum tersedia</div>
                        <div style={{ fontSize: 13 }} className="mb-2">
                            File GLB perlu di-export via Blender Toolkit terlebih dahulu.
                        </div>
                        <div style={{ fontSize: 12 }} className="text-industrial-400">
                            Detail: <code>{String(this.state.errorMsg).slice(0, 120)}</code>
                        </div>
                        <div style={{ fontSize: 12 }} className="mt-3 p-3 bg-white rounded border">
                            <div className="font-weight-bold text-industrial-700 mb-1">
                                <i className="fas fa-info-circle mr-1 text-leather"></i>
                                Panel Konfigurator tetap aktif
                            </div>
                            Anda bisa mencoba swatch warna dan kalkulasi harga. Setelah file GLB tersedia,
                            refresh halaman untuk melihat preview 3D.
                        </div>
                    </div>
                </div>
            );
        }
        return this.props.children;
    }
}

export default function ShoeConfigurator({ product, categoryLabels, customizationOptions }) {
    const wrapRef = useRef(null);
    const meshesReady = useRef(0);
    const [meshesDetected, setMeshesDetected] = useState([]);
    const initFromProps = useShoeStore(s => s.initFromProps);
    const glbModelPath = useShoeStore(s => s.glbModelPath);
    const [fallbackGLB, setFallbackGLB] = useState(null);
    const [glbOk, setGlbOk] = useState(false);
    const [checkingGlb, setCheckingGlb] = useState(true);
    const [previewMode, setPreviewMode] = useState('auto'); // auto | '3d' | 'photo' | '2d'
    // Mode AUTO Priority:
    //   1. Jika file .glb tersedia  → 🧊 Mode 3D (Per-Mesh Presisi / Heuristic Clipping)
    //   2. Jika .glb error          → ⭐ Mode PHOTO (Recolor HSL Luminance Lock foto asli)
    //   3. Fallback                 → 🗂️ Mode 2D (Layered Photo)
    // User tetap bisa toggle manual via tombol di pojok kanan atas card configurator.
    const [layersReported, setLayersReported] = useState(null);
    const [photoReady, setPhotoReady] = useState(null);

    useEffect(() => {
        if (!product) return;
        initFromProps(product, customizationOptions);
    }, [product, customizationOptions, initFromProps]);

    useEffect(() => {
        let p = product?.glb_model_path;
        if (!p) p = '/3d-assets/leather-boot-optimized.glb';
        setFallbackGLB(p);
    }, [product]);

    const finalGLB = glbModelPath || fallbackGLB;

    useEffect(() => {
        let cancelled = false;
        setCheckingGlb(true);
        if (!finalGLB) {
            setGlbOk(false);
            setCheckingGlb(false);
            return;
        }
        (async () => {
            try {
                const r = await fetch(resolveHeadRequestViteDevUrl(finalGLB), { method: 'HEAD' });
                if (!cancelled) setGlbOk(r.ok);
            } catch (e) {
                if (!cancelled) setGlbOk(false);
            } finally {
                if (!cancelled) setCheckingGlb(false);
            }
        })();
        return () => { cancelled = true; };
    }, [finalGLB]);

    const effectiveMode = (() => {
        if (previewMode === '3d' || previewMode === '2d' || previewMode === 'photo') return previewMode;
        /* AUTO priority: 3D (glb siap) → Photo (lebih realistis) → 2D Layered */
        if (!checkingGlb && glbOk) return '3d';
        return 'photo';
    })();

    const onMeshReport = (names) => {
        setMeshesDetected(names);
        meshesReady.current = names.length;
    };

    const PlaceholderNotReady = ({ reason }) => (
        <div className="h-100 w-100 d-flex align-items-center justify-content-center text-industrial-500 p-4">
            <div className="text-center">
                <i className={`fas fa-cube fa-3x mb-3 ${checkingGlb ? 'text-industrial-300' : 'text-leather'}`}></i>
                <div className="mb-2 font-weight-bold text-industrial-800">
                    {checkingGlb ? 'Memeriksa file model 3D...' : 'Model 3D dalam tahap persiapan'}
                </div>
                <div style={{ fontSize: 13 }} className="mb-3">
                    {reason || 'Menunggu hasil optimize dari Blender Toolkit.'}
                </div>
                <div className="p-3 bg-white rounded border text-left mx-auto" style={{ maxWidth: 380, fontSize: 12 }}>
                    <div className="font-weight-bold text-industrial-700 mb-2">
                        <i className="fas fa-list-check mr-1 text-leather"></i>
                        Checklist Pending (1-click Blender Pipeline):
                    </div>
                    <ol className="pl-3 mb-0 text-industrial-600" style={{ lineHeight: 1.8 }}>
                        <li>Install <span className="font-weight-bold">Blender 4.2 LTS</span> (blender.org)</li>
                        <li>Buka Blender → Scripting → Run Script: <code className="text-industrial-900">tools/blender/shoe_configurator_toolkit.py</code></li>
                        <li>Klik tombol <span className="badge bg-warning text-dark">1-Click Full Pipeline</span> di sidebar 3D View</li>
                        <li>Copy file hasil export ke folder <code className="text-industrial-900">public/3d-assets/</code></li>
                        <li>Refresh halaman ini — model akan otomatis ter-load & interaktif</li>
                    </ol>
                </div>
            </div>
        </div>
    );

    const ModePill = ({ modeId, label, icon, desc }) => {
        const active = previewMode === modeId || (modeId === 'auto' && effectiveMode !== previewMode);
        const eff = effectiveMode === modeId && previewMode === 'auto';
        return (
            <button
                type="button"
                className={`btn btn-sm px-2 py-1 mr-1 mb-0 ${active || eff ? 'text-warning' : 'text-industrial-300'}`}
                style={{
                    background: active ? '#ffffff18' : 'transparent',
                    border: (active || eff) ? '1px solid #ffb74d66' : '1px solid transparent',
                    fontSize: 11.5,
                    borderRadius: 5,
                }}
                onClick={() => setPreviewMode(modeId)}
                title={desc}
            >
                <i className={`fas ${icon} mr-1`}></i>
                {label}
                {eff && previewMode === 'auto' && (
                    <span className="badge badge-light text-dark ml-1" style={{ fontSize: 9 }}>AUTO</span>
                )}
            </button>
        );
    };

    const layersReadyInfo = layersReported
        ? `${layersReported.layers?.length || 0} lapisan`
        : null;

    const effectiveLabel = effectiveMode === '3d'
        ? (meshesDetected.length > 4 ? 'Per-Mesh Presisi' : 'Heuristic Tint')
        : effectiveMode === 'photo'
            ? 'Photo HSL Recolor'
            : '2D Layered Photo';

    return (
        <div className="row no-gutters">
            {/* ======= LEFT: PREVIEW (3D / 2D / Hybrid) ======= */}
            <div className="col-12 col-lg-8 pr-lg-3">
                <div className="card card-configurator">
                    <div className="card-header bg-industrial-900 text-white d-flex flex-wrap align-items-center">
                        <h3 className="card-title m-0 uppercase-header mr-3" style={{ fontSize: 16 }}>
                            <i className={`fas ${
                                effectiveMode === '3d' ? 'fa-cube'
                                : effectiveMode === 'photo' ? 'fa-wand-magic-sparkles'
                                : 'fa-layer-group'
                            } mr-2 text-warning`}></i>
                            {effectiveMode === '3d'
                                ? 'Preview 3D Interaktif'
                                : effectiveMode === 'photo'
                                    ? 'Preview Photo Real (HSL Recolor)'
                                    : 'Preview 2D Layered'}
                        </h3>
                        <div className="ml-auto d-flex flex-wrap align-items-center">
                            <div className="mr-2 mb-0">
                                <ModePill modeId="auto" icon="fa-wand-magic-sparkles" label="Auto"
                                    desc="Otomatis: 3D jika GLB ada, jika tidak → Photo HSL Recolor (paling realistis tanpa 3D)" />
                                <ModePill modeId="3d" icon="fa-cube" label="3D"
                                    desc="Paksa pakai 3D Canvas WebGL (rotasi 360°)" />
                                <ModePill modeId="photo" icon="fa-palette" label="Photo"
                                    desc="⭐ REKOMENDASI: Recolor FOTO ASLI per-bagian (teksur kulit + bayangan 100% dipertahankan, gak perlu potong mesh Blender)" />
                                <ModePill modeId="2d" icon="fa-layer-group" label="2D Layered"
                                    desc="Stacking layer PNG transparan per-bagian (jika sudah punya PNG potongan)" />
                            </div>
                            <div className="text-industrial-300 ml-2 d-none d-lg-block" style={{ fontSize: 11.5 }}>
                                {checkingGlb && effectiveMode === '3d' && (
                                    <><i className="fas fa-spinner fa-spin mr-1"></i> Checking GLB...</>
                                )}
                                {!checkingGlb && effectiveMode === '3d' && glbOk && (
                                    <><i className="fas fa-check-circle mr-1 text-success"></i> {effectiveLabel} ·
                                    <i className="fas fa-mouse-pointer ml-2 mr-1"></i> drag ·
                                    <i className="fas fa-expand ml-2 mr-1"></i> zoom</>
                                )}
                                {effectiveMode === 'photo' && (
                                    <><i className="fas fa-wand-magic-sparkles mr-1 text-warning"></i> {photoReady ? 'HSL Engine aktif' : 'Memuat foto base...'}</>
                                )}
                                {effectiveMode === '2d' && (
                                    <><i className="fas fa-image mr-1 text-warning"></i> {layersReadyInfo || 'Layered Photo Mode'}</>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="card-body p-0">
                        <div ref={wrapRef} className="canvas-wrap-3d">
                            <div className="loading-bar"
                                style={{
                                    width: checkingGlb && effectiveMode === '3d' ? '35%' : ((glbOk && effectiveMode === '3d') || effectiveMode === '2d' || effectiveMode === 'photo' ? '0%' : '100%'),
                                    background: checkingGlb && effectiveMode === '3d'
                                        ? 'linear-gradient(90deg,#a7671f,#ffb74d)'
                                        : (effectiveMode === '3d' && !glbOk)
                                            ? 'linear-gradient(90deg,#a8a298,#cac6bf)'
                                            : 'transparent'
                                }} />
                            <CanvasErrorBoundary>
                                {effectiveMode === '3d' && finalGLB && !checkingGlb && glbOk ? (
                                    <ShoeConfiguratorCanvas
                                        glbPath={finalGLB}
                                        scale={1.0}
                                        containerRef={wrapRef}
                                        onMeshReport={onMeshReport}
                                        model={product?.slug || 'leather-boot'}
                                    />
                                ) : effectiveMode === 'photo' ? (
                                    <PhotorealRecoloringPreview
                                        productSlug={product?.slug}
                                        onReady={setPhotoReady}
                                    />
                                ) : effectiveMode === '2d' ? (
                                    <LayeredShoePreview
                                        productSlug={product?.slug}
                                        onLayersReady={setLayersReported}
                                    />
                                ) : checkingGlb ? (
                                    <PlaceholderNotReady reason="Memvalidasi ketersediaan file GLB di server..." />
                                ) : (
                                    <div className="position-relative w-100 h-100">
                                        <PlaceholderNotReady reason={`File ${finalGLB || '(none)'} belum tersedia. Mode auto → pakai Photo HSL Recolor sebagai default.`} />
                                        <div className="position-absolute"
                                            style={{ inset: 0, zIndex: 5, pointerEvents: 'none', opacity: 0.96 }}>
                                            <PhotorealRecoloringPreview
                                                productSlug={product?.slug}
                                                showOverlayInfo={false}
                                                className=""
                                                onReady={setPhotoReady}
                                            />
                                        </div>
                                    </div>
                                )}
                            </CanvasErrorBoundary>
                        </div>
                        {/* Info footer di bawah preview */}
                        <div className="px-3 py-2 d-flex flex-wrap align-items-center"
                            style={{ background: '#f6f5f4', borderTop: '1px solid #e9e7e3', fontSize: 12, color: '#7c7569' }}>
                            {effectiveMode === '3d' && meshesDetected.length > 0 && (
                                <div className="flex-grow-1">
                                    <i className="fas fa-check-circle text-success mr-1"></i>
                                    Mesh terdeteksi ({meshesDetected.length}):
                                    <code className="ml-1" style={{ color: '#454039' }}>{meshesDetected.join(', ')}</code>
                                    {meshesDetected.length <= 2 && (
                                        <span className="ml-2 text-warning">
                                            <i className="fas fa-info-circle mr-1"></i>
                                            Hanya {meshesDetected.length} mesh → pakai heuristic tint. Untuk presisi 100%: export mesh terpisah di Blender, atau switch ke Mode Photo (⭐ paling realistis!).
                                        </span>
                                    )}
                                </div>
                            )}
                            {effectiveMode === 'photo' && photoReady && (
                                <div className="flex-grow-1">
                                    <i className="fas fa-wand-magic-sparkles text-warning mr-1"></i>
                                    <b className="text-dark">Photo HSL Recolor</b> aktif · warna diganti per-region dengan mempertahankan L (luminance) asli foto
                                    <span className="ml-2 text-leather">
                                        <i className="fas fa-circle-info mr-1"></i>
                                        Tekstur kulit, kerutan, bayangan, highlight SEMUA dipertahankan!
                                    </span>
                                    <code className="ml-2" style={{ color: '#454039' }}>
                                        regions: {photoReady.layers?.length || 0}
                                    </code>
                                </div>
                            )}
                            {effectiveMode === '2d' && layersReported && (
                                <div className="flex-grow-1">
                                    <i className="fas fa-layer-group text-leather mr-1"></i>
                                    Mode 2D Layered · {layersReported.layers?.length || 0} lapisan aktif
                                    <code className="ml-2" style={{ color: '#454039' }}>
                                        view: {layersReported._meta?.view_angle || 'front-3q'}
                                    </code>
                                </div>
                            )}
                            <div className="ml-auto">
                                {previewMode === 'auto' && (
                                    <span className="badge badge-light text-dark px-2 py-1" style={{ fontSize: 10.5 }}>
                                        <i className="fas fa-wand-magic-sparkles mr-1 text-leather"></i>
                                        AUTO MODE · dipilih: {effectiveMode.toUpperCase()} ({effectiveLabel})
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ======= RIGHT: Configurator Panel ======= */}
            <div className="col-12 col-lg-4 mt-3 mt-lg-0">
                <ConfiguratorPanel
                    categoryLabels={categoryLabels}
                    customizationOptions={customizationOptions}
                    meshesDetected={meshesDetected}
                />
            </div>
        </div>
    );
}
