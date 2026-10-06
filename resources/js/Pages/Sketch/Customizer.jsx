import { useState } from 'react';
import { Link } from '@inertiajs/react';
import SketchLayout, { fmt } from '../../Components/Sketch/SketchLayout';

function Swatch({ v, active, onClick }) {
    return (
        <button onClick={onClick} className="d-flex align-items-center flex-grow-1 p-2 rounded text-left position-relative"
            style={{
                background: active ? '#fff4e4' : '#faf8f4',
                border: active ? '2px solid #a7671f' : '1px solid #e3ddd2',
                minHeight: 68,
            }}>
            {v.c && (
                <span className="mr-2 flex-shrink-0" style={{
                    width: 38, height: 38, borderRadius: '50%',
                    background: v.c, border: active ? '3px solid #a7671f' : '2px solid #cac6bf',
                    boxShadow: 'inset 0 0 12px rgba(0,0,0,0.35)'
                }}></span>
            )}
            <div className="flex-grow-1">
                <div style={{ fontSize: 12.5, fontWeight: active ? 800 : 600 }}>{v.n}</div>
                <div style={{ fontSize: 11, color: v.p ? '#c64400' : '#6e685f', fontWeight: 700 }}>
                    {v.p ? `+ ${fmt(v.p)}` : <span style={{ color: '#2e7d32' }}>Standard (tanpa tambah)</span>}
                </div>
            </div>
            {active && (
                <span className="position-absolute badge badge-success" style={{ top: 6, right: 6, fontSize: 10 }}>
                    <i className="fas fa-check"></i>
                </span>
            )}
        </button>
    );
}

