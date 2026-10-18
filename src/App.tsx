import { useEffect } from 'react';
import { HashRouter, Route, Routes, useLocation } from 'react-router-dom';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { VenueProvider } from './lib/venue';
import { HirePage } from './pages/HirePage';
import { Home } from './pages/Home';
import { MenusPage } from './pages/MenusPage';
import { NotFound } from './pages/NotFound';
import { VenuePage } from './pages/VenuePage';
import { VenuesPage } from './pages/VenuesPage';

const DEFAULT_TITLE = 'The Joint | Brunch, BBQ & Bar in London';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    if (pathname === '/') document.title = DEFAULT_TITLE;
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <HashRouter>
      <VenueProvider>
        <ScrollToTop />
        <a className="skip" href="#main" onClick={(e) => { e.preventDefault(); document.getElementById('main')?.focus(); }}>
          Skip to content
        </a>
        <Header />
        <main id="main" tabIndex={-1} style={{ outline: 'none' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/venues" element={<VenuesPage />} />
            <Route path="/menus" element={<MenusPage />} />
            <Route path="/menus/:venueId" element={<MenusPage />} />
            <Route path="/hire" element={<HirePage />} />
            <Route path="/hire/:type" element={<HirePage />} />
            <Route path="/:venueId" element={<VenuePage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </VenueProvider>
    </HashRouter>
  );
}
