import { Head, Link } from '@inertiajs/react';
import ShoeConfigurator from '../../Components/ShoeConfigurator/index.jsx';

export default function ProductShow({ product, category_labels, customization_options }) {
    return (
        <div>
            <Head title={product?.name || 'Produk'} />

            <nav aria-label="breadcrumb" className="mb-3">
                <ol className="breadcrumb small" style={{ background: 'transparent', padding: 0 }}>
                    <li className="breadcrumb-item">
                        <Link href="/products" className="text-industrial-700">
                            <i className="fas fa-store mr-1"></i>Katalog
                        </Link>
                    </li>
                    <li className="breadcrumb-item active text-industrial-500" aria-current="page">
                        {product?.name}
                    </li>
                </ol>
            </nav>

            <div className="row mb-3">
                <div className="col-12 col-lg-8">
                    <h1 className="h2 font-weight-bold text-industrial-900 mb-1 uppercase-header" style={{ letterSpacing: .5 }}>
                        {product?.name}
                    </h1>
                    <div className="d-flex align-items-center gap-3 text-industrial-500 mb-2">
                        <span className="d-inline-flex align-items-center">
                            <i className="fas fa-leaf mr-1 text-success"></i>
                            Kulit Full Grain
                        </span>
                        <span className="d-inline-flex align-items-center">
                            <i className="fas fa-industry mr-1 text-warning"></i>
                            Goodyear Welt Construction
                        </span>
                        <span className="d-inline-flex align-items-center">
                            <i className="fas fa-hand-holding-heart mr-1 text-leather"></i>
                            Handcrafted ID
                        </span>
                    </div>
                    {product?.description && (
                        <p className="text-industrial-700 mb-0" style={{ lineHeight: 1.7 }}>
                            {product.description}
                        </p>
                    )}
                </div>
            </div>

            <ShoeConfigurator
                product={product}
                categoryLabels={category_labels}
                customizationOptions={customization_options}
            />

            <div className="row mt-5">
                <div className="col-12 col-md-6">
                    <div className="card card-configurator border-0">
                        <div className="card-body">
                            <h5 className="font-weight-bold text-industrial-900 mb-3">
                                <i className="fas fa-info-circle mr-2 text-leather"></i>
                                Detail Produk
                            </h5>
                            <ul className="list-unstyled text-industrial-700 mb-0" style={{ lineHeight: 2 }}>
                                <li><i className="fas fa-check-circle text-success mr-2"></i> Bahan kulit sapi pilihan (Full Grain)</li>
                                <li><i className="fas fa-check-circle text-success mr-2"></i> Konstruksi Jahit Goodyear Welt</li>
                                <li><i className="fas fa-check-circle text-success mr-2"></i> Tahan air ringan (water repellent)</li>
                                <li><i className="fas fa-check-circle text-success mr-2"></i> Anti slip outsole</li>
                                <li><i className="fas fa-check-circle text-success mr-2"></i> Include shoe bag + perawatan kit</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-md-6 mt-3 mt-md-0">
                    <div className="card card-configurator border-0">
                        <div className="card-body">
                            <h5 className="font-weight-bold text-industrial-900 mb-3">
                                <i className="fas fa-shield-halved mr-2 text-leather"></i>
                                Garansi & Layanan
                            </h5>
                            <ul className="list-unstyled text-industrial-700 mb-0" style={{ lineHeight: 2 }}>
                                <li><i className="fas fa-shield-alt text-warning mr-2"></i> Garansi jahitan 12 bulan</li>
                                <li><i className="fas fa-shield-alt text-warning mr-2"></i> Garansi sole terlepas 6 bulan</li>
                                <li><i className="fas fa-shield-alt text-warning mr-2"></i> Free re-soling pertama</li>
                                <li><i className="fas fa-shield-alt text-warning mr-2"></i> Konsultasi perawatan gratis seumur hidup</li>
                                <li><i className="fas fa-truck text-success mr-2"></i> Gratis ongkir Jabodetabek</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
