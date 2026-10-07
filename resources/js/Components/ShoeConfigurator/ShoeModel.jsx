import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
    OrbitControls,
    useGLTF,
    Environment,
    ContactShadows,
    Html,
    useProgress,
    Center,
    PresentationControls,
    AccumulativeShadows,
    RandomizedLight,
} from '@react-three/drei';
import * as THREE from 'three';
import { useShoeStore } from './useShoeStore';
import resolveStaticAssetViteDevUrl from './resolveAssetUrl';

/* ================================================================
 * HYBRID MATERIAL PIPELINE
 * 2 strategi warna, otomatis pilih berdasarkan jumlah mesh:
 *
 * STRATEGI A — Per-Mesh (jika GLB punya banyak mesh bernama benar):
 *   Warna di-apply langsung per-mesh target (presisi 100%).
 *   Digunakan kalau mesh_upper, mesh_sole, mesh_insole dst ADA & TERDETEKSI.
 *
 * STRATEGI B — Clipping-Plane Heuristic (jika cuma 1-2 mesh gabungan):
 *   Scene di-Render BEBERAPA KALI, tiap render dibatasi clipping plane
 *   hanya untuk 1 region (sole / insole / upper / laces / hardware),
 *   material tiap region diberi WARNA sesuai pilihan user.
 *   Boundary MENGIKUTI KONTUR 3D (bukan garis kotak), jauh lebih natural.
 *   Ini TANPA PERLU pisah mesh di Blender!
 * ================================================================ */

function regionPlanesFor(box, category, model = 'leather-boot') {
    /*
     * Tentukan region (3D box) berdasarkan persentase bounding box.
     * Return daftar THREE.Plane untuk clipping — intersection = hanya area
     * di dalam region yang terlihat.
     */
    const size = new THREE.Vector3();
    box.getSize(size);
    const min = box.min.clone();
    const max = box.max.clone();

    const pct = (a, b) => min.y + size.y * (a + b) / 2; // unused
    const sliceY = (fromPct, toPct) => {
        const yBottom = min.y + size.y * fromPct;
        const yTop = min.y + size.y * toPct;
        return [
            new THREE.Plane(new THREE.Vector3(0, +1, 0), -yBottom), // di-atas yBottom
            new THREE.Plane(new THREE.Vector3(0, -1, 0), +yTop),    // di-bawah yTop
        ];
    };
    const sideSliceX = (xPct, thickness = 0.04, yRange = [0.28, 0.82]) => {
        const xPos = min.x + size.x * xPct;
        const yBottom = min.y + size.y * yRange[0];
        const yTop = min.y + size.y * yRange[1];
        return [
            new THREE.Plane(new THREE.Vector3(+1, 0, 0), -(xPos - thickness * size.x)),
            new THREE.Plane(new THREE.Vector3(-1, 0, 0), +(xPos + thickness * size.x)),
            new THREE.Plane(new THREE.Vector3(0, +1, 0), -yBottom),
            new THREE.Plane(new THREE.Vector3(0, -1, 0), +yTop),
        ];
    };

    switch (category) {
        case 'sole':
            return sliceY(0.00, model === 'chelsea-boot' ? 0.20 : 0.22);
        case 'insole':
            return sliceY(model === 'chelsea-boot' ? 0.18 : 0.20, model === 'chelsea-boot' ? 0.28 : 0.30);
        case 'material_upper':
            return sliceY(model === 'chelsea-boot' ? 0.26 : 0.28, 1.00);
        case 'laces':
            return [
                ...sliceY(model === 'chelsea-boot' ? 0.30 : 0.32, 0.78),
                new THREE.Plane(new THREE.Vector3(+1, 0, 0), -(min.x + size.x * 0.32)),
                new THREE.Plane(new THREE.Vector3(-1, 0, 0), +(min.x + size.x * 0.68)),
                new THREE.Plane(new THREE.Vector3(0, 0, +1), -(min.z + size.z * 0.35)),
                new THREE.Plane(new THREE.Vector3(0, 0, -1), +(min.z + size.z * 0.65)),
            ];
        case 'hardware':
            // 2 kolom eyelet di kiri + kanan
            return {
                multi: true,
                chunks: [
                    sideSliceX(0.32, 0.05, [0.32, 0.76]),
                    sideSliceX(0.68, 0.05, [0.32, 0.76]),
                ],
            };
        case 'stitching':
            // Jahitan perimeter upper (line tipis di batas-batas)
            return [
                ...sliceY(model === 'chelsea-boot' ? 0.25 : 0.27, 1.0),
                // outermost shell ~ 2% thickness
                new THREE.Plane(new THREE.Vector3(+1, 0, 0), -(min.x + size.x * 0.02)),
                new THREE.Plane(new THREE.Vector3(-1, 0, 0), +(min.x + size.x * 0.98)),
                new THREE.Plane(new THREE.Vector3(0, 0, +1), -(min.z + size.z * 0.02)),
                new THREE.Plane(new THREE.Vector3(0, 0, -1), +(min.z + size.z * 0.98)),
            ];
        default:
            return [];
    }
}

