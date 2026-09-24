import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });
// On touch devices the collapsing address bar resizes the viewport mid-scroll, which makes
// pinned scenes jump up and down. normalizeScroll takes over touch scrolling to stop that.
if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) ScrollTrigger.normalizeScroll(true);

/** Shared easing vocabulary — one motion language for the whole site. */
export const EASE = {
  out: 'expo.out',
  inOut: 'expo.inOut',
  soft: 'power3.out',
  shutter: 'power4.inOut',
};
gsap.defaults({ ease: EASE.out, duration: 1.1 });

export const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
export const finePointer = () => window.matchMedia('(pointer: fine)').matches;

let lenis: Lenis | null = null;

export function startSmoothScroll() {
  // Smoothing follows the user's own scroll input, so it stays on even with reduced motion —
  // turning it off made the pinned scenes step and stutter.
  if (lenis) return lenis;
  lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 0.9 });
  lenis.on('scroll', ScrollTrigger.update);
  // keep Lenis' idea of the page height in step with pin spacers after every re-measure
  ScrollTrigger.addEventListener('refresh', () => lenis?.resize());
  gsap.ticker.add((t) => lenis?.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  return lenis;
}

export const getLenis = () => lenis;

/** Freeze page scroll while any overlay (keyed) is open. */
const locks = new Set<string>();
export function lockScroll(key: string, locked: boolean) {
  if (locked) locks.add(key);
  else locks.delete(key);
  const on = locks.size > 0;
  document.documentElement.classList.toggle('is-locked', on);
  if (!lenis) return;
  if (on) lenis.stop();
  else lenis.start();
}

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { duration: 1.6, easing: (t) => 1 - Math.pow(1 - t, 4) });
  else el.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth' });
}

export { gsap, ScrollTrigger };

if (import.meta.env.DEV) (window as unknown as { __ST: typeof ScrollTrigger }).__ST = ScrollTrigger;
