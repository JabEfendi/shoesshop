import { useState } from 'react';
import { Link } from '@inertiajs/react';
import SketchLayout, { fmt } from '../../Components/Sketch/SketchLayout';
import { Reveal } from '../../Components/Parallax/index.jsx';

export default function Checkout({ expedisi, payment_rules, subtotal, alamat_default }) {
    const [ongkirIdx, setOngkirIdx] = useState(0);
    const ongkir = expedisi[ongkirIdx].price;
    const total = subtotal + ongkir;
    const dp = Math.round(total * (payment_rules.dp_pct / 100));
    const sisa = total - dp;

    return (
        <SketchLayout title="Checkout — SHOESHOP.ID" active="Home"
            breadcrumb={[
                { label: 'Home', href: '/sketch/home', done: true },
                { label: 'Custom Detail', href: '/sketch/custom/boots', done: true },
                { label: 'Pilih Ukuran', href: '/sketch/sizing', done: true },
                { label: 'Keranjang', href: '/sketch/cart', done: true },
                { label: 'Checkout', active: true },
            ]}>
            <section style={{ background: '#f7f3ec', padding: 'clamp(40px,6vw,72px) 0' }}>
                <div className="hm-container">
                    <Reveal>
                        <span className="hm-kicker"><i className="fas fa-flag-checkered mr-2" /> Final · Langkah 6 dari 6</span>
                        <h1 className="hm-display mt-2 mb-4" style={{ fontWeight: 800, fontSize: 'clamp(1.6rem,3.4vw,2.4rem)' }}>Checkout Order</h1>
                    </Reveal>

                    <div className="row">
                        <div className="col-lg-8 mb-4">
                            <Reveal delay={1}>
                                <div className="hm-panel p-4 mb-3">
                                    <h6 className="hm-display mb-3" style={{ fontWeight: 800 }}><i className="fas fa-location-dot mr-2" style={{ color: '#a9822f' }} />Alamat Pengiriman</h6>
                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label className="hm-mono mb-1" style={{ fontSize: 10.5, letterSpacing: '.1em', color: '#6b665d' }}>NAMA PENERIMA</label>
                                            <input type="text" defaultValue={alamat_default.penerima} className="form-control" />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="hm-mono mb-1" style={{ fontSize: 10.5, letterSpacing: '.1em', color: '#6b665d' }}>NO. HP / WA</label>
                                            <input type="text" defaultValue={alamat_default.hp} className="form-control" />
                                        </div>
                                        <div className="col-12 mb-3">
                                            <label className="hm-mono mb-1" style={{ fontSize: 10.5, letterSpacing: '.1em', color: '#6b665d' }}>ALAMAT LENGKAP</label>
                                            <textarea rows={3} defaultValue={alamat_default.alamat} className="form-control" />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="hm-mono mb-1" style={{ fontSize: 10.5, letterSpacing: '.1em', color: '#6b665d' }}>KOTA / KABUPATEN</label>
                                            <select className="form-control"><option>Kota Depok</option><option>Kota Jakarta Selatan</option><option>Kota Tangerang Selatan</option></select>
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="hm-mono mb-1" style={{ fontSize: 10.5, letterSpacing: '.1em', color: '#6b665d' }}>KODE POS</label>
                                            <input type="text" defaultValue="164xx" className="form-control" />
                                        </div>
                                    </div>
                                </div>
                            </Reveal>

                            <Reveal delay={2}>
                                <div className="hm-panel p-4 mb-3">
                                    <h6 className="hm-display mb-3" style={{ fontWeight: 800 }}><i className="fas fa-truck mr-2" style={{ color: '#a9822f' }} />Pilih Ekspedisi</h6>
                                    {expedisi.map((e, i) => (
                                        <div key={e.name} onClick={() => setOngkirIdx(i)} role="button"
                                            className="d-flex justify-content-between align-items-center p-3 mb-2"
                                            style={{
                                                cursor: 'pointer', borderRadius: 6,
                                                background: ongkirIdx === i ? 'rgba(201,169,98,.12)' : '#faf8f4',
                                                border: ongkirIdx === i ? '1px solid #c9a962' : '1px solid rgba(20,22,28,.06)',
                                            }}>
                                            <div>
                                                <b>{ongkirIdx === i && <i className="fas fa-check-circle mr-2" style={{ color: '#a9822f' }} />}{e.name}</b>
                                                <div style={{ fontSize: 12.5, color: '#6b665d' }}>Estimasi {e.etd}</div>
                                            </div>
                                            <span style={{ color: '#a9822f', fontWeight: 900, fontSize: 16 }}>{fmt(e.price)}</span>
                                        </div>
                                    ))}
                                </div>
                            </Reveal>

                            <Reveal delay={3}>
                                <div className="hm-panel p-4">
                                    <h6 className="hm-display mb-3" style={{ fontWeight: 800 }}>
                                        <i className="fas fa-money-bill-transfer mr-2" style={{ color: '#a9822f' }} />Pembayaran — <span style={{ color: '#a9822f' }}>DP {payment_rules.dp_pct}%</span> di Depan
                                    </h6>
                                    <div className="p-3 mb-3" style={{ background: '#eef5fb', borderRadius: 8, fontSize: 13 }}>
                                        <i className="fas fa-circle-info mr-1" style={{ color: '#3a7ca5' }} />
                                        DP dibayar sekarang untuk mulai produksi. Pelunasan dibayar setelah sepatu selesai — kamu diinfokan via WhatsApp, tombol pelunasan muncul di Dashboard Order.
                                    </div>
                                    <div className="hm-mono mb-2" style={{ fontSize: 10.5, letterSpacing: '.1em', color: '#6b665d' }}>METODE DP</div>
                                    <div className="d-flex flex-wrap gap-2 mb-3">
                                        {payment_rules.methods.map(m => {
                                            const active = m === 'QRIS';
                                            return (
                                                <button key={m} className="hm-btn" style={{
                                                    padding: '11px 18px', fontSize: 12.5,
                                                    background: active ? 'linear-gradient(135deg,#d9b45e,#a9822f)' : '#fff',
                                                    color: active ? '#17140c' : '#14161c',
                                                    border: active ? '1px solid transparent' : '1px solid rgba(20,22,28,.18)',
                                                }}>
                                                    <i className={`fas ${active ? 'fa-qrcode' : 'fa-building-columns'}`} /> {m}
                                                    {active && <span className="hm-tag ml-2" style={{ background: 'rgba(20,22,28,.15)', color: '#14161c', border: 0 }}>Rekomendasi</span>}
                                                </button>
                                            );
                                        })}
                                    </div>
                                    <div className="p-3" style={{ background: 'rgba(201,169,98,.1)', borderRadius: 8, fontSize: 13 }}>
                                        <i className="fas fa-shield-halved mr-1" style={{ color: '#a9822f' }} />
                                        <b>Order terlindungi.</b> Produksi mulai setelah DP diterima. Gagal produksi = 100% refund DP.
                                    </div>
                                </div>
                            </Reveal>

                            <Reveal delay={3}>
                                <div className="p-3 mt-3" style={{ background: '#fdece6', borderRadius: 8, fontSize: 12.5 }}>
                                    <i className="fas fa-triangle-exclamation mr-1" style={{ color: '#b7410e' }} />
                                    <b>Garansi & Retur:</b> 3 hari sejak barang diterima. Wajib video unboxing penuh. Ongkir retur ditanggung buyer.
                                </div>
                            </Reveal>
                        </div>

                        <div className="col-lg-4">
                            <Reveal delay={1}>
                                <div className="hm-panel p-4" style={{ position: 'sticky', top: 90 }}>
                                    <h6 className="hm-display mb-3" style={{ fontWeight: 800 }}>Ringkasan Order</h6>
                                    <div className="d-flex justify-content-between mb-1" style={{ fontSize: 14 }}>
                                        <span>Subtotal</span><b>{fmt(subtotal)}</b>
                                    </div>
                                    <div className="d-flex justify-content-between mb-1" style={{ fontSize: 14 }}>
                                        <span><i className="fas fa-truck mr-1" /> {expedisi[ongkirIdx].name}</span><b>{fmt(ongkir)}</b>
                                    </div>
                                    <div className="d-flex justify-content-between align-items-end border-top mt-2 pt-2 mb-1" style={{ borderColor: 'rgba(20,22,28,.1)' }}>
                                        <b>TOTAL TAGIHAN</b>
                                        <span className="hm-display" style={{ color: '#a9822f', fontWeight: 800, fontSize: 21 }}>{fmt(total)}</span>
                                    </div>
                                    <div style={{ fontSize: 12, color: '#8a857b' }} className="mb-3">Produksi ± 7 hari dari DP terverifikasi.</div>

                                    <div className="p-3 mb-3" style={{ background: 'rgba(201,169,98,.12)', borderRadius: 8 }}>
                                        <div className="hm-mono mb-1" style={{ fontSize: 10.5, letterSpacing: '.1em', color: '#6b665d' }}>
                                            <i className="fas fa-credit-card mr-1" /> DIBAYAR SEKARANG (DP {payment_rules.dp_pct}%)
                                        </div>
                                        <div className="hm-display" style={{ color: '#a9822f', fontWeight: 800, fontSize: 30 }}>{fmt(dp)}</div>
                                        <div style={{ fontSize: 12, color: '#6b665d' }}>Pelunasan nanti: <b>{fmt(sisa)}</b></div>
                                    </div>

                                    <div className="form-check mb-4" style={{ fontSize: 12.5 }}>
                                        <input id="tos" type="checkbox" defaultChecked className="form-check-input" />
                                        <label htmlFor="tos" className="form-check-label">
                                            Saya setuju <b>Syarat & Ketentuan</b> (DP tidak refund setelah produksi jalan, garansi 3 hari wajib video unboxing).
                                        </label>
                                    </div>

                                    <div className="d-flex gap-2">
                                        <Link href="/sketch/cart" className="hm-btn hm-btn-outline-dark" style={{ padding: '11px 16px' }}><i className="fas fa-arrow-left" /></Link>
                                        <Link href="/sketch/account/orders" className="hm-btn hm-btn-gold flex-grow-1"><i className="fas fa-bolt" /> Bayar DP</Link>
                                    </div>
                                    <div className="text-center mt-2 hm-mono" style={{ fontSize: 10.5, color: '#8a857b' }}>
                                        Diarahkan ke halaman pembayaran QRIS/VA.
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
