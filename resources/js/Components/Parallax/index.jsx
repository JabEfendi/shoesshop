import React, { useEffect, useRef } from 'react';

/* =====================================================================
 * Parallax engine (shared rAF scroll bus — ringan untuk banyak layer)
 * ===================================================================== */
const subscribers = new Set();
let ticking = false;

function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
        const vh = window.innerHeight;
        subscribers.forEach(fn => {
            try { fn(vh); } catch (e) { /* noop */ }
        });
        ticking = false;
    });
}

function subscribe(fn) {
    if (subscribers.size === 0 && typeof window !== 'undefined') {
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll);
    }
    subscribers.add(fn);
    return () => {
        subscribers.delete(fn);
        if (subscribers.size === 0 && typeof window !== 'undefined') {
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onScroll);
        }
    };
}

const prefersReduced = () =>
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * useParallax — translate a child based on the progress of its (untransformed)
 * parent through the viewport. Parent is the stable measuring reference so the
 * transform never feeds back into its own measurement.
 *
 * @param {number} speed  positive = moves up faster as you scroll down
 * @param {object} opts   { max, axis, scale }
 */
export function useParallax(speed = 0.2, opts = {}) {
    const { max = 220, axis = 'y', scale = 0 } = opts;
    const ref = useRef(null);

    useEffect(() => {
        const el = ref.current;
        if (!el || prefersReduced()) return;
        const host = el.parentElement || el;

        const update = (vh) => {
            const rect = host.getBoundingClientRect();
            if (rect.bottom < -vh || rect.top > vh * 2) return;
            const center = rect.top + rect.height / 2;
            const progress = (center - vh / 2) / vh; // ≈ -1 .. 1
            const value = Math.max(-max, Math.min(max, -progress * speed * 100));
            const s = scale ? 1 + Math.min(scale, Math.abs(progress) * scale) : 1;
            const ty = axis === 'y' || axis === 'both' ? value : 0;
            const tx = axis === 'x' || axis === 'both' ? value : 0;
            el.style.transform = `translate3d(${tx}px, ${ty}px, 0)${scale ? ` scale(${s})` : ''}`;
        };

        update(window.innerHeight);
        return subscribe(update);
    }, [speed, max, axis, scale]);

    return ref;
}

/**
 * ParallaxLayer — absolutely positioned child that floats inside a
 * `.hm-parallax` host.
 */
export function ParallaxLayer({
    speed = 0.2,
    max = 220,
    axis = 'y',
    className = '',
    style,
    children,
    ...rest
}) {
    const ref = useParallax(speed, { max, axis });
    return (
        <div ref={ref} className={`hm-parallax__layer ${className}`} style={style} {...rest}>
            {children}
        </div>
    );
}

/**
 * ParallaxImage — background image that drifts (classic depth cue).
 */
