import { Link } from '@inertiajs/react';
import SketchLayout, { fmt } from '../../Components/Sketch/SketchLayout';
import { Reveal } from '../../Components/Parallax/index.jsx';

export default function Cart({ items, subtotal }) {
    return (
        <SketchLayout title="Keranjang — SHOESHOP.ID" active="Home"
            breadcrumb={[
                { label: 'Home', href: '/sketch/home', done: true },
                { label: 'Pilih Model', href: '/sketch/custom', done: true },
                { label: 'Custom Detail', href: '/sketch/custom/boots', done: true },
                { label: 'Review', href: '/sketch/custom/boots/preview', done: true },
                { label: 'Pilih Ukuran', href: '/sketch/sizing', done: true },
                { label: 'Keranjang', active: true },
                { label: 'Checkout' },
            ]}>
            <section style={{ background: '#f7f3ec', padding: 'clamp(40px,6vw,72px) 0' }}>
                <div className="hm-container">
                    <div className="d-flex flex-wrap justify-content-between align-items-end mb-4">
                        <Reveal>
                            <span className="hm-kicker"><i className="fas fa-cart-shopping mr-2" /> Langkah 5 dari 6</span>
                            <h1 className="hm-display mt-2 mb-0" style={{ fontWeight: 800, fontSize: 'clamp(1.6rem,3.4vw,2.4rem)' }}>Review Keranjang</h1>
                        </Reveal>
                        <Reveal delay={1}>
                            <Link href="/sketch/shop" className="hm-btn hm-btn-outline-dark mb-2"><i className="fas fa-plus" /> Tambah Produk</Link>
                        </Reveal>
                    </div>

                    <div className="row">
                        <div className="col-lg-8 mb-4">
                            {items.map((it, idx) => (
                                <Reveal key={it.id} delay={(idx % 3) + 1}>
                                    <div className="hm-panel p-4 mb-3">
                                        <div className="row align-items-center">
                                            <div className="col-3 col-lg-2">
                                                <div className="d-flex align-items-center justify-content-center rounded" style={{ minHeight: 76, background: '#14161c' }}>
                                                    <i className={`fas ${it.type === 'custom' ? 'fa-sliders' : 'fa-store'}`} style={{ fontSize: 30, color: 'var(--hm-brass)' }} />
                                                </div>
                                            </div>
                                            <div className="col-9 col-lg-6">
                                                <div className="d-flex align-items-center gap-2 mb-1">
                                                    {it.type === 'custom'
                                                        ? <span className="hm-tag"><i className="fas fa-sliders" /> Custom</span>
                                                        : <span className="hm-tag"><i className="fas fa-check" /> Preset</span>}
                                                    <b style={{ fontSize: 15 }}>{it.name}</b>
                                                </div>
                                                <div style={{ fontSize: 12.5, color: '#6b665d' }} className="mb-2">{it.variant_summary}</div>
                                                <div className="d-flex align-items-center gap-3" style={{ fontSize: 13 }}>
                                                    <span className="hm-tag">Size EU {it.size}</span>
                                                    <span style={{ color: '#6b665d' }}>Qty:</span>
                                                    <div className="d-flex align-items-center" style={{ border: '1px solid rgba(20,22,28,.16)', borderRadius: 5 }}>
                                                        <button className="btn btn-sm py-0 px-2">−</button>
                                                        <span className="px-3 py-1 font-weight-bold">{it.qty}</span>
                                                        <button className="btn btn-sm py-0 px-2">+</button>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-lg-4 mt-2 mt-lg-0 text-right">
                                                <div style={{ fontSize: 12, color: '#8a857b' }}>
                                                    Base {fmt(it.base_price)}{it.add_ons > 0 && <span> + add-ons {fmt(it.add_ons)}</span>}
                                                </div>
                                                <div className="hm-display" style={{ color: '#a9822f', fontWeight: 800, fontSize: 21 }}>{fmt(it.unit_total)}</div>
                                                <button className="btn btn-sm text-danger mt-1" style={{ fontSize: 12 }}><i className="fas fa-trash mr-1" /> Hapus</button>
                                            </div>
                                        </div>
                                    </div>
                                </Reveal>
                            ))}
                            <div className="p-3 hm-mono" style={{ fontSize: 11.5, background: 'rgba(201,169,98,.1)', borderRadius: 8, color: '#55524c' }}>
                                <i className="fas fa-shield-halved mr-1" style={{ color: '#a9822f' }} />
                                Saat checkout kamu bayar DP 50% saja. Sisa 50% dibayar setelah sepatu selesai produksi.
                            </div>
                        </div>

                        <div className="col-lg-4">
                            <Reveal delay={1}>
                                <div className="hm-panel p-4" style={{ position: 'sticky', top: 90 }}>
                                    <h6 className="hm-display mb-3" style={{ fontWeight: 800 }}><i className="fas fa-sack-dollar mr-2" style={{ color: '#a9822f' }} />Ringkasan Harga</h6>
                                    <div className="d-flex justify-content-between mb-1" style={{ fontSize: 14 }}>
                                        <span>Subtotal ({items.length} item)</span><b>{fmt(subtotal)}</b>
                                    </div>
                                    <div className="d-flex justify-content-between mb-1" style={{ fontSize: 13, color: '#6b665d' }}>
                                        <span><i className="fas fa-truck mr-1" /> Ongkir</span><span>Pilih di Checkout</span>
                                    </div>
                                    <div className="d-flex justify-content-between align-items-end border-top mt-3 pt-3" style={{ borderColor: 'rgba(20,22,28,.1)' }}>
                                        <span className="font-weight-bold">Estimasi Total</span>
                                        <span className="hm-display" style={{ color: '#a9822f', fontWeight: 800, fontSize: 24 }}>{fmt(subtotal)}</span>
                                    </div>

                                    <div className="mt-4 p-3" style={{ background: '#101218', borderRadius: 8 }}>
                                        <div className="hm-mono mb-2" style={{ fontSize: 10.5, letterSpacing: '.12em', color: 'rgba(255,255,255,.6)' }}>DIBAYAR SEKARANG (DP 50%)</div>
                                        <div className="hm-display" style={{ color: 'var(--hm-brass-2)', fontWeight: 800, fontSize: 24 }}>{fmt(Math.round(subtotal * 0.5))}</div>
                                        <div style={{ fontSize: 11, color: 'rgba(255,255,255,.5)' }} className="mt-1">
                                            Sisa {fmt(Math.round(subtotal * 0.5))} setelah sepatu jadi.
                                        </div>
                                    </div>

                                    <div className="d-flex gap-2 mt-4">
                                        <Link href="/sketch/sizing" className="hm-btn hm-btn-outline-dark" style={{ padding: '11px 16px' }}><i className="fas fa-arrow-left" /></Link>
                                        <Link href="/sketch/checkout" className="hm-btn hm-btn-gold flex-grow-1">Checkout <i className="fas fa-arrow-right" /></Link>
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
