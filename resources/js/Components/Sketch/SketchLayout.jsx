import { Head, Link } from '@inertiajs/react';

const NAV = [
    { href: '/sketch/home',       label: 'Home',       icon: 'fa-house-chimney' },
    { href: '/sketch/shop',       label: 'Shop Preset',icon: 'fa-store' },
    { href: '/sketch/custom',     label: 'Custom',     icon: 'fa-sliders' },
    { href: '/sketch/our-story',  label: 'Our Story',  icon: 'fa-book-open' },
    { href: '/sketch/account/orders', label: 'Orders',icon: 'fa-clipboard-list' },
];

const fmt = (n) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(n) || 0);

export function SketchBadge() {
    return (
        <div className="px-3 py-2" style={{ background: 'repeating-linear-gradient(45deg,#fff4d6,#fff4d6 10px,#ffe6a3 10px,#ffe6a3 20px)', borderBottom: '2px solid #b8860b' }}>
            <div className="container-fluid d-flex flex-wrap align-items-center gap-2">
                <span className="badge badge-warning px-2 py-1 text-dark" style={{ fontWeight: 800, letterSpacing: .4 }}>
                    <i className="fas fa-triangle-exclamation mr-1"></i>
                    SKETCH PREVIEW
                </span>
                <span className="text-industrial-800" style={{ fontSize: 13, fontWeight: 600 }}>
                    Wireframe fungsional (tgl 12 preview) — <b>bukan final UI</b>. Fokus mengecek user flow & masuk akal tidaknya UX.
                </span>
                <span className="ml-auto text-industrial-700 d-none d-sm-block" style={{ fontSize: 12 }}>
                    <i className="fas fa-code-branch mr-1"></i> v0.1 · Wireframe Low-Fi
                </span>
            </div>
        </div>
    );
}

function Header({ active }) {
    return (
        <header className="border-bottom" style={{ background: '#181714', borderBottom: '2px solid #a7671f' }}>
            <div className="container-fluid d-flex flex-wrap align-items-center py-2">
                <Link href="/sketch/home" className="d-flex align-items-center text-white text-decoration-none mr-4">
                    <i className="fas fa-boot mr-2 text-warning fa-lg"></i>
                    <div>
                        <div style={{ fontSize: 18, fontWeight: 900, letterSpacing: 1 }}>SHOESHOP<span style={{ color: '#ffb74d' }}>.ID</span></div>
                        <div style={{ fontSize: 10, color: '#a8a298', letterSpacing: 2 }}>DAILY CASUAL LEATHER · GEN Z & MILLENNIALS</div>
                    </div>
                </Link>
                <nav className="d-flex flex-wrap ml-auto">
                    {NAV.map(n => {
                        const isActive = active === n.label;
                        return (
                            <Link key={n.label} href={n.href}
                                className={`px-3 py-2 text-decoration-none d-flex align-items-center`}
                                style={{
                                    fontSize: 13,
                                    fontWeight: isActive ? 700 : 600,
                                    color: isActive ? '#ffb74d' : '#e9e7e3',
                                    borderBottom: isActive ? '2px solid #ffb74d' : '2px solid transparent',
                                }}>
                                <i className={`fas ${n.icon} mr-2`} style={{ opacity: .9 }}></i>
                                {n.label}
                            </Link>
                        );
                    })}
                    <div className="ml-3 d-flex align-items-center gap-2">
                        <Link href="/sketch/cart" className="btn btn-outline-light btn-sm px-2 py-1" style={{ borderColor: '#5a544c' }} title="Cart">
                            <i className="fas fa-cart-shopping"></i>
                            <span className="ml-1 badge badge-warning text-dark p-1" style={{ fontSize: 10, borderRadius: 10 }}>2</span>
                        </Link>
                        <button className="btn btn-sm px-2 py-1" style={{ background: '#a7671f', color: '#fff' }}>
                            <i className="fas fa-user mr-1"></i> Account
                        </button>
                    </div>
                </nav>
            </div>
        </header>
    );
}

