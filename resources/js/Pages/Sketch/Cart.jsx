import { Link } from '@inertiajs/react';
import SketchLayout, { fmt } from '../../Components/Sketch/SketchLayout';

export default function Cart({ items, subtotal }) {
    return (
        <SketchLayout title="Keranjang — ShoeShop Sketch" active="Home"
            breadcrumb={[
                { label: 'Home', href: '/sketch/home', done: true },
                { label: 'Pilih Model', href: '/sketch/custom', done: true },
                { label: 'Custom Detail', href: '/sketch/custom/boots', done: true },
                { label: 'Preview Konfigurasi', href: '/sketch/custom/boots/preview', done: true },
                { label: 'Pilih Ukuran', href: '/sketch/sizing', done: true },
                { label: 'Keranjang', active: true },
                { label: 'Checkout' },
            ]}>
            <div className="container-fluid py-4">
                <div className="row mb-3">
                    <div className="col">
                        <span className="badge badge-warning text-dark font-weight-bold px-3 py-1 mb-2">
                            LANGKAH 5 dari 6
                        </span>
                        <h2 style={{ fontWeight: 900 }}>Review Keranjang</h2>
                    </div>
                    <div className="col text-right align-self-end">
                        <Link href="/sketch/shop" className="btn btn-sm" style={{ background: '#fff', color: '#181714', border: '2px solid #181714' }}>
                            <i className="fas fa-plus mr-1"></i> Tambah Produk Lain
                        </Link>
                    </div>
                </div>

                <div className="row">
                    <div className="col-lg-8 mb-4">
                        <div className="card border-0 shadow-sm">
                            <div className="card-header d-flex justify-content-between align-items-center" style={{ background: '#f9f6f1', fontWeight: 800 }}>
                                <span>Item di Keranjang ({items.length})</span>
                                <span style={{ fontSize: 12, color: '#6e685f' }}>Qty × Size × Variant dapat diubah</span>
                            </div>
                            <div className="list-group list-group-flush">
                                {items.map(it => (
                                    <div key={it.id} className="list-group-item p-4">
                                        <div className="row">
                                            <div className="col-3 col-lg-2">
                                                <div className="d-flex align-items-center justify-content-center h-100 rounded"
                                                    style={{ minHeight: 80, background: '#f4f1ec' }}>
                                                    <i className={`fas ${it.type === 'custom' ? 'fa-sliders' : 'fa-store'} text-industrial-400`} style={{ fontSize: 36 }}></i>
                                                </div>
                                            </div>
                                            <div className="col-9 col-lg-6">
                                                <div className="d-flex align-items-start justify-content-between mb-2">
                                                    <div>
                                                        {it.type === 'custom' && (
                                                            <span className="badge badge-warning text-dark mr-2 font-weight-bold">
                                                                <i className="fas fa-sliders mr-1"></i> CUSTOM
                                                            </span>
                                                        )}
                                                        {it.type === 'preset' && (
                                                            <span className="badge badge-success mr-2 font-weight-bold">
                                                                <i className="fas fa-check mr-1"></i> PRESET
                                                            </span>
                                                        )}
                                                        <b style={{ fontSize: 15 }}>{it.name}</b>
                                                    </div>
                                                    <button className="btn btn-sm text-danger" style={{ fontSize: 12 }}>
                                                        <i className="fas fa-trash mr-1"></i> Hapus
                                                    </button>
                                                </div>
                                                <div className="text-industrial-600 mb-2" style={{ fontSize: 12.5 }}>
                                                    {it.variant_summary}
                                                </div>
                                                <div className="d-flex align-items-center gap-3 mb-2" style={{ fontSize: 13 }}>
                                                    <span className="px-2 py-1 rounded font-weight-bold"
                                                        style={{ background: '#181714', color: '#ffb74d' }}>
                                                        Size EU {it.size}
                                                    </span>
                                                    <span className="text-industrial-600">Qty:</span>
                                                    <div className="d-flex align-items-center" style={{ border: '1px solid #e3ddd2', borderRadius: 6 }}>
                                                        <button className="btn btn-sm py-0 px-2" style={{ color: '#181714' }}>−</button>
                                                        <span className="px-3 py-1 font-weight-bold">{it.qty}</span>
                                                        <button className="btn btn-sm py-0 px-2" style={{ color: '#181714' }}>+</button>
                                                    </div>
                                                </div>
                                                {it.type === 'custom' && (
                                                    <Link href={`/sketch/custom/boots`} style={{ fontSize: 12, color: '#a7671f' }}>
                                                        <i className="fas fa-pen mr-1"></i> Ubah konfigurasi custom ini
                                                    </Link>
                                                )}
                                            </div>
                                            <div className="col-lg-4 mt-2 mt-lg-0 text-right">
                                                <div style={{ fontSize: 12, color: '#6e685f' }}>
                                                    Base {fmt(it.base_price)}
                                                    {it.add_ons > 0 && <span> + add-ons {fmt(it.add_ons)}</span>}
                                                </div>
                                                <div style={{ color: '#a7671f', fontWeight: 900, fontSize: 20 }}>
                                                    {fmt(it.unit_total)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mt-3 p-3" style={{ background: '#fff4e4', borderRadius: 8, fontSize: 13 }}>
                            <i className="fas fa-shield-halved mr-1 text-warning"></i>
                            <b>Info pembayaran:</b> Saat checkout kamu bayar <b>DP 50%</b> saja. Pelunasan 50% sisanya dibayar <b>setelah sepatu selesai produksi</b>
                            (dikasih tahu lewat WhatsApp + dashboard order).
                        </div>
                    </div>

                    <div className="col-lg-4">
                        <div className="card border-0 shadow sticky-top" style={{ top: 10 }}>
                            <div className="card-body">
                                <h6 className="font-weight-bold mb-3"><i className="fas fa-sack-dollar mr-2 text-warning"></i> Ringkasan Harga</h6>
                                <div className="d-flex justify-content-between mb-1" style={{ fontSize: 14 }}>
                                    <span>Subtotal ({items.length} item)</span>
                                    <span><b>{fmt(subtotal)}</b></span>
                                </div>
                                <div className="d-flex justify-content-between mb-1" style={{ fontSize: 13, color: '#6e685f' }}>
                                    <span><i className="fas fa-truck mr-1"></i> Ongkir (estimasi)</span>
                                    <span>Pilih di Checkout</span>
                                </div>
                                <div className="d-flex justify-content-between mb-1" style={{ fontSize: 13, color: '#2e7d32' }}>
                                    <span><i className="fas fa-percent mr-1"></i> Diskon</span>
                                    <span>Belum ada</span>
                                </div>
                                <div className="border-top mt-3 pt-3 d-flex justify-content-between align-items-end">
                                    <span style={{ fontSize: 14, fontWeight: 700 }}>Estimasi TOTAL</span>
                                    <div style={{ color: '#a7671f', fontWeight: 900, fontSize: 24 }}>
                                        {fmt(subtotal)}
                                    </div>
                                </div>

                                <div className="mt-4 p-3 rounded" style={{ background: '#181714', color: '#fff' }}>
                                    <div className="mb-2"><b>Estimasi yang dibayar sekarang (DP 50%):</b></div>
                                    <div style={{ color: '#ffb74d', fontWeight: 900, fontSize: 22 }} className="mb-2">
                                        {fmt(Math.round(subtotal * 0.5))}
                                    </div>
                                    <div style={{ fontSize: 11, color: '#a8a298' }}>
                                        Sisa pelunasan {fmt(Math.round(subtotal * 0.5))} dibayar setelah sepatu selesai dibuat.
                                    </div>
                                </div>

                                <div className="d-flex gap-2 mt-4">
                                    <Link href="/sketch/sizing" className="btn btn-sm flex-grow-1"
                                        style={{ background: '#fff', color: '#181714', border: '2px solid #181714' }}>
                                        <i className="fas fa-arrow-left mr-1"></i> Kembali
                                    </Link>
                                    <Link href="/sketch/checkout" className="btn btn-sm flex-grow-1 text-white font-weight-bold" style={{ background: '#a7671f' }}>
                                        Lanjut Checkout <i className="fas fa-arrow-right ml-1"></i>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </SketchLayout>
    );
}
