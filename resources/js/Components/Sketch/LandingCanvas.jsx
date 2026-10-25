import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function LandingCanvas({ host }) {
    const mount = useRef(null);
    useEffect(() => {
        const element = mount.current;
        let renderer;
        try {
            renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, powerPreference: 'low-power' });
        } catch {
            return;
        }
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        element.appendChild(renderer.domElement);
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
        camera.position.z = 7;
        const geometry = new THREE.PlaneGeometry(10, 6, 100, 64);
        const positions = geometry.attributes.position;
        for (let i = 0; i < positions.count; i++) {
            const x = positions.getX(i);
            const y = positions.getY(i);
            positions.setZ(i, Math.sin(x * 1.2 + y * 0.8) * 0.5 + Math.cos(y * 2) * 0.15);
        }
        const material = new THREE.PointsMaterial({ color: '#8b683c', size: 0.018, transparent: true, opacity: 0.38, depthWrite: false });
        const points = new THREE.Points(geometry, material);
        points.rotation.z = -0.25;
        scene.add(points);
        let frame = 0;
        let active = true;
        let lost = false;
        let targetX = 0;
        let targetY = 0;
        let scroll = 0;
        const resize = () => {
            const { width, height } = element.getBoundingClientRect();
            renderer.setSize(width, height);
            camera.aspect = width / Math.max(height, 1);
            camera.updateProjectionMatrix();
        };
        const pointer = (event) => {
            const rect = host.current.getBoundingClientRect();
            targetX = ((event.clientX - rect.left) / rect.width - 0.5) * 40;
            targetY = ((event.clientY - rect.top) / rect.height - 0.5) * 40;
        };
        const reset = () => { targetX = 0; targetY = 0; };
        const onScroll = () => { scroll = Math.min(20, window.scrollY / Math.max(1, window.innerHeight) * 20); };
        const render = () => {
            if (!active || lost || document.hidden) { frame = 0; return; }
            points.rotation.y += (targetX * 0.003 - points.rotation.y) * 0.035;
            points.rotation.x += (targetY * 0.003 - points.rotation.x) * 0.035;
            element.style.transform = `translate3d(${targetX * 0.35}px,${Math.min(20, Math.max(-20, targetY * 0.35 + scroll))}px,0)`;
            renderer.render(scene, camera);
            frame = requestAnimationFrame(render);
        };
        const resume = () => { if (!frame && active && !lost && !document.hidden) render(); };
        const observer = new IntersectionObserver(([entry]) => { active = entry.isIntersecting; resume(); });
        observer.observe(host.current);
        const sizing = new ResizeObserver(resize);
        sizing.observe(element);
        const contextLost = (event) => { event.preventDefault(); lost = true; element.style.opacity = '0'; };
        renderer.domElement.addEventListener('webglcontextlost', contextLost);
        const hero = host.current;
        hero.addEventListener('pointermove', pointer, { passive: true });
        hero.addEventListener('pointerleave', reset);
        window.addEventListener('scroll', onScroll, { passive: true });
        document.addEventListener('visibilitychange', resume);
        resize();
        onScroll();
        render();
        return () => {
            cancelAnimationFrame(frame);
            observer.disconnect();
            sizing.disconnect();
            hero.removeEventListener('pointermove', pointer);
            hero.removeEventListener('pointerleave', reset);
            window.removeEventListener('scroll', onScroll);
            document.removeEventListener('visibilitychange', resume);
            renderer.domElement.removeEventListener('webglcontextlost', contextLost);
            geometry.dispose();
            material.dispose();
            renderer.dispose();
            renderer.domElement.remove();
        };
    }, [host]);
    return <div className="lp-canvas" ref={mount} />;
}
