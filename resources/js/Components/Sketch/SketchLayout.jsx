import React, { useEffect, useState } from 'react';
import { Head, Link } from '@inertiajs/react';

const NAV = [
    { href: '/sketch/home',          label: 'Home',       icon: 'fa-house-chimney' },
    { href: '/sketch/shop',          label: 'Shop',       icon: 'fa-store' },
    { href: '/sketch/custom',        label: 'Custom',     icon: 'fa-sliders' },
    { href: '/sketch/our-story',     label: 'Our Story',  icon: 'fa-book-open' },
    { href: '/sketch/account/orders',label: 'Orders',     icon: 'fa-clipboard-list' },
];

const fmt = (n) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(n) || 0);

/* Subtle "preview" marker replacing the loud wireframe banner. */
function SketchBadge() {
    return (
        <div className="text-center py-2" style={{ background: '#0c0d11', borderBottom: '1px solid rgba(201,169,98,.22)' }}>
            <span className="hm-mono" style={{ fontSize: 10.5, letterSpacing: '.22em', textTransform: 'uppercase', color: 'rgba(230,200,119,.75)' }}>
                <i className="fas fa-circle-notch mr-2" style={{ fontSize: 9 }} />
                Concept Interface · Functional Flow Preview
            </span>
        </div>
    );
}

function BrandMark({ light = true }) {
    return (
        <span className="d-inline-flex align-items-center">
            <span className="d-inline-flex align-items-center justify-content-center mr-2"
                style={{ width: 34, height: 34, borderRadius: 6, background: 'linear-gradient(135deg,#d9b45e,#a9822f)' }}>
                <i className="fas fa-boot" style={{ color: '#17140c', fontSize: 16 }} />
            </span>
            <span className="d-flex flex-column" style={{ lineHeight: 1 }}>
                <span className="hm-display" style={{ fontSize: 19, fontWeight: 800, letterSpacing: '.06em', color: light ? '#fff' : '#14161c' }}>
                    SHOESHOP<span className="hm-gold-text">.ID</span>
                </span>
                <span className="hm-mono" style={{ fontSize: 8.5, letterSpacing: '.28em', color: light ? 'rgba(255,255,255,.45)' : 'rgba(20,22,28,.5)', marginTop: 3 }}>
                    DAILY CASUAL LEATHER
                </span>
            </span>
        </span>
    );
}