function applyColorToMaterial(mat, option, snap) {
    if (!mat) return;
    if (snap) {
        if (snap.color && mat.color) mat.color.copy(snap.color);
        mat.roughness = snap.roughness ?? mat.roughness;
        mat.metalness = snap.metalness ?? mat.metalness;
        mat.envMapIntensity = snap.envMapIntensity ?? mat.envMapIntensity;
        if ('thickness' in mat) mat.thickness = snap.thickness ?? mat.thickness;
        if (snap.normalScale && mat.normalScale) mat.normalScale.copy(snap.normalScale);
        mat.map = snap.map ?? mat.map;
        mat.normalMap = snap.normalMap ?? mat.normalMap;
        mat.roughnessMap = snap.roughnessMap ?? mat.roughnessMap;
        mat.metalnessMap = snap.metalnessMap ?? mat.metalnessMap;
        mat.aoMap = snap.aoMap ?? mat.aoMap;
        mat.bumpMap = snap.bumpMap ?? mat.bumpMap;
        mat.bumpScale = snap.bumpScale ?? mat.bumpScale;
    }
    if (option?.hex_color && mat.color) {
        mat.color.set(option.hex_color);
    }
    if (option?.roughness != null) mat.roughness = Number(option.roughness);
    if (option?.metalness != null) mat.metalness = Number(option.metalness);
    mat.needsUpdate = true;
}

