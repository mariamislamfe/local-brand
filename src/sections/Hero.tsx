import { useEffect, useLayoutEffect, useRef } from 'react';
import { gsap, EASE, ScrollTrigger, finePointer, lite, reducedMotion, scrollToId } from '../lib/motion';
import { Img } from '../components/Img';
import { ArrowIcon } from '../components/Icons';
import { useShop } from '../store/shop';
import { goShop } from '../lib/nav';
import { money, productById } from '../data/catalog';
import './Hero.css';

/**
 * First screen: a framed portrait inside giant type, with the shop one click away.
 * Scrolling pins it briefly — the frame opens to full bleed and flashes the looks teaser.
 */
export function Hero() {
  const root = useRef<HTMLElement>(null);
  const blazer = productById('atelier-blazer')!;
  const { openProduct, setFilter } = useShop();

  useLayoutEffect(() => {
    const el = root.current!;
    const ctx = gsap.context(() => {
      const frame = el.querySelector<HTMLElement>('.hero__frame')!;
      const plate = el.querySelector<HTMLElement>('.hero__plate')!;
      const rect = () => {
        const r = frame.getBoundingClientRect();
        const s = el.getBoundingClientRect();
        return { top: r.top - s.top, left: r.left - s.left, width: r.width, height: r.height };
      };
      // Phones: the plate stays full-size and a clip-path opens it (composited, no per-frame
      // layout). Desktop resizes the box so the portrait re-crops as it grows.
      const clipMode = lite();
      const inset = () => {
        const r = rect();
        return `inset(${r.top}px ${el.clientWidth - r.left - r.width}px ${el.clientHeight - r.top - r.height}px ${r.left}px)`;
      };
      // shift the photo so the model sits in the small frame, then glide back as it opens
      const shift = () => rect().left + rect().width / 2 - el.clientWidth / 2;
      if (clipMode) gsap.set(plate, { top: 0, left: 0, width: '100%', height: '100%', clipPath: inset() });
      else gsap.set(plate, rect());

      // scroll: expand → teaser
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: el,
          start: 'top top',
          end: () => `+=${window.innerHeight * 1.2}`,
          pin: true,
          anticipatePin: 1,
          scrub: clipMode ? 0.25 : 0.5,
          invalidateOnRefresh: true,
        },
      });
      if (clipMode) {
        tl.fromTo(plate, { clipPath: inset }, { clipPath: 'inset(0px 0px 0px 0px)', duration: 1, ease: 'power2.inOut' }, 0)
          .fromTo('.hero__plate-img', { x: shift, scale: 1.12 }, { x: 0, scale: 1, duration: 1, ease: 'power2.inOut' }, 0);
      } else {
        tl.fromTo(
          plate,
          { top: () => rect().top, left: () => rect().left, width: () => rect().width, height: () => rect().height },
          { top: 0, left: 0, width: () => el.clientWidth, height: () => el.clientHeight, duration: 1, ease: 'power2.inOut' },
          0,
        ).fromTo('.hero__plate-img', { scale: 1.12 }, { scale: 1, duration: 1 }, 0);
      }
      tl.to('.hero__letter', { yPercent: (i) => -30 - i * 15, opacity: 0, duration: 0.5, stagger: 0.03 }, 0)
        .to('.hero__second', { yPercent: -80, autoAlpha: 0, duration: 0.5 }, 0)
        .to('.hero__fade', { autoAlpha: 0, y: -20, duration: 0.3 }, 0)
        .to('.hero__veil', { opacity: 1, duration: 0.4 }, 0.6)
        .fromTo('.hero__teaser-line', { yPercent: 105 }, { yPercent: 0, duration: 0.4, stagger: 0.08, ease: 'power2.out' }, 0.7)
        .to({}, { duration: 0.2 });

      // hand-off, overlapped with the looks scene rising: the photo recedes into the studio grey
      // the looks are shot on, so the next section arrives out of the same colour — no hard edge
      const looks = document.getElementById('looks');
      if (looks) {
        gsap
          .timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: looks, start: 'top bottom', end: 'top 35%', scrub: 0.4 } })
          .to('.hero__teaser', { yPercent: -60, autoAlpha: 0, duration: 0.5 }, 0)
          .to(plate, { scale: 0.88, autoAlpha: 0, duration: 1 }, 0)
          .to(el, { backgroundColor: '#d9d8d5', duration: 0.8 }, 0);
      }

      // entrance — no loader, the page arrives already moving
      gsap.set('.hero__letter-in', { yPercent: 105 });
      const intro = gsap.timeline({ delay: 0.1, onComplete: () => ScrollTrigger.refresh() });
      intro
        .fromTo('.hero__plate-clip', { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.3, ease: EASE.inOut }, 0)
        .fromTo('.hero__plate-clip img', { scale: 1.3 }, { scale: 1, duration: 1.8, ease: EASE.out }, 0)
        .to('.hero__letter-in', { yPercent: 0, duration: 1.2, stagger: 0.06, ease: EASE.out }, 0.3)
        .fromTo('.hero__second-clip', { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.1, ease: EASE.inOut }, 0.45)
        .fromTo('.hero__in', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.9, stagger: 0.05 }, 0.55);
      if (reducedMotion()) intro.progress(1);
    }, el);
    return () => ctx.revert();
  }, []);

  // cursor parallax — layers drift at different depths
  useEffect(() => {
    if (!finePointer() || reducedMotion()) return;
    const el = root.current!;
    const layers = [
      { node: el.querySelector('.hero__word'), depth: -14 },
      { node: el.querySelector('.hero__second-clip'), depth: 22 },
      { node: el.querySelector('.hero__plate-clip img'), depth: -8 },
    ].map(({ node, depth }) => ({
      depth,
      x: gsap.quickTo(node, 'x', { duration: 1.4, ease: 'power3' }),
      y: gsap.quickTo(node, 'y', { duration: 1.4, ease: 'power3' }),
    }));
    const move = (e: PointerEvent) => {
      const nx = e.clientX / window.innerWidth - 0.5;
      const ny = e.clientY / window.innerHeight - 0.5;
      layers.forEach((l) => {
        l.x(nx * l.depth);
        l.y(ny * l.depth);
      });
    };
    el.addEventListener('pointermove', move);
    return () => el.removeEventListener('pointermove', move);
  }, []);

  return (
    <section id="top" ref={root} className="hero" aria-label="ASHE — Drop 04">
      <div className="hero__frame" aria-hidden="true" />

      <div className="hero__plate">
        <div className="hero__plate-clip">
          <div className="hero__plate-img">
            <Img name="hero-main" pos="50% 22%" eager sizes="100vw" alt="Model in the Atelier Blazer in sand wool" fetchPriority="high" />
          </div>
        </div>
        <div className="hero__veil" />
        <p className="hero__teaser t-display" aria-hidden="true">
          <span className="mask">
            <span className="hero__teaser-line">Seven looks.</span>
          </span>
          <span className="mask">
            <span className="hero__teaser-line">
              One <em>body.</em>
            </span>
          </span>
          <span className="mask">
            <span className="hero__teaser-line hero__teaser-small">Keep scrolling ↓</span>
          </span>
        </p>
      </div>

      <div className="hero__second" aria-hidden="true">
        <div className="hero__second-clip">
          <Img name="hero-bw" pos="50% 30%" eager sizes="(max-width: 800px) 30vw, 16vw" />
        </div>
      </div>

      <h1 className="hero__word t-display" aria-label="ASHE">
        {'ASHE'.split('').map((c, i) => (
          <span className="hero__letter" key={i} aria-hidden="true">
            <span className="hero__letter-in">{c}</span>
          </span>
        ))}
      </h1>

      <div className="hero__copy hero__fade">
        <span className="sticker hero__in">Drop 04 — out now</span>
        <p className="hero__headline hero__in">
          Made in Cairo.
          <br />
          <em>Worn loud.</em>
        </p>
        <p className="hero__sub hero__in">Heavy tees, sharp tailoring and bags that go everywhere — made in small runs in Downtown Cairo.</p>
        <div className="hero__ctas hero__in">
          <button className="btn" onClick={() => goShop(setFilter, 'new')}>
            <span>Shop new in</span>
            <ArrowIcon />
          </button>
          <button className="btn btn--ghost" onClick={() => scrollToId('looks')}>
            <span>See the looks</span>
          </button>
        </div>
      </div>

      <button
        className="hero__tag hero__fade"
        data-cursor="View"
        onClick={(e) => openProduct(blazer.id, { rect: e.currentTarget.getBoundingClientRect(), src: 'hero-main', pos: '50% 22%' })}
      >
        <span className="t-meta hero__in">Wearing</span>
        <span className="hero__tag-name hero__in">{blazer.name}</span>
        <span className="t-meta hero__in">{money(blazer.price)} →</span>
      </button>
    </section>
  );
}
