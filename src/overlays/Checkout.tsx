import { useEffect, useRef, useState, type FormEvent } from 'react';
import { gsap, EASE, lockScroll } from '../lib/motion';
import { FREE_SHIPPING, money, productById } from '../data/catalog';
import { useShop } from '../store/shop';
import { Img, shotProps } from '../components/Img';
import { Roll } from '../components/Roll';
import './Checkout.css';

type Fields = Record<'email' | 'first' | 'last' | 'address' | 'city' | 'postcode' | 'country' | 'card' | 'expiry' | 'cvc', string>;

const EMPTY: Fields = { email: '', first: '', last: '', address: '', city: '', postcode: '', country: 'Cairo', card: '', expiry: '', cvc: '' };
const GOVERNORATES = ['Cairo', 'Giza', 'Alexandria', 'Qalyubia', 'Sharqia', 'Dakahlia', 'Gharbia', 'Red Sea', 'South Sinai', 'Luxor', 'Aswan', 'Other'];

const RULES: Partial<Record<keyof Fields, (v: string) => string | null>> = {
  email: (v) => (/^\S+@\S+\.\S+$/.test(v) ? null : 'Enter a valid email'),
  first: (v) => (v.trim() ? null : 'Required'),
  last: (v) => (v.trim() ? null : 'Required'),
  address: (v) => (v.trim() ? null : 'Required'),
  city: (v) => (v.trim() ? null : 'Required'),
  postcode: (v) => (/^01[0125]\d{8}$/.test(v.replace(/\s/g, '')) ? null : 'Enter an 11-digit Egyptian mobile (01…)'),
  card: (v) => (v.replace(/\s/g, '').length >= 12 ? null : 'Enter a card number'),
  expiry: (v) => (/^\d{2}\s?\/\s?\d{2}$/.test(v) ? null : 'MM / YY'),
  cvc: (v) => (/^\d{3,4}$/.test(v) ? null : '3–4 digits'),
};