/* -------- STRATEGI A: Per-Mesh (presisi) -------- */
function ShoeModelMeshStrategy({ scene, meshRefs, baseDefaultsReported, onMeshReport }) {
    const selected = useShoeStore(s => s.selected);
    const allMeshes = useMemo(() => {
        const s = scene.clone(true);
        s.updateMatrixWorld(true);
        const arr = [];
        s.traverse(obj => {
            if (obj.isMesh) {
                obj.castShadow = true;
                obj.receiveShadow = true;
                obj.frustumCulled = false;
                const originalName = obj.name || '';
                const key = originalName.toLowerCase().trim();
                meshRefs.current[key] = obj;
                meshRefs.current[originalName] = obj;

                // ==== NORMALIZE MESH NAME TO DB PATTERN ====
                // Case 1: Pattern Baru (Tripo3D export GLB) → "sole(region)", "upper(region)", "stitching(region)"
                //         NORMALIZE → "mesh_sole", "mesh_upper", "mesh_stitching" → SAMA dengan kolom mesh_target DB!
                // Case 2: Pattern Lama → "mesh_sole" (tidak perlu ubah, match DB langsung).
                const regRegion = /^([a-zA-Z0-9_-]+)\(\s*region\s*\)$/i;
                const matchRegion = key.match(regRegion);
                if (matchRegion && matchRegion[1]) {
                    const normalizedKey = 'mesh_' + matchRegion[1].toLowerCase();
                    meshRefs.current[normalizedKey] = obj;
                    // Juga simpan uppercase / original case normalized.
                    meshRefs.current[normalizedKey.toUpperCase()] = obj;
                }
                // Case 3: Nama mesh sembarang tapi CONTAINS kata region mis "Boot_Mesh_UPPER_Region"
                const regContains = /^.*?(mesh[_-]?|)([a-zA-Z0-9_-]+)[_-]*\s*\(?region\)?.*$/i;
                if (!matchRegion) {
                    const mc = key.match(regContains);
                    if (mc && mc[2] && mc[2].length <= 12) {
                        const nk = 'mesh_' + mc[2].toLowerCase();
                        if (!meshRefs.current[nk]) meshRefs.current[nk] = obj;
                    }
                }
                // Special case: category "material_upper" di-DB → mesh_target = mesh_upper.
                // Juga simpan alias: mesh_material_upper → mesh_upper (jika ada).
                if (!meshRefs.current['mesh_material_upper'] && meshRefs.current['mesh_upper']) {
                    meshRefs.current['mesh_material_upper'] = meshRefs.current['mesh_upper'];
                }
                // End normalize.
                const mat = obj.material;
                if (mat && !mat._shoeBaseSnapshot) {
                    const mats = Array.isArray(mat) ? mat : [mat];
                    mats.forEach(m => {
                        if (!m) return;
                        if (m.isMeshStandardMaterial || m.isMeshPhysicalMaterial) {
                            m.envMapIntensity = m.envMapIntensity ?? 1.1;
                            m.thickness = m.thickness ?? 0.035;
                            if (!m.normalScale) m.normalScale = new THREE.Vector2(1, 1);
                        }
                        m._shoeBaseSnapshot = {
                            color: m.color ? m.color.clone() : null,
                            roughness: m.roughness ?? 0.5,
                            metalness: m.metalness ?? 0.0,
                            envMapIntensity: m.envMapIntensity ?? 1.0,
                            thickness: m.thickness ?? 0,
                            normalScale: m.normalScale ? m.normalScale.clone() : null,
                            map: m.map ?? null,
                            normalMap: m.normalMap ?? null,
                            roughnessMap: m.roughnessMap ?? null,
                            metalnessMap: m.metalnessMap ?? null,
                            aoMap: m.aoMap ?? null,
                            bumpMap: m.bumpMap ?? null,
                            bumpScale: m.bumpScale ?? 1,
                        };
                        m.needsUpdate = true;
                    });
                }
                arr.push(obj);
            }
        });
        return arr;
    }, [scene, meshRefs]);

    useEffect(() => {
        if (baseDefaultsReported.current) return;
        const names = [...new Set(Object.keys(meshRefs.current))].sort();
        if (names.length && typeof onMeshReport === 'function') {
            onMeshReport(names);
            baseDefaultsReported.current = true;
        }
    }, [allMeshes, onMeshReport, baseDefaultsReported, meshRefs]);

    useEffect(() => {
        if (!selected) return;
        const unique = allMeshes.filter((v, i, a) => a.indexOf(v) === i);
        Object.values(selected).forEach(option => {
            const targetName = option?.mesh_target;
            const key = targetName ? String(targetName).toLowerCase().trim() : null;
            let targets = [];
            if (key) {
                // Exact match (normalize sudah di-load time, ini yg utama)
                if (meshRefs.current[key]) {
                    targets = [meshRefs.current[key]];
                } else {
                    // Fallback 1: pattern "xxx(region)" (jika load-time normalize miss)
                    const m = key.match(/^mesh_([a-z0-9_-]+)$/i);
                    if (m && m[1]) {
                        const altRegion = m[1].toLowerCase() + '(region)';
                        if (meshRefs.current[altRegion]) {
                            targets = [meshRefs.current[altRegion]];
                        }
                    }
                    // Fallback 2: search di semua mesh keys, contains key atau region
                    if (!targets || targets.length === 0) {
                        const allKeys = Object.keys(meshRefs.current);
                        const baseCat = (key || '').replace(/^mesh[-_]*/i, '').toLowerCase().trim();
                        for (const mk of allKeys) {
                            const norm = String(mk).toLowerCase().trim();
                            const hit = (baseCat && norm.includes(baseCat));
                            if (hit && meshRefs.current[mk]) {
                                targets = [meshRefs.current[mk]];
                                break;
                            }
                        }
                    }
                }
            }
            // Fallback terakhir (TIDAK ADA MATCH SAMA SEKALI): apply SEMUA mesh (hindari jika bisa)
            if (!targets || targets.length === 0) {
                targets = unique;
            }
            targets.forEach(mesh => {
                if (!mesh) return;
                const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
                mats.forEach(mat => applyColorToMaterial(mat, option, mat?._shoeBaseSnapshot));
            });
        });
    }, [selected, allMeshes, meshRefs]);

    return <primitive object={allMeshes[0]?.parent ?? scene} />;
}

