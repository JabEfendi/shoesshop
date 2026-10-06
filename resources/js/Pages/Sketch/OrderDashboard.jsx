import { Link } from '@inertiajs/react';
import SketchLayout, { fmt } from '../../Components/Sketch/SketchLayout';

function StatusBadge({ s }) {
    if (s === 'done')    return <span className="badge badge-success"><i className="fas fa-check mr-1"></i>Selesai</span>;
    if (s === 'active')  return <span className="badge badge-warning text-dark"><i className="fas fa-gears mr-1 fa-spin"></i>Sedang dikerjakan</span>;
    return <span className="badge badge-secondary">Menunggu</span>;
}

export default function OrderDashboard({ orders }) {
    return (
        <SketchLayout title="Order Dashboard — ShoeShop" active="Orders"
            breadcrumb={[
                { label: 'Home', href: '/sketch/home', done: true },
                { label: 'Account', active: true },
                { label: 'Pesanan & Status Produksi' },
                { label: 'Pelunasan' },
                { label: 'Garansi' },
            ]}>
            <div className="container-fluid py-4">
                <div className="row mb-4">
                    <div className="col">
                        <span className="badge badge-warning text-dark font-weight-bold px-3 py-1 mb-2">
                            ACCOUNT · ORDER DASHBOARD
                        </span>
                        <h2 style={{ fontWeight: 900 }} className="mb-1">Pesanan, Produksi, & Pelunasan</h2>
                        <p className="text-industrial-600 mb-0">
                            Cek status produksi sepatu kamu, bayar pelunasan, dan klaim garansi dari satu tempat.
                        </p>
                    </div>
                </div>

                <div className="row mb-4">
                    <div className="col-md-3 mb-2">
                        <div className="card border-0 shadow-sm">
                            <div className="card-body p-3">
                                <div className="text-industrial-500" style={{ fontSize: 12 }}>Total Order</div>
                                <div style={{ fontSize: 24, fontWeight: 900 }}>{orders.length}</div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3 mb-2">
                        <div className="card border-0 shadow-sm">
                            <div className="card-body p-3">
                                <div className="text-industrial-500" style={{ fontSize: 12 }}>Dalam Produksi</div>
                                <div style={{ fontSize: 24, fontWeight: 900, color: '#a7671f' }}>1</div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3 mb-2">
                        <div className="card border-0 shadow-sm">
                            <div className="card-body p-3">
                                <div className="text-industrial-500" style={{ fontSize: 12 }}>Sisa Pelunasan</div>
                                <div style={{ fontSize: 24, fontWeight: 900, color: '#c64400' }}>
                                    {fmt(orders[0].tagihan.pelunasan_sisa)}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3 mb-2">
                        <div className="card border-0 shadow-sm">
                            <div className="card-body p-3">
                                <div className="text-industrial-500" style={{ fontSize: 12 }}>Garansi Aktif</div>
                                <div style={{ fontSize: 24, fontWeight: 900, color: '#2e7d32' }}>{orders.filter(o => o.garansi.claimable).length}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-12">
                        {orders.map((o, idx) => (
                            <div key={o.id} className="card border-0 shadow-sm mb-4">
                                <div className="card-header d-flex flex-wrap justify-content-between align-items-center"
                                    style={{ background: idx === 0 ? '#181714' : '#f9f6f1', color: idx === 0 ? '#fff' : '#181714' }}>
                                    <div>
                                        <span className="badge badge-warning text-dark mr-2 font-weight-bold">
                                            #{o.id}
                                        </span>
                                        <span className="font-weight-bold mr-2">{o.items[0].n}</span>
                                        <span className={idx === 0 ? 'text-industrial-300' : 'text-industrial-500'} style={{ fontSize: 12 }}>
                                            <i className="fas fa-calendar mr-1"></i> {o.tgl} · Size EU {o.items[0].size}
                                        </span>
                                    </div>
                                    {idx === 0 && <span className="badge badge-warning text-dark font-weight-bold px-3 py-1"><i className="fas fa-gears mr-1 fa-spin"></i>PRODUKSI BERJALAN</span>}
                                    {idx === 1 && <span className="badge badge-success font-weight-bold px-3 py-1"><i className="fas fa-check mr-1"></i>SUDAH DITERIMA</span>}
                                </div>
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-lg-7 mb-4">
                                            <div className="font-weight-bold mb-2" style={{ fontSize: 13 }}>
                                                <i className="fas fa-diagram-project mr-1 text-warning"></i>
                                                Timeline Produksi — <span className="badge badge-info text-white px-2 py-1 ml-1">{o.estimasi}</span>
                                            </div>
                                            <div className="d-flex flex-column gap-1">
                                                {o.produksi.map((s, si) => (
                                                    <div key={s.label} className={`p-2 rounded d-flex align-items-center justify-content-between ${s.status === 'active' ? 'bg-warning bg-opacity-10' : ''}`}
                                                        style={{ border: s.status === 'active' ? '1px solid #ffd080' : '1px solid transparent' }}>
                                                        <div className="d-flex align-items-center gap-2">
                                                            <span className="badge font-weight-bold"
                                                                style={{
                                                                    minWidth: 26,
                                                                    background: s.status === 'done' ? '#2e7d32' : s.status === 'active' ? '#a7671f' : '#cac6bf',
                                                                    color: '#fff', borderRadius: 14
                                                                }}>
                                                                {s.status === 'done' ? <i className="fas fa-check"></i> : si + 1}
                                                            </span>
                                                            <span style={{ fontSize: 13, fontWeight: s.status === 'active' ? 800 : 600 }}>{s.label}</span>
                                                        </div>
                                                        <StatusBadge s={s.status} />
                                                    </div>
                                                ))}
                                            </div>

                                            {idx === 0 && (
                                                <div className="mt-4 p-3 rounded" style={{ background: '#eaf5ff', fontSize: 13 }}>
                                                    <i className="fas fa-clock mr-1 text-primary"></i>
                                                    <b>Update terakhir (contoh):</b> Pemotongan pola ~50% selesai. Hari Rabu besok masuk tahap jahit upper.
                                                    <br />
                                                    <span style={{ fontSize: 12, color: '#6e685f' }}>
                                                        (Nanti update real akan push notifikasi WA + email otomatis setiap step berganti status)
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="col-lg-5">
                                            <div className="card border-0 shadow-sm h-100">
                                                <div className="card-header" style={{ background: '#fff4e4', fontWeight: 800 }}>
                                                    <i className="fas fa-sack-dollar mr-1 text-warning"></i>
                                                    Tagihan & Pelunasan
                                                </div>
                                                <ul className="list-group list-group-flush" style={{ fontSize: 13.5 }}>
                                                    <li className="list-group-item d-flex justify-content-between">
                                                        <span>Total Tagihan</span>
                                                        <b>{fmt(o.tagihan.total)}</b>
                                                    </li>
                                                    <li className="list-group-item d-flex justify-content-between">
                                                        <span>
                                                            DP {Math.round(o.tagihan.dp / o.tagihan.total * 100)}%
                                                            <span className="badge badge-success ml-2"><i className="fas fa-check mr-1"></i>LUNAS</span>
                                                        </span>
                                                        <b className="text-success">{fmt(o.tagihan.dp)}</b>
                                                    </li>
                                                    <li className="list-group-item d-flex justify-content-between bg-white"
                                                        style={{ background: o.tagihan.pelunasan_sisa > 0 ? '#fff4e4' : '#e9f7ea' }}>
                                                        <span className="font-weight-bold">
                                                            {o.tagihan.pelunasan_sisa > 0 ? 'Sisa Pelunasan' : 'Pelunasan'}
                                                            <span className={`badge ml-2 ${o.tagihan.lunas ? 'badge-success' : 'badge-warning text-dark'}`}>
                                                                {o.tagihan.lunas ? <><i className="fas fa-check mr-1"></i>LUNAS</> : 'BELUM LUNAS'}
                                                            </span>
                                                        </span>
                                                        <b style={{ color: o.tagihan.lunas ? '#2e7d32' : '#c64400', fontSize: 18 }}>
                                                            {fmt(o.tagihan.pelunasan_sisa)}
                                                        </b>
                                                    </li>
                                                </ul>

                                                {!o.tagihan.lunas && (
                                                    <div className="p-3">
                                                        <button className="btn btn-block font-weight-bold text-white" style={{ background: '#a7671f' }}>
                                                            <i className="fas fa-credit-card mr-1"></i>
                                                            Bayar Pelunasan Sekarang
                                                        </button>
                                                        <div className="mt-2 text-industrial-500" style={{ fontSize: 11.5 }}>
                                                            Pelunasan akan tersedia untuk dibayar setelah status "Selesai Produksi".
                                                            Bayar → order lanjut ke packing & kirim.
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="card border-0 shadow-sm mt-3">
                                                <div className="card-header d-flex justify-content-between align-items-center" style={{ background: '#181714', color: '#fff' }}>
                                                    <span style={{ fontWeight: 800 }}><i className="fas fa-shield-halved mr-1 text-warning"></i> Garansi</span>
                                                    {o.garansi.claimable && (
                                                        <span className="badge badge-success">
                                                            Aktif s/d {o.garansi.sampai}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="card-body" style={{ fontSize: 13 }}>
                                                    <div className="mb-2">Syarat: {o.garansi.syarat}</div>
                                                    <div className="d-flex gap-2">
                                                        <button className="btn btn-sm flex-grow-1" style={{ background: '#181714', color: '#ffb74d' }}>
                                                            <i className="fas fa-file-invoice mr-1"></i> Klaim Garansi
                                                        </button>
                                                        <button className="btn btn-sm flex-grow-1" style={{ background: '#fff', color: '#181714', border: '1px solid #181714' }}>
                                                            <i className="fas fa-rotate mr-1"></i> Re-Soling Pertama (Gratis!)
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </SketchLayout>
    );
}
