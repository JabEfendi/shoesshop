import { Link, router, usePage } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import SketchLayout from '../../Components/Sketch/SketchLayout';
import { Reveal } from '../../Components/Parallax/index.jsx';

export default function Sizing({ chart, next_url }) {
    const { url } = usePage();
    const params = useMemo(() => new URLSearchParams(url.split('?')[1] || ''), [url]);
    const [size, setSize] = useState(42);
    const modelSlug = params.get('model') || 'boots';
    const selection = useMemo(() => {
        try { return JSON.parse(params.get('selection') || '{}'); } catch { return {}; }
    }, [params]);
    const [processing, setProcessing] = useState(false);
    const reviewUrl = `/sketch/custom/${modelSlug}/preview?selection=${encodeURIComponent(JSON.stringify(selection))}`;
    const addToCart = () => {
        if (processing) return;
        setProcessing(true);
        router.post('/cart', { type: 'custom', model_slug: modelSlug, size, selection }, { onFinish: () => setProcessing(false) });
    };
    return (
        <SketchLayout title="Sizing — SHOESHOP.ID" active="Size Guide"
            breadcrumb={[
                { label: 'Home', href: '/sketch/home', done: true },
                { label: 'Pilih Model', href: '/sketch/custom', done: true },
                { label: 'Custom Detail', href: '/sketch/custom/boots', done: true },
                { label: 'Review', href: '/sketch/custom/boots/preview', done: true },
                { label: 'Pilih Ukuran', active: true },
                { label: 'Checkout' },
            ]}>
            <section style={{ background: '#f7f3ec', padding: 'clamp(40px,6vw,72px) 0' }}>
                <div className="hm-container">
                    <Reveal>
                        <span className="hm-kicker"><i className="fas fa-ruler-combined mr-2" /> Customizer · Langkah 4 dari 6</span>
                        <h1 className="hm-display mt-2 mb-2" style={{ fontWeight: 800, fontSize: 'clamp(1.6rem,3.4vw,2.4rem)' }}>
                            Tentukan <span className="accent">Ukuranmu</span>
                        </h1>
                        <p style={{ color: '#6b665d', maxWidth: 620 }}>
                            Ukur panjang kaki dari tumit sampai ujung jari terpanjang, lalu pilih ukuran EU dari panduan di bawah.
                        </p>
                    </Reveal>

                    <div className="row mt-4">
                        <div className="col-lg-6 mb-4">
                            <Reveal delay={1}>
                                <div className="hm-panel p-4 h-100">
                                    <span className="hm-kicker">Fit guide / Ukur di rumah</span>
                                    <h2 className="hm-serif mt-3">Pas dimulai dari ukuran.</h2>
                                    <ol className="atelier-measure-steps">{['Berdiri di atas kertas, dengan tumit menempel pada dinding.', 'Tandai ujung jari terpanjang. Ukur jarak dari tumit dalam sentimeter.', 'Ukur kedua kaki. Gunakan ukuran kaki yang lebih panjang.'].map((step, i) => <Reveal as="li" key={step} delay={i + 1}><span>0{i + 1}</span><p>{step}</p></Reveal>)}</ol>
                                    <p className="hm-mono" style={{ fontSize: 11 }}>Panduan ini menggunakan ukuran EU. Upload foto belum tersedia.</p>
                                    <div className="mt-3 p-3" style={{ background: '#eef5fb', borderRadius: 8, fontSize: 13 }}>
                                        <i className="fas fa-circle-info mr-1" style={{ color: '#3a7ca5' }} />
                                        <b>Contoh:</b> panjang telapak 26.4 cm → rekomendasi <b>Size 42</b> (insole 26.8 cm).
                                    </div>
                                </div>
                            </Reveal>
                        </div>

                        <div className="col-lg-6 mb-4">
                            <Reveal delay={2}>
                                <div className="hm-panel p-4 h-100">
                                    <div className="font-weight-bold mb-3"><i className="fas fa-table mr-2" style={{ color: '#a9822f' }} />Opsi 2: Pakai Size Chart</div>
                                    <div className="table-responsive">
                                        <table className="table table-sm mb-0">
                                            <thead>
                                                <tr style={{ borderBottom: '2px solid rgba(20,22,28,.15)' }}>
                                                    <th className="hm-mono" style={{ fontSize: 10.5, letterSpacing: '.1em', color: '#8a857b' }}>EU</th>
                                                    <th className="hm-mono" style={{ fontSize: 10.5, letterSpacing: '.1em', color: '#8a857b' }}>INSOLE</th>
                                                    <th className="hm-mono" style={{ fontSize: 10.5, letterSpacing: '.1em', color: '#8a857b' }}>PANJANG KAKI</th>
                                                    <th></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {chart.map((r, i) => (
                                                    <tr key={r.size} style={{ background: size === r.size ? 'rgba(201,169,98,.12)' : 'transparent' }}>
                                                        <td className="font-weight-bold">{r.size}</td>
                                                        <td>{r.insole_cm} cm</td>
                                                        <td style={{ fontSize: 12.5, color: '#6b665d' }}>{r.recommended_for}</td>
                                                        <td>
                                                            <button type="button" aria-label={`Pilih ukuran EU ${r.size}`} aria-pressed={size === r.size} onClick={() => setSize(r.size)} className="btn btn-sm px-3" style={{
                                                                borderRadius: 4,
                                                                background: size === r.size ? '#14161c' : '#fff',
                                                                color: size === r.size ? 'var(--hm-brass-2)' : '#14161c',
                                                                border: size === r.size ? '1px solid #c9a962' : '1px solid rgba(20,22,28,.18)',
                                                            }}>
                                                                {size === r.size ? <><i className="fas fa-check mr-1" />Pilih</> : 'Pilih'}
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="mt-3 p-3" style={{ background: 'rgba(201,169,98,.1)', borderRadius: 8, fontSize: 12.5 }}>
                                        <i className="fas fa-lightbulb mr-1" style={{ color: '#a9822f' }} />
                                        <b>Tips:</b> kaki lebar atau suka kaos kaki tebal? pilih 1 size di atas rekomendasi.
                                    </div>
                                </div>
                            </Reveal>
                        </div>
                    </div>

                    <Reveal delay={1}>
                        <div className="hm-panel p-4 d-flex flex-wrap align-items-center justify-content-between">
                            <h5 key={size} aria-live="polite" className="mb-0 font-weight-bold atelier-price-update">
                                <i className="fas fa-circle-check mr-2" style={{ color: '#4a7c59' }} />
                                 Terpilih: <span className="hm-tag ml-2">Size {size} EU · Insole {chart.find(r => r.size === size)?.insole_cm} cm</span>
                            </h5>
                            <div className="d-flex gap-2 mt-3 mt-md-0">
                                <Link href={reviewUrl} className="hm-btn hm-btn-outline-dark" style={{ padding: '11px 18px' }}>
                                    <i className="fas fa-arrow-left" /> Kembali
                                </Link>
                                <button type="button" disabled={processing} aria-busy={processing} onClick={addToCart} className="hm-btn hm-btn-gold">
                                    Masuk Keranjang <i className="fas fa-cart-shopping" />
                                </button>
                            </div>
                        </div>
                    </Reveal>
                </div>
            </section>
        </SketchLayout>
    );
}