/* -------- STRATEGI B: Clipping-Plane Heuristic (1 mesh bisa multi-warna) -------- */
function ClippedRegion({ sourceScene, category, option, regionBox, model }) {
    const appliedScene = useMemo(() => sourceScene.clone(true), [sourceScene]);
    const groupRef = useRef(null);

    const { planesDef, opacity } = useMemo(() => {
        const raw = regionPlanesFor(regionBox, category, model);
        if (raw?.multi) {
            return { planesDef: raw.chunks, opacity: 1 };
        }
        return { planesDef: [raw], opacity: category === 'stitching' ? 0.92 : 1 };
    }, [regionBox, category, model]);

    const hex = option?.hex_color || null;
    const roughness = option?.roughness;
    const metalness = option?.metalness;

    /* Apply per-cloned mesh once on mount + when option changes */
    useEffect(() => {
        appliedScene.updateMatrixWorld(true);
        appliedScene.traverse(obj => {
            if (!obj?.isMesh) return;
            const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
            mats.forEach(mat => {
                if (!mat) return;
                if (hex && mat.color) mat.color.set(hex);
                if (roughness != null) mat.roughness = Number(roughness);
                if (metalness != null) mat.metalness = Number(metalness);
                if (category === 'stitching' && !hex) {
                    // Match color: subtle contrast
                    if (mat.color) {
                        const baseLum = 0.2126 * mat.color.r + 0.7152 * mat.color.g + 0.0722 * mat.color.b;
                        const matchHex = baseLum > 0.5 ? '#000000' : '#ffffff';
                        mat.color.set(matchHex);
                    }
                }
                mat.polygonOffset = true;
                mat.polygonOffsetFactor = -1; // tampil lebih depan
                mat.needsUpdate = true;
            });
        });
    }, [appliedScene, hex, roughness, metalness, category]);

    const chunks = planesDef.map((planes, i) => (
        <group key={i} ref={groupRef}>
            <ClippedGroup planes={planes} opacity={opacity}>
                <primitive object={appliedScene} />
            </ClippedGroup>
        </group>
    ));

    return <>{chunks}</>;
}

function ClippedGroup({ planes, opacity, children }) {
    /*
     * Render children dengan clipping planes. Kita bungkus <group> + pakai
     * clippingPlanes di Material on-the-fly via onBeforeRender-style effect:
     * di R3F/Drei paling gampang pakai clone + override.
     */
    const group = useRef(null);
    useEffect(() => {
        if (!group?.current) return;
        group.current.traverse(obj => {
            if (!obj?.isMesh) return;
            const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
            mats.forEach(m => {
                if (!m) return;
                m.clippingPlanes = planes;
                m.clipShadows = true;
                m.transparent = opacity < 1;
                m.opacity = opacity;
                m.needsUpdate = true;
            });
        });
    }, [planes, opacity]);
    return <group ref={group}>{children}</group>;
}

