import { useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import { gsap, ScrollTrigger, getLenis } from '../lib/motion';
import { looks, money, productById } from '../data/catalog';
import { useShop } from '../store/shop';
import { Img, shotProps } from '../components/Img';
import { Roll } from '../components/Roll';
import './Looks.css';

const HOLD = 0.6; // dwell on each look
const WIPE = 1; // length of each outfit change
const STEP = HOLD + WIPE;
const labelTime = (i: number) => HOLD / 2 + i * STEP;

const lookTotal = (i: number) => looks[i].pieces.reduce((n, p) => n + (productById(p.productId)?.price ?? 0), 0);

/**
 * Signature scene. The model stays anchored at the centre of a pinned studio while
 * scrolling pulls each new outfit up over the last one — a scan line marks the edge,
 * the look number rolls behind her and the editorial notes re-set around her.
 */
export function Looks() {
  const root = useRef<HTMLElement>(null);
  const st = useRef<ScrollTrigger | null>(null);
  const [active, setActive] = useState(0);
  const { add, addLook, openProduct } = useShop();

  useLayoutEffect(() => {
    const el = root.current!;
    const ctx = gsap.context(() => {
      const shots = gsap.utils.toArray<HTMLElement>('.looks__shot');
      const imgs = shots.map((s) => s.querySelector('img')!);
      const fills = gsap.utils.toArray<HTMLElement>('.looks__tick-fill');
      const mobile = window.matchMedia('(max-width: 900px)').matches;

      gsap.set(shots.slice(1), { clipPath: 'inset(100% 0% 0% 0%)' });
      gsap.set('.looks__scan', { opacity: 0 });

      const tl = gsap.timeline({ defaults: { ease: 'none' } });
      tl.to({}, { duration: labelTime(0) });

      looks.forEach((_, i) => {
        if (i === 0) return;
        const at = labelTime(i - 1) + HOLD / 2;
        tl.to(shots[i], { clipPath: 'inset(0% 0% 0% 0%)', duration: WIPE, ease: 'power2.inOut' }, at)
          .fromTo(imgs[i], { scale: 1.1, yPercent: 3 }, { scale: 1, yPercent: 0, duration: WIPE, ease: 'power2.out' }, at)
          .to(imgs[i - 1], { scale: 0.94, yPercent: -2, duration: WIPE, ease: 'power2.in' }, at)
          .fromTo('.looks__scan', { top: '100%' }, { top: '0%', duration: WIPE, ease: 'power2.inOut', immediateRender: false }, at)
          .to('.looks__scan', { opacity: 1, duration: 0.12 }, at)
          .to('.looks__scan', { opacity: 0, duration: 0.15 }, at + WIPE - 0.15)
          .to(fills[i - 1], { scaleX: 1, duration: WIPE, ease: 'power1.inOut' }, at)
          .to('.looks__numbers', { yPercent: -(100 / looks.length) * i, duration: WIPE, ease: 'expo.inOut' }, at);
      });
      tl.to({}, { duration: 0.08 }); // no dead zone after the last look — the next scroll moves on
      tl.to('.looks__hint', { opacity: 0, duration: 0.3 }, labelTime(0) + 0.1);

      const total = tl.duration();
      st.current = ScrollTrigger.create({
        trigger: el,
        start: 'top top',
        end: () => `+=${window.innerHeight * (mobile ? 0.6 : 0.75) * (looks.length - 1) + window.innerHeight * 0.25}`,
        pin: el.querySelector<HTMLElement>('.looks__stage'),
        anticipatePin: 1,
        scrub: 0.8,
        animation: tl,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const t = self.progress * total;
          const idx = Math.max(0, Math.min(looks.length - 1, Math.round((t - labelTime(0)) / STEP)));
          setActive((a) => (a === idx ? a : idx));
        },
      });
      (st.current as ScrollTrigger & { _total?: number })._total = total;

      // Arrival: the studio opens like a frame widening — same aperture language as the hero.
      gsap.fromTo(
        '.looks__model',
        { clipPath: 'inset(0% 30% 0% 30%)' },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          ease: 'power2.inOut',
          scrollTrigger: { trigger: el, start: 'top bottom', end: 'top 20%', scrub: 0.6 },
        },
      );
      gsap.from('.looks__intro-line', {
        yPercent: 110,
        stagger: 0.08,
        duration: 1.2,
        scrollTrigger: { trigger: el, start: 'top 55%' },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  const goTo = (i: number) => {
    const s = st.current as (ScrollTrigger & { _total?: number }) | null;
    if (!s || !s._total) return;
    const y = s.start + (labelTime(i) / s._total) * (s.end - s.start);
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(y, { duration: 1.4 });
    else window.scrollTo({ top: y, behavior: 'smooth' });
  };

  const look = looks[active];
  const lead = productById(look.pieces[0].productId)!;

  return (
    <section id="looks" ref={root} className="looks" style={{ '--tint': look.tint } as CSSProperties} aria-label="The looks — scroll to change the outfit">
      <div className="looks__stage">
        <header className="looks__intro">
          <p className="t-meta">
            <span className="mask"><span className="looks__intro-line">The looks · Drop 04</span></span>
          </p>
          <h2 className="looks__heading t-display">
            <span className="mask"><span className="looks__intro-line">One body.</span></span>
            <span className="mask"><span className="looks__intro-line"><em>Seven</em> looks.</span></span>
          </h2>
        </header>

        {/* giant rolling look number behind the model */}
        <div className="looks__number-mask" aria-hidden="true">
          <div className="looks__numbers">
            {looks.map((l) => (
              <span key={l.id}>{l.no}</span>
            ))}
          </div>
        </div>

        <button
          className="looks__model"
          data-cursor="Shop"
          aria-label={`Shop ${lead.name} from look ${look.no}`}
          onClick={(e) => {
            const s = lead.colours.find((c) => c.id === look.pieces[0].colourId)!.shots[0];
            openProduct(lead.id, { rect: e.currentTarget.getBoundingClientRect(), src: s.name, pos: s.pos });
          }}
        >
          {looks.map((l, i) => (
            <span className="looks__shot" key={l.id} style={{ zIndex: i + 1 }}>
              <Img
                name={l.image}
                sizes="(max-width: 900px) 90vw, 40vw"
                eager={i < 2}
                alt={`Look ${l.no}, ${l.title}: ${l.pieces.map((p) => productById(p.productId)?.name).join(' and ')}`}
                style={{
                  translate: `${l.frame.x}% ${l.frame.y}%`,
                  scale: `${l.frame.scale}`,
                  filter: `brightness(${l.frame.bright}) contrast(1.04)`,
                }}
              />
            </span>
          ))}
          <span className="looks__scan" aria-hidden="true">
            <span className="t-meta">Next look</span>
          </span>
        </button>

        {/* left: look title block */}
        <div className="looks__info" aria-live="polite">
          {looks.map((l, i) => (
            <div key={l.id} className={`looks__info-item${i === active ? ' is-active' : ''}`} aria-hidden={i !== active}>
              <p className="t-meta looks__kicker">
                <span className="mask"><span>Look {l.no} / 0{looks.length}</span></span>
              </p>
              <h3 className="looks__title t-display">
                {l.title.split(' ').map((w, wi) => (
                  <span className="mask" key={wi}>
                    <span style={{ transitionDelay: `${0.05 + wi * 0.06}s` }}>{w}</span>
                  </span>
                ))}
              </h3>
              <p className="looks__mood t-serif">
                <span className="mask"><span>{l.mood}</span></span>
              </p>
            </div>
          ))}
        </div>

        {/* right: pieces in the look */}
        <div className="looks__pieces">
          <p className="t-meta looks__pieces-head">
            <span>In this look</span>
            <span>{look.pieces.length} piece{look.pieces.length > 1 ? 's' : ''}</span>
          </p>
          <ul>
            {look.pieces.map((p, pi) => {
              const product = productById(p.productId)!;
              const colour = product.colours.find((c) => c.id === p.colourId)!;
              return (
                <li key={`${look.id}-${p.productId}`} className="looks__piece" style={{ animationDelay: `${pi * 0.08}s` }}>
                  <button
                    className="looks__piece-open"
                    data-cursor="View"
                    onClick={(e) =>
                      openProduct(product.id, { rect: e.currentTarget.getBoundingClientRect(), src: colour.shots[0].name, pos: colour.shots[0].pos })
                    }
                  >
                    <span className="looks__piece-thumb">
                      <Img {...shotProps(colour.shots[0])} sizes="80px" />
                    </span>
                    <span className="looks__piece-name">{product.name}</span>
                    <span className="looks__piece-meta t-meta">
                      {colour.label} — {money(product.price)}
                    </span>
                  </button>
                  <button
                    className="looks__piece-add"
                    aria-label={`Add ${product.name}, ${colour.label}, size ${p.size} to bag`}
                    onClick={(e) => add({ productId: p.productId, colourId: p.colourId, size: p.size }, { from: e.currentTarget.getBoundingClientRect() })}
                  >
                    +
                  </button>
                </li>
              );
            })}
          </ul>
          <button className="btn looks__cta" onClick={(e) => addLook(look.pieces, look.title, e.currentTarget.getBoundingClientRect())}>
            <Roll>{look.pieces.length > 1 ? 'Add the full look' : 'Add to bag'}</Roll>
            <span>{money(lookTotal(active))}</span>
          </button>
        </div>

        {/* progress — thumbnails double as shortcuts */}
        <nav className="looks__progress" aria-label="Choose a look">
          {looks.map((l, i) => (
            <button
              key={l.id}
              className={`looks__tick${i === active ? ' is-active' : ''}${i < active ? ' is-past' : ''}`}
              onClick={() => goTo(i)}
              aria-label={`Look ${l.no}: ${l.title}`}
              aria-current={i === active}
            >
              <span className="looks__tick-thumb">
                <Img name={l.image} pos="50% 25%" sizes="60px" alt="" />
              </span>
              <span className="t-meta">{l.no}</span>
              {i < looks.length - 1 && (
                <span className="looks__tick-track" aria-hidden="true">
                  <span className="looks__tick-fill" />
                </span>
              )}
            </button>
          ))}
        </nav>

        <p className="looks__hint t-meta" aria-hidden="true">
          Scroll to change the look <i />
        </p>
      </div>
    </section>
  );
}
