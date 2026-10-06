import { Link } from '@inertiajs/react';
import SketchLayout, { fmt } from '../../Components/Sketch/SketchLayout';

export default function Sizing({ chart, next_url }) {
    return (
        <SketchLayout title="Sizing — ShoeShop Sketch" active="Custom"
            breadcrumb={[
                { label: 'Home', href: '/sketch/home', done: true },
                { label: 'Pilih Model', href: '/sketch/custom', done: true },
                { label: 'Custom Detail', href: '/sketch/custom/boots', done: true },
                { label: 'Preview Konfigurasi', href: '/sketch/custom/boots/preview', done: true },
                { label: 'Pilih Ukuran', active: true },
                { label: 'Keranjang' },
                { label: 'Checkout' },
            ]}>
            <div className="container-fluid py-4">
                <span className="badge badge-warning text-dark font-weight-bold px-3 py-1 mb-2">
                    CUSTOMIZER · LANGKAH 4 dari 6
                </span>
                <h2 style={{ fontWeight: 900 }} className="mb-4">Pilih Ukuran — Pastikan Pas!</h2>

                <div className="row mb-4">
                    <div className="col-lg-6 mb-4">
                        <div className="card border-0 shadow-sm h-100">
                            <div className="card-header" style={{ background: '#181714', color: '#fff', fontWeight: 800 }}>
                                <i className="fas fa-camera-retro mr-2 text-warning"></i> Opsi 1: Upload Gambar Telapak Kaki (Rekomendasi)
                            </div>
                            <div className="card-body d-flex flex-column align-items-center justify-content-center" style={{ minHeight: 360 }}>
                                <div className="d-flex flex-column align-items-center justify-content-center w-100"
                                    style={{
                                        border: '3px dashed #a7671f', borderRadius: 12,
                                        padding: 40, background: '#fff9ef', cursor: 'pointer'
                                    }}>
                                    <i className="fas fa-cloud-arrow-up mb-3" style={{ fontSize: 64, color: '#a7671f' }}></i>
                                    <div className="font-weight-bold mb-1" style={{ fontSize: 16 }}>
                                        Klik / drag gambar telapak kaki kamu di sini
                                    </div>
                                    <div style={{ fontSize: 13, color: '#6e685f', textAlign: 'center' }} className="mb-3">
                                        Letakkan kertas A4 di lantai sebagai skala referensi, telapak kaki berdiri di atasnya. Foto dari atas 90 derajat.
                                    </div>
                                    <button className="btn btn-sm font-weight-bold px-3" style={{ background: '#a7671f', color: '#fff' }}>
                                        <i className="fas fa-image mr-2"></i> Pilih File Gambar
                                    </button>
                                    <div className="text-industrial-500 mt-2" style={{ fontSize: 11 }}>
                                        JPG / PNG · Maksimal 8 MB · Tim kami baca skala & rekomendasikan size dalam 1 jam kerja
                                    </div>
                                </div>

                                <div className="mt-3 w-100 p-3 rounded" style={{ background: '#eaf5ff', fontSize: 13 }}>
                                    <i className="fas fa-circle-info mr-1 text-primary"></i>
                                    <b>Contoh hasil:</b> "Panjang telapak kaki 26.4 cm → rekomendasi <b>Size 42</b> (insole 26.8 cm, sisa 4mm ujung)."
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-6 mb-4">
                        <div className="card border-0 shadow-sm h-100">
                            <div className="card-header" style={{ background: '#fff4e4', fontWeight: 800 }}>
                                <i className="fas fa-ruler-combined mr-2 text-warning"></i> Opsi 2: Pakai Size Chart (jika kamu sudah tahu ukuran standar)
                            </div>
                            <div className="card-body">
                                <div className="table-responsive">
                                    <table className="table table-sm">
                                        <thead style={{ background: '#181714', color: '#fff' }}>
                                            <tr>
                                                <th>Size EU</th>
                                                <th>Insole (cm)</th>
                                                <th>Rekomendasi Panjang Kaki</th>
                                                <th>Pilih</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {chart.map((r, i) => (
                                                <tr key={r.size} style={{ background: i === 3 ? '#fff4e4' : 'transparent' }}>
                                                    <td className="font-weight-bold">{r.size}</td>
                                                    <td>{r.insole_cm}</td>
                                                    <td style={{ fontSize: 12.5 }}>{r.recommended_for}</td>
                                                    <td>
                                                        <button className={`btn btn-sm px-3 py-1 ${i === 3 ? 'font-weight-bold' : ''}`}
                                                            style={{
                                                                background: i === 3 ? '#181714' : '#fff',
                                                                color: i === 3 ? '#ffb74d' : '#181714',
                                                                border: i === 3 ? '2px solid #ffb74d' : '1px solid #cac6bf'
                                                            }}>
                                                            {i === 3 ? <><i className="fas fa-check mr-1"></i>Size 42 (contoh terpilih)</> : 'Pilih'}
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="p-3 mt-2" style={{ background: '#fff4e4', fontSize: 12.5, borderRadius: 8 }}>
                                    <i className="fas fa-lightbulb mr-1 text-warning"></i>
                                    <b>Tips:</b> Jika kaki cenderung lebar / biasanya pakai kaos kaki tebal, pilih 1 size di atas rekomendasi.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-lg-8">
                        <div className="card border-0 shadow p-4">
                            <h5 className="font-weight-bold mb-3">
                                <i className="fas fa-circle-check text-success mr-2"></i>
                                Ukuran kamu sudah terpilih: <span className="badge badge-dark" style={{ fontSize: 15 }}>Size 42 EU (Insole 26.8 cm)</span>
                            </h5>
                            <div className="d-flex gap-2 flex-wrap">
                                <Link href="/sketch/custom/boots/preview" className="btn btn-sm"
                                    style={{ background: '#fff', color: '#181714', border: '2px solid #181714' }}>
                                    <i className="fas fa-arrow-left mr-1"></i> Kembali ke Review Konfigurasi
                                </Link>
                                <Link href="/sketch/cart" className="btn btn-sm font-weight-bold"
                                    style={{ background: '#a7671f', color: '#fff' }}>
                                    Konfirmasi → Masuk Keranjang <i className="fas fa-cart-shopping ml-1"></i>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </SketchLayout>
    );
}
