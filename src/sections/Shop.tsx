import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { FILTERS, collections, matchesFilter, products, type Filter, type Product } from '../data/catalog';
import { useShop } from '../store/shop';
import { ProductCard } from '../components/ProductCard';
import { ArrowIcon } from '../components/Icons';
import { ScrollTrigger, scrollToId } from '../lib/motion';
import './Shop.css';

type Sort = 'featured' | 'new' | 'low' | 'high';
const SORTS: { id: Sort; label: string }[] = [
  { id: 'featured', label: 'Featured' },
  { id: 'new', label: 'Newest' },
  { id: 'low', label: 'Price: low to high' },
  { id: 'high', label: 'Price: high to low' },
];

const sorters: Record<Sort, (a: Product, b: Product) => number> = {
  featured: () => 0,
  new: (a, b) => Number(!!b.isNew) - Number(!!a.isNew),
  low: (a, b) => a.price - b.price,
  high: (a, b) => b.price - a.price,
};

const labelFor = (f: Filter) => FILTERS.find((x) => x.id === f)?.label ?? collections.find((c) => c.id === f)?.title ?? 'All';

/** The main store: category chips, sort, and a uniform card grid. */
export function Shop() {
  const { filter, setFilter } = useShop();
  const [sort, setSort] = useState<Sort>('featured');
  const [seen, setSeen] = useState(false);
  const section = useRef<HTMLElement>(null);

  const list = useMemo(() => products.filter((p) => matchesFilter(p, filter)).sort(sorters[sort]), [filter, sort]);

  useEffect(() => {
    // observe the section, not the grid — the grid is re-keyed (remounted) on every filter change
    const el = section.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setSeen(true), { rootMargin: '0px 0px -25% 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // grid height changes with the filter — pinned scenes below need re-measuring
  useEffect(() => {
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 60);
    return () => window.clearTimeout(id);
  }, [filter, sort]);

  // one card size throughout — the grid is for comparing, the campaign lives in the lookbook
  const items = list.map((p, i) => <ProductCard key={p.id} product={p} style={{ '--d': `${Math.min(i, 10) * 0.05}s` } as CSSProperties} />);

  return (
    <section id="shop" ref={section} className="shop" aria-labelledby="shop-title">
      <div className="shop__head">
        <div className="shop__title-wrap">
          <p className="t-meta">Drop 04 — {products.length} pieces</p>
          <h2 id="shop-title" className="section-title">
            Shop <em>{filter === 'all' ? 'the drop' : labelFor(filter).toLowerCase()}</em>
          </h2>
        </div>
        <span className="sticker shop__sticker">Cash on delivery ✦ Free returns</span>
      </div>

      <div className="shop__bar">
        <div className="shop__chips" role="toolbar" aria-label="Filter by category">
          {FILTERS.map((f) => {
            const n = products.filter((p) => matchesFilter(p, f.id)).length;
            return (
              <button key={f.id} className="chip" aria-pressed={filter === f.id} onClick={() => setFilter(f.id)} disabled={!n}>
                {f.label} <sup>{n}</sup>
              </button>
            );
          })}
          {collections.some((c) => c.id === filter) && (
            <button className="chip is-active" onClick={() => setFilter('all')} aria-label={`Clear ${labelFor(filter)} filter`}>
              {labelFor(filter)} ×
            </button>
          )}
        </div>
        <label className="shop__sort t-meta">
          Sort
          <select value={sort} onChange={(e) => setSort(e.target.value as Sort)}>
            {SORTS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div key={`${filter}-${sort}`} className={`shop__grid${seen ? ' is-in' : ''}`}>
        {items}
      </div>

      {!list.length && <p className="shop__empty t-meta">Nothing here right now — new pieces land every month.</p>}

      <div className="shop__foot">
        <p className="t-meta">
          Showing {list.length} of {products.length}
        </p>
        {filter !== 'all' ? (
          <button className="btn btn--ghost" onClick={() => setFilter('all')}>
            <span>View everything</span>
            <ArrowIcon />
          </button>
        ) : (
          <button className="btn btn--ghost" onClick={() => scrollToId('collections')}>
            <span>See the lookbook</span>
            <ArrowIcon />
          </button>
        )}
      </div>
    </section>
  );
}

