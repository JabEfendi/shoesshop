import { create } from 'zustand';

const DEFAULT_STATE = {
    basePrice: 0,
    currency: 'IDR',
    selected: {},
};

const pickDefault = (optsByCategory = {}) => {
    const selected = {};
    Object.entries(optsByCategory).forEach(([cat, opts]) => {
        const def = (opts || []).find(o => o.is_default) || (opts || [])[0];
        if (def) selected[cat] = def;
    });
    return selected;
};

const fmt = (num) => new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
}).format(Number(num) || 0);

const calcTotal = (base, selectedObj) => {
    let extras = 0;
    Object.values(selectedObj || {}).forEach(opt => {
        extras += Number(opt?.price_addition || 0);
    });
    return Number(base) + extras;
};

export const useShoeStore = create((set, get) => ({
    ...DEFAULT_STATE,

    initFromProps(product, optionsByCategory) {
        const base = Number(product?.base_price || 0);
        const selected = pickDefault(optionsByCategory || {});
        set({
            basePrice: base,
            selected,
            productSlug: product?.slug,
            productId: product?.id,
            glbModelPath: product?.glb_model_path,
        });
    },

    setOption(category, option) {
        if (!category || !option) return;
        set(state => ({
            selected: { ...state.selected, [category]: option },
        }));
    },

    resetAll() {
        set({ selected: {} });
    },

    getBreakdown() {
        const { basePrice, selected } = get();
        const extras = [];
        Object.entries(selected || {}).forEach(([cat, opt]) => {
            if (opt && Number(opt.price_addition || 0) > 0) {
                extras.push({
                    category: cat,
                    label: opt.display_name || opt.name,
                    amount: Number(opt.price_addition),
                });
            }
        });
        const extrasTotal = extras.reduce((s, i) => s + i.amount, 0);
        return {
            basePrice,
            extras,
            extrasTotal,
            totalPrice: basePrice + extrasTotal,
            fmt,
        };
    },

    /* Expose formatted helpers (convenience) */
    fmt,
    totalPrice() { return calcTotal(get().basePrice, get().selected); },
    priceAdditionFor(cat) { return Number(get().selected?.[cat]?.price_addition || 0); },
}));

export { calcTotal, fmt as formatRupiah };
