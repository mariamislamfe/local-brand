import { useEffect } from 'react';
import { ShopProvider } from './store/shop';
import { ScrollTrigger, startSmoothScroll } from './lib/motion';
import { Nav } from './components/Nav';
import { Menu } from './components/Menu';
import { Search } from './components/Search';
import { Cursor } from './components/Cursor';
import { Toast } from './components/Toast';
import { Hero } from './sections/Hero';
import { Looks } from './sections/Looks';
import { Shop } from './sections/Shop';
import { Categories } from './sections/Categories';
import { Collections } from './sections/Collections';
import { About } from './sections/About';
import { Footer } from './sections/Footer';
import { ProductView } from './overlays/ProductView';
import { CartDrawer } from './overlays/CartDrawer';
import { Checkout } from './overlays/Checkout';

export default function App() {
  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
    startSmoothScroll();
    // fonts change text metrics — re-measure pinned scenes once, early (ScrollTrigger already refreshes on load)
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
  }, []);

  return (
    <ShopProvider>
      <a className="skip sr-only" href="#shop">
        Skip to shop
      </a>
      <Nav />
      <Menu />
      <Search />
      <main>
        <Hero />
        <Looks />
        <Categories />
        <Shop />
        <Collections />
        <About />
      </main>
      <Footer />
      <ProductView />
      <CartDrawer />
      <Checkout />
      <Toast />
      <Cursor />
      <div className="grain" aria-hidden="true" />
    </ShopProvider>
  );
}
