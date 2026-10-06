import { Fragment, useMemo } from 'react';
import { useShoeStore, formatRupiah } from './useShoeStore';

const ICONS = {
    material_upper: 'fa-tshirt',
    sole:           'fa-shoe-prints',
    insole:         'fa-feather-alt',
    laces:          'fa-link',
    hardware:       'fa-screwdriver-wrench',
    stitching:      'fa-wand-magic-sparkles',
};

function SwatchColor({ color, label, active, onClick, extraLabel }) {
    return (
        <div
            className={`option-card p-2 rounded ${active ? 'active' : ''}`}
            onClick={onClick}
            title={`${label}${extraLabel ? ' · ' + extraLabel : ''}`}
            style={{ minWidth: 78 }}
        >
            <div className="d-flex align-items-center flex-column">
                <div
                    className={`swatch-color mb-1 ${active ? 'active' : ''}`}
                    style={{
                        background: color
                            ? `linear-gradient(135deg, ${color} 0%, ${shade(color, -18)} 100%)`
                            : 'linear-gradient(45deg,#aaa 25%,transparent 25%,transparent 75%,#aaa 75%),linear-gradient(45deg,#aaa 25%,#fff 25%,#fff 75%,#aaa 75%)',
                        backgroundSize: '100% 100%, 8px 8px',
                        backgroundPosition: '0 0, 4px 4px',
                    }}
                />
                <div className="text-center" style={{ fontSize: 12, lineHeight: 1.2, color: '#302d29' }}>
                    <div className="font-weight-bold text-dark" style={{ fontSize: 12.5 }}>
                        {label}
                    </div>
                    {extraLabel && (
                        <div className="mt-1 text-leather font-weight-semibold" style={{ fontSize: 11.5 }}>
                            {extraLabel}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function shade(hex, pct) {
    const c = hex.replace('#', '');
    const n = parseInt(c, 16);
    const r = Math.max(0, Math.min(255, (n >> 16) + Math.round(2.55 * pct)));
    const g = Math.max(0, Math.min(255, ((n >> 8) & 0xff) + Math.round(2.55 * pct)));
    const b = Math.max(0, Math.min(255, (n & 0xff) + Math.round(2.55 * pct)));
    return '#' + (0x1000000 + r * 0x10000 + g * 0x100 + b).toString(16).slice(1);
}

function CategoryGroup({ category, label, options, selected, onSelect }) {
    if (!options || options.length === 0) return null;
    return (
        <div className="form-group mb-3">
            <label className="d-flex align-items-center mb-2 text-industrial-800" style={{ fontWeight: 600 }}>
                <i className={`fas ${ICONS[category] || 'fa-circle-dot'} mr-2 text-leather`}></i>
                {label}
                {selected && Number(selected.price_addition) > 0 && (
                    <span className="ml-auto text-leather font-weight-bold" style={{ fontSize: 13 }}>
                        +{formatRupiah(selected.price_addition)}
                    </span>
                )}
            </label>
            <div className="d-flex flex-wrap gap-2">
                {options.map(opt => {
                    const extra = Number(opt.price_addition) > 0
                        ? `+${formatRupiah(opt.price_addition)}`
                        : (opt.roughness != null && opt.metalness != null
                            ? `${Math.round((1 - opt.roughness) * 100)}% glossy${opt.metalness > 0.3 ? ' · metal' : ''}`
                            : null);
                    return (
                        <SwatchColor
                            key={opt.id || opt.name}
                            color={opt.hex_color || null}
                            label={opt.display_name || opt.name}
                            extraLabel={extra}
                            active={selected?.id === opt.id || selected?.name === opt.name}
                            onClick={() => onSelect(category, opt)}
                        />
                    );
                })}
            </div>
        </div>
    );
}

function PriceBreakdown() {
    const { basePrice, selected, fmt } = useShoeStore();
    const extras = useMemo(() => {
        const arr = [];
        Object.entries(selected || {}).forEach(([cat, opt]) => {
            if (!opt) return;
            const add = Number(opt.price_addition || 0);
            if (add > 0) {
                arr.push({
                    label: `${opt.display_name || opt.name}`,
                    sub: cat,
                    amount: add,
                });
            }
        });
        return arr;
    }, [selected]);

    const extrasTotal = extras.reduce((s, e) => s + e.amount, 0);
    const total = basePrice + extrasTotal;

    return (
        <div className="total-price-box mt-3 mb-3">
            <div className="d-flex justify-content-between align-items-center mb-2">
                <span style={{ color: '#a8a298' }}>Harga Dasar</span>
                <span className="price-line-through rupiah-font">{fmt(basePrice)}</span>
            </div>
            {extras.map((e, i) => (
                <div key={i} className="d-flex justify-content-between align-items-center mb-1">
                    <small style={{ color: '#a8a298' }}>
                        + {e.label} <span className="text-industrial-400">({e.sub})</span>
                    </small>
                    <small className="rupiah-font text-warning">+{fmt(e.amount)}</small>
                </div>
            ))}
            <hr style={{ borderColor: '#454039' }} />
            <div className="d-flex justify-content-between align-items-end">
                <span style={{ color: '#ffb74d', letterSpacing: 1 }} className="font-weight-bold">
                    <i className="fas fa-tag mr-1"></i> TOTAL
                </span>
                <span className="total-price rupiah-font">{fmt(total)}</span>
            </div>
        </div>
    );
}

function Buttons() {
    const total = useShoeStore(s => s.totalPrice());
    const fmt = useShoeStore(s => s.fmt);
    const reset = useShoeStore(s => s.resetAll);
    return (
        <div className="mt-2">
            <button
                type="button"
                className="btn btn-industrial-primary btn-block btn-lg mb-2"
                onClick={() => {
                    alert(`[DEMO] Desain ditambahkan ke keranjang!\n\nTotal: ${fmt(total)}`);
                }}
            >
                <i className="fas fa-cart-plus mr-2"></i>
                Tambah ke Keranjang
            </button>
            <div className="d-flex gap-2">
                <button
                    type="button"
                    className="btn btn-outline-dark btn-sm flex-grow-1"
                    onClick={() => {
                        const params = new URLSearchParams(location.search);
                        params.set('reset', '1');
                        alert('[DEMO] Desain disimpan!\nShare link: ' + location.href.split('?')[0] + '?' + params.toString());
                    }}
                >
                    <i className="fas fa-share-nodes mr-1"></i> Share Desain
                </button>
                <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => reset()}
                >
                    <i className="fas fa-rotate-left"></i>
                </button>
            </div>
        </div>
    );
}

export function ConfiguratorPanel({ categoryLabels, customizationOptions, meshesDetected = [] }) {
    const selected = useShoeStore(s => s.selected);
    const setOption = useShoeStore(s => s.setOption);
    const cats = Object.keys(customizationOptions || {});

    return (
        <div className="card card-configurator">
            <div className="card-header bg-industrial-900 text-white d-flex align-items-center">
                <h3 className="card-title m-0 uppercase-header" style={{ fontSize: 16 }}>
                    <i className="fas fa-sliders mr-2 text-warning"></i>
                    Customize Your Shoes
                </h3>
                {meshesDetected?.length > 0 && (
                    <small className="ml-auto d-none d-md-inline text-industrial-300">
                        {meshesDetected.length} mesh siap
                    </small>
                )}
            </div>
            <div className="card-body" style={{ maxHeight: 'calc(70vh - 90px)', overflowY: 'auto' }}>
                {cats.length === 0 && (
                    <div className="alert alert-warning small">
                        <i className="fas fa-triangle-exclamation mr-1"></i>
                        Belum ada opsi custom untuk produk ini. Jalankan
                        <code className="mx-1 px-1">php artisan db:seed --class=ProductSeeder</code>
                    </div>
                )}
                {cats.map(cat => (
                    <CategoryGroup
                        key={cat}
                        category={cat}
                        label={categoryLabels?.[cat] || cat}
                        options={customizationOptions[cat]}
                        selected={selected?.[cat]}
                        onSelect={setOption}
                    />
                ))}
            </div>
            <div className="card-footer" style={{ background: '#f6f5f4', borderTop: '1px solid #cac6bf' }}>
                <PriceBreakdown />
                <Buttons />
            </div>
        </div>
    );
}

export default ConfiguratorPanel;
