import { useState } from 'react';
import { Link } from '@inertiajs/react';
import SketchLayout, { fmt } from '../../Components/Sketch/SketchLayout';
import { Hero, Reveal, SectionHeading } from '../../Components/Parallax/index.jsx';

export default function ProductIndex({ products = [] }) {
    const [query, setQuery] = useState('');
    const visible = products.filter(p => p.name.toLowerCase().includes(query.trim().toLowerCase()));
    return (
        <SketchLayout title="Katalog Sepatu — SHOESHOP.ID" active="Collection"
            breadcrumb={[
                { label: 'Home', href: '/sketch/home', done: true },
                { label: 'Katalog', active: true },
            ]}>
            <Hero
                image="/assets/images/products/boots/boots.jpeg"
                imageSpeed={0.18}
                height="52vh"
                minHeight={380}
                eyebrow="Katalog 3D Configurator"
                kickerIcon="fas fa-store"
                title={<>Koleksi <span className="accent">Kulit Premium</span></>}
                subtitle="Pilih model, lalu kustomisasi material, warna, dan aksesori secara real-time dalam 3D."
            />

            <section style={{ background: '#f7f3ec', padding: 'clamp(48px,6vw,80px) 0' }}>
                <div className="hm-container">
                    <SectionHeading eyebrow={`${products.length} Model`} title="Didukung 3D Configurator" />
                    <div className="atelier-toolbar"><label htmlFor="catalog-search">Temukan model <input id="catalog-search" type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Nama model..." className="form-control" /></label><span className="hm-mono" aria-live="polite">{visible.length} model ditemukan</span></div>
                    {products.length > 0 && visible.length === 0 && <p>Tidak ada model yang cocok. Coba nama lain.</p>}
                    <div className="row atelier-collection">
                        {products.length === 0 && (
                            <div className="col-12">
                                <div className="hm-panel p-4">
                                    <i className="fas fa-triangle-exclamation mr-2" style={{ color: '#a9822f' }} />
                                    Belum ada produk. Jalankan <code>php artisan db:seed --class=ProductSeeder</code>
                                </div>
                            </div>
                        )}
                        {visible.map((p, i) => (
                            <div key={p.id} className="col-lg-4 col-md-6 mb-4">
                                <Reveal delay={(i % 3) + 1}>
                                    <div className="hm-card h-100">
                                        <Link href={`/products/${p.slug}`} className="text-decoration-none">
                                            <div style={{
                                                height: 230,
                                                background: p.thumbnail
                                                    ? `linear-gradient(180deg, rgba(12,13,17,0), rgba(12,13,17,.45)), url(${p.thumbnail}) center/cover`
                                                    : 'linear-gradient(135deg,#1b2a4a,#334155)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
                                            }}>
                                                {!p.thumbnail && <i className="fas fa-boot fa-4x" style={{ color: 'var(--hm-brass)' }} />}
                                            </div>
                                        </Link>
                                        <div className="p-4">
                                            <div className="d-flex justify-content-between align-items-start mb-2">
                                                <h4 className="hm-display mb-0" style={{ fontWeight: 800, fontSize: 19 }}>{p.name}</h4>
                                                <span className="hm-tag">Handmade</span>
                                            </div>
                                            <div className="hm-display mb-3" style={{ color: '#a9822f', fontWeight: 900, fontSize: 20 }}>{fmt(p.base_price)}</div>
                                            <Link href={`/products/${p.slug}`} className="hm-btn hm-btn-navy w-100">
                                                <i className="fas fa-sliders" /> Customize
                                            </Link>
                                        </div>
                                    </div>
                                </Reveal>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </SketchLayout>
    );
}