function Header({ active, transparent = false }) {
    const [scrolled, setScrolled] = useState(false);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const on = () => setScrolled(window.scrollY > 24);
        on();
        window.addEventListener('scroll', on, { passive: true });
        return () => window.removeEventListener('scroll', on);
    }, []);

    return (
        <header className={`hm-header ${scrolled ? 'is-scrolled' : ''}`} style={transparent && !scrolled ? { background: 'transparent', borderBottomColor: 'transparent' } : undefined}>
            <div className="hm-container d-flex align-items-center justify-content-between" style={{ minHeight: 70 }}>
                <Link href="/sketch/home" className="text-decoration-none">
                    <BrandMark />
                </Link>

                <nav className="d-none d-lg-flex align-items-center">
                    {NAV.map(n => {
                        const isActive = active === n.label;
                        return (
                            <Link key={n.label} href={n.href} className={`hm-navlink ${isActive ? 'is-active' : ''}`}>
                                <i className={`fas ${n.icon} mr-2`} style={{ fontSize: 11, opacity: .8 }} />
                                {n.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="d-flex align-items-center gap-2">
                    <Link href="/sketch/cart" className="hm-btn hm-btn-ghost d-none d-sm-inline-flex" style={{ padding: '9px 14px' }} title="Keranjang">
                        <i className="fas fa-cart-shopping" />
                        <span className="hm-mono" style={{ fontSize: 11 }}>2</span>
                    </Link>
                    <Link href="/sketch/account/orders" className="hm-btn hm-btn-gold d-none d-md-inline-flex" style={{ padding: '10px 18px', fontSize: 12 }}>
                        <i className="fas fa-user" /> Account
                    </Link>
                    <button className="hm-btn hm-btn-ghost d-lg-none" style={{ padding: '8px 12px' }} onClick={() => setOpen(o => !o)} aria-label="Menu">
                        <i className={`fas ${open ? 'fa-xmark' : 'fa-bars'}`} />
                    </button>
                </div>
            </div>

            {open && (
                <div className="d-lg-none" style={{ borderTop: '1px solid rgba(201,169,98,.2)', background: 'rgba(12,13,17,.98)' }}>
                    <div className="hm-container py-3 d-flex flex-column">
                        {NAV.map(n => (
                            <Link key={n.label} href={n.href} onClick={() => setOpen(false)}
                                className={`hm-navlink ${active === n.label ? 'is-active' : ''}`} style={{ padding: '12px 0' }}>
                                <i className={`fas ${n.icon} mr-2`} style={{ fontSize: 12, opacity: .8 }} />
                                {n.label}
                            </Link>
                        ))}
                        <Link href="/sketch/cart" onClick={() => setOpen(false)} className="hm-btn hm-btn-gold mt-2">
                            <i className="fas fa-cart-shopping" /> Keranjang
                        </Link>
                    </div>
                </div>
            )}
        </header>
    );
}

function FlowBreadcrumb({ steps }) {
    return (
        <div style={{ background: '#faf7f1', borderBottom: '1px solid rgba(20,22,28,.07)' }}>
            <div className="hm-container py-2 d-flex flex-wrap align-items-center gap-1" style={{ fontSize: 11.5 }}>
                <span className="hm-mono mr-2" style={{ letterSpacing: '.14em', textTransform: 'uppercase', color: '#a49c8d' }}>
                    <i className="fas fa-diagram-project mr-1" /> Alur
                </span>
                {steps.map((s, i) => (
                    <React.Fragment key={i}>
                        {s.href ? (
                            <Link href={s.href} className="text-decoration-none d-inline-flex align-items-center"
                                style={{ color: s.active ? '#a9822f' : '#6b665d', fontWeight: s.active ? 800 : 600 }}>
                                <span className="d-inline-flex align-items-center justify-content-center mr-1"
                                    style={{
                                        width: 19, height: 19, borderRadius: '50%', fontSize: 10,
                                        background: s.done ? '#4a7c59' : s.active ? '#c9a962' : 'rgba(20,22,28,.1)',
                                        color: s.done || s.active ? '#fff' : '#6b665d',
                                    }}>
                                    {s.done ? <i className="fas fa-check" style={{ fontSize: 8 }} /> : i + 1}
                                </span>
                                {s.label}
                            </Link>
                        ) : (
                            <span className="d-inline-flex align-items-center" style={{ color: s.active ? '#a9822f' : '#6b665d', fontWeight: s.active ? 800 : 600 }}>
                                <span className="d-inline-flex align-items-center justify-content-center mr-1"
                                    style={{
                                        width: 19, height: 19, borderRadius: '50%', fontSize: 10,
                                        background: s.done ? '#4a7c59' : s.active ? '#c9a962' : 'rgba(20,22,28,.1)',
                                        color: s.done || s.active ? '#fff' : '#6b665d',
                                    }}>
                                    {s.done ? <i className="fas fa-check" style={{ fontSize: 8 }} /> : i + 1}
                                </span>
                                {s.label}
                            </span>
                        )}
                        {i < steps.length - 1 && <i className="fas fa-angle-right mx-1" style={{ color: '#c9c2b6', fontSize: 10 }} />}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
}

function Footer() {
    return (
        <footer className="hm-footer mt-0 pt-5 pb-4" style={{ borderTop: '1px solid rgba(201,169,98,.2)' }}>
            <div className="hm-container">
                <div className="row">
                    <div className="col-lg-4 mb-4">
                        <BrandMark />
                        <p className="mt-3 mb-3" style={{ fontSize: 13, lineHeight: 1.8, color: '#9c988f', maxWidth: 340 }}>
                            Daily casual leather — handmade di Indonesia. Custom & preset, konstruksi
                            <span className="hm-gold-text"> Goodyear Welt</span> yang bisa di-re-soling.
                        </p>
                        <div className="d-flex gap-2">
                            <a href="#" className="d-inline-flex align-items-center justify-content-center" style={{ width: 36, height: 36, borderRadius: 6, background: 'rgba(255,255,255,.06)' }}><i className="fab fa-instagram" /></a>
                            <a href="#" className="d-inline-flex align-items-center justify-content-center" style={{ width: 36, height: 36, borderRadius: 6, background: 'rgba(255,255,255,.06)' }}><i className="fab fa-tiktok" /></a>
                            <a href="#" className="d-inline-flex align-items-center justify-content-center" style={{ width: 36, height: 36, borderRadius: 6, background: 'rgba(255,255,255,.06)' }}><i className="fab fa-whatsapp" /></a>
                        </div>
                    </div>
                    <div className="col-6 col-lg-2 mb-4">
                        <h6 className="hm-display text-white mb-3" style={{ fontSize: 13, letterSpacing: '.1em' }}>Jelajah</h6>
                        <ul className="list-unstyled mb-0" style={{ fontSize: 13, lineHeight: 2.2 }}>
                            <li><Link href="/sketch/shop">Shop Preset</Link></li>
                            <li><Link href="/sketch/custom">Custom Shoes</Link></li>
                            <li><Link href="/sketch/our-story">Our Story</Link></li>
                            <li><Link href="/sketch/account/orders">Order & Tracking</Link></li>
                        </ul>
                    </div>
                    <div className="col-6 col-lg-3 mb-4">
                        <h6 className="hm-display text-white mb-3" style={{ fontSize: 13, letterSpacing: '.1em' }}>Alur Order</h6>
                        <ul className="list-unstyled mb-0" style={{ fontSize: 13, lineHeight: 2.2 }}>
                            <li><i className="fas fa-check text-warning mr-2" style={{ fontSize: 10 }} /> DP 50% di depan</li>
                            <li><i className="fas fa-check text-warning mr-2" style={{ fontSize: 10 }} /> Produksi ± 7 hari</li>
                            <li><i className="fas fa-check text-warning mr-2" style={{ fontSize: 10 }} /> Pelunasan setelah jadi</li>
                            <li><i className="fas fa-check text-warning mr-2" style={{ fontSize: 10 }} /> Garansi 3 hari (video unboxing)</li>
                        </ul>
                    </div>
                    <div className="col-lg-3 mb-4">
                        <h6 className="hm-display text-white mb-3" style={{ fontSize: 13, letterSpacing: '.1em' }}>Payment & Shipping</h6>
                        <div style={{ fontSize: 13, lineHeight: 2.2 }}>
                            <div><i className="fas fa-qrcode mr-2 text-warning" style={{ width: 16 }} /> QRIS · Virtual Account</div>
                            <div><i className="fas fa-truck mr-2 text-warning" style={{ width: 16 }} /> JNE · AnterAja · SiCepat</div>
                            <div><i className="fas fa-box mr-2 text-warning" style={{ width: 16 }} /> ID Express · Pos Indonesia</div>
                        </div>
                    </div>
                </div>
                <hr style={{ borderColor: 'rgba(255,255,255,.08)' }} />
                <div className="d-flex flex-wrap justify-content-between align-items-center" style={{ fontSize: 12, color: '#7c776e' }}>
                    <span>© 2026 SHOESHOP.ID — Foot Fashion. Seluruh hak dilindungi.</span>
                    <span className="hm-serif" style={{ fontStyle: 'italic', color: '#c9a962' }}>
                        “Handcrafted, not mass-produced.”
                    </span>
                </div>
            </div>
        </footer>
    );
}

export default function SketchLayout({ title, active, breadcrumb, children, transparentHeader = false }) {
    return (
        <div className="d-flex flex-column hm-body" style={{ minHeight: '100vh' }}>
            <Head title={title || 'ShoeShop — Daily Casual Leather'} />
            <Header active={active} transparent={transparentHeader} />
            {breadcrumb && breadcrumb.length > 0 && (
                <FlowBreadcrumb steps={breadcrumb} />
            )}
            <main className="flex-grow-1">{children}</main>
            <Footer />
        </div>
    );
}

export { fmt, SketchLayout, Header, FlowBreadcrumb, Footer };
