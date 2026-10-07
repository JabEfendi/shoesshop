import { Link } from '@inertiajs/react';
import SketchLayout, { fmt } from '../../Components/Sketch/SketchLayout';
import { Reveal, ParallaxImage } from '../../Components/Parallax/index.jsx';

export default function ProductDetail({ product }) {
    const gallery = product.gallery || [product.image].filter(Boolean);

    return (
        <SketchLayout title={`${product.name} — Preset Detail`} active="Shop"
            breadcrumb={[
                { label: 'Home', href: '/sketch/home', done: true },
                { label: 'Shop Preset', href: '/sketch/shop', done: true },
                { label: product.name, active: true },
            ]}>
            <section style={{ background: '#f7f3ec', padding: 'clamp(40px,6vw,72px) 0' }}>
                <div className="hm-container">
                    <div className="row">
                        {/* GALLERY */}
                        <div className="col-lg-7 mb-4">
                            <Reveal>
                                <div className="hm-parallax position-relative" style={{ height: 500, borderRadius: 10, overflow: 'hidden', boxShadow: 'var(--hm-shadow)' }}>
                                    <ParallaxImage src={product.image} speed={0.14} overlay="linear-gradient(180deg, rgba(12,13,17,.06), rgba(12,13,17,.4))" />
                                    <span className="hm-tag hm-tag-dark position-absolute" style={{ top: 16, left: 16, zIndex: 6 }}>
                                        <i className="fas fa-camera" /> Preset View
                                    </span>
                                </div>
                            </Reveal>
                            <div className="row mt-2">
                                {gallery.slice(0, 3).map((g, i) => (
                                    <div key={i} className="col-4">
                                        <Reveal delay={i + 1}>
                                            <div style={{ height: 110, borderRadius: 8, overflow: 'hidden', border: '1px solid rgba(20,22,28,.08)' }}>
                                                <img src={g} alt={`${product.name} ${i}`} className="hm-img-cover" />
                                            </div>
                                        </Reveal>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* INFO */}
                        <div className="col-lg-5">
                            <Reveal delay={1}>
                                <span className="hm-tag"><i className="fas fa-check" /> Preset Edition · tanpa custom</span>
                                <h1 className="hm-display mt-3 mb-2" style={{ fontWeight: 800, fontSize: 'clamp(1.7rem,3.6vw,2.5rem)' }}>
                                    {product.name} <span className="accent">(Classic)</span>
                                </h1>
                                <div className="hm-display mb-3" style={{ color: '#a9822f', fontWeight: 900, fontSize: 30 }}>
                                    {fmt(product.price)}
                                </div>
                                <p style={{ color: '#55524c', lineHeight: 1.75 }}>{product.desc}. Versi preset desain jadi — langsung pilih ukuran & checkout. Ingin ubah warna kulit, tali, atau sole? Buka di customizer.</p>
                            </Reveal>

                            <Reveal delay={2}>
                                <div className="hm-panel p-4 mt-4">
                                    <div className="hm-mono mb-3" style={{ fontSize: 10.5, letterSpacing: '.16em', textTransform: 'uppercase', color: '#8a857b' }}>
                                        <i className="fas fa-list-check mr-2" /> Yang kamu dapat
                                    </div>
                                    <ul className="list-unstyled mb-0" style={{ fontSize: 13.5, lineHeight: 2.1 }}>
                                        {product.highlights.map(h => (
                                            <li key={h}><i className="fas fa-check mr-2" style={{ color: '#4a7c59', fontSize: 11 }} />{h}</li>
                                        ))}
                                        <li><i className="fas fa-clock mr-2" style={{ color: '#a9822f', fontSize: 11 }} />Estimasi pengerjaan: <b>{product.lead_time}</b></li>
                                        <li><i className="fas fa-shield-halved mr-2" style={{ color: '#a9822f', fontSize: 11 }} />Garansi 3 hari (wajib video unboxing)</li>
                                        <li><i className="fas fa-gift mr-2" style={{ color: '#a9822f', fontSize: 11 }} />Include shoe bag + care kit</li>
                                    </ul>
                                </div>
                            </Reveal>

                            <Reveal delay={3}>
                                <div className="mt-4">
                                    <div className="hm-mono mb-2" style={{ fontSize: 10.5, letterSpacing: '.14em', color: '#8a857b' }}>
                                        <i className="fas fa-ruler mr-1" /> PILIH UKURAN · EU
                                    </div>
                                    <div className="d-flex flex-wrap gap-2">
                                        {product.sizes.map(sz => (
                                            <button key={sz} className="hm-btn" style={{
                                                padding: '9px 16px', fontSize: 13, minWidth: 52,
                                                background: sz === 42 ? '#14161c' : '#fff',
                                                color: sz === 42 ? 'var(--hm-brass-2)' : '#14161c',
                                                border: sz === 42 ? '1px solid var(--hm-brass)' : '1px solid rgba(20,22,28,.18)',
                                            }}>{sz}</button>
                                        ))}
                                    </div>
                                    <Link href="/sketch/sizing" className="d-inline-block mt-2" style={{ fontSize: 12.5, color: '#a9822f' }}>
                                        <i className="fas fa-ruler-combined mr-1" /> Bingung ukuran? Lihat size chart & upload kaki
                                    </Link>
                                </div>

                                <div className="d-flex flex-wrap gap-2 mt-4">
                                    <Link href="/sketch/cart" className="hm-btn hm-btn-gold flex-grow-1">
                                        <i className="fas fa-cart-shopping" /> Tambah ke Keranjang
                                    </Link>
                                    <Link href={`/sketch/custom/${product.slug}`} className="hm-btn hm-btn-outline-dark flex-grow-1">
                                        <i className="fas fa-sliders" /> Custom dari Preset Ini
                                    </Link>
                                </div>
                                <div className="mt-3 p-3 hm-mono" style={{ fontSize: 11.5, color: '#55524c', background: 'rgba(201,169,98,.1)', borderRadius: 6 }}>
                                    <i className="fas fa-circle-info mr-1" style={{ color: '#a9822f' }} /> DP 50% di awal, pelunasan setelah sepatu jadi.
                                </div>
                            </Reveal>
                        </div>
                    </div>
                </div>
            </section>
        </SketchLayout>
    );
}
