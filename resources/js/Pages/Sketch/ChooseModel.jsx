import { Link } from '@inertiajs/react';
import SketchLayout, { fmt } from '../../Components/Sketch/SketchLayout';

export default function ChooseModel({ models }) {
    return (
        <SketchLayout title="Pilih Model — Custom ShoeShop" active="Custom"
            breadcrumb={[
                { label: 'Home', href: '/sketch/home', done: true },
                { label: 'Pilih Model Custom', active: true },
                { label: 'Pilih Material & Detail' },
                { label: 'Preview Konfigurasi' },
                { label: 'Ukuran' },
                { label: 'Keranjang' },
                { label: 'Checkout' },
            ]}>
            <div className="container-fluid py-4">
                <div className="row mb-4">
                    <div className="col-lg-10">
                        <span className="badge badge-warning text-dark font-weight-bold px-3 py-1 mb-2">
                            CUSTOMIZER · LANGKAH 1 dari 6
                        </span>
                        <h2 style={{ fontWeight: 900 }}>Pilih Silhouette Model</h2>
                        <p className="text-industrial-600 mb-0">
                            Pilih base model yang kamu suka — nanti di langkah berikutnya kamu bisa ubah SEMUA detail (kulit, benang,
                            eyelet, tali, outsole, welt, panel Chelsea — total 8 elemen).
                        </p>
                    </div>
                </div>

                <div className="row">
                    {models.map((m, idx) => (
                        <div key={m.slug} className="col-lg-4 col-md-6 mb-4">
                            <Link href={`/sketch/custom/${m.slug}`} className="text-decoration-none text-dark">
                                <div className="card h-100 border-0 shadow-sm position-relative" style={{ transition: 'all .2s', border: '2px solid transparent' }}
                                    onMouseEnter={e => e.currentTarget.style.borderColor = '#a7671f'}
                                    onMouseLeave={e => e.currentTarget.style.borderColor = 'transparent'}>
                                    <span className="position-absolute top-2 left-2 badge badge-dark font-weight-bold">MODEL {String(idx + 1).padStart(2, '0')}</span>
                                    <div className="d-flex align-items-center justify-content-center" style={{
                                        height: 260, background: `linear-gradient(135deg, ${m.color}30, #f4f1ec)`
                                    }}>
                                        <i className={`fas ${m.icon}`} style={{ fontSize: 120, color: m.color, opacity: .6 }}></i>
                                    </div>
                                    <div className="card-body">
                                        <h5 className="font-weight-bold mb-1">{m.name}</h5>
                                        <p className="text-industrial-600 mb-3" style={{ fontSize: 13, minHeight: 40 }}>{m.desc}</p>
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div>
                                                <div className="text-industrial-500" style={{ fontSize: 11 }}>BASE PRICE (belum opsi)</div>
                                                <div style={{ color: '#a7671f', fontWeight: 900, fontSize: 22 }}>{fmt(m.price)}</div>
                                            </div>
                                            <div className="btn" style={{ background: '#181714', color: '#ffb74d' }}>
                                                Pilih ini <i className="fas fa-arrow-right ml-2"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </SketchLayout>
    );
}
