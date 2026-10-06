import { Head, Link } from '@inertiajs/react';

export default function ProductIndex({ products = [] }) {
    return (
        <div>
            <Head title="Katalog Sepatu" />

            <nav aria-label="breadcrumb" className="mb-3">
                <ol className="breadcrumb small" style={{ background: 'transparent', padding: 0 }}>
                    <li className="breadcrumb-item"><Link href="/" className="text-industrial-700">Beranda</Link></li>
                    <li className="breadcrumb-item active text-industrial-500" aria-current="page">Katalog</li>
                </ol>
            </nav>

            <div className="d-flex align-items-end flex-wrap justify-content-between mb-4">
                <div>
                    <h1 className="h2 font-weight-bold text-industrial-900 mb-1 uppercase-header" style={{ letterSpacing: 1 }}>
                        <i className="fas fa-store mr-2 text-leather"></i>
                        Koleksi Kulit Premium
                    </h1>
                    <p className="text-industrial-500 mb-0">
                        Pilih model favorit Anda, lalu kustomisasi material, warna, dan aksesoris secara real-time dalam 3D.
                    </p>
                </div>
                <div className="mt-2 mt-md-0">
                    <div className="badge badge-industrial px-3 py-2" style={{ background: '#181714', color: '#ffb74d', fontSize: 13, borderRadius: 4 }}>
                        <i className="fas fa-cube mr-1"></i> {products.length} Model · Didukung 3D Configurator
                    </div>
                </div>
            </div>

            <div className="row">
                {products.length === 0 && (
                    <div className="col-12">
                        <div className="alert alert-warning">
                            <i className="fas fa-triangle-exclamation mr-1"></i>
                            Belum ada produk. Jalankan <code>php artisan db:seed --class=ProductSeeder</code>
                        </div>
                    </div>
                )}

                {products.map(p => (
                    <div key={p.id} className="col-12 col-md-6 col-lg-4 mb-4">
                        <div className="card card-configurator h-100">
                            <Link
                                href={`/products/${p.slug}`}
                                className="d-block"
                                style={{
                                    height: 220,
                                    background: p.thumbnail
                                        ? `radial-gradient(ellipse at center, rgba(255,255,255,.1) 0%, rgba(0,0,0,.25) 100%), url(${p.thumbnail}) center/cover`
                                        : 'linear-gradient(135deg, #22201c 0%, #454039 100%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#fff',
                                }}
                            >
                                {!p.thumbnail && (
                                    <div className="text-center">
                                        <i className="fas fa-boot fa-4x mb-2 text-warning"></i>
                                        <div className="text-uppercase font-weight-bold" style={{ letterSpacing: 2 }}>
                                            {p.name}
                                        </div>
                                    </div>
                                )}
                                {p.thumbnail && (
                                    <div style={{
                                        position: 'absolute', bottom: 12, left: 16, right: 16,
                                        background: 'rgba(24,23,20,0.7)', padding: '8px 12px',
                                        borderRadius: 4, color: '#fff',
                                    }}>
                                        <span className="text-warning font-weight-bold mr-1">
                                            <i className="fas fa-cube mr-1"></i> 3D
                                        </span>
                                        <small className="opacity-90">Klik untuk kustomisasi</small>
                                    </div>
                                )}
                            </Link>
                            <div className="card-body d-flex flex-column">
                                <div className="d-flex justify-content-between align-items-start mb-2">
                                    <h5 className="card-title font-weight-bold text-industrial-900 mb-0">{p.name}</h5>
                                    <span className="badge badge-dark p-2" style={{ background: '#302d29' }}>
                                        Handmade
                                    </span>
                                </div>
                                <div className="text-leather font-weight-bold rupiah-font" style={{ fontSize: '1.35rem' }}>
                                    {new Intl.NumberFormat('id-ID', {
                                        style: 'currency', currency: 'IDR', maximumFractionDigits: 0
                                    }).format(p.base_price)}
                                </div>
                                <div className="mt-auto pt-3 d-flex gap-2">
                                    <Link
                                        href={`/products/${p.slug}`}
                                        className="btn btn-industrial-primary flex-grow-1 py-2"
                                    >
                                        <i className="fas fa-sliders mr-1"></i> Customize
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
