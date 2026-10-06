import { Link } from '@inertiajs/react';
import SketchLayout, { fmt } from '../../Components/Sketch/SketchLayout';

export default function CustomizerPreview({ model, elements, lead_time, garansi }) {
    const picks = elements.map((e, i) => ({
        el: e,
        v: e.defaults[i === 2 ? 1 : i === elements.length - 1 ? 2 : 0],
        add: i === 2 ? e.defaults[1].p : i === elements.length - 1 ? e.defaults[2].p : 0,
    }));
    const addOns = picks.reduce((t, p) => t + p.add, 0);
    const total = model.price + addOns;

    return (
        <SketchLayout title={`Review Custom ${model.name}`} active="Custom"
            breadcrumb={[
                { label: 'Home', href: '/sketch/home', done: true },
                { label: 'Pilih Model', href: '/sketch/custom', done: true },
                { label: 'Custom Detail', href: `/sketch/custom/${model.slug}`, done: true },
                { label: 'Review Konfigurasi', active: true },
                { label: 'Ukuran' },
                { label: 'Keranjang' },
                { label: 'Checkout' },
            ]}>
            <div className="container-fluid py-4">
                <span className="badge badge-warning text-dark font-weight-bold px-3 py-1 mb-2">
                    CUSTOMIZER · LANGKAH 3 dari 6
                </span>
                <h2 style={{ fontWeight: 900 }} className="mb-4">Review Konfigurasi Custom {model.name} Mu</h2>

                <div className="row">
                    <div className="col-lg-6 mb-4">
                        <div className="card border-0 shadow-sm">
                            <div className="card-header d-flex justify-content-between align-items-center"
                                style={{ background: '#181714', color: '#fff' }}>
                                <b><i className="fas fa-eye mr-2 text-warning"></i> Preview Final Visual (nanti gambar / 3D render)</b>
                                <span className="badge badge-warning text-dark font-weight-bold">
                                    360° Preview
                                </span>
                            </div>
                            <div className="d-flex align-items-center justify-content-center position-relative" style={{
                                minHeight: 420,
                                background: `linear-gradient(135deg, ${model.color}22, #fff9ef)`
                            }}>
                                <span className="position-absolute top-2 right-2 badge badge-dark">
                                    <i className="fas fa-camera mr-1"></i> Share Desain
                                </span>
                                <i className={`fas ${model.icon}`} style={{
                                    fontSize: 220, color: model.color, opacity: .7,
                                    textShadow: '0 18px 40px rgba(0,0,0,0.25)'
                                }}></i>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-6 mb-4">
                        <div className="card border-0 shadow-sm mb-3">
                            <div className="card-header" style={{ background: '#fff4e4', fontWeight: 800 }}>
                                <i className="fas fa-list-check mr-2 text-warning"></i> Detail Konfigurasi
                            </div>
                            <ul className="list-group list-group-flush" style={{ fontSize: 14 }}>
                                <li className="list-group-item d-flex justify-content-between">
                                    <b>Model</b>
                                    <span>{model.name}</span>
                                </li>
                                {picks.map(p => (
                                    <li key={p.el.slug} className="list-group-item d-flex justify-content-between align-items-center">
                                        <span>
                                            <i className={`fas ${p.el.icon} mr-2 text-industrial-400`}></i>
                                            {p.el.label}
                                        </span>
                                        <span className="text-right">
                                            <span className="font-weight-bold">{p.v.n}</span>
                                            <div style={{ fontSize: 12, color: p.add ? '#c64400' : '#2e7d32', fontWeight: 700 }}>
                                                {p.add ? `+ ${fmt(p.add)}` : 'standard'}
                                            </div>
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="card border-0 shadow-sm mb-3">
                            <ul className="list-group list-group-flush" style={{ fontSize: 13.5 }}>
                                <li className="list-group-item d-flex justify-content-between">
                                    <span className="text-industrial-600"><i className="fas fa-clock mr-1 text-warning"></i> Estimasi Produksi</span>
                                    <b>{lead_time}</b>
                                </li>
                                <li className="list-group-item d-flex justify-content-between">
                                    <span className="text-industrial-600"><i className="fas fa-shield-halved mr-1 text-warning"></i> Garansi</span>
                                    <b>{garansi}</b>
                                </li>
                            </ul>
                        </div>

                        <div className="card border-0 shadow">
                            <div className="card-body" style={{ background: '#181714', color: '#fff', borderRadius: 6 }}>
                                <div className="mb-2">
                                    <div className="d-flex justify-content-between mb-1" style={{ fontSize: 13, color: '#cac6bf' }}>
                                        <span>Base Price</span><span>{fmt(model.price)}</span>
                                    </div>
                                    {picks.filter(p => p.add > 0).map(p => (
                                        <div key={p.el.slug} className="d-flex justify-content-between mb-1" style={{ fontSize: 13, color: '#ffd89a' }}>
                                            <span>+ {p.v.n}</span><span>+ {fmt(p.add)}</span>
                                        </div>
                                    ))}
                                    <div className="d-flex justify-content-between mb-1" style={{ fontSize: 13, color: '#a8a298' }}>
                                        <span>Add-ons Total</span><span>{fmt(addOns)}</span>
                                    </div>
                                    <div className="border-top border-dark mt-2 pt-2 d-flex justify-content-between align-items-end">
                                        <span style={{ fontSize: 13, color: '#cac6bf' }}>TOTAL (sebelum ongkir & size)</span>
                                        <div style={{ color: '#ffb74d', fontWeight: 900, fontSize: 26, lineHeight: 1 }}>
                                            {fmt(total)}
                                        </div>
                                    </div>
                                </div>
                                <div className="d-flex gap-2 mt-4">
                                    <Link href={`/sketch/custom/${model.slug}`} className="btn btn-sm"
                                        style={{ background: '#ffffff14', color: '#fff', border: '1px solid #ffffff28' }}>
                                        <i className="fas fa-pen mr-1"></i> Ubah Detail Lagi
                                    </Link>
                                    <Link href="/sketch/sizing" className="btn btn-sm flex-grow-1 text-dark font-weight-bold" style={{ background: '#ffb74d' }}>
                                        Lanjut → Pilih Ukuran <i className="fas fa-ruler ml-1"></i>
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
