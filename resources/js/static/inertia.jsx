import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { addCartItem, createOrder, removeCart, updateCart } from './store';

const NavigationContext = createContext({ navigate: () => {}, url: '/' });

export function Link({ href, onClick, children, ...props }) {
    const { navigate } = useContext(NavigationContext);
    const external = !href || /^(https?:|mailto:|tel:|#)/.test(href);

    return <a
        href={href}
        onClick={(event) => {
            onClick?.(event);
            if (event.defaultPrevented || external || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
            event.preventDefault();
            navigate(href);
        }}
        {...props}
    >{children}</a>;
}

export function Head({ title, children }) {
    useEffect(() => {
        if (title) document.title = title;
    }, [title]);
    return children || null;
}

export function usePage() {
    const { url, component } = useContext(NavigationContext);
    return { url, component, props: {} };
}

export function useForm(initialData) {
    const [data, setState] = useState(initialData);
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState({});
    const { navigate } = useContext(NavigationContext);
    const setData = (key, value) => setState((current) => typeof key === 'object' ? key : { ...current, [key]: value });

    const post = (url) => {
        setProcessing(true);
        const required = Object.entries(data).filter(([key, value]) => ['recipient_name', 'phone', 'address', 'city', 'postal_code', 'email', 'password', 'name', 'password_confirmation'].includes(key) && !value);
        if (required.length > 0) {
            setErrors(Object.fromEntries(required.map(([key]) => [key, 'Kolom ini wajib diisi.'])));
            setProcessing(false);
            return;
        }
        setErrors({});
        window.setTimeout(() => {
            if (url === '/checkout') {
                createOrder(data);
                navigate('/sketch/account/orders');
            } else {
                navigate('/sketch/home');
            }
            setProcessing(false);
        }, 250);
    };

    return { data, setData, post, processing, errors };
}

export const router = {
    post(url, data, options = {}) {
        if (url === '/cart') addCartItem(data);
        options.onSuccess?.();
        options.onFinish?.();
    },
    patch(url, data, options = {}) {
        updateCart(url.split('/').pop(), data.qty);
        options.onSuccess?.();
        options.onFinish?.();
    },
    delete(url, options = {}) {
        removeCart(url.split('/').pop());
        options.onSuccess?.();
        options.onFinish?.();
    },
};

export function StaticRouter({ children, component }) {
    const [url, setUrl] = useState(() => window.location.pathname + window.location.search);
    useEffect(() => {
        const onPopState = () => setUrl(window.location.pathname + window.location.search);
        window.addEventListener('popstate', onPopState);
        return () => window.removeEventListener('popstate', onPopState);
    }, []);

    const value = useMemo(() => ({
        url,
        component,
        navigate(href) {
            window.history.pushState({}, '', href);
            setUrl(window.location.pathname + window.location.search);
            window.dispatchEvent(new PopStateEvent('popstate'));
            window.scrollTo({ top: 0, behavior: 'auto' });
        },
    }), [url, component]);

    return <NavigationContext.Provider value={value}>{children}</NavigationContext.Provider>;
}
