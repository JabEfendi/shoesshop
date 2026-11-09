import { Head, Link } from '@inertiajs/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import '../../../css/home.css';
import { useParallax } from '../../Components/Parallax';
import { text, useLanguage } from '../../lib/i18n';

const NAVIGATION = [
    ['/sketch/shop', 'Collection'],
    ['/sketch/custom', '3D Custom'],
    ['/sketch/our-story', 'Craft'],
    ['/sketch/sizing', 'Size guide'],
    ['/sketch/cart', 'Cart'],
];

function ShoeMark({ className = '' }) {
    return <svg className={`shoe-mark ${className}`} viewBox="0 0 118 72" aria-hidden="true"><path d="M18 12c12 3 18 11 25 26 9 17 27 18 43 20 15 2 23 7 23 15H13C3 73 1 66 5 58l8-16c3-7 2-17 5-30Z" fill="currentColor" /><path d="M27 23c7 3 12 8 17 17M45 20c7 4 13 10 17 19M63 30c6 3 12 7 16 12" fill="none" stroke="#f2ebd0" strokeWidth="3" strokeLinecap="round" /></svg>;
}

function Header() {
    const [scrolled, setScrolled] = useState(false);
    const [open, setOpen] = useState(false);
    const menuButton = useRef(null);
    useEffect(() => {
        const update = () => setScrolled(window.scrollY > 40);
        update();
        window.addEventListener('scroll', update, { passive: true });
        return () => window.removeEventListener('scroll', update);
    }, []);
    useEffect(() => {
        if (!open) return undefined;
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = previousOverflow; menuButton.current?.focus(); };
    }, [open]);
    return <header className={`shoe-header ${scrolled ? 'is-scrolled' : ''}`}>
        <Link className="shoe-wordmark" href="/sketch/home" aria-label="SHOESHOP.ID home">SHOE<span>SHOP</span>.ID</Link>
        <nav className="shoe-nav" aria-label="Primary navigation">{NAVIGATION.map(([href, label]) => <Link key={href} href={href}>{label}</Link>)}</nav>
        <div className="shoe-header__actions"><Link href="/sketch/custom" className="shoe-button shoe-button--primary">Build yours <span aria-hidden="true">&rarr;</span></Link><button ref={menuButton} onClick={() => setOpen(true)} className="shoe-menu-button" aria-label="Open menu" aria-expanded={open}><i /><i /></button></div>
        {open && <div className="shoe-menu-overlay" role="dialog" aria-modal="true" aria-label="Navigation menu"><div className="shoe-menu-overlay__top"><Link className="shoe-wordmark" href="/sketch/home" onClick={() => setOpen(false)}>SHOE<span>SHOP</span>.ID</Link><button onClick={() => setOpen(false)} className="shoe-close">Close</button></div><nav>{NAVIGATION.map(([href, label], index) => <Link key={href} href={href} onClick={() => setOpen(false)}><small>0{index + 1}</small>{label}</Link>)}</nav><Link href="/sketch/custom" className="shoe-button shoe-button--primary" onClick={() => setOpen(false)}>Build your pair <span aria-hidden="true">&rarr;</span></Link><ShoeMark className="shoe-menu-overlay__mark" /></div>}
    </header>;
}

function ParallaxImage({ src, alt, className, speed = .08, eager = false }) {
    const layer = useParallax(speed, { max: 32, cover: true });
    return <div className={className}><div ref={layer} className="shoe-media__layer"><img src={src} alt={alt} loading={eager ? 'eager' : 'lazy'} decoding="async" /></div></div>;
}

function ProductCard({ model, index }) {
    return <article className={`shoe-product shoe-product--${index % 2 ? 'offset' : 'base'}`}><Link href={`/sketch/shop/${model.slug}`} className="shoe-product__photo"><img src={model.image} alt={model.name} loading="lazy" decoding="async" /><span>0{index + 1}</span><b aria-hidden="true">&rarr;</b></Link><div className="shoe-product__copy"><p>{model.type === 'casual' ? 'Daily casual' : 'Smart formal'}</p><h3>{model.name}</h3><Link href={`/sketch/custom/${model.slug}`}>Customize this pair <span aria-hidden="true">&rarr;</span></Link></div></article>;
}

