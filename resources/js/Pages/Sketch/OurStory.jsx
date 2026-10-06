import { Link } from '@inertiajs/react';
import SketchLayout from '../../Components/Sketch/SketchLayout';

export default function OurStory() {
    return (
        <SketchLayout title="Our Story — Craftsmanship" active="Our Story"
            breadcrumb={[
                { label: 'Home', href: '/sketch/home', done: true },
                { label: 'Our Story / Craftsmanship', active: true },
            ]}>
            <section className="position-relative" style={{ background: '#181714', color: '#fff', padding: '80px 0' }}>
                <div className="container-fluid">
                    <div className="row align-items-center">
                        <div className="col-lg-7 mb-5 mb-lg-0">
                            <span className="badge badge-warning text-dark px-3 py-1 font-weight-bold" style={{ letterSpacing: 1.5 }}>
                                BRAND STORY · CRAFTSMANSHIP ID
                            </span>
                            <h1 className="mt-3" style={{ fontSize: 48, fontWeight: 900, lineHeight: 1.1 }}>
                                Sepatu kulit yang <span style={{ color: '#ffb74d' }}>tidak cuma buat 1 musim.</span>
                            </h1>
                            <p className="mt-4" style={{ color: '#cac6bf', fontSize: 16, lineHeight: 1.8, maxWidth: 640 }}>
                                ShoeShop.ID lahir dari kesal mencari sepatu kulit yang pas buat Gen Z & Millennials —
                                tidak terlalu formal ke kantor, tidak terlalu murahan buat hangout, dan harganya tidak
                                bikin dompet nangis. Kami bikin sepatu dengan <b>konstruksi Goodyear Welt</b> (jahitan
                                benang tembus + lipatan kulit rim) yang kuat, bisa di-re-soling, dan umurnya bisa sampai
                                <b> 5 tahun+</b> kalau dirawat.
                            </p>
                            <div className="d-flex gap-2 flex-wrap mt-5">
                                <Link href="/sketch/custom" className="btn btn-lg text-white font-weight-bold" style={{ background: '#a7671f' }}>
                                    <i className="fas fa-sliders mr-1"></i> Mulai Custom Sepatu Kamu
                                </Link>
                                <Link href="/sketch/shop" className="btn btn-lg btn-outline-light font-weight-bold">
                                    <i className="fas fa-store mr-1"></i> Lihat Desain Preset
                                </Link>
                            </div>
                        </div>
                        <div className="col-lg-5">
                            <div className="d-flex align-items-center justify-content-center position-relative"
                                style={{ minHeight: 360, border: '2px dashed #ffffff33', borderRadius: 12, background: '#ffffff08' }}>
                                <div className="badge badge-light text-dark position-absolute top-2 right-2">
                                    <i className="fas fa-image mr-1"></i> Nanti: Foto Workshop & Produksi
                                </div>
                                <div className="text-center px-5" style={{ color: '#cac6bf' }}>
                                    <i className="fas fa-hammer" style={{ fontSize: 96, color: '#ffb74d40' }}></i>
                                    <div className="mt-3 font-weight-bold" style={{ color: '#fff' }}>
                                        Workshop kami di Bandung & Jakarta
                                    </div>
                                    <div style={{ fontSize: 13 }}>
                                        Tiap sepatu melalui tangan 7+ pengrajin dengan pengalaman rata-rata 12 tahun.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-5">
                <div className="container-fluid">
                    <div className="text-center mb-5">
                        <span className="badge badge-warning text-dark font-weight-bold px-3 py-1 mb-2">
                            CRAFT · KONSTRUKSI
                        </span>
                        <h3 style={{ fontWeight: 900 }}>Kenapa Goodyear Welt?</h3>
                        <p className="text-industrial-600 mx-auto" style={{ maxWidth: 720 }}>
                            Konstruksi jahit welt tepi membuat sepatu kamu tidak mudah bocor, jahitan tidak mudah lepas,
                            dan yang paling penting: <b>bisa di-re-soling berulang kali</b>. Tidak seperti sepatu kulit
                                lem "sekilas pakai" — ini investasi kaki kamu untuk tahunan.
                        </p>
                    </div>

                    <div className="row">
                        {[
                            ['01', 'Upper Full Grain', 'Kulit lapisan terluar (full grain) — semakin dipakai semakin cantik patinanya.', 'fa-cowhide'],
                            ['02', 'Goodyear Welt Strip', 'Lipatan kulit tepi yang dijahit tembus dengan upper + insole — inti kekuatan sepatu.', 'fa-diagram-next'],
                            ['03', 'Rib of Cork Filling', 'Isi gabus alami di tengah — bentuknya menyesuaikan telapak kaki seiring waktu.', 'fa-layer-group'],
                            ['04', 'Outsole Anti-slip', 'Karet pilihan atau kulit asli — tebal, kuat, anti-slip. Bisa ganti tanpa ganti upper.', 'fa-shoe-prints'],
                        ].map(([n, t, d, ic]) => (
                            <div key={n} className="col-lg-3 col-md-6 mb-4">
                                <div className="card h-100 border-0 shadow-sm p-4" style={{ background: '#f9f6f1' }}>
                                    <div className="d-flex align-items-baseline mb-2">
                                        <span style={{ color: '#a7671f', fontSize: 36, fontWeight: 900, marginRight: 12 }}>{n}</span>
                                        <h6 style={{ fontWeight: 800 }} className="mb-0">{t}</h6>
                                    </div>
                                    <i className={`fas ${ic} mb-2`} style={{ color: '#a7671f', fontSize: 28 }}></i>
                                    <p className="mb-0" style={{ fontSize: 13, color: '#454039', lineHeight: 1.7 }}>{d}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-5" style={{ background: '#fff9ef' }}>
                <div className="container-fluid">
                    <div className="row align-items-center">
                        <div className="col-lg-6 mb-5 mb-lg-0">
                            <h3 style={{ fontWeight: 900 }}>Daily Casual Leather — untuk kamu yang <span style={{ color: '#a7671f' }}>tidak mau pusing.</span></h3>
                            <p className="text-industrial-600 mt-3" style={{ lineHeight: 1.8 }}>
                                5 silhouette yang cocok buat kuliah, WFO, hangout malam, sampai kondangan. Kamu bisa custom
                                detail kulit, tali, eyelet, outsole, sampai <b>storm welt water-repellent</b> buat hujan-hujan.
                                Harga berubah realtime saat kamu pilih — tidak ada biaya tersembunyi.
                            </p>
                            <ul className="mt-4" style={{ listStyle: 'none', padding: 0, lineHeight: 2.5 }}>
                                <li><i className="fas fa-check text-success mr-2"></i> Full grain leather pilihan</li>
                                <li><i className="fas fa-check text-success mr-2"></i> Konstruksi Goodyear Welt — tahan & re-sorable</li>
                                <li><i className="fas fa-check text-success mr-2"></i> 8 elemen bebas custom (kulit, tali, eyelet, outsole, dll)</li>
                                <li><i className="fas fa-check text-success mr-2"></i> Produksi ± 7 hari kerja</li>
                                <li><i className="fas fa-check text-success mr-2"></i> Gratis ongkir Jabodetabek</li>
                                <li><i className="fas fa-check text-success mr-2"></i> Garansi jahitan 12 bulan + re-soling pertama gratis</li>
                            </ul>
                        </div>
                        <div className="col-lg-6">
                            <div className="d-flex align-items-center justify-content-center position-relative"
                                style={{ minHeight: 420, border: '2px dashed #ffd080', borderRadius: 12, background: '#fff' }}>
                                <div className="badge badge-dark position-absolute top-2 left-2">
                                    <i className="fas fa-image mr-1"></i> Foto Lifestyle (contoh)
                                </div>
                                <div className="text-center" style={{ color: '#6e685f' }}>
                                    <i className="fas fa-user-tie" style={{ fontSize: 120, color: '#a7671f40' }}></i>
                                    <div className="mt-3 font-weight-bold" style={{ color: '#181714' }}>
                                        Gen Z & Millennials — daily casual.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </SketchLayout>
    );
}
