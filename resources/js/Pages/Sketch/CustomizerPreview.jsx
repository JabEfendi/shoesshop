import { Link } from '@inertiajs/react';
import SketchLayout, { fmt } from '../../Components/Sketch/SketchLayout';
import { Reveal, SectionHeading } from '../../Components/Parallax/index.jsx';
import Shoe3DStage from '../../Components/Sketch/Shoe3DStage';

export default function CustomizerPreview({ model, elements, lead_time, garansi }) {
    const picks = elements.map((e, i) => ({
        el: e,
        v: e.defaults[i === 2 ? 1 : i === elements.length - 1 ? 2 : 0],
        add: i === 2 ? e.defaults[1].p : i === elements.length - 1 ? e.defaults[2].p : 0,
    }));
    const addOns = picks.reduce((t, p) => t + p.add, 0);
    const total = model.price + addOns;

    return (
        <SketchLayout title={`Review Custom ${model.name}`} active="Custom"
            breadcrumb={[
                { label: 'Home', href: '/sketch/home', done: true },
                { label: 'Pilih Model', href: '/sketch/custom', done: true },
                { label: 'Custom Detail', href: `/sketch/custom/${model.slug}`, done: true },
                { label: 'Review Konfigurasi', active: true },
                { label: 'Ukuran' },
                { label: 'Checkout' },
            ]}>
            <section style={{ background: '#f7f3ec' }}>
                <div className="hm-container py-4 py-md-5">
                    <Reveal>
                        <span className="hm-kicker"><i className="fas fa-clipboard-check mr-2" /> Customizer · Langkah 3 dari 6</span>
                        <h1 className="hm-display mt-2 mb-4" style={{ fontWeight: 800, fontSize: 'clamp(1.7rem,3.6vw,2.6rem)' }}>
                            Review Konfigurasi <span className="accent">{model.name}</span>
                        </h1>
                    </Reveal>

                    <div className="row">
                        <div className="col-lg-7 mb-4">
                            <Reveal>
                                <div className="hm-panel p-2" style={{ background: '#0e1015', border: '1px solid rgba(201,169,98,.25)' }}>
                                    <Shoe3DStage glb={model.glb} slug={model.slug} model={model.slug} height={520} badge="360° Preview Final" />
                                </div>
                                <div className="d-flex flex-wrap gap-2 mt-3">
                                    <span className="hm-tag"><i className="fas fa-clock" /> {lead_time}</span>
                                    <span className="hm-tag"><i className="fas fa-shield-halved" /> Garansi {garansi}</span>
                                </div>
                            </Reveal>
                        </div>

                        <div className="col-lg-5 mb-4">
                            <Reveal delay={1}>
                                <div className="hm-panel p-4 mb-3">
                                    <div className="hm-mono mb-3" style={{ fontSize: 10.5, letterSpacing: '.16em', textTransform: 'uppercase', color: '#8a857b' }}>
                                        <i className="fas fa-list-check mr-2" /> Detail konfigurasi
                                    </div>
                                    <div className="d-flex justify-content-between py-2" style={{ borderBottom: '1px solid rgba(20,22,28,.08)', fontSize: 13.5 }}>
                                        <span className="font-weight-bold">Model</span><span>{model.name}</span>
                                    </div>
                                    {picks.map(p => (
                                        <div key={p.el.slug} className="d-flex justify-content-between align-items-center py-2" style={{ borderBottom: '1px solid rgba(20,22,28,.06)', fontSize: 13.5 }}>
                                            <span style={{ color: '#55524c' }}>{p.el.label}</span>
                                            <span className="text-right">
                                                <span className="font-weight-bold d-block">{p.v.n}</span>
                                                <span className="hm-mono" style={{ fontSize: 10.5, color: p.add ? '#a9822f' : '#4a7c59' }}>
                                                    {p.add ? `+${fmt(p.add)}` : 'STANDARD'}
                                                </span>
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </Reveal>

                            <Reveal delay={2}>
                                <div className="hm-panel p-4" style={{ background: '#101218', color: '#fff', border: '1px solid rgba(201,169,98,.3)' }}>
                                    <div className="d-flex justify-content-between mb-1" style={{ fontSize: 13, color: 'rgba(255,255,255,.62)' }}>
                                        <span>Base Price</span><span>{fmt(model.price)}</span>
                                    </div>
                                    {picks.filter(p => p.add > 0).map(p => (
                                        <div key={p.el.slug} className="d-flex justify-content-between mb-1" style={{ fontSize: 13, color: 'var(--hm-brass-2)' }}>
                                            <span>+ {p.v.n}</span><span>+ {fmt(p.add)}</span>
                                        </div>
                                    ))}
                                    <div className="d-flex justify-content-between mb-1" style={{ fontSize: 12.5, color: 'rgba(255,255,255,.5)' }}>
                                        <span>Add-ons Total</span><span>{fmt(addOns)}</span>
                                    </div>
                                    <div className="d-flex justify-content-between align-items-end border-top mt-3 pt-3" style={{ borderColor: 'rgba(255,255,255,.1)' }}>
                                        <span className="hm-mono" style={{ fontSize: 10.5, letterSpacing: '.12em', color: 'rgba(255,255,255,.6)' }}>TOTAL</span>
                                        <span className="hm-display" style={{ fontWeight: 800, fontSize: 28, color: 'var(--hm-brass-2)', lineHeight: 1 }}>{fmt(total)}</span>
                                    </div>
                                    <div className="d-flex gap-2 mt-4">
                                        <Link href={`/sketch/custom/${model.slug}`} className="hm-btn hm-btn-ghost" style={{ padding: '11px 16px' }}>
                                            <i className="fas fa-pen" /> Ubah
                                        </Link>
                                        <Link href="/sketch/sizing" className="hm-btn hm-btn-gold flex-grow-1">
                                            Pilih Ukuran <i className="fas fa-ruler" />
                                        </Link>
                                    </div>
                                </div>
                            </Reveal>
                        </div>
                    </div>
                </div>
            </section>
        </SketchLayout>
    );
}