const PROCESS_STEPS = [
    ['01', 'Material', 'Start with full-grain leather chosen for character, not just colour.'],
    ['02', 'Cutting', 'Each panel is cut to preserve the grain and shape of the final pair.'],
    ['03', 'Stitching', 'Upper, lining, and thread come together by hand in small batches.'],
    ['04', 'Soling', 'The sole is built for daily wear and designed to be replaced over time.'],
    ['05', 'Your pair', 'Checked, packed, and ready to become part of your everyday.'],
];

function FromMaterialToPair({ images }) {
    const sectionRef = useRef(null);
    const [step, setStep] = useState(0);
    const [reducedMotion, setReducedMotion] = useState(false);

    useEffect(() => {
        const media = window.matchMedia('(prefers-reduced-motion: reduce)');
        const updatePreference = () => setReducedMotion(media.matches);
        updatePreference();
        media.addEventListener?.('change', updatePreference);
        return () => media.removeEventListener?.('change', updatePreference);
    }, []);

    useEffect(() => {
        if (reducedMotion) return undefined;
        let frame = 0;
        const update = () => {
            frame = 0;
            const section = sectionRef.current;
            if (!section) return;
            const scrollable = section.offsetHeight - window.innerHeight;
            const progress = scrollable > 0
                ? Math.max(0, Math.min(1, -section.getBoundingClientRect().top / scrollable))
                : 0;
            setStep(Math.min(PROCESS_STEPS.length - 1, Math.floor(progress * PROCESS_STEPS.length)));
        };
        const onScroll = () => {
            if (!frame) frame = window.requestAnimationFrame(update);
        };
        update();
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll);
        return () => {
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onScroll);
            if (frame) window.cancelAnimationFrame(frame);
        };
    }, [reducedMotion]);

    const activeImage = images[step] || images[0];
    return <section ref={sectionRef} className="shoe-process-story" aria-labelledby="process-title">
        <div className="shoe-process-story__visual">
            <div className="shoe-process__image"><img key={activeImage} src={activeImage} alt={`${PROCESS_STEPS[step][1]} stage of making a SHOESHOP.ID pair`} loading="lazy" decoding="async" /></div>
            <span className="shoe-process__stamp">SHOESHOP.ID<br />MADE IN INDONESIA</span>
        </div>
        <div className="shoe-process-story__content">
            <div className="shoe-process__intro">
                <p className="shoe-eyebrow">made to be worn</p>
                <h2 id="process-title">From material<br /><em>to pair.</em></h2>
                <p>Five quiet steps behind a shoe made for everyday life.</p>
                <span className="shoe-process__progress" aria-hidden="true"><i style={{ width: `${((step + 1) / PROCESS_STEPS.length) * 100}%` }} /></span>
            </div>
            <ol className="shoe-process__steps">
                {PROCESS_STEPS.map(([number, title, copy], index) => <li key={number} className={index === step ? 'is-active' : index < step ? 'is-done' : ''}><span>{number}</span><div><b>{title}</b><p>{copy}</p></div></li>)}
            </ol>
        </div>
    </section>;
}

