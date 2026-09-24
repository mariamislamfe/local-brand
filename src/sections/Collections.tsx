import { useState, type CSSProperties } from 'react';
import { collections, products } from '../data/catalog';
import { useShop } from '../store/shop';
import { goShop } from '../lib/nav';
import { Img } from '../components/Img';
import { ArrowIcon } from '../components/Icons';
import './Collections.css';

/**
 * The campaign moment: three collections as panels that open like a contact sheet.
 * Hover (or tap) one and it takes over the frame; its button filters the shop.
 */
export function Collections() {
  const { setFilter } = useShop();
  const [open, setOpen] = useState(0);

  return (
    <section id="collections" className="coll" aria-labelledby="coll-title">
      <div className="coll__head">
        <p className="t-meta">SS27 · Three collections</p>
        <h2 id="coll-title" className="section-title">
          The <em>lookbook</em>
        </h2>
      </div>
      <div className="coll__panels">
        {collections.map((c, i) => {
          const n = products.filter((p) => p.collection === c.id).length;
          return (
            <article
              key={c.id}
              className={`coll__panel${open === i ? ' is-open' : ''}`}
              style={{ '--bg': c.bg, '--fg': c.fg } as CSSProperties}
              onMouseEnter={() => setOpen(i)}
              aria-label={`${c.title} collection`}
            >
              <button className="coll__tab" onClick={() => setOpen(i)} aria-expanded={open === i}>
                <span className="t-meta">{c.numeral}</span>
                <span className="coll__tab-title t-display">{c.title}</span>
              </button>
              <div className="coll__body">
                <div className="coll__imgs">
                  {c.images.map((img, k) => (
                    <div key={img} className={`coll__img coll__img--${k + 1}`}>
                      <Img name={img} sizes="(max-width: 900px) 70vw, 30vw" alt={k === 0 ? `${c.title} campaign photograph` : ''} />
                    </div>
                  ))}
                </div>
                <div className="coll__text">
                  <p className="t-meta">
                    Collection {c.numeral} — {n} pieces
                  </p>
                  <h3 className="coll__title t-display">{c.title}</h3>
                  <p className="coll__tag t-serif">{c.tagline}</p>
                  <p className="coll__caption">{c.caption}</p>
                  <button className="btn coll__cta" onClick={() => goShop(setFilter, c.id)}>
                    <span>Shop {c.title}</span>
                    <ArrowIcon />
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
