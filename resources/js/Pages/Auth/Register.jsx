import { Link, useForm } from '@inertiajs/react';
import SketchLayout from '../../Components/Sketch/SketchLayout';

export default function Register() {
    const { data, setData, post, processing, errors } = useForm({ name: '', email: '', password: '', password_confirmation: '' });
    return <SketchLayout title="Daftar" active="">
        <section className="py-5" style={{ background: '#f7f3ec', minHeight: '70vh' }}><div className="hm-container" style={{ maxWidth: 480 }}><div className="hm-panel p-4"><h1 className="hm-display">Buat Akun</h1>
            <form onSubmit={e => { e.preventDefault(); post('/register'); }}>
                {[['name', 'Nama', 'text'], ['email', 'Email', 'email'], ['password', 'Kata sandi', 'password'], ['password_confirmation', 'Konfirmasi kata sandi', 'password']].map(([key, label, type]) => <div key={key} className="mb-3"><label>{label}</label><input type={type} value={data[key]} onChange={e => setData(key, e.target.value)} className="form-control" />{errors[key] && <small className="text-danger">{errors[key]}</small>}</div>)}
                <button disabled={processing} className="hm-btn hm-btn-gold w-100">Daftar</button>
            </form><p className="mt-3 mb-0">Sudah punya akun? <Link href="/login">Masuk</Link></p>
        </div></div></section>
    </SketchLayout>;
}
