import { Link } from '@inertiajs/react';
import SketchLayout from '../../Components/Sketch/SketchLayout';
import { Reveal } from '../../Components/Parallax/index.jsx';

export default function Sizing({ chart, next_url }) {
    return (
        <SketchLayout title="Sizing — SHOESHOP.ID" active="Custom"
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
                            Dua cara: unggah jejak telapak kaki untuk dibaca pengrajin, atau langsung pilih
                            dari size chart standar EU/US/UK.
                        </p>
                    </Reveal>

                    <div className="row mt-4">
                        <div className="col-lg-6 mb-4">
                            <Reveal delay={1}>
                                <div className="hm-panel p-4 h-100">
                                    <div className="d-flex align-items-center mb-3">
                                        <span className="hm-tag"><i className="fas fa-star" /> Rekomendasi</span>
                                        <span className="ml-2 font-weight-bold"><i className="fas fa-camera-retro mr-2" style={{ color: '#a9822f' }} />Upload Gambar Telapak Kaki</span>
                                    </div>
                                    <div className="d-flex flex-column align-items-center justify-content-center text-center"
                                        style={{ border: '2px dashed rgba(201,169,98,.6)', borderRadius: 10, padding: '40px 24px', background: 'rgba(201,169,98,.06)', cursor: 'pointer' }}>
                                        <i className="fas fa-cloud-arrow-up mb-3" style={{ fontSize: 58, color: '#a9822f' }} />
                                        <div className="font-weight-bold mb-1">Klik / drag gambar telapak kaki ke sini</div>
                                        <div style={{ fontSize: 13, color: '#6b665d', maxWidth: 380 }} className="mb-3">
                                            Letakkan kertas A4 sebagai skala, telapak kaki berdiri di atasnya, foto dari atas 90°.
                                        </div>
                                        <button className="hm-btn hm-btn-gold"><i className="fas fa-image" /> Pilih File Gambar</button>
                                        <div className="hm-mono mt-3" style={{ fontSize: 10.5, color: '#8a857b' }}>JPG/PNG · maks 8MB · dibaca dalam 1 jam kerja</div>
                                    </div>
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
                                                    <tr key={r.size} style={{ background: i === 3 ? 'rgba(201,169,98,.12)' : 'transparent' }}>
                                                        <td className="font-weight-bold">{r.size}</td>
                                                        <td>{r.insole_cm} cm</td>
                                                        <td style={{ fontSize: 12.5, color: '#6b665d' }}>{r.recommended_for}</td>
                                                        <td>
                                                            <button className="btn btn-sm px-3" style={{
                                                                borderRadius: 4,
                                                                background: i === 3 ? '#14161c' : '#fff',
                                                                color: i === 3 ? 'var(--hm-brass-2)' : '#14161c',
                                                                border: i === 3 ? '1px solid #c9a962' : '1px solid rgba(20,22,28,.18)',
                                                            }}>
                                                                {i === 3 ? <><i className="fas fa-check mr-1" />Pilih</> : 'Pilih'}
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
                            <h5 className="mb-0 font-weight-bold">
                                <i className="fas fa-circle-check mr-2" style={{ color: '#4a7c59' }} />
                                Terpilih: <span className="hm-tag ml-2">Size 42 EU · Insole 26.8 cm</span>
                            </h5>
                            <div className="d-flex gap-2 mt-3 mt-md-0">
                                <Link href="/sketch/custom/boots/preview" className="hm-btn hm-btn-outline-dark" style={{ padding: '11px 18px' }}>
                                    <i className="fas fa-arrow-left" /> Kembali
                                </Link>
                                <Link href="/sketch/cart" className="hm-btn hm-btn-gold">
                                    Masuk Keranjang <i className="fas fa-cart-shopping" />
                                </Link>
                            </div>
                        </div>
                    </Reveal>
                </div>
            </section>
        </SketchLayout>
    );
}
