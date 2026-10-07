import { useMemo, useState } from 'react';
import { Link } from '@inertiajs/react';
import SketchLayout, { fmt } from '../../Components/Sketch/SketchLayout';
import { Reveal } from '../../Components/Parallax/index.jsx';
import Shoe3DStage, { useSyncShoeStore } from '../../Components/Sketch/Shoe3DStage';

const ELEMENT_ICONS = {
    'kulit': 'fa-cowhide',
    'benang-kulit': 'fa-wand-magic-sparkles',
    'benang-outsole': 'fa-diagram-project',
    'eyelet': 'fa-screwdriver-wrench',
    'panel-chelsea': 'fa-angles-left-right',
    'tali': 'fa-link',
    'storm-welt': 'fa-water',
    'outsole': 'fa-shoe-prints',
};

function OptionRow({ v, active, onClick }) {
    return (
        <button onClick={onClick} className={`hm-option-chip mb-2 ${active ? 'is-active' : ''}`}>
            {v.c && (
                <span className="flex-shrink-0" style={{
                    width: 30, height: 30, borderRadius: '50%',
                    background: v.c, border: active ? '2px solid var(--hm-brass)' : '2px solid rgba(255,255,255,.25)',
                    boxShadow: 'inset 0 -4px 8px rgba(0,0,0,.4)',
                }} />
            )}
            <span className="flex-grow-1">
                <span className="d-block" style={{ fontSize: 13, fontWeight: active ? 700 : 600 }}>{v.n}</span>
                <span className="d-block hm-mono" style={{ fontSize: 10.5, color: v.p ? 'var(--hm-brass-2)' : 'rgba(255,255,255,.5)' }}>
                    {v.p ? `+ ${fmt(v.p)}` : 'STANDARD'}
                </span>
            </span>
            {active && <i className="fas fa-check" style={{ color: 'var(--hm-brass)' }} />}
        </button>
    );
}