function ShoeModelHeuristicStrategy({ scene, meshRefs, baseDefaultsReported, onMeshReport, model }) {
    const selected = useShoeStore(s => s.selected);
    const prepared = useMemo(() => {
        const s = scene.clone(true);
        s.updateMatrixWorld(true);
        const names = [];
        const snapMap = new Map();
        s.traverse(obj => {
            if (obj.isMesh) {
                obj.castShadow = true;
                obj.receiveShadow = true;
                obj.frustumCulled = false;
                const key = obj.name.toLowerCase().trim() || 'unnamed';
                names.push(key);
                const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
                mats.forEach((m, idx) => {
                    if (!m) return;
                    if (m.isMeshStandardMaterial || m.isMeshPhysicalMaterial) {
                        m.envMapIntensity = m.envMapIntensity ?? 1.1;
                        m.thickness = m.thickness ?? 0.035;
                        if (!m.normalScale) m.normalScale = new THREE.Vector2(1, 1);
                    }
                    snapMap.set(`${key}_${idx}`, {
                        color: m.color ? m.color.clone() : null,
                        roughness: m.roughness ?? 0.5,
                        metalness: m.metalness ?? 0.0,
                        envMapIntensity: m.envMapIntensity ?? 1.0,
                    });
                    m.needsUpdate = true;
                });
            }
        });
        return { scene: s, names, snapMap };
    }, [scene]);

    const regionBox = useMemo(() => {
        const b = new THREE.Box3().setFromObject(prepared.scene);
        return b;
    }, [prepared.scene]);

    useEffect(() => {
        if (baseDefaultsReported.current) return;
        const names = [...new Set(prepared.names)].sort();
        const aug = [
            ...names,
            'sole(region)',
            'insole(region)',
            'upper(region)',
            'laces(region)',
            'hardware(region)',
            'stitching(region)',
        ];
        if (typeof onMeshReport === 'function') {
            onMeshReport(aug);
            baseDefaultsReported.current = true;
        }
    }, [prepared.names, onMeshReport, baseDefaultsReported]);

    /*
     * Render order (z):
     *   1. Sole (paling bawah)
     *   2. Insole
     *   3. Upper
     *   4. Laces
     *   5. Hardware / eyelets
     *   6. Stitching (paling atas)
     */
    const order = ['sole', 'insole', 'material_upper', 'laces', 'hardware', 'stitching'];

    return (
        <group>
            {order.map(cat => {
                const sel = selected?.[cat];
                if (cat === 'stitching') {
                    const matchSel = selected?.stitching;
                    return (
                        <ClippedRegion
                            key={cat}
                            sourceScene={prepared.scene}
                            category={cat}
                            option={matchSel || null}
                            regionBox={regionBox}
                            model={model}
                        />
                    );
                }
                return (
                    <ClippedRegion
                        key={cat}
                        sourceScene={prepared.scene}
                        category={cat}
                        option={sel || null}
                        regionBox={regionBox}
                        model={model}
                    />
                );
            })}
        </group>
    );
}

