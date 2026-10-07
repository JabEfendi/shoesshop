import { Link } from '@inertiajs/react';
import SketchLayout, { fmt } from '../../Components/Sketch/SketchLayout';
import { Hero, Reveal, ParallaxImage, SectionHeading } from '../../Components/Parallax/index.jsx';

export default function Shop({ presets }) {
    const heroImg = presets?.[2]?.image || presets?.[0]?.image || '/assets/images/products/pantofel/PANTOFEL.jpeg';

    return (
        <SketchLayout title="Shop Preset — SHOESHOP.ID" active="Shop"
            breadcrumb={[
                { label: 'Home', href: '/sketch/home', done: true },
                { label: 'Shop Preset', active: true },
            ]}>
            <Hero
                image={heroImg}
                imageSpeed={0.18}
                height="58vh"
                minHeight={420}
                eyebrow="Desain Jadi · Tanpa Custom"
                kickerIcon="fas fa-store"
                title={<>Koleksi <span className="accent">Preset</span> Siap Pesan</>}
                subtitle="Desain yang sudah kami kurasi — tinggal pilih ukuran dan checkout. Ingin ubah detailnya? Setiap preset bisa dibuka kembali di customizer."
                actions={<Link href="/sketch/custom" className="hm-btn hm-btn-gold"><i className="fas fa-sliders" /> Custom dari Nol</Link>}
            />

            <section style={{ background: '#f7f3ec', padding: 'clamp(56px,7vw,92px) 0' }}>
                <div className="hm-container">
                    <SectionHeading
                        eyebrow="Preset Edition"
                        title="Siap Pakai, Tetap Personal"
                        lead="Tersedia dalam beberapa varian — Classic, Heritage, hingga paket lengkap dengan care kit."
                    />

                    <div className="row">
                        {presets.map((p, i) => (
                            <div key={p.slug} className="col-xl-4 col-lg-6 mb-4">
                                <Reveal delay={(i % 3) + 1}>
                                    <div className="hm-card h-100 d-flex flex-column">
                                        <div className="hm-parallax position-relative" style={{ height: 260 }}>
                                            <ParallaxImage src={p.image} speed={0.1} overlay="linear-gradient(180deg, rgba(12,13,17,.05), rgba(12,13,17,.46))" />
                                            <span className="hm-tag position-absolute" style={{ top: 12, left: 12, zIndex: 6 }}>
                                                <i className="fas fa-check-circle" /> Preset
                                            </span>
                                        </div>
                                        <div className="p-4 d-flex flex-column flex-grow-1">
                                            <div className="d-flex justify-content-between align-items-start mb-2">
                                                <h4 className="hm-display mb-0" style={{ fontWeight: 800, fontSize: 19 }}>{p.name}</h4>
                                                <span style={{ color: '#a9822f', fontWeight: 900, fontSize: 16 }}>dari {fmt(p.price)}</span>
                                            </div>
                                            <p style={{ fontSize: 13, color: '#6b665d' }}>{p.desc}</p>

                                            <div className="mt-2 mb-3">
                                                <div className="hm-mono mb-2" style={{ fontSize: 10, letterSpacing: '.14em', color: '#8a857b' }}>VARIAN PRESET</div>
                                                {p.preset_variants.map((v, vi) => (
                                                    <div key={vi} className="d-flex align-items-center justify-content-between py-2 px-3 mb-2"
                                                        style={{
                                                            background: vi === 0 ? 'rgba(201,169,98,.1)' : '#faf8f4',
                                                            border: vi === 0 ? '1px solid rgba(201,169,98,.5)' : '1px solid rgba(20,22,28,.06)',
                                                            borderRadius: 5, fontSize: 13,
                                                        }}>
                                                        <span className="font-weight-bold">
                                                            {vi === 0 && <i className="fas fa-check mr-2" style={{ color: '#4a7c59', fontSize: 10 }} />}
                                                            {v.n}
                                                        </span>
                                                        <span style={{ color: '#a9822f', fontWeight: 800 }}>{fmt(v.p)}</span>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="d-flex gap-2 mt-auto">
                                                <Link href={`/sketch/shop/${p.slug}`} className="hm-btn hm-btn-navy flex-grow-1" style={{ padding: '10px 12px', fontSize: 12 }}>
                                                    <i className="fas fa-circle-info" /> Detail
                                                </Link>
                                                <Link href={`/sketch/custom/${p.slug}`} className="hm-btn hm-btn-outline-dark flex-grow-1" style={{ padding: '10px 12px', fontSize: 12 }}>
                                                    <i className="fas fa-sliders" /> Custom
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </Reveal>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </SketchLayout>
    );
}
