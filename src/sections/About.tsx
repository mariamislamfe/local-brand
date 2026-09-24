import { useLayoutEffect, useRef } from 'react';
import { gsap } from '../lib/motion';
import { Img } from '../components/Img';
import './About.css';

const GRID = [
  { img: 'look-05', pos: '50% 30%', likes: '4.1k', handle: '@malak.fx' },
  { img: 'iron-3', likes: '2.8k', handle: '@ashe.cairo' },
  { img: 'p-set-olive', pos: '50% 40%', likes: '3.3k', handle: '@youssef.jpg' },
  { img: 'hero-bw', pos: '50% 30%', likes: '6.0k', handle: '@ashe.cairo' },
  { img: 'salt-3', likes: '1.9k', handle: '@nadine.alx' },
  { img: 'p-bag-model', pos: '50% 50%', likes: '2.2k', handle: '@farida.w' },
];

const STATS = [
  ['11', 'people in one Downtown workshop'],
  ['0', 'middlemen between us and you'],
  ['320', 'gsm — the weight of our tees'],
  ['30', 'days to change your mind'],
];

/** Short story, real numbers, and the community wearing it. */
export function About() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.about__marquee-track',
        { xPercent: 0 },
        { xPercent: -35, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true } },
      );
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="about" ref={root} className="about" aria-labelledby="about-title">
      <div className="about__marquee" aria-hidden="true">
        <p className="about__marquee-track t-display">
          Made in Cairo <em>—</em> worn everywhere <em>—</em> made in Cairo <em>—</em> worn everywhere <em>—</em>
        </p>
      </div>

      <div className="about__grid">
        <div className="about__story">
          <p className="t-meta">About ASHE</p>
          <h2 id="about-title" className="about__title">
            We started with <em>one tee</em> and a sewing room above Champollion Street.
          </h2>
          <p className="about__copy">
            Seven years later it’s still the same room — just louder. Everything you see here is cut, sewn and packed in Downtown Cairo, in small runs,
            so nothing sits in a warehouse and nothing gets wasted.
          </p>
          <dl className="about__stats">
            {STATS.map(([n, label]) => (
              <div key={label}>
                <dt className="t-display">{n}</dt>
                <dd className="t-meta">{label}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="about__social">
          <div className="about__social-head">
            <p className="about__handle t-display">@ashe.cairo</p>
            <a className="btn" href="#about" onClick={(e) => e.preventDefault()}>
              <span>Follow · 48k</span>
              <span>→</span>
            </a>
          </div>
          <ul className="about__ig">
            {GRID.map((g, i) => (
              <li key={i} className="about__post">
                <Img name={g.img} pos={g.pos} sizes="(max-width: 900px) 33vw, 15vw" alt={`Community photo by ${g.handle}`} />
                <span className="about__post-meta t-meta">
                  <span>{g.handle}</span>
                  <span>♥ {g.likes}</span>
                </span>
              </li>
            ))}
          </ul>
          <p className="t-meta about__tag">Tag #ASHEcairo to be featured</p>
        </div>
      </div>
    </section>
  );
}
