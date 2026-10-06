import { Link } from '@inertiajs/react';
import SketchLayout, { fmt } from '../../Components/Sketch/SketchLayout';

export default function ProductDetail({ product }) {
    return (
        <SketchLayout title={`${product.name} — Preset Detail`} active="Shop Preset"
            breadcrumb={[
                { label: 'Home', href: '/sketch/home', done: true },
                { label: 'Shop Preset', href: '/sketch/shop', done: true },
                { label: product.name, active: true },
            ]}>
            <div className="container-fluid py-4">
                <div className="row">
                    <div className="col-lg-7 mb-5">
                        <div className="d-flex align-items-center justify-content-center position-relative" style={{
                            height: 480, border: '2px dashed #d9d2c4', borderRadius: 12,
                            background: `linear-gradient(135deg, ${product.color}22, #fff9ef)`
                        }}>
                            <span className="position-absolute top-2 right-2 badge badge-dark">
                                <i className="fas fa-image mr-1"></i> GAMBAR PRODUK / 3D PRESET (nanti)
                            </span>
                            <i className={`fas ${product.icon}`} style={{ fontSize: 160, color: product.color, opacity: .55 }}></i>
                        </div>
                    </div>
                    <div className="col-lg-5">
                        <div className="badge badge-success mb-2"><i className="fas fa-check mr-1"></i> Preset Edition (tanpa custom)</div>
                        <h2 className="font-weight-bold mb-1" style={{ fontSize: 32 }}>{product.name} (Classic)</h2>
                        <div style={{ color: '#a7671f', fontWeight: 900, fontSize: 28 }} className="mb-3">
                            {fmt(product.price)}
                        </div>
                        <p className="text-industrial-600" style={{ lineHeight: 1.7 }}>
                            Versi preset desain jadi — langsung pilih size & checkout. Kalau mau ubah warna kulit/tali/sole,
                            klik <b>"Custom dari Preset Ini"</b>.
                        </p>

                        <div className="card mb-3 mt-4" style={{ border: '1px solid #e3ddd2' }}>
                            <div className="card-header" style={{ background: '#f9f6f1', fontWeight: 800 }}>
                                <i className="fas fa-list-check mr-2 text-success"></i> Yang Didapat:
                            </div>
                            <ul className="list-group list-group-flush" style={{ fontSize: 14 }}>
                                {product.highlights.map(h => (
                                    <li key={h} className="list-group-item"><i className="fas fa-check text-success mr-2"></i>{h}</li>
                                ))}
                                <li className="list-group-item"><i className="fas fa-clock text-warning mr-2"></i> Estimasi pengerjaan: <b>{product.lead_time}</b></li>
                                <li className="list-group-item"><i className="fas fa-shield-halved text-warning mr-2"></i> <b>Garansi 3 hari</b> (wajib video unboxing, ongkir retur = buyer)</li>
                                <li className="list-group-item"><i className="fas fa-gift text-warning mr-2"></i> Include shoe bag + care kit (cleaner + brush)</li>
                            </ul>
                        </div>

                        <div className="mb-3">
                            <div className="font-weight-bold mb-2" style={{ fontSize: 13 }}><i className="fas fa-ruler mr-1"></i> Pilih Ukuran:</div>
                            <div className="d-flex flex-wrap gap-2">
                                {product.sizes.map(sz => (
                                    <button key={sz} className="btn btn-sm px-3 py-2 font-weight-bold"
                                        style={{
                                            background: sz === 42 ? '#181714' : '#fff',
                                            color: sz === 42 ? '#ffb74d' : '#181714',
                                            border: sz === 42 ? '2px solid #ffb74d' : '1px solid #cac6bf'
                                        }}>
                                        {sz} EU
                                    </button>
                                ))}
                            </div>
                            <Link href="/sketch/sizing" className="d-inline-block mt-2" style={{ fontSize: 12, color: '#a7671f' }}>
                                <i className="fas fa-ruler-combined mr-1"></i> Bingung size? Lihat size chart & upload kaki
                            </Link>
                        </div>

                        <div className="d-flex flex-wrap gap-2 mt-4">
                            <Link href="/sketch/cart" className="btn btn-lg flex-grow-1 text-white font-weight-bold" style={{ background: '#a7671f', borderColor: '#a7671f' }}>
                                <i className="fas fa-cart-shopping mr-2"></i> Tambah ke Keranjang
                            </Link>
                            <Link href={`/sketch/custom/${product.slug}`} className="btn btn-lg flex-grow-1" style={{ background: '#fff', color: '#181714', border: '2px solid #181714' }}>
                                <i className="fas fa-sliders mr-2"></i> Custom dari Preset Ini
                            </Link>
                        </div>
                        <div className="mt-2 p-2 text-center" style={{ fontSize: 12, color: '#454039', background: '#fff4e4', borderRadius: 6 }}>
                            <i className="fas fa-circle-info mr-1"></i> <b>Pembayaran:</b> DP 50% di awal, pelunasan setelah sepatu jadi via Dashboard Order.
                        </div>
                    </div>
                </div>
            </div>
        </SketchLayout>
    );
}
