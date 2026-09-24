import { matchesFilter, products, type Filter } from '../data/catalog';
import { useShop } from '../store/shop';
import { goShop } from '../lib/nav';
import { Img } from '../components/Img';
import { ArrowIcon } from '../components/Icons';
import './Categories.css';

const CATS: { id: Filter; label: string; image: string; pos?: string }[] = [
  { id: 'Tops', label: 'Tops', image: 'p-tee-2', pos: '50% 25%' },
  { id: 'Bottoms', label: 'Bottoms', image: 'look-05', pos: '50% 78%' },
  { id: 'Outerwear', label: 'Outerwear', image: 'hero-full', pos: '50% 25%' },
  { id: 'Sets', label: 'Sets', image: 'p-set-bomber', pos: '50% 35%' },
  { id: 'Dresses', label: 'Dresses', image: 'p-blazer-dress', pos: '50% 30%' },
  { id: 'Accessories', label: 'Bags', image: 'p-bag-model', pos: '50% 60%' },
];

/** Deliberately simple: six doors into the shop. */
export function Categories() {
  const { setFilter } = useShop();
  return (
    <section id="categories" className="cats" aria-labelledby="cats-title">
      <div className="section-head">
        <h2 id="cats-title" className="section-title">
          Shop by <em>category</em>
        </h2>
      </div>
      <ul className="cats__row">
        {CATS.map((c) => (
          <li key={c.label}>
            <button className="cats__tile" onClick={() => goShop(setFilter, c.id)} data-cursor="Shop">
              <span className="cats__img">
                <Img name={c.image} pos={c.pos} sizes="(max-width: 900px) 45vw, 17vw" alt="" />
              </span>
              <span className="cats__label">
                <span className="cats__name">{c.label}</span>
                <span className="t-meta">{products.filter((p) => matchesFilter(p, c.id)).length} pieces</span>
              </span>
              <span className="cats__arrow" aria-hidden="true">
                <ArrowIcon />
              </span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