export default function Home({ models = [] }) {
    const { t } = useLanguage();
    const heroCopy = useParallax(-.035, { max: 22 });
    const gallery = useMemo(() => [...new Set(models.flatMap((model) => [model.image, ...(model.gallery || [])]).filter(Boolean))], [models]);
    const boot = models.find((model) => model.slug === 'boots') || models[0];
    const chelsea = models.find((model) => model.slug === 'chelsea') || models[1];
    const featureOne = models[2] || boot;
    return <div className="shoe-landing">
        <Head title="SHOESHOP.ID | Built for your everyday"><meta name="description" content="Explore ready-to-wear leather shoes or build your own pair in the SHOESHOP.ID 3D studio." /></Head>
        <a className="shoe-skip" href="#storefront-main">Skip to content</a>
        <Header />
        <main id="storefront-main" tabIndex={-1}>
            <section className="shoe-hero" aria-labelledby="hero-title"><div className="shoe-hero__shape shoe-hero__shape--one" aria-hidden="true" /><div className="shoe-hero__shape shoe-hero__shape--two" aria-hidden="true" /><div ref={heroCopy} className="shoe-hero__copy"><p className="shoe-eyebrow">{t.home.eyebrow}</p><h1 id="hero-title">{text(t.home.title)}</h1><p>{t.home.body}</p><div className="shoe-actions"><Link href="/sketch/shop" className="shoe-button shoe-button--primary">{t.home.shop} <span aria-hidden="true">&rarr;</span></Link><Link href="/sketch/custom" className="shoe-button shoe-button--secondary">{t.home.studio}</Link></div></div><div className="shoe-hero__visual"><div className="shoe-hero__photo"><ParallaxImage eager speed={.055} className="shoe-media" src={boot?.image || '/assets/images/products/boots/boots.jpeg'} alt={boot?.name || 'Leather boots'} /></div><ShoeMark className="shoe-hero__mark" /><span className="shoe-hero__note">Built for your<br />everyday stride</span></div><a href="#collection" className="shoe-scroll-note">find your pair <span aria-hidden="true">&darr;</span></a></section>
            <section className="shoe-proof" aria-label="SHOESHOP.ID values"><div><span>FULL GRAIN</span><span>GOODYEAR WELT</span><span>HANDMADE IN INDONESIA</span><span>RE-SOLABLE</span></div></section>
            <section id="collection" className="shoe-section shoe-collection" aria-labelledby="collection-title"><div className="shoe-collection__intro"><p className="shoe-eyebrow">one shoe, many lives</p><h2 id="collection-title">Start with<br /><em>your silhouette.</em></h2><p>Five grounded forms for the commute, the weekend, and every plan in between.</p><Link href="/sketch/shop" className="shoe-text-link">View all preset pairs <span aria-hidden="true">&rarr;</span></Link></div><div className="shoe-collection__grid">{models.map((model, index) => <ProductCard key={model.slug} model={model} index={index} />)}</div></section>
            <section className="shoe-studio" aria-labelledby="studio-title"><div className="shoe-studio__title"><p className="shoe-eyebrow">try before it takes shape</p><h2 id="studio-title">Your pair,<br /><em>in 3D.</em></h2><p>Choose a silhouette first. The interactive model opens only inside the Custom Studio, once you are ready to make it yours.</p><Link href="/sketch/custom" className="shoe-button shoe-button--primary">Choose a model <span aria-hidden="true">&rarr;</span></Link></div><ParallaxImage speed={.07} className="shoe-studio__stage shoe-media" src={boot?.gallery?.[0] || boot?.image || '/assets/images/products/boots/front-side.jpeg'} alt={`Front view of ${boot?.name || 'leather boots'}`} /></section>
            <section className="shoe-section shoe-gallery" aria-labelledby="gallery-title"><div className="shoe-gallery__head"><div><p className="shoe-eyebrow">the whole picture</p><h2 id="gallery-title">Every angle<br /><em>matters.</em></h2></div><p>The leather, the sole, the shape, the finish. These are the details that make a pair yours for longer.</p></div><div className="shoe-gallery__track" role="region" aria-label="Product photo gallery">{gallery.map((image, index) => <figure key={image} className={`shoe-gallery__image shoe-gallery__image--${index % 5}`}><img src={image} alt={`SHOESHOP.ID product detail ${index + 1}`} loading="lazy" decoding="async" /></figure>)}</div></section>
            <FromMaterialToPair images={gallery.slice(0, 5)} />
            <section className="shoe-materials shoe-section" aria-labelledby="materials-title"><div className="shoe-materials__head"><div><p className="shoe-eyebrow">choose your character</p><h2 id="materials-title">Material, <em>your way.</em></h2></div><p>Start with a finish that will age with you. Every choice is visible in the studio before you commit.</p></div><div className="shoe-materials__grid">{[['Cognac', '#a47148', 'Warm, already lived-in'], ['Espresso', '#3b2722', 'Deep and quietly formal'], ['Leather', '#604848', 'Soft contrast, strong presence'], ['Forest', '#3c4a3a', 'A grounded green note'], ['Brass', '#c9a24a', 'Small details, warm light'], ['Rust', '#a9502e', 'For a little street energy']].map(([name, color, desc]) => <Link key={name} href="/sketch/custom" className="shoe-material"><span className="shoe-material__swatch" style={{ backgroundColor: color }} /><span><b>{name}</b><small>{desc}</small></span><i aria-hidden="true">&rarr;</i></Link>)}</div></section>
            <section className="shoe-section shoe-features" aria-label="SHOESHOP.ID craftsmanship"><article className="shoe-feature"><div className="shoe-feature__copy"><p className="shoe-eyebrow">built from the ground up</p><h2>Closer to<br /><em>the craft.</em></h2><p>Good leather gets better with time. Strong construction means your favorite pair can keep earning its story.</p><Link href="/sketch/our-story" className="shoe-text-link">How we make them <span aria-hidden="true">&rarr;</span></Link></div><ParallaxImage speed={.09} className="shoe-feature__image shoe-media" src={featureOne?.gallery?.[1] || featureOne?.image || '/assets/images/products/pantofel/PANTOFEL.jpeg'} alt={`Detail of ${featureOne?.name || 'leather shoe'}`} /></article><article className="shoe-feature shoe-feature--reverse"><div className="shoe-feature__copy"><p className="shoe-eyebrow">no almost-right pairs</p><h2>Details, in<br /><em>your hands.</em></h2><p>Choose leather, thread, sole, and finishing touches. The 3D view opens after selecting your preferred model.</p><Link href={`/sketch/custom/${chelsea?.slug || 'boots'}`} className="shoe-text-link">Customize a model <span aria-hidden="true">&rarr;</span></Link></div><ParallaxImage speed={.08} className="shoe-feature__3d shoe-media" src={chelsea?.gallery?.[0] || chelsea?.image || '/assets/images/products/chelsea-boots/front-side.jpeg'} alt={`Front view of ${chelsea?.name || 'Chelsea boots'}`} /></article></section>
            <section className="shoe-editorial" aria-label="Stories and customer note"><div className="shoe-editorial__quote"><p className="shoe-eyebrow">a note from the workshop</p><blockquote>“Handcrafted, not mass-produced.”</blockquote><cite>Made in Indonesia, designed for the everyday.</cite></div><div className="shoe-journal"><p className="shoe-eyebrow">journal / field notes</p><Link href="/sketch/our-story"><span>01</span><b>How a shoe earns its patina</b><i>&rarr;</i></Link><Link href="/sketch/sizing"><span>02</span><b>Finding your fit without a fitting room</b><i>&rarr;</i></Link><Link href="/sketch/our-story"><span>03</span><b>Five stages behind every pair</b><i>&rarr;</i></Link></div></section>
            <section className="shoe-newsletter" aria-labelledby="newsletter-title"><div><p className="shoe-eyebrow">stay close to the craft</p><h2 id="newsletter-title">Notes for<br /><em>the long walk.</em></h2></div><form onSubmit={(event) => event.preventDefault()}><label htmlFor="newsletter-email">Email address</label><div><input id="newsletter-email" type="email" placeholder="nama@email.com" /><button type="submit" className="shoe-button shoe-button--primary">Join the list <span aria-hidden="true">&rarr;</span></button></div><small>New releases, care notes, and the occasional workshop story. No noise.</small></form></section>
            <section className="shoe-final" aria-labelledby="final-title"><ShoeMark className="shoe-final__mark" /><div><p className="shoe-eyebrow">your next pair starts here</p><h2 id="final-title">Make every<br /><em>step yours.</em></h2><Link href="/sketch/custom" className="shoe-button shoe-button--primary">Build in 3D <span aria-hidden="true">&rarr;</span></Link><p className="shoe-reassurance">See your choices and final price before checkout</p></div></section>
        </main>
        <footer className="shoe-footer"><div className="shoe-footer__brand"><Link className="shoe-wordmark" href="/sketch/home">SHOE<span>SHOP</span>.ID</Link><p>Daily casual leather.<br />A little more you.</p></div><nav aria-label="Shop links"><h2>Shop</h2><Link href="/sketch/shop">All presets</Link><Link href="/sketch/custom">3D Custom</Link><Link href="/sketch/cart">Your cart</Link></nav><nav aria-label="Information links"><h2>Know more</h2><Link href="/sketch/our-story">Our craft</Link><Link href="/sketch/sizing">Size guide</Link><Link href="/sketch/account/orders">Your orders</Link></nav><div className="shoe-footer__legal"><span>© {new Date().getFullYear()} SHOESHOP.ID</span><Link href="/sketch/home">Back to top &uarr;</Link></div></footer>
    </div>;
}
