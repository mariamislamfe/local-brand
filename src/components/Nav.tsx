import { useEffect, useRef, useState } from 'react';
import { useShop } from '../store/shop';
import { ScrollTrigger, scrollToId } from '../lib/motion';
import { goShop } from '../lib/nav';
import { BagIcon, SearchIcon } from './Icons';
import './Nav.css';

const TICKER = ['Drop 04 is live', 'Free delivery across Egypt over EGP 3,000', 'Cash on delivery available', 'Made in Downtown Cairo', '30-day free returns'];

export function Nav() {
  const { count, setCartOpen, menuOpen, setMenuOpen, setFilter, setSearchOpen } = useShop();
  const [scrolled, setScrolled] = useState(false);
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const st = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => {
        setScrolled(self.scroll() > 40);
        if (bar.current) bar.current.style.transform = `scaleX(${self.progress})`;
      },
    });
    return () => st.kill();
  }, []);

  const link = (label: string, onClick: () => void) => (
    <a
      href="#shop"
      className="nav__link u-link"
      onClick={(e) => {
        e.preventDefault();
        setMenuOpen(false);
        onClick();
      }}
    >
      {label}
    </a>
  );

  return (
    <header className={`nav${scrolled ? ' is-scrolled' : ''}${menuOpen ? ' is-menu' : ''}`}>
      <div className="nav__ticker ticker t-meta" aria-label="Store announcements">
        <div className="ticker__track">
          {[...TICKER, ...TICKER].map((t, i) => (
            <span key={i} aria-hidden={i >= TICKER.length}>
              {t} <i>✦</i>
            </span>
          ))}
        </div>
      </div>

      <div className="nav__bar">
        <div className="nav__left">
          <button className="nav__burger" aria-expanded={menuOpen} aria-controls="site-menu" aria-label={menuOpen ? 'Close menu' : 'Open menu'} onClick={() => setMenuOpen(!menuOpen)}>
            <i />
            <i />
          </button>
          <a
            href="#top"
            className="nav__mark t-display"
            aria-label="ASHE — home"
            onClick={(e) => {
              e.preventDefault();
              setMenuOpen(false);
              scrollToId('top');
            }}
          >
            ASHE
          </a>
          <nav className="nav__links t-label" aria-label="Primary">
            {link('Shop', () => goShop(setFilter, 'all'))}
            {link('New', () => goShop(setFilter, 'new'))}
            {link('Looks', () => scrollToId('looks'))}
            {link('Collections', () => scrollToId('collections'))}
            {link('About', () => scrollToId('about'))}
          </nav>
        </div>

        <div className="nav__right t-label">
          <button className="nav__shop-m" onClick={() => goShop(setFilter, 'all')}>
            Shop
          </button>
          <button className="nav__icon-btn" onClick={() => setSearchOpen(true)} aria-label="Search products">
            <SearchIcon />
            <span className="nav__icon-label">Search</span>
          </button>
          <button className="nav__icon-btn nav__bag" onClick={() => setCartOpen(true)} aria-label={`Open bag, ${count} items`}>
            <span className="nav__bag-icon">
              <BagIcon />
              <span className="nav__count" aria-hidden="true">
                <span key={count}>{count}</span>
              </span>
            </span>
            <span className="nav__icon-label">Bag</span>
          </button>
        </div>
        <div className="nav__progress" ref={bar} />
      </div>
    </header>
  );
}
