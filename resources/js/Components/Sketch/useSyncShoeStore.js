import { useEffect } from 'react';
import { useShoeStore } from '../ShoeConfigurator/useShoeStore';

export const ELEMENT_TO_CATEGORY = {
    kulit: 'material_upper', 'benang-kulit': 'stitching', 'benang-outsole': 'sole',
    eyelet: 'hardware', 'panel-chelsea': 'material_upper', tali: 'laces',
    'storm-welt': 'stitching', outsole: 'sole',
};

export function useSyncShoeStore(elements, selectedMap, model) {
    const initFromProps = useShoeStore(s => s.initFromProps);
    const setOption = useShoeStore(s => s.setOption);

    useEffect(() => {
        initFromProps({ base_price: model?.price || 0, slug: model?.slug, glb_model_path: model?.glb }, {});
    }, [initFromProps, model?.slug]);

    useEffect(() => {
        elements?.forEach(el => {
            const category = ELEMENT_TO_CATEGORY[el.slug];
            const value = el.defaults[selectedMap?.[el.slug] ?? 0];
            if (!category || !value) return;
            setOption(category, {
                id: `${el.slug}-${selectedMap?.[el.slug] ?? 0}`, name: value.n, display_name: value.n,
                hex_color: value.c || null, price_addition: value.p || 0,
                roughness: el.slug === 'kulit' ? 0.82 : undefined,
                metalness: el.slug === 'eyelet' ? 0.8 : undefined,
            });
        });
    }, [elements, selectedMap, setOption]);
}
