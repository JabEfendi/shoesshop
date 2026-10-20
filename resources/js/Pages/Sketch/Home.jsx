import { Link } from '@inertiajs/react';
import SketchLayout, { fmt } from '../../Components/Sketch/SketchLayout';
import { ParallaxElement, ParallaxImage, ParallaxLayer, Reveal, SectionHeading } from '../../Components/Parallax/index.jsx';
import '../../../css/home.css';

const STEPS = [
    ['01', 'Pilih Model', 'Lima silhouette daily — dari oxford formal sampai boots workwear.'],
    ['02', 'Rancang Detail', 'Kulit, tali, eyelet, outsole, welt, panel — delapan elemen bebas.'],
    ['03', 'Harga Realtime', 'Setiap pilihan langsung memperbarui harga, tanpa biaya tersembunyi.'],
    ['04', 'Tentukan Ukuran', 'Unggah jejak telapak kaki atau pakai size chart EU/US/UK kami.'],
    ['05', 'DP 50% & Produksi', 'Produksi ±7 hari, pelunasan setelah sepatu selesai dibuat.'],
];

export default function Home({ models = [] }) {
    const heroImg = models?.[0]?.image || '/assets/images/products/boots/boots.jpeg';
    const storyImg = models?.[1]?.image || '/assets/images/products/chelsea-boots/chelsea-pair-glossy-black.jpeg';

    return (
        <SketchLayout title="Home — SHOESHOP.ID" active="Home" transparentHeader>
            <section className="home-hero hm-parallax" aria-labelledby="home-title">
                <ParallaxLayer speed={-0.16} max={120} className="home-hero__word" aria-hidden="true">
                    LEATHER
                </ParallaxLayer>
                <div className="home-hero__glow" aria-hidden="true" />
                <div className="hm-container home-hero__grid">
                    <div className="home-hero__copy">
                        <ParallaxElement speed={-0.09} max={55}>
                            <span className="hm-kicker">Handcrafted in Indonesia</span>
                            <h1 id="home-title" className="hm-display home-hero__title">
                                YOUR STYLE.<br />YOUR STORY.<br /><span>YOUR SHOES.</span>
                            </h1>
                            <p className="home-hero__intro">
                                Bukan sekadar sepatu. Ini caramu melangkah.
                                Rancang sepatu kulit dengan detail pilihanmu,
                                dibuat satu per satu oleh tangan pengrajin.
                            </p>
                            <div className="home-hero__actions">
                                <Link href="/sketch/custom" className="hm-btn hm-btn-gold">
                                    Rancang Sepatumu <span aria-hidden="true">↗</span>
                                </Link>
                                <Link href="/sketch/shop" className="home-text-link">Jelajahi Koleksi <span aria-hidden="true">→</span></Link>
                            </div>
                        </ParallaxElement>
                    </div>
                    <div className="home-hero__visual">
                        <ParallaxElement speed={0.16} max={85} className="home-hero__photo-layer">
                            <figure className="home-hero__photo">
                                <img src={heroImg} alt="Sepatu boots kulit coklat dengan detail jahitan dan outsole bertekstur" width="1049" height="1008" fetchPriority="high" />
                                <figcaption><span>THE EVERYDAY ORIGINAL</span><span>01 / 05</span></figcaption>
                            </figure>
                        </ParallaxElement>
                        <ParallaxElement speed={-0.22} max={95} className="home-hero__note">
                            <span className="home-hero__note-mark" aria-hidden="true">✳</span>
                            <span>Made by hand.<br /><strong>Made for you.</strong></span>
                        </ParallaxElement>
                        <span className="home-hero__side-label" aria-hidden="true">FULL GRAIN LEATHER / TIMELESS BY DESIGN</span>
                    </div>
                </div>
                <div className="hm-container home-hero__bottom">
                    <a href="#craft" className="home-scroll-link"><span aria-hidden="true">↓</span> Scroll untuk mengenal kami</a>
                    <span className="home-hero__edition">DAILY CASUAL LEATHER — VOL. 01</span>
                </div>
            </section>

            <div className="home-values" aria-label="Keunggulan sepatu">
                {['Full Grain Leather', 'Goodyear Welt', '8 Elemen Custom', 'Handmade in Indonesia'].map(value => (
                    <span key={value}><span aria-hidden="true">✦</span>{value}</span>
                ))}
            </div>

            {/* ============ MANIFESTO (parallax split) ============ */}
            <section id="craft" className="home-craft" aria-labelledby="craft-title">
                <ParallaxLayer speed={-0.06} className="d-none d-lg-block" style={{ zIndex: 1 }} aria-hidden="true">
                    <div className="hm-container">
                        <span className="hm-display" style={{ fontSize: 'clamp(6rem,18vw,17rem)', fontWeight: 800, color: 'rgba(20,22,28,.035)', lineHeight: .8 }}>
                            LEATHER
                        </span>
                    </div>
                </ParallaxLayer>

                <div className="hm-container hm-parallax__content">
                    <div className="home-craft__grid">
                        <div className="home-craft__copy">
                            <Reveal>
                                <span className="hm-kicker">Kenapa SHOESHOP.ID</span>
                            </Reveal>
                            <Reveal delay={1}>
                                <h2 id="craft-title" className="hm-title hm-display mt-3 mb-4" style={{ fontSize: 'clamp(2.4rem,5vw,4.5rem)' }}>
                                    Satu sepatu, <span className="accent">ceritamu sendiri.</span>
                                </h2>
                            </Reveal>
                            <Reveal delay={2}>
                                <p className="hm-lead mb-4" style={{ maxWidth: 520 }}>
                                    Kami membuat sepatu kulit yang tidak terlalu formal untuk kantor, tapi juga
                                    tidak terlalu kasual untuk acara penting. Kulit yang semakin berkarakter,
                                    detail yang kamu tentukan, dan kenyamanan untuk perjalanan sehari-hari.
                                </p>
                            </Reveal>
                            {[
                                ['fa-layer-group', 'Delapan elemen kustomisasi', 'Motif kulit, benang jahit, eyelet, panel, tali, storm welt, hingga bentuk outsole.'],
                                ['fa-feather', 'Goodyear Welt', 'Konstruksi jahit tembus yang kuat dan bisa di-re-soling berkali-kali.'],
                                ['fa-ruler-combined', 'Sizing presisi', 'Jejak telapak kaki dibaca manual oleh pengrajin untuk hasil yang pas.'],
                            ].map(([ic, t, d], i) => (
                                <Reveal key={t} delay={i + 2}>
                                    <div className="home-craft__detail">
                                        <span className="d-inline-flex align-items-center justify-content-center mr-3 flex-shrink-0"
                                            style={{ width: 44, height: 44, borderRadius: 8, background: 'var(--hm-navy)', color: 'var(--hm-brass-2)' }}>
                                            <i className={`fas ${ic}`} />
                                        </span>
                                        <div>
                                            <div className="font-weight-bold" style={{ fontSize: 15 }}>{t}</div>
                                            <div style={{ fontSize: 13.5, color: '#6b665d', lineHeight: 1.6 }}>{d}</div>
                                        </div>
                                    </div>
                                </Reveal>
                            ))}
                        </div>

                        <div className="home-craft__sticky">
                            <div className="hm-parallax home-craft__portrait">
                                <ParallaxImage src={storyImg} speed={0.14} overlay="linear-gradient(180deg, rgba(12,13,17,.12), rgba(12,13,17,.55))" />
                                <div className="hm-noise" />
                                <div className="hm-parallax__content home-craft__caption">
                                    <span className="hm-tag-dark hm-tag" style={{ alignSelf: 'flex-start' }}>Workshop · Bandung & Jakarta</span>
                                    <h3 className="hm-display text-white mt-3 mb-1" style={{ fontWeight: 800, fontSize: 26 }}>
                                        Dikerjakan 7+ tangan pengrajin
                                    </h3>
                                    <p className="mb-0" style={{ color: 'rgba(255,255,255,.72)', fontSize: 13.5 }}>
                                        Rata-rata pengalaman 12 tahun — tiap jahitan punya cerita.
                                    </p>
                                </div>
                            </div>
                            <div className="home-craft__footnote"><span>01 — THE CRAFT</span><span>Detail kecil. Perbedaan besar.</span></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ============ MODELS ============ */}
            <section id="collection" className="home-collection" style={{ background: '#fff', padding: 'clamp(60px,8vw,100px) 0' }}>
                <div className="hm-container">
                    <div className="d-flex flex-wrap justify-content-between align-items-end mb-5">
                        <SectionHeading
                            eyebrow="The Collection"
                            title="Pilih Model Kamu"
                            lead="Mulai custom dari salah satu base model — setiap detail bisa diubah di langkah berikutnya."
                        />
                        <Reveal>
                            <Link href="/sketch/custom" className="hm-btn hm-btn-outline-dark mb-4">
                                Semua Model <i className="fas fa-arrow-right" />
                            </Link>
                        </Reveal>
                    </div>

                    <div className="row">
                        {models.map((m, i) => (
                            <div key={m.slug} className="col-lg-4 col-md-6 mb-4">
                                <Reveal delay={(i % 3) + 1}>
                                    <div className="hm-card h-100">
                                        <Link href={`/sketch/custom/${m.slug}`} className="text-decoration-none text-dark d-block">
                                            <div className="hm-parallax position-relative" style={{ height: 300 }}>
                                                <ParallaxImage src={m.image} speed={0.1} overlay="linear-gradient(180deg, rgba(12,13,17,.05), rgba(12,13,17,.42))" />
                                                <span className="position-absolute hm-tag hm-tag-dark" style={{ top: 12, left: 12, zIndex: 5 }}>
                                                    Model {String(i + 1).padStart(2, '0')} · {m.type === 'casual' ? 'Casual' : 'Formal'}
                                                </span>
                                            </div>
                                        </Link>
                                        <div className="p-4">
                                            <div className="d-flex justify-content-between align-items-start mb-2">
                                                <h4 className="hm-display mb-0" style={{ fontWeight: 800, fontSize: 20 }}>{m.name}</h4>
                                                <span style={{ color: 'var(--hm-brass)', fontWeight: 900, fontSize: 17 }}>{fmt(m.price)}</span>
                                            </div>
                                            <p style={{ fontSize: 13.5, color: '#6b665d', minHeight: 40 }}>{m.desc}</p>
                                            <Link href={`/sketch/custom/${m.slug}`} className="hm-btn hm-btn-navy w-100 mt-2" style={{ fontSize: 12.5 }}>
                                                <i className="fas fa-sliders" /> Custom Model Ini
                                            </Link>
                                        </div>
                                    </div>
                                </Reveal>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ============ HOW IT WORKS (dark parallax) ============ */}
            <section className="hm-parallax home-process" style={{ background: '#101218', color: '#fff', padding: 'clamp(70px,10vw,120px) 0' }}>
                <ParallaxImage
                    src={models?.[3]?.image || heroImg}
                    speed={0.1}
                    overlay="linear-gradient(180deg, rgba(12,13,17,.94), rgba(12,13,17,.86))"
                />
                <div className="hm-noise" />
                <div className="hm-container hm-parallax__content position-relative">
                    <div className="row align-items-start">
                        <div className="col-lg-5 mb-5 mb-lg-0">
                            <SectionHeading
                                light
                                eyebrow="Alur Custom"
                                title={<>Bagaimana<br />Custom Bekerja?</>}
                                lead="Lima langkah sederhana — dari memilih model sampai sepatu tiba di depan pintu rumahmu."
                            />
                            <Reveal delay={3}>
                                <Link href="/sketch/custom" className="hm-btn hm-btn-gold mt-2">
                                    <i className="fas fa-play" /> Mulai Sekarang
                                </Link>
                            </Reveal>
                        </div>
                        <div className="col-lg-7">
                            {STEPS.map(([num, title, d], i) => (
                                <Reveal key={num} delay={(i % 3) + 1}>
                                    <div className="d-flex align-items-start mb-4 pb-4" style={{ borderBottom: i < STEPS.length - 1 ? '1px solid rgba(255,255,255,.08)' : 'none' }}>
                                        <span className="hm-display mr-4" style={{ fontSize: 34, fontWeight: 800, color: 'var(--hm-brass)', lineHeight: 1, minWidth: 48 }}>
                                            {num}
                                        </span>
                                        <div>
                                            <div className="font-weight-bold mb-1" style={{ fontSize: 16 }}>{title}</div>
                                            <div style={{ color: 'rgba(255,255,255,.62)', fontSize: 13.5, lineHeight: 1.65 }}>{d}</div>
                                        </div>
                                    </div>
                                </Reveal>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ============ CRAFTSMANSHIP CTA ============ */}
            <section className="hm-parallax" style={{ padding: 'clamp(70px,10vw,130px) 0' }}>
                <ParallaxImage
                    src={models?.[2]?.image || storyImg}
                    speed={0.16}
                    overlay="linear-gradient(180deg, rgba(12,13,17,.7), rgba(12,13,17,.82))"
                />
                <div className="hm-vignette" />
                <div className="hm-container hm-parallax__content text-center position-relative" style={{ maxWidth: 780 }}>
                    <Reveal>
                        <span className="hm-kicker" style={{ justifyContent: 'center' }}>
                            <i className="fas fa-book-open mr-2" /> Brand Story
                        </span>
                    </Reveal>
                    <Reveal delay={1}>
                        <h2 className="hm-serif text-white mt-3 mb-4" style={{ fontSize: 'clamp(1.8rem,4vw,3rem)', fontStyle: 'italic', lineHeight: 1.3 }}>
                            “Sepatu yang baik mengantarkanmu ke tempat yang baik.”
                        </h2>
                    </Reveal>
                    <Reveal delay={2}>
                        <p className="hm-lead mb-4" style={{ color: 'rgba(255,255,255,.78)', maxWidth: 620, margin: '0 auto' }}>
                            Di balik setiap pasang, ada tangan-tangan pengrajin yang memotong, menjahit, dan
                            menyelesaikannya dengan sabar. Kami percaya sepatu bukan sekadar alas kaki — ia
                            menemani setiap perjalananmu.
                        </p>
                    </Reveal>
                    <Reveal delay={3}>
                        <Link href="/sketch/our-story" className="hm-btn hm-btn-ghost">
                            <i className="fas fa-arrow-right" /> Baca Cerita Kami
                        </Link>
                    </Reveal>
                </div>
            </section>
        </SketchLayout>
    );
}
