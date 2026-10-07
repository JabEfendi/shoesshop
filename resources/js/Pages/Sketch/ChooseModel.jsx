import { Link } from '@inertiajs/react';
import SketchLayout, { fmt } from '../../Components/Sketch/SketchLayout';
import { Hero, Reveal, ParallaxImage, SectionHeading } from '../../Components/Parallax/index.jsx';

export default function ChooseModel({ models }) {
    const heroImg = models?.[0]?.image || '/assets/images/products/boots/boots.jpeg';

    return (
        <SketchLayout title="Pilih Model — Custom SHOESHOP.ID" active="Custom"
            breadcrumb={[
                { label: 'Home', href: '/sketch/home', done: true },
                { label: 'Pilih Model', active: true },
                { label: 'Pilih Detail' },
                { label: 'Review' },
                { label: 'Ukuran' },
                { label: 'Checkout' },
            ]}>
            <Hero
                image={heroImg}
                imageSpeed={0.2}
                height="62vh"
                minHeight={440}
                eyebrow="Customizer · Langkah 1 dari 6"
                kickerIcon="fas fa-shoe-forms"
                title={<>Pilih <span className="accent">Silhouette</span> Modelmu</>}
                subtitle="Lima base model daily casual — dari oxford formal sampai boots workwear. Nanti semua detailnya bisa kamu ubah di langkah berikutnya."
            />

            <section style={{ background: '#f7f3ec', padding: 'clamp(56px,7vw,92px) 0' }}>
                <div className="hm-container">
                    <SectionHeading
                        eyebrow="Koleksi Base Model"
                        title="Lima Dunia, Satu Karakter"
                        lead="Setiap model punya gaya hidupnya sendiri: formal untuk kantor, kasual untuk jalan, dan semuanya tetap terasa premium."
                    />

                    <div className="row">
                        {models.map((m, idx) => (
                            <div key={m.slug} className="col-lg-4 col-md-6 mb-4">
                                <Reveal delay={(idx % 3) + 1}>
                                    <Link href={`/sketch/custom/${m.slug}`} className="text-decoration-none text-dark">
                                        <div className="hm-card h-100 position-relative">
                                            <div className="hm-parallax" style={{ height: 250 }}>
                                                <ParallaxImage src={m.image} speed={0.1} overlay="linear-gradient(180deg, rgba(12,13,17,.08), rgba(12,13,17,.5))" />
                                                <span className="hm-tag hm-tag-dark position-absolute" style={{ top: 12, left: 12, zIndex: 6 }}>
                                                    Model {String(idx + 1).padStart(2, '0')}
                                                </span>
                                                <span className="hm-tag hm-tag-dark position-absolute" style={{ top: 12, right: 12, zIndex: 6 }}>
                                                    {m.type === 'casual' ? 'Casual' : 'Formal'}
                                                </span>
                                            </div>
                                            <div className="p-4">
                                                <h4 className="hm-display mb-1" style={{ fontWeight: 800, fontSize: 20 }}>{m.name}</h4>
                                                <p style={{ fontSize: 13.5, color: '#6b665d', minHeight: 42 }}>{m.desc}</p>
                                                <div className="d-flex justify-content-between align-items-end mt-3">
                                                    <div>
                                                        <div className="hm-mono" style={{ fontSize: 10, letterSpacing: '.14em', color: '#8a857b' }}>BASE PRICE</div>
                                                        <div style={{ color: '#a9822f', fontWeight: 900, fontSize: 21 }}>{fmt(m.price)}</div>
                                                    </div>
                                                    <span className="hm-btn hm-btn-navy" style={{ padding: '10px 16px', fontSize: 12 }}>
                                                        Pilih <i className="fas fa-arrow-right" />
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </Reveal>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </SketchLayout>
    );
}