export default function Customizer({ model, elements }) {
    const defaults = useMemo(() => Object.fromEntries(elements.map(e => [e.slug, 0])), [elements]);
    const [sel, setSel] = useState(defaults);
    const [activeEl, setActiveEl] = useState(elements[0].slug);

    useSyncShoeStore(elements, sel, model);

    const addOns = elements.reduce((t, e) => t + (e.defaults[sel[e.slug]]?.p || 0), 0);
    const total = model.price + addOns;
    const activeElement = elements.find(e => e.slug === activeEl) || elements[0];
    const summary = elements.map(e => e.defaults[sel[e.slug]]?.n).filter(Boolean).join(' · ');

    return (
        <SketchLayout title={`Custom ${model.name} — SHOESHOP.ID`} active="Custom"
            breadcrumb={[
                { label: 'Home', href: '/sketch/home', done: true },
                { label: 'Pilih Model', href: '/sketch/custom', done: true },
                { label: `Custom ${model.name}`, active: true },
                { label: 'Review' },
                { label: 'Ukuran' },
                { label: 'Checkout' },
            ]}>
            <section style={{ background: '#f7f3ec' }}>
                <div className="hm-container py-4 py-md-5">
                    <Reveal>
                        <div className="d-flex flex-wrap justify-content-between align-items-end mb-4">
                            <div>
                                <span className="hm-kicker"><i className="fas fa-sliders mr-2" /> Customizer · Langkah 2 dari 6</span>
                                <h1 className="hm-display mt-2 mb-1" style={{ fontWeight: 800, fontSize: 'clamp(1.7rem,3.6vw,2.6rem)' }}>
                                    Custom <span className="accent">{model.name}</span>
                                </h1>
                                <p className="mb-0" style={{ fontSize: 14, color: '#6b665d' }}>
                                    Ubah delapan elemen, lihat model 3D-nya berubah realtime.
                                </p>
                            </div>
                            <Link href="/sketch/custom" className="hm-btn hm-btn-outline-dark mb-2">
                                <i className="fas fa-shuffle" /> Ganti Model
                            </Link>
                        </div>
                    </Reveal>

                    <div className="row">
                        {/* 3D STAGE */}
                        <div className="col-lg-7 mb-4">
                            <Reveal>
                                <div className="hm-panel p-2" style={{ background: '#0e1015', border: '1px solid rgba(201,169,98,.25)' }}>
                                    <Shoe3DStage glb={model.glb} slug={model.slug} model={model.slug} height={560} />
                                    <div className="d-flex flex-wrap justify-content-between align-items-center px-3 py-3" style={{ borderTop: '1px solid rgba(255,255,255,.08)' }}>
                                        <div className="hm-mono" style={{ fontSize: 10.5, letterSpacing: '.1em', color: 'rgba(255,255,255,.55)', textTransform: 'uppercase' }}>
                                            {model.name} · {elements.filter(e => e.defaults[sel[e.slug]]?.p > 0).length} upgrade
                                        </div>
                                        <div className="text-right">
                                            <div className="hm-mono" style={{ fontSize: 10, color: 'rgba(255,255,255,.5)', letterSpacing: '.16em' }}>TOTAL</div>
                                            <div className="hm-display" style={{ color: 'var(--hm-brass-2)', fontWeight: 800, fontSize: 24, lineHeight: 1 }}>{fmt(total)}</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-2 hm-mono" style={{ fontSize: 11, color: '#8a857b' }}>
                                    <i className="fas fa-circle-info mr-1" /> {summary.length > 90 ? summary.slice(0, 88) + '…' : summary}
                                </div>
                            </Reveal>
                        </div>

                        {/* PANEL */}
                        <div className="col-lg-5 mb-4">
                            <Reveal delay={1}>
                                <div className="hm-panel p-3 mb-3">
                                    <div className="hm-mono mb-2" style={{ fontSize: 10.5, letterSpacing: '.16em', textTransform: 'uppercase', color: '#8a857b' }}>
                                        <i className="fas fa-list-ol mr-2" /> Pilih elemen
                                    </div>
                                    <div className="d-flex flex-wrap gap-2">
                                        {elements.map(e => {
                                            const isA = activeEl === e.slug;
                                            const hasUp = e.defaults[sel[e.slug]]?.p > 0;
                                            return (
                                                <button key={e.slug} onClick={() => setActiveEl(e.slug)}
                                                    className="btn btn-sm px-3 py-2"
                                                    style={{
                                                        fontWeight: isA ? 700 : 600, fontSize: 12.5, borderRadius: 4,
                                                        background: isA ? 'var(--hm-navy)' : '#fff',
                                                        color: isA ? '#fff' : '#14161c',
                                                        border: isA ? '1px solid var(--hm-navy)' : '1px solid rgba(20,22,28,.14)',
                                                    }}>
                                                    <i className={`fas ${ELEMENT_ICONS[e.slug] || 'fa-circle-dot'} mr-2`} style={{ color: isA ? 'var(--hm-brass-2)' : 'var(--hm-brass)' }} />
                                                    {e.label}
                                                    {hasUp && <i className="fas fa-circle ml-2" style={{ fontSize: 5, verticalAlign: 'middle', color: 'var(--hm-brass)' }} />}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </Reveal>

                            <Reveal delay={2}>
                                <div className="hm-panel p-4">
                                    <div className="d-flex align-items-center justify-content-between mb-3">
                                        <span className="font-weight-bold">
                                            <i className={`fas ${ELEMENT_ICONS[activeElement.slug] || 'fa-circle-dot'} mr-2`} style={{ color: 'var(--hm-brass)' }} />
                                            {activeElement.label}
                                        </span>
                                        <span className="hm-mono" style={{ fontSize: 10.5, color: '#8a857b' }}>
                                            {elements.map(e => e.slug).indexOf(activeEl) + 1} / {elements.length}
                                        </span>
                                    </div>
                                    <div style={{ background: '#14161c', padding: 12, borderRadius: 8, maxHeight: 320, overflowY: 'auto' }}>
                                        {activeElement.defaults.map((v, i) => (
                                            <OptionRow key={i} v={v} active={sel[activeEl] === i}
                                                onClick={() => setSel(s => ({ ...s, [activeEl]: i }))} />
                                        ))}
                                    </div>

                                    <hr className="hm-rule my-4" />

                                    <div style={{ fontSize: 13 }}>
                                        <div className="d-flex justify-content-between mb-1" style={{ color: '#6b665d' }}>
                                            <span>Base {model.name}</span><span>{fmt(model.price)}</span>
                                        </div>
                                        {elements.filter(e => e.defaults[sel[e.slug]]?.p > 0).map(e => (
                                            <div key={e.slug} className="d-flex justify-content-between mb-1" style={{ color: '#a9822f' }}>
                                                <span>+ {e.defaults[sel[e.slug]].n}</span><span>+ {fmt(e.defaults[sel[e.slug]].p)}</span>
                                            </div>
                                        ))}
                                        <div className="d-flex justify-content-between align-items-end border-top mt-3 pt-3" style={{ borderColor: 'rgba(20,22,28,.1)' }}>
                                            <span className="hm-mono" style={{ fontSize: 10.5, letterSpacing: '.12em', color: '#6b665d' }}>TOTAL SEBELUM ONGKIR</span>
                                            <span className="hm-display" style={{ fontWeight: 800, fontSize: 26, color: '#14161c' }}>{fmt(total)}</span>
                                        </div>
                                    </div>

                                    <div className="d-flex gap-2 mt-4">
                                        <button onClick={() => setSel(defaults)} className="hm-btn hm-btn-outline-dark" style={{ padding: '11px 16px' }}>
                                            <i className="fas fa-rotate-left" /> Reset
                                        </button>
                                        <Link href={`/sketch/custom/${model.slug}/preview`} className="hm-btn hm-btn-gold flex-grow-1">
                                            Review Konfigurasi <i className="fas fa-arrow-right" />
                                        </Link>
                                    </div>
                                    <div className="text-center mt-2 hm-mono" style={{ fontSize: 10.5, color: '#8a857b' }}>
                                        <i className="fas fa-clock mr-1" /> Produksi ± 7 hari · DP 50% saat checkout
                                    </div>
                                </div>
                            </Reveal>
                        </div>
                    </div>
                </div>
            </section>
        </SketchLayout>
    );
}
