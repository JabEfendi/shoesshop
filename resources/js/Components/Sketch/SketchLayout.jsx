import React, { useEffect, useRef, useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';

const NAV = [
    { href: '/sketch/home',      label: 'Home',       icon: 'fa-house-chimney' },
    { href: '/sketch/shop',      label: 'Collection', icon: 'fa-store' },
    { href: '/sketch/custom',    label: '3D Custom',  icon: 'fa-sliders' },
    { href: '/sketch/our-story', label: 'Craft',       icon: 'fa-book-open' },
    { href: '/sketch/sizing',    label: 'Size Guide',  icon: 'fa-ruler-combined' },
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
            <span className="d-flex flex-column" style={{ lineHeight: 1 }}>
                <span className="hm-display" style={{ fontSize: 19, fontWeight: 800, letterSpacing: '-.06em', color: light ? '#303018' : '#303018' }}>
                    SHOE<span className="hm-gold-text">SHOP</span>.ID
                </span>
                <span className="hm-mono" style={{ fontSize: 8.5, letterSpacing: '.16em', color: '#909078', marginTop: 3 }}>
                    DAILY CASUAL LEATHER
                </span>
            </span>
        </span>
    );
}

function Header({ active }) {
    const [scrolled, setScrolled] = useState(false);
    const [open, setOpen] = useState(false);
    const menuButton = useRef(null);

    useEffect(() => {
        const on = () => setScrolled(window.scrollY > 24);
        on();
        window.addEventListener('scroll', on, { passive: true });
        return () => window.removeEventListener('scroll', on);
    }, []);

    useEffect(() => {
        if (!open) return undefined;
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = previousOverflow;
            menuButton.current?.focus();
        };
    }, [open]);

    return <header className={`shoe-shell-header ${scrolled ? 'is-scrolled' : ''}`}>
        <Link href="/sketch/home" className="shoe-shell-wordmark" aria-label="SHOESHOP.ID home">SHOE<span>SHOP</span>.ID</Link>
        <nav className="shoe-shell-nav" aria-label="Primary navigation">
            {NAV.map((item) => <Link key={item.href} href={item.href} className={active === item.label ? 'is-active' : ''}>{item.label}</Link>)}
            <Link href="/sketch/cart" className={active === 'Cart' ? 'is-active' : ''}>Cart</Link>
        </nav>
        <div className="shoe-shell-actions"><Link href="/sketch/custom" className="shoe-shell-button">Build yours <span aria-hidden="true">&rarr;</span></Link><button ref={menuButton} type="button" onClick={() => setOpen(true)} className="shoe-shell-menu" aria-label="Open menu" aria-expanded={open} aria-controls="storefront-mobile-menu"><i /><i /></button></div>
        {open && <div id="storefront-mobile-menu" className="shoe-shell-overlay" role="dialog" aria-modal="true" aria-label="Navigation menu"><div className="shoe-shell-overlay__top"><Link href="/sketch/home" className="shoe-shell-wordmark" onClick={() => setOpen(false)}>SHOE<span>SHOP</span>.ID</Link><button type="button" onClick={() => setOpen(false)} className="shoe-shell-close">Close</button></div><nav>{[...NAV, { href: '/sketch/cart', label: 'Cart' }].map((item, index) => <Link key={item.href} href={item.href} onClick={() => setOpen(false)}><small>0{index + 1}</small>{item.label}</Link>)}</nav><Link href="/sketch/custom" className="shoe-shell-button" onClick={() => setOpen(false)}>Build your pair <span aria-hidden="true">&rarr;</span></Link></div>}
    </header>;
}

function FlowBreadcrumb({ steps }) {
    return (
        <div className="hm-flow" role="navigation" aria-label="Alur pesanan" style={{ background: '#faf7f1', borderBottom: '1px solid rgba(20,22,28,.07)' }}>
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
                        <Link href="/sketch/custom" className="hm-footer-studio">Buat pasangan versimu <span aria-hidden="true">↗</span></Link>
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
    const { component } = usePage();
    const page = component.split('/').pop().replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();

    return (
        <div className={`d-flex flex-column hm-body hm-storefront hm-page-${page} ${transparentHeader ? 'hm-layout-overlay' : ''}`} style={{ minHeight: '100vh' }}>
            <a href="#storefront-main" className="hm-skip-link">Lewati ke konten</a>
            <Head title={title || 'ShoeShop — Daily Casual Leather'} />
            <Header active={active} />
            <main id="storefront-main" tabIndex={-1} className="flex-grow-1">{children}</main>
            <Footer />
        </div>
    );
}

export { fmt, SketchLayout, Header, FlowBreadcrumb, Footer };
