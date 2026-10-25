import { Link, useForm } from '@inertiajs/react';
import SketchLayout from '../../Components/Sketch/SketchLayout';
import { Reveal, ParallaxImage } from '../../Components/Parallax/index.jsx';

export default function Register() {
    const { data, setData, post, processing, errors } = useForm({ name: '', email: '', password: '', password_confirmation: '' });
    return <SketchLayout title="Daftar" active="">
        <section className="atelier-auth atelier-auth-register">
            <div className="atelier-auth-story hm-parallax"><ParallaxImage src="/assets/images/products/loafers/out-side.jpeg" speed={0.08} /><div className="hm-parallax__content"><Reveal><span className="hm-kicker">A pair. A personal story.</span><h2>LANGKAH<br />PERTAMA.<br /><em>Mulai dari kamu.</em></h2><p>Buat akun untuk menyelesaikan pesanan dan mengikuti perkembangannya.</p><Link href="/sketch/custom" className="hm-btn hm-btn-ghost">Kenali custom studio</Link></Reveal></div></div>
            <div className="atelier-auth-form"><Reveal><span className="hm-kicker">Account / Daftar</span><h1 className="hm-display mt-3 mb-4">Buat ruang untuk ceritamu.</h1>
                <form aria-busy={processing} onSubmit={e => { e.preventDefault(); post('/register'); }}>
                    {[['name', 'Nama', 'text', 'name'], ['email', 'Email', 'email', 'email'], ['password', 'Kata sandi', 'password', 'new-password'], ['password_confirmation', 'Konfirmasi kata sandi', 'password', 'new-password']].map(([key, label, type, autocomplete]) => <div key={key} className="mb-3"><label htmlFor={`register-${key}`}>{label}</label><input id={`register-${key}`} autoComplete={autocomplete} required type={type} value={data[key]} onChange={e => setData(key, e.target.value)} className="form-control" aria-invalid={!!errors[key]} />{errors[key] && <small role="alert" className="text-danger">{errors[key]}</small>}</div>)}
                    <button disabled={processing} className="hm-btn hm-btn-gold w-100">{processing ? 'Membuat akun...' : 'Buat akun'} <span aria-hidden="true">→</span></button>
                </form><p className="mt-4 mb-0">Sudah punya akun? <Link href="/login">Masuk</Link></p>
            </Reveal></div>
        </section>
    </SketchLayout>;
}
