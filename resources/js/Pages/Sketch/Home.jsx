import { Link } from '@inertiajs/react';
import SketchLayout, { fmt } from '../../Components/Sketch/SketchLayout';

export default function Home({ models }) {
    return (
        <SketchLayout title="Home — ShoeShop Sketch" active="Home">
            <section className="position-relative" style={{
                background: 'linear-gradient(135deg,#181714 0%,#2d2416 60%,#4a2c1a 100%)',
                color: '#fff', padding: '80px 0'
            }}>
                <div className="container-fluid">
                    <div className="row align-items-center">
                        <div className="col-lg-6 mb-5 mb-lg-0">
                            <span className="badge badge-warning text-dark px-3 py-2 font-weight-bold" style={{ letterSpacing: 1.2 }}>
                                CRAFTED · CUSTOM · MADE IN ID
                            </span>
                            <h1 className="mt-4 mb-3" style={{ fontSize: 48, fontWeight: 900, lineHeight: 1.05 }}>
                                Sepatu Kulit Sesuai<br />
                                <span style={{ color: '#ffb74d' }}>Kepribadian Kamu.</span>
                            </h1>
                            <p className="mb-4" style={{ color: '#cac6bf', fontSize: 16, lineHeight: 1.6, maxWidth: 520 }}>
                                Pilih model, ubah tiap detail, lihat harganya berubah realtime. Produksi
                                tangan ±1 minggu dengan konstruksi <b>Goodyear Welt</b> yang tahan bertahun-tahun.
                            </p>
                            <div className="d-flex flex-wrap gap-2">
                                <Link href="/sketch/custom" className="btn btn-lg font-weight-bold text-white" style={{ background: '#a7671f', borderColor: '#a7671f', padding: '12px 26px' }}>
                                    <i className="fas fa-sliders mr-2"></i> Mulai Custom Sekarang
                                </Link>
                                <Link href="/sketch/shop" className="btn btn-lg btn-outline-light font-weight-bold" style={{ padding: '12px 26px' }}>
                                    <i className="fas fa-store mr-2"></i> Lihat Desain Preset
                                </Link>
                            </div>
                            <div className="d-flex flex-wrap gap-4 mt-5" style={{ fontSize: 13, color: '#cac6bf' }}>
                                <div><i className="fas fa-shield-halved mr-2 text-warning"></i> Garansi Jahitan 12 Bulan</div>
                                <div><i className="fas fa-truck mr-2 text-warning"></i> Gratis Ongkir Jabodetabek</div>
                                <div><i className="fas fa-calendar-check mr-2 text-warning"></i> Produksi ± 7 Hari</div>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="position-relative p-5" style={{ background: '#ffffff10', border: '2px dashed #ffffff40', borderRadius: 12, minHeight: 360 }}>
                                <div className="position-absolute top-2 right-2 badge badge-light text-dark font-weight-bold">
                                    <i className="fas fa-triangle-exclamation text-warning mr-1"></i>
                                    Placeholder 3D Preview (nanti 3D 360°)
                                </div>
                                <div className="d-flex align-items-center justify-content-center flex-column" style={{ minHeight: 300, color: '#cac6bf' }}>
                                    <i className="fas fa-shoe-forms mb-3" style={{ fontSize: 120, color: '#ffb74d40' }}></i>
                                    <div style={{ fontSize: 16, fontWeight: 700 }}>
                                        Custom Boots 6" — Kulit Hitam · Lug Sole · Brass
                                    </div>
                                    <div style={{ fontSize: 13, opacity: .8 }} className="mt-1">
                                        Drag rotate 360° · Scroll zoom · Lihat sol bawah
                                    </div>
                                    <div className="mt-3 px-4 py-2 rounded" style={{ background: '#181714', color: '#ffb74d', fontWeight: 800, fontSize: 20 }}>
                                        {fmt(1485000)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-5">
                <div className="container-fluid">
                    <div className="d-flex justify-content-between align-items-end mb-4">
                        <div>
                            <h3 style={{ fontWeight: 900 }}>Pilih Model Kamu</h3>
                            <p className="text-industrial-600 mb-0">5 daily silhouette. Mulai custom dari salah satu ini.</p>
                        </div>
                        <Link href="/sketch/custom" className="btn btn-sm" style={{ background: '#181714', color: '#ffb74d' }}>
                            Lihat Semua Model <i className="fas fa-arrow-right ml-2"></i>
                        </Link>
                    </div>
                    <div className="row">
                        {models.map(m => (
                            <div key={m.slug} className="col-lg-4 col-md-6 mb-4">
                                <div className="card h-100 border-0 shadow-sm">
                                    <div className="d-flex align-items-center justify-content-center" style={{
                                        height: 220, background: `linear-gradient(135deg, ${m.color}30, #ffffff)`,
                                        color: m.color
                                    }}>
                                        <i className={`fas ${m.icon} mr-2`} style={{ fontSize: 80, opacity: .6 }}></i>
                                    </div>
                                    <div className="card-body d-flex flex-column">
                                        <h5 className="font-weight-bold mb-1">{m.name}</h5>
                                        <p className="text-industrial-600" style={{ fontSize: 13 }}>{m.desc}</p>
                                        <div className="mt-auto d-flex align-items-center justify-content-between">
                                            <div style={{ color: '#a7671f', fontWeight: 900, fontSize: 18 }}>
                                                dari {fmt(m.price)}
                                            </div>
                                            <Link href={`/sketch/custom/${m.slug}`} className="btn btn-sm" style={{ background: '#a7671f', color: '#fff' }}>
                                                Custom <i className="fas fa-sliders ml-1"></i>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-5" style={{ background: '#181714', color: '#fff' }}>
                <div className="container-fluid">
                    <div className="row align-items-center">
                        <div className="col-lg-6">
                            <h3 style={{ fontWeight: 900 }}>Bagaimana Custom Bekerja?</h3>
                            <p className="text-industrial-400">5 langkah sederhana, dari pilih model sampai sepatu sampai ke rumah.</p>
                        </div>
                        <div className="col-lg-6">
                            <div className="row">
                                {[
                                    ['01', 'Pilih Model', '5 daily silhouette cocok buat casual-kantor-hangout.'],
                                    ['02', 'Pilih Detail', 'Kulit, tali, eyelet, outsole, welt, panel — 8 elemen bebas.'],
                                    ['03', 'Harga Realtime', 'Setiap pilihan tambah/harga baru kelihatan langsung.'],
                                    ['04', 'Ukuran', 'Upload gambar telapak kaki / pake size chart kami.'],
                                    ['05', 'DP 50% + Produksi', 'Produksi ±7 hari, pelunasan setelah sepatu jadi.'],
                                ].map(([num, title, d]) => (
                                    <div key={num} className="col-sm-6 mb-4">
                                        <div className="p-4" style={{ background: '#ffffff08', border: '1px solid #ffffff18', borderRadius: 8 }}>
                                            <div className="d-flex align-items-baseline mb-1">
                                                <span style={{ color: '#ffb74d', fontSize: 24, fontWeight: 900, marginRight: 10 }}>{num}</span>
                                                <span style={{ fontWeight: 800 }}>{title}</span>
                                            </div>
                                            <div style={{ color: '#a8a298', fontSize: 13 }}>{d}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-5">
                <div className="container-fluid text-center" style={{ maxWidth: 720 }}>
                    <span className="badge badge-warning text-dark font-weight-bold px-3 py-1 mb-2">
                        <i className="fas fa-book-open mr-1"></i> BRAND STORY
                    </span>
                    <h3 style={{ fontWeight: 900 }}>Our Craftsmanship</h3>
                    <p className="text-industrial-600 mt-3 mb-4" style={{ lineHeight: 1.8 }}>
                        ShoeShop.ID lahir dari kesal mencari sepatu kulit yang tidak terlalu formal & harganya
                        tidak ngiler di kantong. Kami produksi lokal dengan konstruksi <b>Goodyear Welt</b> —
                        jahitannya kuat, bisa di-re-soling, dan umurnya bertahun-tahun kalau dirawat.
                    </p>
                    <Link href="/sketch/our-story" className="btn font-weight-bold" style={{ background: '#181714', color: '#fff' }}>
                        Baca Cerita Kami <i className="fas fa-arrow-right ml-2"></i>
                    </Link>
                </div>
            </section>
        </SketchLayout>
    );
}