export function ParallaxImage({
    src,
    speed = 0.18,
    max = 180,
    className = '',
    style,
    overlay = 'linear-gradient(180deg, rgba(10,11,14,.35) 0%, rgba(10,11,14,.15) 45%, rgba(10,11,14,.78) 100%)',
}) {
    const ref = useParallax(speed, { max });
    return (
        <div
            ref={ref}
            className={`hm-parallax__media ${className}`}
            style={{
                backgroundImage: overlay ? `${overlay}, url(${src})` : `url(${src})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                ...style,
            }}
        />
    );
}

/**
 * Reveal — fade/slide element in when it enters the viewport.
 */
export function Reveal({ children, delay = 0, className = '', as: Tag = 'div', once = true, ...rest }) {
    const ref = useRef(null);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        if (prefersReduced() || typeof IntersectionObserver === 'undefined') {
            el.classList.add('is-in');
            return;
        }
        const io = new IntersectionObserver(
            (entries) => {
                entries.forEach((e) => {
                    if (e.isIntersecting) {
                        el.classList.add('is-in');
                        if (once) io.unobserve(el);
                    } else if (!once) {
                        el.classList.remove('is-in');
                    }
                });
            },
            { threshold: 0.14, rootMargin: '0px 0px -7% 0px' }
        );
        io.observe(el);
        return () => io.disconnect();
    }, [once]);

    const delayClass = delay ? `hm-reveal-delay-${delay}` : '';
    return (
        <Tag ref={ref} className={`hm-reveal ${delayClass} ${className}`.trim()} {...rest}>
            {children}
        </Tag>
    );
}

/**
 * Hero — full-bleed parallax hero for inner pages.
 * Layers: background image (slow) → content (fast) + optional floating chips.
 */
export function Hero({
    image,
    imageSpeed = 0.16,
    eyebrow,
    title,
    subtitle,
    actions,
    height = '80vh',
    minHeight = 520,
    overlay,
    kickerIcon,
    children,
    align = 'left',
    contentClassName = '',
}) {
    return (
        <section
            className="hm-parallax"
            style={{ minHeight, height, display: 'flex', alignItems: 'center' }}
        >
            {image && <ParallaxImage src={image} speed={imageSpeed} overlay={overlay} />}
            {image && <div className="hm-vignette" />}
            {image && <div className="hm-noise" />}

            <div
                className={`hm-parallax__content hm-container w-100 ${contentClassName}`}
                style={{ textAlign: align }}
            >
                <Reveal>
                    {eyebrow && (
                        <span className="hm-kicker" style={{ justifyContent: align === 'center' ? 'center' : 'flex-start' }}>
                            {kickerIcon && <i className={kickerIcon} />} {eyebrow}
                        </span>
                    )}
                </Reveal>
                {title && (
                    <Reveal delay={1}>
                        <h1 className="hm-title hm-display mt-3 mb-3">{title}</h1>
                    </Reveal>
                )}
                {subtitle && (
                    <Reveal delay={2}>
                        <p className="hm-lead mb-4" style={{ maxWidth: 640, color: 'rgba(255,255,255,.82)', marginLeft: align === 'center' ? 'auto' : 0, marginRight: align === 'center' ? 'auto' : 0 }}>
                            {subtitle}
                        </p>
                    </Reveal>
                )}
                {actions && (
                    <Reveal delay={3}>
                        <div className="d-flex flex-wrap gap-3" style={{ justifyContent: align === 'center' ? 'center' : 'flex-start' }}>
                            {actions}
                        </div>
                    </Reveal>
                )}
                {children}
            </div>
        </section>
    );
}

/**
 * SectionHeading — consistent parallax-style section intros.
 */
export function SectionHeading({ eyebrow, title, lead, align = 'left', light = false, className = '' }) {
    return (
        <div className={`mb-4 mb-md-5 ${className}`} style={{ textAlign: align, maxWidth: align === 'center' ? 720 : 680, marginLeft: align === 'center' ? 'auto' : 0, marginRight: align === 'center' ? 'auto' : 0 }}>
            <Reveal>
                <span className="hm-kicker" style={{ justifyContent: align === 'center' ? 'center' : 'flex-start' }}>
                    {eyebrow}
                </span>
            </Reveal>
            {title && (
                <Reveal delay={1}>
                    <h2 className="hm-display mt-3 mb-3" style={{ fontWeight: 800, fontSize: 'clamp(1.6rem, 3.4vw, 2.7rem)', color: light ? '#fff' : 'inherit' }}>
                        {title}
                    </h2>
                </Reveal>
            )}
            {lead && (
                <Reveal delay={2}>
                    <p className={light ? '' : 'hm-lead'} style={{ color: light ? 'rgba(255,255,255,.72)' : undefined, marginBottom: 0 }}>
                        {lead}
                    </p>
                </Reveal>
            )}
        </div>
    );
}

/**
 * Marquee — infinite scrolling brand strip.
 */
export function Marquee({ items = [], className = '' }) {
    const row = (
        <div className="hm-marquee__track" aria-hidden="true">
            {items.map((it, i) => (
                <span key={i} className="hm-display" style={{ fontSize: 'clamp(1.2rem, 3vw, 2.4rem)', fontWeight: 700, color: 'rgba(255,255,255,.22)', whiteSpace: 'nowrap' }}>
                    {it}
                </span>
            ))}
        </div>
    );
    return (
        <div className={`hm-marquee ${className}`}>
            {row}
            {row}
        </div>
    );
}

export default { useParallax, ParallaxLayer, ParallaxImage, Reveal, Hero, SectionHeading, Marquee };