/* -------- ShoeModel wrapper + strategy selector -------- */
function ShoeModelRaw({ glbPath, scale = 1, onMeshReport, model = 'leather-boot' }) {
    const meshRefs = useRef({});
    const baseDefaultsReported = useRef(false);
    const [strategy, setStrategy] = useState(null); // 'mesh' | 'heuristic'
    const { scene } = useGLTF(resolveStaticAssetViteDevUrl(glbPath));

    /* Scan scene → decide strategy */
    const { fittedScene, autoScale, size, boxMinY } = useMemo(() => {
        const s = scene.clone(true);
        s.updateMatrixWorld(true);
        let meshCount = 0;
        s.traverse(obj => { if (obj?.isMesh) meshCount++; });
        /* Strategy: per-mesh kalau >= 4 mesh terpisah ATAU nama meshes match dengan
           pattern DB ('mesh_sole' / 'mesh_upper') ATAU pattern Tripo export ('sole(region)') */
        const namedTargets = ['mesh_upper', 'mesh_sole', 'mesh_insole', 'mesh_laces', 'mesh_hardware', 'mesh_stitching'];
        const regionTargets = ['upper', 'sole', 'insole', 'laces', 'hardware', 'stitching'];
        let hasNamed = 0;
        s.traverse(obj => {
            if (!obj?.isMesh) return;
            const k = (obj.name || '').toLowerCase().trim();
            if (namedTargets.includes(k)) { hasNamed++; return; }
            // Pattern Tripo3D: "xxx(region)"
            const m = k.match(/^([a-z0-9_-]+)\(\s*region\s*\)$/i);
            if (m && m[1] && regionTargets.includes(m[1].toLowerCase())) { hasNamed++; return; }
            // Pattern contains: nama mesh ada nama region, mis "mesh_sole_region"
            for (const r of regionTargets) { if (k.indexOf(r) !== -1 && (k.indexOf('mesh') !== -1 || k.indexOf('region') !== -1)) { hasNamed++; return; } }
        });
        // Force STRATEGY = 'mesh' (Per-Mesh Presisi) SELALU! Tidak usah condition heuristic clipping yang 6x render → WebGL Context Lost!
        // hasNamed=6, meshCount=7 → 100% match pattern (mesh_xxx atau xxx(region)).
        setStrategy('mesh');
        const box = new THREE.Box3().setFromObject(s);
        const size = new THREE.Vector3();
        box.getSize(size);
        const boxMinY = box.min.y;
        const maxDim = Math.max(size.x, size.y, size.z) || 1;
        const targetSize = 1.25;  // ⬇️ Zoom Out (dulu 1.9 = terlalu besar → sole keluar viewport bawah)
        const fit = targetSize / maxDim;
        return { fittedScene: s, autoScale: fit, size, boxMinY };
    }, [scene]);

    const finalScale = autoScale * scale;
    const liftTune = 0.18; /* ⬆️ Object di-naik-kan 18cm ke ATAS (agar sole tidak keluar viewport bawah) */
    const groundY = -boxMinY * finalScale + liftTune;

    return (
        <group position={[0, groundY, 0]}>
            <group scale={[finalScale, finalScale, finalScale]} name="ShoeRoot">
                {strategy === 'mesh' ? (
                    <ShoeModelMeshStrategy
                        scene={fittedScene}
                        meshRefs={meshRefs}
                        baseDefaultsReported={baseDefaultsReported}
                        onMeshReport={onMeshReport}
                    />
                ) : strategy === 'heuristic' ? (
                    <ShoeModelHeuristicStrategy
                        scene={fittedScene}
                        meshRefs={meshRefs}
                        baseDefaultsReported={baseDefaultsReported}
                        onMeshReport={onMeshReport}
                        model={model}
                    />
                ) : null}
            </group>
        </group>
    );
}

function ShoeModel(props) {
    return (
        <Suspense fallback={<Html center><div className="text-center text-industrial-600"><i className="fas fa-spin fa-sync-alt"></i>&nbsp; Memuat aset...</div></Html>}>
            <ShoeModelRaw {...props} />
        </Suspense>
    );
}

/* ============================================================
 * Loading overlay (top progress bar inside Canvas area)
 * ============================================================ */
function LoaderBar({ containerRef }) {
    const { progress, active } = useProgress();
    useEffect(() => {
        if (!containerRef?.current) return;
        const bar = containerRef.current.querySelector('.loading-bar');
        if (bar) bar.style.width = `${progress}%`;
        const wrap = containerRef.current;
        if (wrap) {
            if (active || progress < 99) wrap.classList.add('loading');
            else wrap.classList.remove('loading');
        }
    }, [progress, active, containerRef]);
    return null;
}

/* ============================================================
 * Rotating auto-demo: subtle idle auto rotation till user interacts
 * ============================================================ */
