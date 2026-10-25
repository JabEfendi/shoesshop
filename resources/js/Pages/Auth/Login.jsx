import { Link, useForm } from '@inertiajs/react';
import SketchLayout from '../../Components/Sketch/SketchLayout';
import { Reveal, ParallaxImage } from '../../Components/Parallax/index.jsx';

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({ email: '', password: '', remember: false });
    return <SketchLayout title="Masuk" active="">
        <section className="atelier-auth">
            <div className="atelier-auth-story hm-parallax"><ParallaxImage src="/assets/images/products/boots/out-side.jpeg" speed={0.08} /><div className="hm-parallax__content"><Reveal><span className="hm-kicker">Your everyday companion</span><h2>KEMBALI.<br /><em>Lanjutkan langkahmu.</em></h2><p>Koleksi pilihan, rancangan personal, dan pesananmu — dalam satu akun.</p><Link href="/sketch/shop" className="hm-btn hm-btn-ghost">Jelajahi koleksi</Link></Reveal></div></div>
            <div className="atelier-auth-form"><Reveal><span className="hm-kicker">Account / Masuk</span><h1 className="hm-display mt-3">Selamat datang kembali.</h1><p>Masuk untuk checkout dan melihat pesananmu.</p>
                <form aria-busy={processing} onSubmit={e => { e.preventDefault(); post('/login'); }}>
                    <label htmlFor="login-email">Email</label><input id="login-email" autoComplete="email" required type="email" value={data.email} onChange={e => setData('email', e.target.value)} className="form-control mb-1" aria-invalid={!!errors.email} />{errors.email && <small role="alert" className="text-danger">{errors.email}</small>}
                    <label htmlFor="login-password" className="mt-3">Kata sandi</label><input id="login-password" autoComplete="current-password" required type="password" value={data.password} onChange={e => setData('password', e.target.value)} className="form-control mb-3" aria-invalid={!!errors.password} />{errors.password && <small role="alert" className="text-danger">{errors.password}</small>}
                    <label className="d-flex align-items-center gap-2 mb-4"><input type="checkbox" checked={data.remember} onChange={e => setData('remember', e.target.checked)} /> Ingat saya</label>
                    <button disabled={processing} className="hm-btn hm-btn-gold w-100">{processing ? 'Memproses...' : 'Masuk ke akun'} <span aria-hidden="true">→</span></button>
                </form><p className="mt-4 mb-0">Belum punya akun? <Link href="/register">Daftar</Link></p>
            </Reveal></div>
        </section>
    </SketchLayout>;
}