export default function Customizer({ model, elements }) {
    const defaults = Object.fromEntries(elements.map(e => [e.slug, 0]));
    const [sel, setSel] = useState(defaults);
    const [activeEl, setActiveEl] = useState(elements[0].slug);

    const addOns = elements.reduce((t, e) => t + (e.defaults[sel[e.slug]]?.p || 0), 0);
    const total = model.price + addOns;
    const activeElement = elements.find(e => e.slug === activeEl);
    const summaryStr = elements.map(e => `${e.label.split(' ')[0]}: ${e.defaults[sel[e.slug]].n}`).join(' · ');

    return (
        <SketchLayout title={`Custom ${model.name} — ShoeShop`} active="Custom"
            breadcrumb={[
                { label: 'Home', href: '/sketch/home', done: true },
                { label: 'Pilih Model', href: '/sketch/custom', done: true },
                { label: `Custom ${model.name}`, active: true },
                { label: 'Preview Konfigurasi' },
                { label: 'Ukuran' },
                { label: 'Keranjang' },
                { label: 'Checkout' },
            ]}>
            <div className="container-fluid py-4">
                <div className="row mb-3">
                    <div className="col">
                        <span className="badge badge-warning text-dark font-weight-bold px-3 py-1 mb-1">
                            CUSTOMIZER · LANGKAH 2 dari 6
                        </span>
                        <h2 style={{ fontWeight: 900 }} className="mb-0">
                            Custom {model.name}
                            <span className="ml-3 text-industrial-500 font-weight-bold" style={{ fontSize: 16 }}>
                                <i className="fas fa-circle-info mr-1"></i> Pilih detail 8 elemen di bawah. Harga realtime!
                            </span>
                        </h2>
                    </div>
                </div>

                <div className="row">
                    <div className="col-lg-7 mb-4">
                        <div className="card border-0 shadow-sm h-100">
                            <div className="card-header d-flex justify-content-between align-items-center"
                                style={{ background: '#181714', color: '#fff', borderRadius: '6px 6px 0 0' }}>
                                <div>
                                    <b style={{ fontSize: 15 }}><i className="fas fa-eye mr-2 text-warning"></i> Preview Visual (SKETCH — nanti 3D 360°)</b>
                                </div>
                                <div className="badge badge-warning text-dark font-weight-bold">
                                    <i className="fas fa-sync-alt mr-1"></i> 360° · Zoom · Lihat Sol Bawah
                                </div>
                            </div>
                            <div className="p-0 position-relative" style={{ minHeight: 480, background: `linear-gradient(135deg, ${model.color}22, #fff9ef)` }}>
                                <div className="position-absolute bottom-3 left-3 badge badge-dark px-2 py-1" style={{ fontSize: 11, zIndex: 2 }}>
                                    <i className="fas fa-hand mr-1"></i> Drag rotate · Scroll zoom
                                </div>
                                <div className="position-absolute top-3 right-3 badge badge-dark px-2 py-1" style={{ fontSize: 11, zIndex: 2 }}>
                                    Base {model.name} · {summaryStr.length > 50 ? summaryStr.slice(0, 48) + '…' : summaryStr}
                                </div>

                                <div className="d-flex align-items-center justify-content-center flex-column" style={{ minHeight: 480 }}>
                                    <i className={`fas ${model.icon}`} style={{
                                        fontSize: 220,
                                        color: elements[0].defaults[sel[elements[0].slug]].c || model.color,
                                        opacity: .65,
                                        textShadow: '0 18px 40px rgba(0,0,0,0.25)'
                                    }}></i>
                                    <div className="mt-3 px-4 py-2 rounded" style={{ background: '#181714cc', color: '#fff', fontSize: 12 }}>
                                        Placeholder 3D Model — Final akan pakai WebGL 360° (atau 2D layer jika butuh fallback cepat)
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-5 mb-4">
                        <div className="sticky-top" style={{ top: 10 }}>
                            <div className="card border-0 shadow-sm mb-3">
                                <div className="card-header" style={{ background: '#f9f6f1', fontWeight: 800 }}>
                                    <i className="fas fa-list-ol mr-2 text-warning"></i> 8 Elemen yang Bisa di-Ubah
                                </div>
                                <div className="d-flex flex-wrap p-2 gap-1">
                                    {elements.map(e => {
                                        const isA = activeEl === e.slug;
                                        return (
                                            <button key={e.slug} onClick={() => setActiveEl(e.slug)}
                                                className="btn btn-sm px-2 py-2"
                                                style={{
                                                    fontWeight: isA ? 800 : 600,
                                                    fontSize: 12,
                                                    background: isA ? '#181714' : '#fff',
                                                    color: isA ? '#ffb74d' : '#181714',
                                                    border: isA ? '2px solid #a7671f' : '1px solid #e3ddd2'
                                                }}>
                                                <i className={`fas ${e.icon} mr-1`}></i> {e.label}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="card border-0 shadow-sm mb-3">
                                <div className="card-header d-flex justify-content-between align-items-center" style={{ background: '#fff4e4', borderBottom: '1px solid #ffd080' }}>
                                    <span style={{ fontWeight: 800 }}>
                                        <i className={`fas ${activeElement.icon} mr-2 text-warning`}></i>
                                        {activeElement.label}
                                    </span>
                                    <span className="badge badge-dark">Pilihan ke-{elements.map(e => e.slug).indexOf(activeEl) + 1} / 8</span>
                                </div>
                                <div className="card-body d-flex flex-column gap-2">
                                    {activeElement.defaults.map((v, i) => (
                                        <Swatch key={i} v={v} active={sel[activeEl] === i}
                                            onClick={() => setSel(s => ({ ...s, [activeEl]: i }))} />
                                    ))}
                                </div>
                            </div>

                            <div className="card border-0 shadow">
                                <div className="card-body" style={{ background: '#181714', color: '#fff', borderRadius: 6 }}>
                                    <div className="mb-2">
                                        <div className="d-flex justify-content-between mb-1" style={{ fontSize: 13, color: '#cac6bf' }}>
                                            <span>Base {model.name}</span>
                                            <span>{fmt(model.price)}</span>
                                        </div>
                                        {elements.filter(e => e.defaults[sel[e.slug]].p > 0).map(e => (
                                            <div key={e.slug} className="d-flex justify-content-between mb-1" style={{ fontSize: 13, color: '#ffd89a' }}>
                                                <span>+ {e.defaults[sel[e.slug]].n} ({e.label})</span>
                                                <span>+ {fmt(e.defaults[sel[e.slug]].p)}</span>
                                            </div>
                                        ))}
                                        <div className="border-top border-dark mt-2 pt-2 d-flex justify-content-between align-items-end">
                                            <span style={{ fontSize: 13, color: '#cac6bf' }}>TOTAL (sebelum ongkir)</span>
                                            <div style={{ color: '#ffb74d', fontWeight: 900, fontSize: 26, lineHeight: 1 }}>
                                                {fmt(total)}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="d-flex gap-2 mt-4">
                                        <button onClick={() => setSel(defaults)} className="btn btn-sm"
                                            style={{ background: '#ffffff14', color: '#fff', border: '1px solid #ffffff28' }}>
                                            <i className="fas fa-rotate-left mr-1"></i> Reset
                                        </button>
                                        <Link href="/sketch/custom" className="btn btn-sm"
                                            style={{ background: '#ffffff14', color: '#fff', border: '1px solid #ffffff28' }}>
                                            <i className="fas fa-shoe-forms mr-1"></i> Ganti Model
                                        </Link>
                                        <Link href={`/sketch/custom/${model.slug}/preview`} className="btn btn-sm flex-grow-1 text-dark font-weight-bold"
                                            style={{ background: '#ffb74d' }}>
                                            Review Konfigurasi <i className="fas fa-arrow-right ml-2"></i>
                                        </Link>
                                    </div>
                                    <div className="mt-2 text-center" style={{ fontSize: 11, color: '#a8a298' }}>
                                        <i className="fas fa-clock mr-1"></i> Estimasi produksi ± 7 hari · DP 50% di checkout
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </SketchLayout>
    );
}
