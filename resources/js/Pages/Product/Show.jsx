import { Link } from '@inertiajs/react';
import ShoeConfigurator from '../../Components/ShoeConfigurator/index.jsx';
import SketchLayout from '../../Components/Sketch/SketchLayout';
import { Hero, Reveal } from '../../Components/Parallax/index.jsx';

export default function ProductShow({ product, category_labels, customization_options }) {
    return (
        <SketchLayout title={product?.name || 'Produk'} active="Custom"
            breadcrumb={[
                { label: 'Home', href: '/sketch/home', done: true },
                { label: 'Katalog', href: '/products', done: true },
                { label: product?.name, active: true },
            ]}>
            <Hero
                image="/assets/images/products/boots/front-side.jpeg"
                imageSpeed={0.16}
                height="42vh"
                minHeight={320}
                eyebrow="3D Configurator"
                kickerIcon="fas fa-cube"
                title={product?.name}
                subtitle="Kustomisasi material, warna, dan aksesori secara real-time. Putar model 360°, zoom, dan lihat harga berubah langsung."
            />

            <section style={{ background: '#f7f3ec', padding: 'clamp(36px,5vw,64px) 0' }}>
                <div className="hm-container">
                    <Reveal>
                        <ShoeConfigurator
                            product={product}
                            categoryLabels={category_labels}
                            customizationOptions={customization_options}
                        />
                    </Reveal>

                    <div className="row mt-5">
                        <div className="col-md-6 mb-3">
                            <Reveal>
                                <div className="hm-panel p-4 h-100">
                                    <h5 className="hm-display mb-3" style={{ fontWeight: 800 }}>
                                        <i className="fas fa-info-circle mr-2" style={{ color: '#a9822f' }} />Detail Produk
                                    </h5>
                                    <ul className="list-unstyled mb-0" style={{ lineHeight: 2, fontSize: 13.5, color: '#55524c' }}>
                                        <li><i className="fas fa-check mr-2" style={{ color: '#4a7c59', fontSize: 11 }} />Bahan kulit sapi pilihan (Full Grain)</li>
                                        <li><i className="fas fa-check mr-2" style={{ color: '#4a7c59', fontSize: 11 }} />Konstruksi jahit Goodyear Welt</li>
                                        <li><i className="fas fa-check mr-2" style={{ color: '#4a7c59', fontSize: 11 }} />Tahan air ringan (water repellent)</li>
                                        <li><i className="fas fa-check mr-2" style={{ color: '#4a7c59', fontSize: 11 }} />Anti-slip outsole</li>
                                        <li><i className="fas fa-check mr-2" style={{ color: '#4a7c59', fontSize: 11 }} />Include shoe bag + perawatan kit</li>
                                    </ul>
                                </div>
                            </Reveal>
                        </div>
                        <div className="col-md-6 mb-3">
                            <Reveal delay={1}>
                                <div className="hm-panel p-4 h-100">
                                    <h5 className="hm-display mb-3" style={{ fontWeight: 800 }}>
                                        <i className="fas fa-shield-halved mr-2" style={{ color: '#a9822f' }} />Garansi & Layanan
                                    </h5>
                                    <ul className="list-unstyled mb-0" style={{ lineHeight: 2, fontSize: 13.5, color: '#55524c' }}>
                                        <li><i className="fas fa-shield-alt mr-2" style={{ color: '#a9822f', fontSize: 11 }} />Garansi jahitan 12 bulan</li>
                                        <li><i className="fas fa-shield-alt mr-2" style={{ color: '#a9822f', fontSize: 11 }} />Garansi sole terlepas 6 bulan</li>
                                        <li><i className="fas fa-shield-alt mr-2" style={{ color: '#a9822f', fontSize: 11 }} />Free re-soling pertama</li>
                                        <li><i className="fas fa-shield-alt mr-2" style={{ color: '#a9822f', fontSize: 11 }} />Konsultasi perawatan gratis seumur hidup</li>
                                        <li><i className="fas fa-truck mr-2" style={{ color: '#4a7c59', fontSize: 11 }} />Gratis ongkir Jabodetabek</li>
                                    </ul>
                                </div>
                            </Reveal>
                        </div>
                    </div>
                </div>
            </section>
        </SketchLayout>
    );
}
