import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { ShoeConfiguratorCanvas } from '../ShoeConfigurator/ShoeModel';
import { useShoeStore } from '../ShoeConfigurator/useShoeStore';
import PhotorealRecoloringPreview from '../ShoeConfigurator/PhotorealRecoloringPreview';
import { resolveHeadRequestViteDevUrl } from '../ShoeConfigurator/resolveAssetUrl';

/* Peta elemen kustomisasi Sketch → kategori mesh 3D / photo-recolor. */
export const ELEMENT_TO_CATEGORY = {
    'kulit':            'material_upper',
    'benang-kulit':     'stitching',
    'benang-outsole':   'sole',
    'eyelet':           'hardware',
    'panel-chelsea':    'material_upper',
    'tali':             'laces',
    'storm-welt':       'stitching',
    'outsole':          'sole',
};

function Loading({ label = 'Menyiapkan preview...' }) {
    return (
        <div className="position-absolute inset-0 d-flex align-items-center justify-content-center" style={{ zIndex: 30 }}>
            <div className="text-center">
                <div className="spinner-border mb-3" role="status" style={{ width: 38, height: 38, color: 'var(--hm-brass)', borderWidth: 3 }} />
                <div className="hm-mono" style={{ fontSize: 11, letterSpacing: '.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,.6)' }}>
                    {label}
                </div>
            </div>
        </div>
    );
}

/**
 * Sinkronkan pilihan elemen Sketch (selectedMap: slug → index) ke store 3D.
 */
export function useSyncShoeStore(elements, selectedMap, model) {
    const initFromProps = useShoeStore(s => s.initFromProps);
    const setOption = useShoeStore(s => s.setOption);

    useEffect(() => {
        initFromProps({ base_price: model?.price || 0, slug: model?.slug, glb_model_path: model?.glb }, {});
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [model?.slug]);

    useEffect(() => {
        if (!elements) return;
        elements.forEach(el => {
            const category = ELEMENT_TO_CATEGORY[el.slug];
            if (!category) return;
            const idx = selectedMap?.[el.slug] ?? 0;
            const v = el.defaults[idx];
            if (!v) return;
            setOption(category, {
                id: `${el.slug}-${idx}`,
                name: v.n,
                display_name: v.n,
                hex_color: v.c || null,
                price_addition: v.p || 0,
                roughness: el.slug === 'kulit' ? 0.82 : undefined,
                metalness: el.slug === 'eyelet' ? 0.8 : undefined,
            });
        });
    }, [elements, selectedMap, setOption]);
}

/**
 * Shoe3DStage — menampilkan model 3D interaktif (R3F) bila GLB tersedia,
 * atau preview photo-recolor sebagai fallback. Latar studio gelap Hybrid Mood.
 */
export default function Shoe3DStage({
    glb,
    slug,
    model = 'leather-boot',
    height = 560,
    badge = '3D Interaktif · 360°',
    showControls = true,
    onMeshReport,
}) {
    const wrapRef = useRef(null);
    const [checking, setChecking] = useState(true);
    const [glbOk, setGlbOk] = useState(false);
    const [meshes, setMeshes] = useState([]);

    useEffect(() => {
        let cancelled = false;
        setChecking(true);
        if (!glb) { setGlbOk(false); setChecking(false); return; }
        (async () => {
            try {
                const r = await fetch(resolveHeadRequestViteDevUrl(glb), { method: 'HEAD' });
                if (!cancelled) setGlbOk(r.ok);
            } catch {
                if (!cancelled) setGlbOk(false);
            } finally {
                if (!cancelled) setChecking(false);
            }
        })();
        return () => { cancelled = true; };
    }, [glb]);

    const report = (names) => {
        setMeshes(names);
        if (typeof onMeshReport === 'function') onMeshReport(names);
    };

    return (
        <div ref={wrapRef} className="hm-3d-stage" style={{ minHeight: height, height }}>
            <span className="hm-3d-badge" style={{ top: 14, left: 14 }}>
                <i className={`fas ${glbOk ? 'fa-cube' : 'fa-wand-magic-sparkles'}`} />
                {glbOk ? badge : 'Preview Foto · Realtime Warna'}
            </span>

            {showControls && glbOk && (
                <span className="hm-3d-badge" style={{ top: 14, right: 14 }}>
                    <i className="fas fa-hand-pointer" /> Drag · <i className="fas fa-magnifying-glass-plus" /> Zoom
                </span>
            )}

            {checking ? (
                <Loading label="Memeriksa model 3D..." />
            ) : glbOk && glb ? (
                <Suspense fallback={<Loading label="Memuat model 3D..." />}>
                    <div className="hm-3d-fill">
                        <ShoeConfiguratorCanvas
                            glbPath={glb}
                            scale={1.0}
                            containerRef={wrapRef}
                            onMeshReport={report}
                            model={model}
                        />
                    </div>
                </Suspense>
            ) : (
                <>
                    <PhotorealRecoloringPreview productSlug={slug} />
                    {meshes.length === 0 && (
                        <span className="hm-3d-badge" style={{ bottom: 14, left: 14 }}>
                            <i className="fas fa-circle-info" /> Asset GLB menyusul — preview foto aktif
                        </span>
                    )}
                </>
            )}
        </div>
    );
}