function FlowBreadcrumb({ steps }) {
    return (
        <div className="bg-white border-bottom px-3 py-2" style={{ borderColor: '#cac6bf' }}>
            <div className="container-fluid d-flex flex-wrap align-items-center gap-1 gap-sm-2" style={{ fontSize: 12 }}>
                <span className="text-industrial-500 mr-1"><i className="fas fa-diagram-project mr-1"></i> Flow:</span>
                {steps.map((s, i) => (
                    <span key={i} className="d-flex align-items-center">
                        {s.href ? (
                            <Link href={s.href} className="text-decoration-none" style={{ color: s.active ? '#a7671f' : '#454039', fontWeight: s.active ? 800 : 600 }}>
                                <span className={`badge mr-1 px-2 py-1 ${s.done ? 'badge-success' : s.active ? 'badge-warning text-dark' : 'badge-secondary'}`}
                                    style={{ borderRadius: 10, minWidth: 22, textAlign: 'center' }}>
                                    {s.done ? <i className="fas fa-check"></i> : i + 1}
                                </span>
                                {s.label}
                            </Link>
                        ) : (
                            <>
                                <span className={`badge mr-1 px-2 py-1 ${s.done ? 'badge-success' : s.active ? 'badge-warning text-dark' : 'badge-secondary'}`}
                                    style={{ borderRadius: 10, minWidth: 22, textAlign: 'center' }}>
                                    {s.done ? <i className="fas fa-check"></i> : i + 1}
                                </span>
                                <span style={{ color: s.active ? '#a7671f' : '#454039', fontWeight: s.active ? 800 : 600 }}>{s.label}</span>
                            </>
                        )}
                        {i < steps.length - 1 && (
                            <i className="fas fa-angle-right mx-2 text-industrial-300"></i>
                        )}
                    </span>
                ))}
            </div>
        </div>
    );
}

function Footer() {
    return (
        <footer className="mt-5 border-top" style={{ background: '#181714', color: '#a8a298', fontSize: 12 }}>
            <div className="container-fluid py-4">
                <div className="row">
                    <div className="col-md-4 mb-3">
                        <div className="text-white font-weight-bold mb-2"><i className="fas fa-boot mr-2 text-warning"></i>SHOESHOP.ID</div>
                        <div>Daily Casual Leather — handmade ID, custom dan preset, Goodyear Welt.</div>
                    </div>
                    <div className="col-md-4 mb-3">
                        <div className="text-white font-weight-bold mb-2">Alur Order</div>
                        <ul className="list-unstyled mb-0" style={{ lineHeight: 2 }}>
                            <li><i className="fas fa-check text-success mr-1"></i> DP 50% didepan</li>
                            <li><i className="fas fa-check text-success mr-1"></i> Produksi ± 7 hari</li>
                            <li><i className="fas fa-check text-success mr-1"></i> Pelunasan setelah jadi</li>
                            <li><i className="fas fa-check text-success mr-1"></i> Garansi 3 hari (unboxing video wajib)</li>
                        </ul>
                    </div>
                    <div className="col-md-4 mb-3">
                        <div className="text-white font-weight-bold mb-2">Payment & Shipping</div>
                        <div><i className="fas fa-qrcode mr-1 text-warning"></i> QRIS · Virtual Account</div>
                        <div><i className="fas fa-truck mr-1 text-warning"></i> JNE, AnterAja, ID Express, SiCepat, Pos</div>
                    </div>
                </div>
                <div className="pt-3 mt-3 border-top text-center" style={{ borderColor: '#302d29' }}>
                    © 2026 SHOESHOP.ID — Wireframe Sketch Preview v0.1
                </div>
            </div>
        </footer>
    );
}

export default function SketchLayout({ title, active, breadcrumb, children }) {
    return (
        <div className="d-flex flex-column" style={{ minHeight: '100vh' }}>
            <Head title={title || 'Sketch Preview — ShoeShop'} />
            <SketchBadge />
            <Header active={active} />
            {breadcrumb && breadcrumb.length > 0 && (
                <FlowBreadcrumb steps={breadcrumb} />
            )}
            <main className="flex-grow-1 bg-industrial-50" style={{ background: '#f4f1ec' }}>
                {children}
            </main>
            <Footer />
        </div>
    );
}

export { fmt, SketchLayout, Header, FlowBreadcrumb, Footer };
