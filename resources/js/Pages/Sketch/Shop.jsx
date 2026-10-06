import { Link } from '@inertiajs/react';
import SketchLayout, { fmt } from '../../Components/Sketch/SketchLayout';

export default function Shop({ presets }) {
    return (
        <SketchLayout title="Shop Preset — ShoeShop Sketch" active="Shop Preset"
            breadcrumb={[
                { label: 'Home', href: '/sketch/home', done: true },
                { label: 'Shop Preset', active: true },
            ]}>
            <div className="container-fluid py-4">
                <div className="row mb-4">
                    <div className="col-md-8">
                        <h2 style={{ fontWeight: 900 }}>Shop Preset</h2>
                        <p className="text-industrial-600 mb-0">
                            Desain desain jadi yang tidak perlu di-custom lagi. Bisa langsung pilih size & checkout.
                            Atau klik <b>"Custom dari Preset Ini"</b> untuk ubah detail lagi.
                        </p>
                    </div>
                    <div className="col-md-4 text-right">
                        <Link href="/sketch/custom" className="btn btn-sm font-weight-bold" style={{ background: '#a7671f', color: '#fff' }}>
                            <i className="fas fa-sliders mr-2"></i> Ingin Custom dari Nol?
                        </Link>
                    </div>
                </div>

                <div className="row">
                    {presets.map(p => (
                        <div key={p.slug} className="col-xl-4 col-lg-6 mb-4">
                            <div className="card h-100 border-0 shadow-sm">
                                <div className="position-relative d-flex align-items-center justify-content-center" style={{
                                    height: 240, background: `linear-gradient(135deg, ${p.color}25, #f4f1ec)`
                                }}>
                                    <span className="position-absolute top-2 left-2 badge badge-success font-weight-bold">
                                        <i className="fas fa-check-circle mr-1"></i> PRESET
                                    </span>
                                    <i className={`fas ${p.icon}`} style={{ fontSize: 90, color: p.color, opacity: .55 }}></i>
                                </div>
                                <div className="card-body">
                                    <h5 className="font-weight-bold mb-1">{p.name}</h5>
                                    <p className="text-industrial-600 mb-3" style={{ fontSize: 13 }}>{p.desc}</p>
                                    <div className="mb-3">
                                        <div className="text-industrial-700 font-weight-bold mb-2" style={{ fontSize: 12 }}>Varian Preset:</div>
                                        {p.preset_variants.map((v, i) => (
                                            <div key={i} className="d-flex align-items-center justify-content-between py-2 px-3 mb-2 rounded"
                                                style={{ background: i === 0 ? '#fff4e4' : '#faf8f4', border: i === 0 ? '1px solid #ffd080' : '1px solid transparent', cursor: 'pointer' }}>
                                                <span style={{ fontSize: 13, fontWeight: i === 0 ? 700 : 500 }}>
                                                    {i === 0 && <i className="fas fa-check text-success mr-2"></i>}
                                                    {v.n}
                                                </span>
                                                <span style={{ color: '#a7671f', fontWeight: 800, fontSize: 14 }}>{fmt(v.p)}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="d-flex gap-2">
                                        <Link href={`/sketch/shop/${p.slug}`} className="btn btn-sm flex-grow-1" style={{ background: '#181714', color: '#fff' }}>
                                            <i className="fas fa-circle-info mr-1"></i> Detail
                                        </Link>
                                        <Link href={`/sketch/custom/${p.slug}`} className="btn btn-sm flex-grow-1" style={{ background: '#fff', color: '#a7671f', border: '1px solid #a7671f' }}>
                                            <i className="fas fa-sliders mr-1"></i> Custom lagi
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </SketchLayout>
    );
}
