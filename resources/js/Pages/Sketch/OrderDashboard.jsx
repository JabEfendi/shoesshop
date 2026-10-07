import SketchLayout, { fmt } from '../../Components/Sketch/SketchLayout';
import { Hero, Reveal } from '../../Components/Parallax/index.jsx';

function StatusBadge({ s }) {
    if (s === 'done') return <span className="hm-tag" style={{ background: 'rgba(74,124,89,.14)', borderColor: 'rgba(74,124,89,.4)', color: '#3d6b4b' }}><i className="fas fa-check" /> Selesai</span>;
    if (s === 'active') return <span className="hm-tag" style={{ background: 'rgba(201,169,98,.18)', borderColor: 'rgba(201,169,98,.5)', color: '#8a6a1f' }}><i className="fas fa-gears fa-spin" /> Sedang dikerjakan</span>;
    return <span className="hm-tag" style={{ color: '#8a857b' }}>Menunggu</span>;
}

export default function OrderDashboard({ orders }) {
    const stats = [
        ['Total Order', orders.length, '#14161c'],
        ['Dalam Produksi', 1, '#a9822f'],
        ['Sisa Pelunasan', fmt(orders[0].tagihan.pelunasan_sisa), '#b7410e'],
        ['Garansi Aktif', orders.filter(o => o.garansi.claimable).length, '#4a7c59'],
    ];

    return (
        <SketchLayout title="Order Dashboard — SHOESHOP.ID" active="Orders"
            breadcrumb={[
                { label: 'Home', href: '/sketch/home', done: true },
                { label: 'Account', active: true },
                { label: 'Pesanan & Status Produksi' },
                { label: 'Pelunasan' },
                { label: 'Garansi' },
            ]}>
            <Hero
                image="/assets/images/products/chelsea-boots/back-side.jpeg"
                imageSpeed={0.16}
                height="46vh"
                minHeight={340}
                eyebrow="Account · Order Dashboard"
                kickerIcon="fas fa-clipboard-list"
                title={<>Pesanan <span className="accent">& Produksi</span></>}
                subtitle="Pantau status produksi, bayar pelunasan, dan klaim garansi dari satu tempat."
            />

            <section style={{ background: '#f7f3ec', padding: 'clamp(40px,6vw,72px) 0' }}>
                <div className="hm-container">
                    <div className="row mb-4">
                        {stats.map(([label, val, color], i) => (
                            <div key={label} className="col-6 col-md-3 mb-3">
                                <Reveal delay={(i % 4) + 1}>
                                    <div className="hm-panel p-3 h-100">
                                        <div className="hm-mono" style={{ fontSize: 10.5, letterSpacing: '.12em', color: '#8a857b', textTransform: 'uppercase' }}>{label}</div>
                                        <div className="hm-display mt-1" style={{ fontSize: 26, fontWeight: 800, color }}>{val}</div>
                                    </div>
                                </Reveal>
                            </div>
                        ))}
                    </div>

                    {orders.map((o, idx) => (
                        <Reveal key={o.id} delay={1}>
                            <div className="hm-panel mb-4" style={{ borderColor: idx === 0 ? 'rgba(201,169,98,.5)' : undefined }}>
                                <div className="d-flex flex-wrap justify-content-between align-items-center p-3"
                                    style={{ background: idx === 0 ? '#14161c' : '#faf8f4', color: idx === 0 ? '#fff' : '#14161c', borderTopLeftRadius: 7, borderTopRightRadius: 7 }}>
                                    <div className="d-flex align-items-center flex-wrap gap-2">
                                        <span className="hm-tag hm-tag-dark" style={{ background: 'rgba(201,169,98,.16)', color: 'var(--hm-brass-2)' }}>#{o.id}</span>
                                        <b>{o.items[0].n}</b>
                                        <span className="hm-mono" style={{ fontSize: 11, color: idx === 0 ? 'rgba(255,255,255,.55)' : '#8a857b' }}>
                                            <i className="fas fa-calendar mr-1" /> {o.tgl} · Size EU {o.items[0].size}
                                        </span>
                                    </div>
                                    {idx === 0 && <span className="hm-tag" style={{ background: 'rgba(201,169,98,.2)', color: 'var(--hm-brass-2)', borderColor: 'rgba(201,169,98,.5)' }}><i className="fas fa-gears fa-spin" /> Produksi Berjalan</span>}
                                    {idx === 1 && <span className="hm-tag" style={{ background: 'rgba(74,124,89,.2)', color: '#a7d6b3', borderColor: 'rgba(74,124,89,.5)' }}><i className="fas fa-check" /> Sudah Diterima</span>}
                                </div>
                                <div className="p-4">
                                    <div className="row">
                                        <div className="col-lg-7 mb-4">
                                            <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
                                                <span className="hm-mono" style={{ fontSize: 10.5, letterSpacing: '.12em', color: '#8a857b', textTransform: 'uppercase' }}>
                                                    <i className="fas fa-diagram-project mr-1" /> Timeline Produksi
                                                </span>
                                                <span className="hm-tag">{o.estimasi}</span>
                                            </div>
                                            {o.produksi.map((s, si) => (
                                                <div key={s.label} className="d-flex align-items-center justify-content-between p-2 mb-1"
                                                    style={{
                                                        borderRadius: 6,
                                                        background: s.status === 'active' ? 'rgba(201,169,98,.12)' : 'transparent',
                                                        border: s.status === 'active' ? '1px solid rgba(201,169,98,.45)' : '1px solid transparent',
                                                    }}>
                                                    <div className="d-flex align-items-center gap-3">
                                                        <span className="d-inline-flex align-items-center justify-content-center hm-mono"
                                                            style={{
                                                                width: 26, height: 26, borderRadius: '50%', fontSize: 11,
                                                                background: s.status === 'done' ? '#4a7c59' : s.status === 'active' ? '#c9a962' : 'rgba(20,22,28,.12)',
                                                                color: s.status === 'done' || s.status === 'active' ? '#fff' : '#8a857b',
                                                            }}>
                                                            {s.status === 'done' ? <i className="fas fa-check" style={{ fontSize: 9 }} /> : si + 1}
                                                        </span>
                                                        <span style={{ fontSize: 13.5, fontWeight: s.status === 'active' ? 700 : 600 }}>{s.label}</span>
                                                    </div>
                                                    <StatusBadge s={s.status} />
                                                </div>
                                            ))}
                                            {idx === 0 && (
                                                <div className="mt-4 p-3" style={{ background: '#eef5fb', borderRadius: 8, fontSize: 13 }}>
                                                    <i className="fas fa-clock mr-1" style={{ color: '#3a7ca5' }} />
                                                    <b>Update terakhir:</b> Pemotongan pola ~50% selesai. Besok masuk tahap jahit upper.
                                                </div>
                                            )}
                                        </div>

                                        <div className="col-lg-5">
                                            <div className="hm-panel p-0 mb-3" style={{ boxShadow: 'none' }}>
                                                <div className="p-3" style={{ background: 'rgba(201,169,98,.1)', borderTopLeftRadius: 7, borderTopRightRadius: 7, fontWeight: 800 }}>
                                                    <i className="fas fa-sack-dollar mr-2" style={{ color: '#a9822f' }} />Tagihan & Pelunasan
                                                </div>
                                                <div className="p-3" style={{ fontSize: 13.5 }}>
                                                    <div className="d-flex justify-content-between py-2" style={{ borderBottom: '1px solid rgba(20,22,28,.06)' }}>
                                                        <span>Total Tagihan</span><b>{fmt(o.tagihan.total)}</b>
                                                    </div>
                                                    <div className="d-flex justify-content-between py-2" style={{ borderBottom: '1px solid rgba(20,22,28,.06)' }}>
                                                        <span>DP {Math.round(o.tagihan.dp / o.tagihan.total * 100)}% <i className="fas fa-check ml-1" style={{ color: '#4a7c59', fontSize: 10 }} /></span>
                                                        <b style={{ color: '#4a7c59' }}>{fmt(o.tagihan.dp)}</b>
                                                    </div>
                                                    <div className="d-flex justify-content-between py-2">
                                                        <span className="font-weight-bold">Sisa Pelunasan</span>
                                                        <b style={{ color: o.tagihan.lunas ? '#4a7c59' : '#b7410e', fontSize: 17 }}>{fmt(o.tagihan.pelunasan_sisa)}</b>
                                                    </div>
                                                    {!o.tagihan.lunas && (
                                                        <button className="hm-btn hm-btn-gold w-100 mt-2" style={{ fontSize: 12 }}>
                                                            <i className="fas fa-credit-card" /> Bayar Pelunasan
                                                        </button>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="hm-panel p-3">
                                                <div className="d-flex justify-content-between align-items-center mb-2">
                                                    <b><i className="fas fa-shield-halved mr-2" style={{ color: '#a9822f' }} />Garansi</b>
                                                    {o.garansi.claimable && <span className="hm-tag">Aktif s/d {o.garansi.sampai}</span>}
                                                </div>
                                                <div style={{ fontSize: 12.5, color: '#6b665d' }} className="mb-3">{o.garansi.syarat}</div>
                                                <div className="d-flex gap-2">
                                                    <button className="hm-btn hm-btn-navy flex-grow-1" style={{ padding: '10px', fontSize: 11.5 }}><i className="fas fa-file-invoice" /> Klaim</button>
                                                    <button className="hm-btn hm-btn-outline-dark flex-grow-1" style={{ padding: '10px', fontSize: 11.5 }}><i className="fas fa-rotate" /> Re-Soling</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Reveal>
                    ))}
                </div>
            </section>
        </SketchLayout>
    );
}
