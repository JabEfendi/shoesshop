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

/* ============================================================
 * ShoeModel — loads the .glb and applies live material changes
 * ============================================================ */
function ShoeModelRaw({ glbPath, scale = 1, onMeshReport }) {
    const meshRefs = useRef({});
    const selected = useShoeStore(s => s.selected);
    const baseDefaultsReported = useRef(false);

    const { scene } = useGLTF(glbPath);

    const { fittedScene, autoScale, size, boxMinY } = useMemo(() => {
        const s = scene.clone(true);
        s.updateMatrixWorld(true);
        s.traverse(obj => {
            if (obj.isMesh) {
                obj.castShadow = true;
                obj.receiveShadow = true;
                obj.frustumCulled = false;
                const key = obj.name.toLowerCase().trim();
                meshRefs.current[key] = obj;
                meshRefs.current[obj.name] = obj;
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
            }
        });

        const box = new THREE.Box3().setFromObject(s);
        const size = new THREE.Vector3();
        box.getSize(size);
        const boxMinY = box.min.y;
        const maxDim = Math.max(size.x, size.y, size.z) || 1;
        const targetSize = 1.9;
        const fit = (targetSize / maxDim);
        return { fittedScene: s, autoScale: fit, size, boxMinY };
    }, [scene]);

    /* Report back available mesh names to parent (for debugging) */
    useEffect(() => {
        if (baseDefaultsReported.current) return;
        const names = [...new Set(Object.keys(meshRefs.current))].sort();
        if (names.length && typeof onMeshReport === 'function') {
            onMeshReport(names);
            baseDefaultsReported.current = true;
        }
    }, [fittedScene, onMeshReport]);

    /* Apply option changes to targeted meshes */
    useEffect(() => {
        if (!selected) return;
        const allMeshes = Object.values(meshRefs.current).filter((v, i, a) => a.indexOf(v) === i);
        Object.values(selected).forEach(option => {
            const targetName = option?.mesh_target;
            const key = targetName ? String(targetName).toLowerCase().trim() : null;
            let targets = [];
            if (key && meshRefs.current[key]) {
                targets = [meshRefs.current[key]];
            } else {
                targets = allMeshes;
            }
            targets.forEach(mesh => {
                if (!mesh) return;
                const applyMat = (mat) => {
                    if (!mat) return;
                    const snap = mat._shoeBaseSnapshot;
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

                    if (option.hex_color && mat.color) {
                        mat.color.set(option.hex_color);
                    }
                    if (option.roughness != null) mat.roughness = Number(option.roughness);
                    if (option.metalness != null) mat.metalness = Number(option.metalness);

                    mat.needsUpdate = true;
                };
                const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
                mats.forEach(applyMat);
            });
        });
    }, [selected]);

    const finalScale = autoScale * scale;
    const liftTune = 0.003;

    // Position bottom of bounding box exactly at y = 0 for contact shadows.
    // After applying finalScale: world minY = boxMinY * finalScale.
    // Lift group so world minY becomes 0 (plus tiny lift tune to avoid z-fighting with ground plane).
    const groundY = -boxMinY * finalScale + liftTune;

    return (
        <group position={[0, groundY, 0]}>
            <group scale={[finalScale, finalScale, finalScale]} name="ShoeRoot">
                <primitive object={fittedScene} />
            </group>
        </group>
    );
}

function ShoeModel(props) {
    // Wrap with Suspense so useGLTF async load doesn't crash Canvas
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

            <ShoeModel glbPath={glbPath} scale={scale} onMeshReport={onMeshReport} />

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
