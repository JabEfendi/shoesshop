import { useState } from 'react';
import { Link, useForm } from '@inertiajs/react';
import SketchLayout, { fmt } from '../../Components/Sketch/SketchLayout';
import { Reveal } from '../../Components/Parallax/index.jsx';

export default function Checkout({ expedisi, payment_rules, subtotal, alamat_default }) {
    const [ongkirIdx, setOngkirIdx] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState('qris');
    const { data, setData, post, processing, errors } = useForm({
        recipient_name: alamat_default.penerima || '', phone: alamat_default.hp || '', address: alamat_default.alamat || '',
        city: alamat_default.kota || '', postal_code: alamat_default.kode_pos || '', notes: alamat_default.catatan || '',
        shipping_method: expedisi[0].id, payment_method: 'qris',
    });
    const ongkir = expedisi[ongkirIdx].price;
    const total = subtotal + ongkir;
    const dp = Math.round(total * (payment_rules.dp_pct / 100));
    const sisa = total - dp;

    return (
        <SketchLayout title="Checkout — SHOESHOP.ID" active="Collection"
            breadcrumb={[
                { label: 'Home', href: '/sketch/home', done: true },
                { label: 'Custom Detail', href: '/sketch/custom/boots', done: true },
                { label: 'Pilih Ukuran', href: '/sketch/sizing', done: true },
                { label: 'Keranjang', href: '/sketch/cart', done: true },
                { label: 'Checkout', active: true },
            ]}>
            <form aria-busy={processing} className="atelier-checkout" onSubmit={(event) => { event.preventDefault(); post('/checkout'); }}>
            <section style={{ background: '#f7f3ec', padding: 'clamp(40px,6vw,72px) 0' }}>
                <div className="hm-container">
                    <Reveal>
                        <span className="hm-kicker"><i className="fas fa-flag-checkered mr-2" /> Final · Langkah 6 dari 6</span>
                        <h1 className="hm-display mt-2 mb-4" style={{ fontWeight: 800, fontSize: 'clamp(1.6rem,3.4vw,2.4rem)' }}>Checkout Order</h1>
                    </Reveal>

                    <div className="atelier-checkout-guide"><span>01 / Alamat</span><span>02 / Pengiriman</span><span>03 / Pembayaran</span></div>
                    {Object.keys(errors).length > 0 && <div role="alert" className="atelier-form-errors"><strong>Periksa kembali pesananmu.</strong><ul>{Object.entries(errors).map(([field, message]) => <li key={field}>{message}</li>)}</ul></div>}
                    <div className="row">
                        <div className="col-lg-8 mb-4">
                            <Reveal delay={1}>
                                <div className="hm-panel p-4 mb-3">
                                    <h6 className="hm-display mb-3" style={{ fontWeight: 800 }}><i className="fas fa-location-dot mr-2" style={{ color: '#a9822f' }} />Alamat Pengiriman</h6>
                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label className="hm-mono mb-1" style={{ fontSize: 10.5, letterSpacing: '.1em', color: '#6b665d' }}>NAMA PENERIMA</label>
                                            <input aria-label="Nama penerima" autoComplete="shipping name" type="text" value={data.recipient_name} onChange={e => setData('recipient_name', e.target.value)} className="form-control" />
                                            {errors.recipient_name && <small className="text-danger">{errors.recipient_name}</small>}
                                        </div>
                                        <div className="col-12 mb-0">
                                            <label className="hm-mono mb-1" style={{ fontSize: 10.5, letterSpacing: '.1em', color: '#6b665d' }}>CATATAN PENGIRIMAN</label>
                                            <textarea aria-label="Catatan pengiriman" rows={2} value={data.notes} onChange={e => setData('notes', e.target.value)} className="form-control" />
                                            {errors.notes && <small className="text-danger">{errors.notes}</small>}
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="hm-mono mb-1" style={{ fontSize: 10.5, letterSpacing: '.1em', color: '#6b665d' }}>NO. HP / WA</label>
                                            <input aria-label="Nomor HP atau WhatsApp" autoComplete="shipping tel" type="tel" value={data.phone} onChange={e => setData('phone', e.target.value)} className="form-control" />
                                            {errors.phone && <small className="text-danger">{errors.phone}</small>}
                                        </div>
                                        <div className="col-12 mb-3">
                                            <label className="hm-mono mb-1" style={{ fontSize: 10.5, letterSpacing: '.1em', color: '#6b665d' }}>ALAMAT LENGKAP</label>
                                            <textarea aria-label="Alamat lengkap" autoComplete="shipping street-address" rows={3} value={data.address} onChange={e => setData('address', e.target.value)} className="form-control" />
                                            {errors.address && <small className="text-danger">{errors.address}</small>}
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="hm-mono mb-1" style={{ fontSize: 10.5, letterSpacing: '.1em', color: '#6b665d' }}>KOTA / KABUPATEN</label>
                                            <input aria-label="Kota atau kabupaten" autoComplete="shipping address-level2" type="text" value={data.city} onChange={e => setData('city', e.target.value)} className="form-control" />
                                            {errors.city && <small className="text-danger">{errors.city}</small>}
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="hm-mono mb-1" style={{ fontSize: 10.5, letterSpacing: '.1em', color: '#6b665d' }}>KODE POS</label>
                                            <input aria-label="Kode pos" autoComplete="shipping postal-code" inputMode="numeric" type="text" value={data.postal_code} onChange={e => setData('postal_code', e.target.value)} className="form-control" />
                                            {errors.postal_code && <small className="text-danger">{errors.postal_code}</small>}
                                        </div>
                                    </div>
                                </div>
                            </Reveal>

                            <Reveal delay={2}>
                                <div className="hm-panel p-4 mb-3">
                                    <h6 className="hm-display mb-3" style={{ fontWeight: 800 }}><i className="fas fa-truck mr-2" style={{ color: '#a9822f' }} />Pilih Ekspedisi</h6>
                                    {expedisi.map((e, i) => (
                                        <button type="button" aria-pressed={ongkirIdx === i} key={e.name} onClick={() => { setOngkirIdx(i); setData('shipping_method', e.id); }}
                                            className="atelier-shipping-option d-flex justify-content-between align-items-center p-3 mb-2"
                                            style={{
                                                cursor: 'pointer', borderRadius: 6,
                                                background: ongkirIdx === i ? 'rgba(201,169,98,.12)' : '#faf8f4',
                                                border: ongkirIdx === i ? '1px solid #c9a962' : '1px solid rgba(20,22,28,.06)',
                                            }}>
                                            <div className="text-left">
                                                <b>{ongkirIdx === i && <i className="fas fa-check-circle mr-2" style={{ color: '#a9822f' }} />}{e.name}</b>
                                                <div style={{ fontSize: 12.5, color: '#6b665d' }}>Estimasi {e.etd}</div>
                                            </div>
                                            <span style={{ color: '#a9822f', fontWeight: 900, fontSize: 16 }}>{fmt(e.price)}</span>
                                        </button>
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
                                        {Object.entries(payment_rules.methods).map(([id, m]) => {
                                            const active = paymentMethod === id;
                                            return (
                                                <button type="button" aria-pressed={active} key={id} onClick={() => { setPaymentMethod(id); setData('payment_method', id); }} className="hm-btn" style={{
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
                                        <div key={dp} aria-live="polite" className="hm-display atelier-price-update" style={{ color: '#a9822f', fontWeight: 800, fontSize: 30 }}>{fmt(dp)}</div>
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
                                        <button type="submit" disabled={processing} className="hm-btn hm-btn-gold flex-grow-1"><i className="fas fa-bolt" /> {processing ? 'Memproses...' : 'Buat Pesanan & Bayar DP'}</button>
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
            </form>
        </SketchLayout>
    );
}
