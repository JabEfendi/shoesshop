import { Component, useEffect, useRef, useState } from 'react';
import { ShoeConfiguratorCanvas } from './ShoeModel';
import { ConfiguratorPanel } from './ConfiguratorPanel';
import { useShoeStore } from './useShoeStore';

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
                const r = await fetch(finalGLB, { method: 'HEAD' });
                if (!cancelled) setGlbOk(r.ok);
            } catch (e) {
                if (!cancelled) setGlbOk(false);
            } finally {
                if (!cancelled) setCheckingGlb(false);
            }
        })();
        return () => { cancelled = true; };
    }, [finalGLB]);

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

    return (
        <div className="row no-gutters">
            {/* ======= LEFT: 3D Canvas ======= */}
            <div className="col-12 col-lg-8 pr-lg-3">
                <div className="card card-configurator">
                    <div className="card-header bg-industrial-900 text-white d-flex align-items-center">
                        <h3 className="card-title m-0 uppercase-header" style={{ fontSize: 16 }}>
                            <i className="fas fa-cube mr-2 text-warning"></i>
                            Preview 3D Interaktif
                        </h3>
                        <div className="ml-auto d-none d-md-block text-industrial-300" style={{ fontSize: 12 }}>
                            {checkingGlb ? (
                                <><i className="fas fa-spinner fa-spin mr-1"></i> Checking GLB...</>
                            ) : glbOk ? (
                                <><i className="fas fa-check-circle mr-1 text-success"></i> GLB Ready ·
                                <i className="fas fa-mouse-pointer ml-2 mr-1"></i> drag ·
                                <i className="fas fa-expand ml-2 mr-1"></i> scroll zoom</>
                            ) : (
                                <><i className="fas fa-info-circle mr-1 text-warning"></i> Placeholder Mode</>
                            )}
                        </div>
                    </div>
                    <div className="card-body p-0">
                        <div ref={wrapRef} className="canvas-wrap-3d">
                            <div className="loading-bar" style={{ width: checkingGlb ? '35%' : (glbOk ? '0%' : '100%'), background: checkingGlb ? 'linear-gradient(90deg,#a7671f,#ffb74d)' : (glbOk ? '' : 'linear-gradient(90deg,#a8a298,#cac6bf)') }} />
                            <CanvasErrorBoundary>
                                {finalGLB && glbOk && !checkingGlb ? (
                                    <ShoeConfiguratorCanvas
                                    glbPath={finalGLB}
                                    scale={1.0}
                                    containerRef={wrapRef}
                                    onMeshReport={onMeshReport}
                                />
                                ) : checkingGlb ? (
                                    <PlaceholderNotReady reason="Memvalidasi ketersediaan file GLB di server..." />
                                ) : (
                                    <PlaceholderNotReady reason={`File ${finalGLB || '(none)'} belum tersedia.`} />
                                )}
                            </CanvasErrorBoundary>
                        </div>
                        {meshesDetected.length > 0 && (
                            <div className="px-3 py-2" style={{ background: '#f6f5f4', borderTop: '1px solid #e9e7e3', fontSize: 12, color: '#7c7569' }}>
                                <i className="fas fa-check-circle text-success mr-1"></i>
                                Mesh terdeteksi: <code style={{ color: '#454039' }}>{meshesDetected.join(', ')}</code>
                            </div>
                        )}
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
