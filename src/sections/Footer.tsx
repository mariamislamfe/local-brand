import { useEffect, useLayoutEffect, useRef, useState, type FormEvent } from 'react';
import { gsap, scrollToId } from '../lib/motion';
import { useShop } from '../store/shop';
import { goShop } from '../lib/nav';
import { Roll } from '../components/Roll';
import './Footer.css';

function CairoClock() {
  const fmt = () =>
    new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'Africa/Cairo' }).format(new Date());
  const [t, setT] = useState(fmt);
  useEffect(() => {
    const id = window.setInterval(() => setT(fmt()), 1000);
    return () => window.clearInterval(id);
  }, []);
  return <span>{t}</span>;
}

export function Footer() {
  const root = useRef<HTMLElement>(null);
  const { setFilter } = useShop();
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.foot__letter',
        { yPercent: 100 },
        {
          yPercent: 0,
          stagger: 0.06,
          ease: 'none',
          scrollTrigger: { trigger: '.foot__mark', start: 'top bottom', end: 'bottom bottom', scrub: 0.6 },
        },
      );
    }, root);
    return () => ctx.revert();
  }, []);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setState('error');
      return;
    }
    setState('sending');
    window.setTimeout(() => setState('done'), 900);
  };

  return (
    <footer id="atelier" ref={root} className="foot">
      <div className="foot__grid">
        <form className="foot__letters" onSubmit={submit} noValidate>
          <label htmlFor="foot-email" className="foot__letters-title t-serif">
            Get the drop first
          </label>
          <p className="t-meta foot__letters-sub">New drops sell out. Subscribers get 24 hours early access and 10% off their first order.</p>
          {state === 'done' ? (
            <p className="foot__letters-done t-label" role="status">
              You’re in — check your inbox for 10% off.
            </p>
          ) : (
            <div className={`foot__field${state === 'error' ? ' is-error' : ''}`}>
              <input
                id="foot-email"
                type="email"
                placeholder="Email address"
                autoComplete="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (state === 'error') setState('idle');
                }}
                aria-invalid={state === 'error'}
                aria-describedby={state === 'error' ? 'foot-email-err' : undefined}
              />
              <button type="submit" className="btn" disabled={state === 'sending'}>
                <Roll>{state === 'sending' ? 'Sending' : 'Subscribe'}</Roll>
              </button>
            </div>
          )}
          {state === 'error' && (
            <p id="foot-email-err" className="t-meta foot__err">
              Please enter a valid email address.
            </p>
          )}
        </form>

        <nav className="foot__cols t-meta" aria-label="Footer">
          <div>
            <p className="foot__col-head">Shop</p>
            <button className="u-link" onClick={() => goShop(setFilter, 'all')}>Shop all</button>
            <button className="u-link" onClick={() => goShop(setFilter, 'new')}>New in</button>
            <button className="u-link" onClick={() => goShop(setFilter, 'sale')}>Sale</button>
            <button className="u-link" onClick={() => scrollToId('looks')}>The looks</button>
          </div>
          <div>
            <p className="foot__col-head">Client care</p>
            <a className="u-link" href="#atelier">Delivery — 1 to 5 days</a>
            <a className="u-link" href="#atelier">Returns — 30 days</a>
            <a className="u-link" href="#atelier">Size guide</a>
            <a className="u-link" href="#atelier">WhatsApp — +20 100 000 0000</a>
          </div>
          <div>
            <p className="foot__col-head">Elsewhere</p>
            <a className="u-link" href="#atelier">Instagram</a>
            <a className="u-link" href="#atelier">TikTok</a>
            <a className="u-link" href="#atelier">Pinterest</a>
            <a className="u-link" href="#atelier">Workshop — 14 Champollion St.</a>
          </div>
        </nav>
      </div>

      <div className="foot__mark t-display" aria-hidden="true">
        {'ASHE'.split('').map((c, i) => (
          <span key={i} className="foot__letter-mask">
            <span className="foot__letter">{c}</span>
          </span>
        ))}
      </div>

      <div className="foot__legal t-meta">
        <p>
          © 2026 ASHE · Cairo <CairoClock />
        </p>
        <p>Campaign imagery: Unsplash contributors (placeholder)</p>
        <button className="u-link" onClick={() => scrollToId('top')}>
          Back to top ↑
        </button>
      </div>
    </footer>
  );
}
