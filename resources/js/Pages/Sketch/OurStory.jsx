import { Link } from '@inertiajs/react';
import SketchLayout from '../../Components/Sketch/SketchLayout';
import { Hero, ParallaxImage, Reveal, SectionHeading, Marquee } from '../../Components/Parallax/index.jsx';

const CONSTRUCTION = [
    ['01', 'Upper Full Grain', 'Kulit lapisan terluar — semakin dipakai semakin cantik patinanya.', 'fa-cowhide'],
    ['02', 'Goodyear Welt Strip', 'Lipatan kulit tepi yang dijahit tembus dengan upper + insole — inti kekuatan.', 'fa-diagram-next'],
    ['03', 'Rib of Cork Filling', 'Isi gabus alami yang menyesuaikan bentuk telapak kaki seiring waktu.', 'fa-layer-group'],
    ['04', 'Outsole Anti-slip', 'Karet pilihan atau kulit asli — tebal, kuat, dan bisa diganti tanpa ganti upper.', 'fa-shoe-prints'],
];

export default function OurStory() {
    return (
        <SketchLayout title="Our Story — Craftsmanship | SHOESHOP.ID" active="Our Story"
            breadcrumb={[
                { label: 'Home', href: '/sketch/home', done: true },
                { label: 'Our Story / Craftsmanship', active: true },
            ]}>
            {/* HERO */}
            <Hero
                image="/assets/images/products/boots/out-side.jpeg"
                imageSpeed={0.2}
                height="92vh"
                minHeight={580}
                eyebrow="Brand Story · Craftsmanship"
                kickerIcon="fas fa-hammer"
                title={<>Sepatu kulit yang <span className="accent">tidak cuma buat 1 musim.</span></>}
                subtitle="SHOESHOP.ID lahir dari kegelisahan mencari sepatu kulit yang pas untuk Gen Z & Millennials — tidak terlalu formal ke kantor, tidak terlalu murahan untuk hangout, dan harganya tidak menguras dompet."
                actions={
                    <>
                        <Link href="/sketch/custom" className="hm-btn hm-btn-gold"><i className="fas fa-sliders" /> Mulai Custom</Link>
                        <Link href="/sketch/shop" className="hm-btn hm-btn-ghost"><i className="fas fa-store" /> Lihat Preset</Link>
                    </>
                }
            />

            {/* MARQUEE */}
            <div style={{ background: '#0c0d11', padding: '20px 0', borderTop: '1px solid rgba(201,169,98,.18)', borderBottom: '1px solid rgba(201,169,98,.18)' }}>
                <Marquee items={['Since Day One', 'Handmade in Indonesia', 'Goodyear Welt', 'Re-Solable', 'Real Craftsmen']} />
            </div>

            {/* PHILOSOPHY */}
            <section style={{ background: '#f7f3ec', padding: 'clamp(70px,10vw,130px) 0' }}>
                <div className="hm-container">
                    <div className="row align-items-center">
                        <div className="col-lg-6 mb-4 mb-lg-0">
                            <Reveal><span className="hm-kicker">Filosofi Kami</span></Reveal>
                            <Reveal delay={1}>
                                <h2 className="hm-serif mt-3 mb-4" style={{ fontSize: 'clamp(1.9rem,4vw,3rem)', lineHeight: 1.25, fontStyle: 'italic' }}>
                                    “Setiap pasang sepatu adalah janji — pada kaki yang memakainya, dan pada tangan yang membuatnya.”
                                </h2>
                            </Reveal>
                            <Reveal delay={2}>
                                <p className="hm-lead" style={{ maxWidth: 520 }}>
                                    Kami percaya pada craftsmanship yang tidak bisa diburu-buru. Setiap sepatu
                                    melewati tangan tujuh lebih pengrajin dengan rata-rata pengalaman dua belas tahun.
                                    Tidak ada produksi massal — hanya kesabaran.
                                </p>
                            </Reveal>
                        </div>
                        <div className="col-lg-6">
                            <Reveal delay={1}>
                                <div className="row">
                                    {[
                                        ['12+', 'Tahun pengalaman pengrajin'],
                                        ['7', 'Tangan di balik tiap pasang'],
                                        ['5', 'Tahun+ umur sepatu terawat'],
                                        ['100%', 'Handmade di Indonesia'],
                                    ].map(([n, l], i) => (
                                        <div key={n} className="col-6 mb-3">
                                            <div className="hm-panel p-4 h-100">
                                                <div className="hm-display" style={{ fontSize: 42, fontWeight: 800, color: '#a9822f', lineHeight: 1 }}>{n}</div>
                                                <div style={{ fontSize: 12.5, color: '#6b665d', marginTop: 6 }}>{l}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Reveal>
                        </div>
                    </div>
                </div>
            </section>

            {/* PARALLAX WORKSHOP */}
            <section className="hm-parallax" style={{ minHeight: 560, display: 'flex', alignItems: 'center' }}>
                <ParallaxImage
                    src="/assets/images/products/boots/in-side.jpeg"
                    speed={0.18}
                    overlay="linear-gradient(180deg, rgba(12,13,17,.72), rgba(12,13,17,.86))"
                />
                <div className="hm-vignette" />
                <div className="hm-noise" />
                <div className="hm-container hm-parallax__content text-center position-relative">
                    <Reveal>
                        <span className="hm-kicker" style={{ justifyContent: 'center' }}><i className="fas fa-location-dot mr-2" /> Workshop</span>
                    </Reveal>
                    <Reveal delay={1}>
                        <h2 className="hm-display text-white mt-3 mb-3" style={{ fontWeight: 800, fontSize: 'clamp(1.8rem,4vw,3rem)' }}>
                            Bandung & Jakarta
                        </h2>
                    </Reveal>
                    <Reveal delay={2}>
                        <p className="hm-lead mx-auto" style={{ color: 'rgba(255,255,255,.75)', maxWidth: 620 }}>
                            Di sinilah kulit dipilih, dipotong, dijahit, dan diselesaikan. Suara mesin jahit tua
                            berpadu dengan bau khas kulit — tempat di mana sepatumu mulai mengambil bentuk.
                        </p>
                    </Reveal>
                </div>
            </section>

            {/* CONSTRUCTION */}
            <section style={{ background: '#fff', padding: 'clamp(70px,10vw,120px) 0' }}>
                <div className="hm-container">
                    <SectionHeading
                        eyebrow="Craft · Konstruksi"
                        title="Kenapa Goodyear Welt?"
                        lead="Konstruksi jahit welt tepi membuat sepatu tidak mudah bocor, jahitannya tidak mudah lepas, dan yang terpenting — bisa di-re-soling berkali-kali."
                    />
                    <div className="row">
                        {CONSTRUCTION.map(([n, t, d, ic], i) => (
                            <div key={n} className="col-lg-3 col-md-6 mb-4">
                                <Reveal delay={(i % 4) + 1}>
                                    <div className="hm-card h-100 p-4">
                                        <div className="d-flex align-items-baseline mb-3">
                                            <span className="hm-display mr-3" style={{ color: '#a9822f', fontSize: 34, fontWeight: 800, lineHeight: 1 }}>{n}</span>
                                            <h5 className="hm-display mb-0" style={{ fontWeight: 800, fontSize: 16 }}>{t}</h5>
                                        </div>
                                        <i className={`fas ${ic} mb-3`} style={{ color: '#a9822f', fontSize: 26 }} />
                                        <p className="mb-0" style={{ fontSize: 13, color: '#55524c', lineHeight: 1.75 }}>{d}</p>
                                    </div>
                                </Reveal>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* LIFESTYLE SPLIT */}
            <section className="hm-parallax" style={{ background: '#f7f3ec', padding: 'clamp(70px,10vw,120px) 0' }}>
                <div className="hm-container hm-parallax__content">
                    <div className="row align-items-center">
                        <div className="col-lg-6 order-lg-2 mb-4 mb-lg-0">
                            <Reveal delay={1}>
                                <div className="hm-parallax" style={{ borderRadius: 10, overflow: 'hidden', minHeight: 460, boxShadow: 'var(--hm-shadow)' }}>
                                    <ParallaxImage
                                        src="/assets/images/products/loafers/out-side.jpeg"
                                        speed={0.12}
                                        overlay="linear-gradient(180deg, rgba(12,13,17,.08), rgba(12,13,17,.42))"
                                    />
                                </div>
                            </Reveal>
                        </div>
                        <div className="col-lg-6 order-lg-1">
                            <Reveal><span className="hm-kicker">Daily Casual Leather</span></Reveal>
                            <Reveal delay={1}>
                                <h2 className="hm-display mt-3 mb-4" style={{ fontWeight: 800, fontSize: 'clamp(1.7rem,3.6vw,2.6rem)' }}>
                                    Untuk kamu yang <span className="accent">tidak mau pusing.</span>
                                </h2>
                            </Reveal>
                            <Reveal delay={2}>
                                <p className="hm-lead mb-4" style={{ maxWidth: 520 }}>
                                    Lima silhouette yang cocok untuk kuliah, WFO, hangout malam, sampai kondangan.
                                    Custom detail kulit, tali, eyelet, outsole, hingga storm welt water-repellent
                                    untuk musim hujan. Harga berubah realtime — tanpa biaya tersembunyi.
                                </p>
                            </Reveal>
                            <Reveal delay={3}>
                                <ul className="list-unstyled" style={{ lineHeight: 2.3, fontSize: 14 }}>
                                    {[
                                        'Full grain leather pilihan',
                                        'Konstruksi Goodyear Welt — tahan & re-solable',
                                        'Delapan elemen bebas custom',
                                        'Produksi ± 7 hari kerja',
                                        'Garansi jahitan 12 bulan + re-soling pertama gratis',
                                    ].map(t => (
                                        <li key={t}><i className="fas fa-check mr-2" style={{ color: '#4a7c59', fontSize: 11 }} />{t}</li>
                                    ))}
                                </ul>
                            </Reveal>
                            <Reveal delay={4}>
                                <div className="d-flex gap-2 mt-4">
                                    <Link href="/sketch/custom" className="hm-btn hm-btn-gold"><i className="fas fa-sliders" /> Mulai Custom</Link>
                                    <Link href="/sketch/shop" className="hm-btn hm-btn-outline-dark"><i className="fas fa-store" /> Lihat Preset</Link>
                                </div>
                            </Reveal>
                        </div>
                    </div>
                </div>
            </section>
        </SketchLayout>
    );
}
