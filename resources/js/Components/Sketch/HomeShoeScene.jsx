import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Center, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

const MODEL_URL = '/assets/3d-models/leather-boot-home.glb';

function ShoeModel({ progressRef, pointerRef, onReady }) {
    const { scene } = useGLTF(MODEL_URL);
    const pivot = useRef(null);
    const announced = useRef(false);

    const model = useMemo(() => {
        const cloned = scene.clone(true);
        cloned.traverse((object) => {
            if (!object.isMesh) return;
            object.frustumCulled = false;
            object.castShadow = false;
            object.receiveShadow = false;
            const materials = Array.isArray(object.material) ? object.material : [object.material];
            materials.forEach((material) => {
                if (!material) return;
                material.envMapIntensity = 1.15;
                material.needsUpdate = true;
            });
        });
        return cloned;
    }, [scene]);

    useEffect(() => {
        if (announced.current) return;
        announced.current = true;
        onReady?.();
    }, [onReady]);

    useFrame((state, delta) => {
        const group = pivot.current;
        if (!group) return;
        const progress = progressRef?.current ?? 0;
        const pointer = pointerRef?.current ?? { x: 0, y: 0 };
        const elapsed = state.clock.elapsedTime;
        const damping = 1 - Math.pow(0.001, Math.min(delta, 0.05));
        const targetY = -0.7 + progress * Math.PI * 1.6 + pointer.x * 0.26 + Math.sin(elapsed * 0.32) * 0.035;
        const targetX = 0.08 + pointer.y * 0.14 + Math.sin(elapsed * 0.44) * 0.018;
        group.rotation.y += (targetY - group.rotation.y) * damping;
        group.rotation.x += (targetX - group.rotation.x) * damping;
        group.position.y = -0.08 + Math.sin(elapsed * 0.7) * 0.022 - progress * 0.05;
    });

    return <group ref={pivot} rotation={[0.08, -0.7, 0]}>
        <Center>
            <group scale={1.3}>
                <primitive object={model} />
            </group>
        </Center>
    </group>;
}

function CameraRig({ progressRef }) {
    const { camera } = useThree();
    useFrame(() => {
        const progress = progressRef?.current ?? 0;
        camera.position.z = 3.15 - progress * 0.2;
        camera.position.y = 0.28 + progress * 0.12;
        camera.lookAt(0, 0.03, 0);
    });
    return null;
}

export default function HomeShoeScene({ progressRef, onReady }) {
    const host = useRef(null);
    const pointerRef = useRef({ x: 0, y: 0 });
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)');
        const onPointer = (event) => {
            pointerRef.current.x = Math.max(-1, Math.min(1, (event.clientX / window.innerWidth) * 2 - 1));
            pointerRef.current.y = Math.max(-1, Math.min(1, (event.clientY / window.innerHeight) * 2 - 1));
        };
        if (!reduced?.matches) window.addEventListener('pointermove', onPointer, { passive: true });

        const observer = typeof IntersectionObserver !== 'undefined' && host.current
            ? new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin: '120px' })
            : null;
        if (observer) observer.observe(host.current);

        return () => {
            window.removeEventListener('pointermove', onPointer);
            observer?.disconnect();
        };
    }, []);

    return <div ref={host} className="shoe-3d-scene" aria-hidden="true">
        <Canvas
            dpr={[1, 1.5]}
            frameloop={visible ? 'always' : 'never'}
            camera={{ position: [0, 0.28, 3.15], fov: 30, near: 0.01, far: 60 }}
            gl={{
                alpha: true,
                antialias: true,
                powerPreference: 'high-performance',
                toneMapping: THREE.ACESFilmicToneMapping,
                toneMappingExposure: 1.02,
                outputColorSpace: THREE.SRGBColorSpace,
            }}
        >
            <ambientLight intensity={0.72} />
            <hemisphereLight args={['#fff3dd', '#6b4a24', 0.68]} />
            <directionalLight position={[3, 5, 4]} intensity={2.1} color="#fff4e0" />
            <directionalLight position={[-2.6, 2.2, -2]} intensity={0.9} color="#ffd39a" />
            <directionalLight position={[0, 3, -4]} intensity={1.05} color="#ffb14d" />
            <Suspense fallback={null}>
                <ShoeModel progressRef={progressRef} pointerRef={pointerRef} onReady={onReady} />
            </Suspense>
            <CameraRig progressRef={progressRef} />
        </Canvas>
    </div>;
}

useGLTF.preload(MODEL_URL);
