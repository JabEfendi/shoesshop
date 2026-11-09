import { useEffect, useState } from 'react';

const STORAGE_KEY = 'shoeshop-language';
const listeners = new Set();

export const translations = {
    id: {
        nav: { home: 'Beranda', collection: 'Koleksi', custom: '3D Custom', craft: 'Craft', sizing: 'Panduan Ukuran', cart: 'Keranjang', build: 'Buat punyamu' },
        home: { eyebrow: 'kulit handmade, dibuat personal', title: 'JALAN\nDENGAN CARA MU.', body: 'Sepatu kulit harian dengan karakter yang bisa sepenuhnya menjadi milikmu.', shop: 'Lihat koleksi', studio: 'Buka studio 3D' },
        custom: { missing3d: 'Preview 3D model ini akan segera tersedia. Semua pilihan dan harga tetap dapat dicoba sekarang.' },
    },
    en: {
        nav: { home: 'Home', collection: 'Collection', custom: '3D Custom', craft: 'Craft', sizing: 'Size guide', cart: 'Cart', build: 'Build yours' },
        home: { eyebrow: 'handmade leather, made personal', title: 'WALK\nYOUR WAY.', body: 'Daily leather shoes with enough character to become entirely yours.', shop: 'Shop the collection', studio: 'Open 3D studio' },
        custom: { missing3d: 'The 3D preview for this model is coming soon. All choices and pricing can still be explored now.' },
    },
};

export function getLanguage() {
    if (typeof window === 'undefined') return 'id';
    return window.localStorage.getItem(STORAGE_KEY) === 'en' ? 'en' : 'id';
}

export function setLanguage(language) {
    if (typeof window !== 'undefined') window.localStorage.setItem(STORAGE_KEY, language === 'en' ? 'en' : 'id');
    listeners.forEach((listener) => listener());
}

export function useLanguage() {
    const [language, setCurrent] = useState(getLanguage);
    useEffect(() => {
        const listener = () => setCurrent(getLanguage());
        listeners.add(listener);
        return () => listeners.delete(listener);
    }, []);
    return { language, t: translations[language], setLanguage };
}

export function text(value) {
    return String(value || '').split('\n').map((line, index) => <span key={`${line}-${index}`}>{index > 0 && <br />}{line}</span>);
}
