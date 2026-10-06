import { useState } from 'react';
import { Link } from '@inertiajs/react';
import SketchLayout, { fmt } from '../../Components/Sketch/SketchLayout';

export default function Checkout({ expedisi, payment_rules, subtotal, ongkir_default, alamat_default }) {
    const [ongkirIdx, setOngkirIdx] = useState(0);
    const ongkir = expedisi[ongkirIdx].price;
    const total = subtotal + ongkir;
    const dp = Math.round(total * (payment_rules.dp_pct / 100));
    const sisa = total - dp;

    return (
        <SketchLayout title="Checkout — ShoeShop Sketch" active="Home"
            breadcrumb={[
                { label: 'Home', href: '/sketch/home', done: true },
                { label: 'Pilih Model', href: '/sketch/custom', done: true },
                { label: 'Custom Detail', href: '/sketch/custom/boots', done: true },
                { label: 'Preview Konfigurasi', href: '/sketch/custom/boots/preview', done: true },
                { label: 'Pilih Ukuran', href: '/sketch/sizing', done: true },
                { label: 'Keranjang', href: '/sketch/cart', done: true },
                { label: 'Checkout', active: true },
            ]}>
            <div className="container-fluid py-4">
                <span className="badge badge-warning text-dark font-weight-bold px-3 py-1 mb-2">
                    FINAL · LANGKAH 6 dari 6
                </span>
                <h2 style={{ fontWeight: 900 }} className="mb-4">Checkout Order</h2>

                <div className="row">
                    <div className="col-lg-8 mb-4">
                        <div className="card border-0 shadow-sm mb-4">
                            <div className="card-header" style={{ background: '#181714', color: '#fff', fontWeight: 800 }}>
                                <i className="fas fa-location-dot mr-2 text-warning"></i> Alamat Pengiriman
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="font-weight-bold" style={{ fontSize: 13 }}>Nama Penerima</label>
                                        <input type="text" defaultValue={alamat_default.penerima} className="form-control" />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="font-weight-bold" style={{ fontSize: 13 }}>No. HP / WA</label>
                                        <input type="text" defaultValue={alamat_default.hp} className="form-control" />
                                    </div>
                                    <div className="col-12 mb-3">
                                        <label className="font-weight-bold" style={{ fontSize: 13 }}>Alamat Lengkap (Jalan, RT/RW, Kel, Kec)</label>
                                        <textarea rows={3} defaultValue={alamat_default.alamat} className="form-control"></textarea>
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="font-weight-bold" style={{ fontSize: 13 }}>Kota / Kabupaten</label>
                                        <select className="form-control">
                                            <option>Kota Depok</option>
                                            <option>Kota Jakarta Selatan</option>
                                            <option>Kota Tangerang Selatan</option>
                                        </select>
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="font-weight-bold" style={{ fontSize: 13 }}>Kode Pos</label>
                                        <input type="text" defaultValue="164xx" className="form-control" />
                                    </div>
                                    <div className="col-12">
                                        <label className="font-weight-bold" style={{ fontSize: 13 }}>Catatan untuk Tim Pengiriman (opsional)</label>
                                        <textarea rows={2} defaultValue={alamat_default.catatan} className="form-control"
                                            placeholder="Contoh: patokan warung nasi, pagar biru, dll"></textarea>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="card border-0 shadow-sm mb-4">
                            <div className="card-header" style={{ background: '#fff4e4', fontWeight: 800 }}>
                                <i className="fas fa-truck mr-2 text-warning"></i> Pilih Ekspedisi
                            </div>
                            <div className="list-group list-group-flush">
                                {expedisi.map((e, i) => (
                                    <div key={e.name} onClick={() => setOngkirIdx(i)}
                                        className={`list-group-item list-group-item-action p-3 ${ongkirIdx === i ? 'active' : ''}`}
                                        style={{
                                            cursor: 'pointer',
                                            background: ongkirIdx === i ? '#fff4e4' : '#fff',
                                            border: ongkirIdx === i ? '1px solid #a7671f' : '1px solid transparent'
                                        }}>
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div>
                                                <b style={{ color: ongkirIdx === i ? '#a7671f' : '#181714' }}>
                                                    {ongkirIdx === i && <i className="fas fa-check-circle mr-2"></i>}
                                                    {e.name}
                                                </b>
                                                <div style={{ fontSize: 12.5, color: '#6e685f' }}>Estimasi {e.etd}</div>
                                            </div>
                                            <div style={{ color: '#a7671f', fontWeight: 900, fontSize: 17 }}>{fmt(e.price)}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="card border-0 shadow-sm mb-4">
                            <div className="card-header" style={{ background: '#181714', color: '#fff', fontWeight: 800 }}>
                                <i className="fas fa-money-bill-transfer mr-2 text-warning"></i>
                                Pembayaran — <span style={{ color: '#ffb74d' }}>DP {payment_rules.dp_pct}%</span> di Depan
                            </div>
                            <div className="card-body">
                                <div className="p-3 mb-3 rounded" style={{ background: '#eaf5ff', fontSize: 13 }}>
                                    <i className="fas fa-circle-info mr-1 text-primary"></i>
                                    <b>Cara bayar:</b> DP 50% dibayar sekarang untuk mulai produksi. 50% sisanya (pelunasan)
                                    dibayar <b>setelah sepatu selesai produksi</b> — kamu akan diinfokan lewat WhatsApp dan
                                    tombol "Bayar Pelunasan" muncul di Dashboard Order.
                                </div>

                                <div className="font-weight-bold mb-2" style={{ fontSize: 13 }}>Pilih Metode Pembayaran DP:</div>
                                <div className="d-flex flex-wrap gap-2 mb-3">
                                    {payment_rules.methods.map(m => (
                                        <button key={m} className="btn btn-sm"
                                            style={{
                                                background: m === 'QRIS' ? '#a7671f' : '#fff',
                                                color: m === 'QRIS' ? '#fff' : '#181714',
                                                border: m === 'QRIS' ? '2px solid #a7671f' : '2px solid #e3ddd2',
                                                fontWeight: 700
                                            }}>
                                            {m === 'QRIS' && <i className="fas fa-qrcode mr-2"></i>}
                                            {m !== 'QRIS' && <i className="fas fa-building-columns mr-2"></i>}
                                            {m}
                                            {m === 'QRIS' && <span className="badge badge-light text-dark ml-2">REKOMENDASI</span>}
                                        </button>
                                    ))}
                                </div>

                                <div className="d-flex justify-content-between align-items-center p-3 rounded" style={{ background: '#fff9ef' }}>
                                    <div style={{ fontSize: 13 }}>
                                        <i className="fas fa-shield-halved mr-1 text-warning"></i>
                                        <b>Order kamu terlindungi.</b><br />
                                        Produksi mulai <b>setelah DP kami terima.</b> Gagal produksi = <b>100% refund DP.</b>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-3 mb-2 rounded" style={{ background: '#ffe5d5', fontSize: 13 }}>
                            <i className="fas fa-triangle-exclamation mr-1 text-danger"></i>
                            <b>Garansi & Retur:</b> 3 hari garansi sejak barang diterima. <b>Wajib kirim video unboxing</b>
                            penuh (dari segel utuh sampai isinya terlihat) — tanpa video, garansi tidak bisa diproses.
                            Ongkir retur ditanggung buyer.
                        </div>
                    </div>

                    <div className="col-lg-4">
                        <div className="card border-0 shadow sticky-top" style={{ top: 10 }}>
                            <div className="card-header" style={{ background: '#181714', color: '#fff', fontWeight: 800 }}>
                                Ringkasan Order
                            </div>
                            <div className="card-body">
                                <div className="d-flex justify-content-between mb-1" style={{ fontSize: 14 }}>
                                    <span>Subtotal (2 item)</span>
                                    <span><b>{fmt(subtotal)}</b></span>
                                </div>
                                <div className="d-flex justify-content-between mb-1" style={{ fontSize: 14 }}>
                                    <span><i className={`fas fa-truck mr-1`}></i> {expedisi[ongkirIdx].name}</span>
                                    <span><b>{fmt(ongkir)}</b></span>
                                </div>
                                <div className="border-top mt-2 pt-2 d-flex justify-content-between mb-1">
                                    <b>TOTAL TAGIHAN</b>
                                    <span style={{ color: '#a7671f', fontWeight: 900, fontSize: 20 }}>{fmt(total)}</span>
                                </div>
                                <div style={{ fontSize: 12, color: '#6e685f' }} className="mb-3">
                                    Estimasi {expedisi[ongkirIdx].etd} · Produksi ± 7 hari (dari DP terverifikasi)
                                </div>

                                <div className="p-3 mb-3 rounded" style={{ background: '#fff4e4' }}>
                                    <div className="font-weight-bold mb-2" style={{ fontSize: 13 }}>
                                        <i className="fas fa-credit-card mr-1 text-warning"></i>
                                        DIBAYAR SEKARANG (DP {payment_rules.dp_pct}%)
                                    </div>
                                    <div style={{ color: '#a7671f', fontWeight: 900, fontSize: 28 }} className="mb-1">
                                        {fmt(dp)}
                                    </div>
                                    <div style={{ fontSize: 12, color: '#6e685f' }}>
                                        Pelunasan nanti: <b>{fmt(sisa)}</b>
                                    </div>
                                </div>

                                <div className="form-check mb-4" style={{ fontSize: 13 }}>
                                    <input id="tos" type="checkbox" defaultChecked className="form-check-input" />
                                    <label htmlFor="tos" className="form-check-label">
                                        Saya sudah baca & setuju dengan <b>Syarat & Ketentuan</b> (DP tidak refund setelah produksi jalan, garansi 3 hari wajib video unboxing).
                                    </label>
                                </div>

                                <div className="d-flex gap-2">
                                    <Link href="/sketch/cart" className="btn btn-sm flex-grow-1"
                                        style={{ background: '#fff', color: '#181714', border: '2px solid #181714' }}>
                                        <i className="fas fa-arrow-left mr-1"></i> Keranjang
                                    </Link>
                                    <Link href="/sketch/account/orders" className="btn btn-sm flex-grow-1 text-white font-weight-bold"
                                        style={{ background: '#a7671f' }}>
                                        <i className="fas fa-bolt mr-1"></i> Bayar DP & Order
                                    </Link>
                                </div>
                                <div className="mt-2 text-center" style={{ fontSize: 11, color: '#6e685f' }}>
                                    Setelah klik, kamu akan diarahkan ke halaman pembayaran QRIS/VA.
                                    Setelah DP masuk, produksi otomatis mulai dan muncul di Dashboard Order.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </SketchLayout>
    );
}