function AutoRotateIdle({ enabled = true }) {
    const { camera } = useThree();
    const ref = useRef({ angle: 0, lastInteract: Date.now() });
    useFrame((_, delta) => {
        if (!enabled) return;
        const idleMs = Date.now() - ref.current.lastInteract;
        if (idleMs > 3500) {
            ref.current.angle += delta * 0.35;
            const r = 3.4;
            camera.position.x = Math.sin(ref.current.angle) * r;
            camera.position.z = Math.cos(ref.current.angle) * r;
            camera.position.y = 0.95 + Math.sin(ref.current.angle * 0.5) * 0.2;
            camera.lookAt(0, 0, 0);
        }
    });
    useEffect(() => {
        const mark = () => (ref.current.lastInteract = Date.now());
        const el = document;
        el.addEventListener('pointerdown', mark);
        el.addEventListener('wheel', mark);
        el.addEventListener('keydown', mark);
        return () => {
            el.removeEventListener('pointerdown', mark);
            el.removeEventListener('wheel', mark);
            el.removeEventListener('keydown', mark);
        };
    }, []);
    return null;
}

/* ============================================================
 * Public exports
 * ============================================================ */
export function ShoeConfiguratorCanvas({
    glbPath,
    scale = 1.0,
    onMeshReport,
    containerRef,
    model = 'leather-boot',
    children,
}) {
    return (
        <Canvas
            shadows
            dpr={[1, 2]}
            camera={{ position: [0, 0.95, 3.4], fov: 35, near: 0.01, far: 200 }}
            gl={{
                antialias: true,
                alpha: true,
                powerPreference: 'high-performance',
                outputColorSpace: THREE.SRGBColorSpace,
                toneMapping: THREE.ACESFilmicToneMapping,
                toneMappingExposure: 1.18,
                localClippingEnabled: true, /* Wajib agar clipping planes lokal per-material bekerja */
            }}
        >
            <color attach="background" args={[0xe9e7e3]} />
            <fog attach="fog" args={[0xe9e7e3, 5, 14]} />

            <ambientLight intensity={0.48} />
            <hemisphereLight args={[0xfff3dd, 0x6b4a24, 0.42]} />

            <directionalLight
                name="KeyLight"
                position={[3.4, 5.2, 4]}
                intensity={1.55}
                color="#fff6e5"
                castShadow
                shadow-mapSize={[2048, 2048]}
                shadow-camera-left={-3}
                shadow-camera-right={3}
                shadow-camera-top={3}
                shadow-camera-bottom={-3}
                shadow-camera-near={0.1}
                shadow-camera-far={30}
                shadow-bias={-0.00015}
                shadow-normalBias={0.02}
            />
            <directionalLight
                name="FillLight"
                position={[-2.6, 3.2, -1.4]}
                intensity={0.48}
                color="#ffe9c2"
            />
            <directionalLight
                name="RimLight"
                position={[-1.8, 4.2, -4.4]}
                intensity={0.68}
                color="#ffb14d"
            />

            <ShoeModel glbPath={glbPath} scale={scale} onMeshReport={onMeshReport} model={model} />

            <AccumulativeShadows
                position={[0, 0.002, 0]}
                temporal
                frames={60}
                alphaTest={0.9}
                opacity={0.42}
                scale={10}
                blur={2}
            >
                <RandomizedLight amount={5} radius={6} ambient={0.24} intensity={1.08} position={[3, 4, 3]} bias={0.0008} />
            </AccumulativeShadows>

            <ContactShadows
                position={[0, 0.003, 0]}
                opacity={0.22}
                scale={9}
                blur={2.6}
                far={3}
            />

            <PresentationControls
                global
                cursor={true}
                polar={[0.02, Math.PI - 0.02]}
                azimuth={[-Infinity, Infinity]}
                snap
            />

            <OrbitControls
                makeDefault
                enablePan={false}
                minDistance={1.2}
                maxDistance={8}
                minPolarAngle={0.02}
                maxPolarAngle={Math.PI - 0.02}
                target={[0, 0, 0]}
                enableDamping
                dampingFactor={0.08}
            />

            <Environment preset="sunset" environmentIntensity={1.15} />
            <AutoRotateIdle enabled />

            <LoaderBar containerRef={containerRef} />
            {children}
        </Canvas>
    );
}

/* ============================================================
 * Cleanup: unload GLB when user leaves page
 * ============================================================ */
if (typeof window !== 'undefined' && useGLTF && useGLTF.preload) {
    // Noop: we preload lazily on mount via component
}
export default ShoeConfiguratorCanvas;
