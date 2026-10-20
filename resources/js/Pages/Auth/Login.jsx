import { Link, useForm } from '@inertiajs/react';
import SketchLayout from '../../Components/Sketch/SketchLayout';

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({ email: '', password: '', remember: false });
    return <SketchLayout title="Masuk" active="">
        <section className="py-5" style={{ background: '#f7f3ec', minHeight: '70vh' }}><div className="hm-container" style={{ maxWidth: 480 }}>
            <div className="hm-panel p-4"><h1 className="hm-display">Masuk Akun</h1><p>Masuk untuk checkout dan melihat pesananmu.</p>
                <form onSubmit={e => { e.preventDefault(); post('/login'); }}>
                    <label>Email</label><input type="email" value={data.email} onChange={e => setData('email', e.target.value)} className="form-control mb-1" />{errors.email && <small className="text-danger">{errors.email}</small>}
                    <label className="mt-3">Kata sandi</label><input type="password" value={data.password} onChange={e => setData('password', e.target.value)} className="form-control mb-3" />{errors.password && <small className="text-danger">{errors.password}</small>}
                    <button disabled={processing} className="hm-btn hm-btn-gold w-100">Masuk</button>
                </form><p className="mt-3 mb-0">Belum punya akun? <Link href="/register">Daftar</Link></p>
            </div></div></section>
    </SketchLayout>;
}