export function Checkout() {
  const { checkoutOpen, setCheckoutOpen, lines, subtotal, clear } = useShop();
  const root = useRef<HTMLDivElement>(null);
  const first = useRef(true);
  const [f, setF] = useState<Fields>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, string>>>({});
  const [ship, setShip] = useState<'express' | 'atelier'>('express');
  const [pay, setPay] = useState<'cod' | 'card'>('cod');
  const [phase, setPhase] = useState<'form' | 'processing' | 'done'>('form');
  const [order, setOrder] = useState<{ no: string; total: number; name: string; email: string } | null>(null);

  const shipping = ship === 'atelier' || subtotal >= FREE_SHIPPING ? 0 : 90;
  const total = subtotal + shipping;

  useEffect(() => {
    const el = root.current!;
    if (first.current) {
      first.current = false;
      gsap.set(el, { visibility: 'hidden', clipPath: 'inset(100% 0% 0% 0%)' });
      return;
    }
    lockScroll('checkout', checkoutOpen);
    if (checkoutOpen) {
      el.scrollTop = 0;
      gsap.timeline()
        .set(el, { visibility: 'visible' })
        .to(el, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1, ease: EASE.shutter })
        .fromTo(el.querySelectorAll('.co__in'), { opacity: 0, y: 24 }, { opacity: 1, y: 0, stagger: 0.05, duration: 0.9 }, 0.4);
      const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setCheckoutOpen(false);
      window.addEventListener('keydown', onKey);
      return () => window.removeEventListener('keydown', onKey);
    }
    gsap.timeline()
      .to(el, { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.9, ease: EASE.shutter })
      .set(el, { visibility: 'hidden', clipPath: 'inset(100% 0% 0% 0%)' })
      .call(() => {
        if (phase === 'done') {
          setPhase('form');
          setF(EMPTY);
          setOrder(null);
        }
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkoutOpen]);

  const set = (k: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    let v = e.target.value;
    if (k === 'card') v = v.replace(/[^\d]/g, '').slice(0, 19).replace(/(.{4})/g, '$1 ').trim();
    if (k === 'expiry') v = v.replace(/[^\d]/g, '').slice(0, 4).replace(/^(\d{2})(\d)/, '$1 / $2');
    if (k === 'cvc') v = v.replace(/[^\d]/g, '').slice(0, 4);
    setF((s) => ({ ...s, [k]: v }));
    if (errors[k]) setErrors((er) => ({ ...er, [k]: undefined }));
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const next: typeof errors = {};
    (Object.keys(RULES) as (keyof Fields)[]).filter((k) => pay === 'card' || !['card', 'expiry', 'cvc'].includes(k)).forEach((k) => {
      const msg = RULES[k]!(f[k]);
      if (msg) next[k] = msg;
    });
    setErrors(next);
    const firstBad = Object.keys(next)[0];
    if (firstBad) {
      root.current?.querySelector<HTMLElement>(`[name="${firstBad}"]`)?.focus();
      return;
    }
    setPhase('processing');
    window.setTimeout(() => {
      setOrder({ no: `ASHE-${Math.floor(10000 + Math.random() * 89999)}`, total, name: f.first, email: f.email });
      clear();
      setPhase('done');
      root.current?.scrollTo({ top: 0 });
    }, 1500);
  };

  const field = (k: keyof Fields, label: string, props: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <label className={`co__field${errors[k] ? ' is-error' : ''}${props.className ? ` ${props.className}` : ''}`}>
      <span className="t-meta">{label}</span>
      <input name={k} value={f[k]} onChange={set(k)} aria-invalid={!!errors[k]} {...props} className={undefined} />
      {errors[k] && <span className="co__err t-meta">{errors[k]}</span>}
    </label>
  );

  return (
    <div ref={root} className="co" role="dialog" aria-modal="true" aria-label="Checkout" aria-hidden={!checkoutOpen} data-lenis-prevent>
      <header className="co__head">
        <p className="co__brand t-display">ASHE</p>
        <p className="t-meta co__secure">Secure checkout · Demo store — no payment is taken</p>
        <button className="t-label u-link" onClick={() => setCheckoutOpen(false)}>
          {phase === 'done' ? 'Close' : 'Back to bag'}
        </button>
      </header>

      {phase === 'done' && order ? (
        <div className="co__done">
          <p className="t-meta">Order {order.no}</p>
          <h2 className="co__done-title t-serif">
            Thank you{order.name ? `, ${order.name}` : ''}.
            <br />
            <em>It’s on its way.</em>
          </h2>
          <p className="t-body">
            Your order is in. We’ll message you on WhatsApp and email {order.email} when it’s on the way. Order total: {money(order.total)}.
          </p>
          <button className="btn" onClick={() => setCheckoutOpen(false)}>
            <Roll>Continue</Roll>
            <span>→</span>
          </button>
        </div>
      ) : (
        <div className="co__layout">
          <form className="co__form" onSubmit={submit} noValidate>
            <section className="co__step co__in">
              <h3 className="co__step-title">
                <span className="t-meta">01</span> Contact
              </h3>
              {field('email', 'Email', { type: 'email', autoComplete: 'email' })}
            </section>

            <section className="co__step co__in">
              <h3 className="co__step-title">
                <span className="t-meta">02</span> Delivery
              </h3>
              <div className="co__grid">
                {field('first', 'First name', { autoComplete: 'given-name' })}
                {field('last', 'Last name', { autoComplete: 'family-name' })}
                {field('address', 'Address', { autoComplete: 'street-address', className: 'co__wide' })}
                {field('city', 'City', { autoComplete: 'address-level2' })}
                {field('postcode', 'Mobile', { autoComplete: 'tel', inputMode: 'tel', placeholder: '01X XXXX XXXX' })}
                <label className="co__field co__wide">
                  <span className="t-meta">Governorate</span>
                  <select name="country" value={f.country} onChange={set('country')} autoComplete="address-level1">
                    {GOVERNORATES.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </label>
              </div>
              <div className="co__options" role="radiogroup" aria-label="Delivery method">
                <label className={`co__option${ship === 'express' ? ' is-active' : ''}`}>
                  <input type="radio" name="ship" checked={ship === 'express'} onChange={() => setShip('express')} />
                  <span>Courier — Cairo & Giza 1–2 days, elsewhere 3–5</span>
                  <span className="t-meta">{subtotal >= FREE_SHIPPING ? 'Free' : money(90)}</span>
                </label>
                <label className={`co__option${ship === 'atelier' ? ' is-active' : ''}`}>
                  <input type="radio" name="ship" checked={ship === 'atelier'} onChange={() => setShip('atelier')} />
                  <span>Pick up from the workshop, Downtown</span>
                  <span className="t-meta">Free</span>
                </label>
              </div>
            </section>

            <section className="co__step co__in">
              <h3 className="co__step-title">
                <span className="t-meta">03</span> Payment
              </h3>
              <div className="co__options co__options--pay" role="radiogroup" aria-label="Payment method">
                <label className={`co__option${pay === 'cod' ? ' is-active' : ''}`}>
                  <input type="radio" name="pay" checked={pay === 'cod'} onChange={() => setPay('cod')} />
                  <span>Cash on delivery</span>
                  <span className="t-meta">Pay the courier</span>
                </label>
                <label className={`co__option${pay === 'card' ? ' is-active' : ''}`}>
                  <input type="radio" name="pay" checked={pay === 'card'} onChange={() => setPay('card')} />
                  <span>Card</span>
                  <span className="t-meta">Visa · Mastercard · Meeza</span>
                </label>
              </div>
              {pay === 'card' && (
              <div className="co__grid co__card">
                {field('card', 'Card number', { inputMode: 'numeric', autoComplete: 'cc-number', placeholder: '4242 4242 4242 4242', className: 'co__wide' })}
                {field('expiry', 'Expiry', { inputMode: 'numeric', autoComplete: 'cc-exp', placeholder: 'MM / YY' })}
                {field('cvc', 'CVC', { inputMode: 'numeric', autoComplete: 'cc-csc', placeholder: '123' })}
              </div>
              )}
            </section>

            <button type="submit" className="btn co__submit co__in" disabled={phase === 'processing' || lines.length === 0}>
              <Roll>{phase === 'processing' ? 'Placing order' : 'Place order'}</Roll>
              <span>{money(total)}</span>
              {phase === 'processing' && <span className="co__progress" aria-hidden="true" />}
            </button>
          </form>

          <aside className="co__summary co__in" aria-label="Order summary">
            <p className="t-meta co__summary-head">Your order</p>
            <ul>
              {lines.map((l) => {
                const p = productById(l.productId)!;
                const c = p.colours.find((c) => c.id === l.colourId) ?? p.colours[0];
                return (
                  <li key={l.key} className="co__line">
                    <span className="co__line-img">
                      <Img {...shotProps(c.shots[0])} sizes="80px" />
                      <span className="co__qty t-meta">{l.qty}</span>
                    </span>
                    <span className="co__line-name">
                      <span className="t-serif">{p.name}</span>
                      <span className="t-meta">
                        {c.label} — {l.size}
                      </span>
                    </span>
                    <span className="t-meta">{money(p.price * l.qty)}</span>
                  </li>
                );
              })}
            </ul>
            <dl className="co__totals">
              <div>
                <dt className="t-meta">Subtotal</dt>
                <dd className="t-meta">{money(subtotal)}</dd>
              </div>
              <div>
                <dt className="t-meta">Delivery</dt>
                <dd className="t-meta">{shipping ? money(shipping) : 'Free'}</dd>
              </div>
              <div className="co__grand">
                <dt className="t-label">Total</dt>
                <dd className="t-serif">{money(total)}</dd>
              </div>
            </dl>
          </aside>
        </div>
      )}
    </div>
  );
}
