import { useEffect, useRef, useState } from 'react';
import { finePointer, gsap } from '../lib/motion';
import './Cursor.css';

/**
 * Desktop-only cursor. Any element with data-cursor="Label" turns the dot into
 * a disc that names the action ("View", "Drag", "Close"…).
 */
export function Cursor() {
  const el = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState('');
  const [enabled] = useState(finePointer);

  useEffect(() => {
    if (!enabled || !el.current) return;
    const node = el.current;
    const x = gsap.quickTo(node, 'x', { duration: 0.45, ease: 'power3' });
    const y = gsap.quickTo(node, 'y', { duration: 0.45, ease: 'power3' });
    let current = '';
    const move = (e: PointerEvent) => {
      x(e.clientX);
      y(e.clientY);
      node.classList.add('is-visible');
      const target = (e.target as Element | null)?.closest?.('[data-cursor]');
      const next = target?.getAttribute('data-cursor') ?? '';
      const interactive = !next && (e.target as Element | null)?.closest?.('a, button, [role="button"], input, select, label');
      node.classList.toggle('is-link', !!interactive);
      if (next !== current) {
        current = next;
        setLabel(next);
      }
    };
    const leave = () => node.classList.remove('is-visible');
    const down = () => node.classList.add('is-down');
    const up = () => node.classList.remove('is-down');
    window.addEventListener('pointermove', move, { passive: true });
    document.documentElement.addEventListener('pointerleave', leave);
    window.addEventListener('pointerdown', down);
    window.addEventListener('pointerup', up);
    document.documentElement.classList.add('has-cursor');
    return () => {
      window.removeEventListener('pointermove', move);
      document.documentElement.removeEventListener('pointerleave', leave);
      window.removeEventListener('pointerdown', down);
      window.removeEventListener('pointerup', up);
      document.documentElement.classList.remove('has-cursor');
    };
  }, [enabled]);

  if (!enabled) return null;
  return (
    <div ref={el} className={`cursor${label ? ' is-labelled' : ''}`} aria-hidden="true">
      <div className="cursor__disc">
        <span className="cursor__label">{label}</span>
      </div>
    </div>
  );
}
