import { ELEMENTS, getModel } from './catalog';

const CART_KEY = 'shoesshop-static-cart';
const ORDER_KEY = 'shoesshop-static-orders';
const notify = () => window.dispatchEvent(new Event('shoesshop:change'));

const read = (key) => {
    try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch { return []; }
};

const write = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
    notify();
};

export const getCart = () => read(CART_KEY);
export const cartSubtotal = (items = getCart()) => items.reduce((total, item) => total + item.unit_total * item.qty, 0);
export const updateCart = (id, qty) => write(CART_KEY, getCart().map((item) => item.id === id ? { ...item, qty: Math.max(1, Math.min(10, qty)) } : item));
export const removeCart = (id) => write(CART_KEY, getCart().filter((item) => item.id !== id));

export const addCartItem = ({ type, model_slug, size, selection = {} }) => {
    const model = getModel(model_slug);
    const choices = type === 'custom'
        ? ELEMENTS.map((element) => element.defaults[selection[element.slug] ?? 0]).filter(Boolean)
        : [];
    const add_ons = choices.reduce((total, choice) => total + (choice.p || 0), 0);
    const item = {
        id: `${type}-${model.slug}-${size}-${Date.now()}`,
        type,
        model_slug: model.slug,
        name: model.name,
        size,
        qty: 1,
        base_price: model.price,
        add_ons,
        unit_total: model.price + add_ons,
        configuration: selection,
        variant_summary: type === 'custom' ? choices.map((choice) => choice.n).join(' - ') : `Classic ${model.name}`,
    };
    write(CART_KEY, [...getCart(), item]);
    return item;
};

export const getOrders = () => read(ORDER_KEY);

export const createOrder = (data = {}) => {
    const items = getCart();
    if (items.length === 0) return null;
    const subtotal = cartSubtotal(items);
    const shipping = 18000;
    const total = subtotal + shipping;
    const now = new Date();
    const order = {
        id: `INV-${now.getTime()}`,
        tgl: now.toLocaleDateString('id-ID'),
        status: 'awaiting_payment',
        payment_status: 'pending',
        shipping_method: data.shipping_method || 'JNE Reguler',
        payment_method: data.payment_method || 'qris',
        items: items.map((item) => ({ n: item.name, size: item.size, qty: item.qty, price: item.unit_total })),
        tagihan: { total, dp: Math.ceil(total / 2), pelunasan_sisa: Math.floor(total / 2), lunas: false },
    };
    write(ORDER_KEY, [order, ...getOrders()]);
    write(CART_KEY, []);
    return order;
};
