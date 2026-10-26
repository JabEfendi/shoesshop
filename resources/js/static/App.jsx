import { useEffect, useState } from 'react';
import { StaticRouter } from './inertia';
import { ELEMENTS, getModel, getProduct, MODELS, PRESETS, SIZE_CHART } from './catalog';
import { cartSubtotal, getCart, getOrders } from './store';
import Home from '../Pages/Sketch/Home';
import Shop from '../Pages/Sketch/Shop';
import ChooseModel from '../Pages/Sketch/ChooseModel';
import Customizer from '../Pages/Sketch/Customizer';
import CustomizerPreview from '../Pages/Sketch/CustomizerPreview';
import ProductDetail from '../Pages/Sketch/ProductDetail';
import Sizing from '../Pages/Sketch/Sizing';
import Cart from '../Pages/Sketch/Cart';
import Checkout from '../Pages/Sketch/Checkout';
import OrderDashboard from '../Pages/Sketch/OrderDashboard';
import OurStory from '../Pages/Sketch/OurStory';
import Login from '../Pages/Auth/Login';
import Register from '../Pages/Auth/Register';

const expedisi = [
    { id: 'jne-regular', name: 'JNE Reguler', etd: '3-4 hari', price: 18000 },
    { id: 'anteraja-regular', name: 'AnterAja Reguler', etd: '2-3 hari', price: 16000 },
    { id: 'id-express', name: 'ID Express', etd: '1-2 hari', price: 28000 },
];

function NotFound() {
    return <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24, background: '#f2ebd0', color: '#303018', fontFamily: 'Inter, sans-serif' }}><div><p style={{ letterSpacing: '.12em', fontSize: 12 }}>404</p><h1>Halaman tidak ditemukan.</h1><a href="/sketch/home">Kembali ke home</a></div></div>;
}

function resolvePage(pathname) {
    if (pathname === '/' || pathname === '/sketch' || pathname === '/sketch/' || pathname === '/sketch/home') return ['Sketch/Home', <Home models={MODELS} />];
    if (pathname === '/sketch/shop') return ['Sketch/Shop', <Shop presets={PRESETS} />];
    if (pathname === '/sketch/custom') return ['Sketch/ChooseModel', <ChooseModel models={MODELS} />];
    if (pathname === '/sketch/our-story') return ['Sketch/OurStory', <OurStory />];
    if (pathname === '/sketch/sizing') return ['Sketch/Sizing', <Sizing chart={SIZE_CHART} next_url="/sketch/cart" />];
    if (pathname === '/sketch/cart') {
        const items = getCart();
        return ['Sketch/Cart', <Cart items={items} subtotal={cartSubtotal(items)} />];
    }
    if (pathname === '/sketch/checkout') {
        const subtotal = cartSubtotal();
        return ['Sketch/Checkout', <Checkout expedisi={expedisi} payment_rules={{ dp_pct: 50, methods: { qris: 'QRIS', 'virtual-account': 'Virtual Account' } }} subtotal={subtotal} alamat_default={{ penerima: '', hp: '', alamat: '', kota: '', kode_pos: '', catatan: '' }} />];
    }
    if (pathname === '/sketch/account/orders') return ['Sketch/OrderDashboard', <OrderDashboard orders={getOrders()} />];
    if (pathname === '/login') return ['Auth/Login', <Login />];
    if (pathname === '/register') return ['Auth/Register', <Register />];

    const preview = pathname.match(/^\/sketch\/custom\/([^/]+)\/preview$/);
    if (preview) return ['Sketch/CustomizerPreview', <CustomizerPreview model={getModel(preview[1])} elements={ELEMENTS} lead_time="+/- 7 hari kerja" garansi="3 hari (video unboxing wajib)" />];
    const customizer = pathname.match(/^\/sketch\/custom\/([^/]+)$/);
    if (customizer) return ['Sketch/Customizer', <Customizer model={getModel(customizer[1])} elements={ELEMENTS} />];
    const product = pathname.match(/^\/sketch\/shop\/([^/]+)$/);
    if (product) return ['Sketch/ProductDetail', <ProductDetail product={getProduct(product[1])} />];
    return ['NotFound', <NotFound />];
}

export default function App() {
    const [, refresh] = useState(0);
    const [location, setLocation] = useState(() => window.location.pathname);
    useEffect(() => {
        const update = () => { refresh((value) => value + 1); setLocation(window.location.pathname); };
        window.addEventListener('popstate', update);
        window.addEventListener('shoesshop:change', update);
        return () => { window.removeEventListener('popstate', update); window.removeEventListener('shoesshop:change', update); };
    }, []);
    const [component, page] = resolvePage(location);
    return <StaticRouter component={component}>{page}</StaticRouter>;
}
