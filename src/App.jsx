import React, { useEffect, useRef } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Toast from './components/Toast';
import CarModal from './components/CarModal';
import SeoHead from './components/SeoHead';
import HomePage from './pages/HomePage';
import FleetPage from './pages/FleetPage';
import CarDetailsPage from './pages/CarDetailsPage';
import BookingPage from './pages/BookingPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import FaqsPage from './pages/FaqsPage';
import AdminDashboard from './pages/AdminDashboard';
import { initGA, trackPageView } from './utils/analytics';
import './styles/theme.css';

function MainRouter() {
  const { currentPage, fleet, selectedCarId } = useApp();
  const lastTrackedRef = useRef('');

  // Resolve the currently-viewed car (for SEO meta on car detail pages)
  const selectedCar = currentPage === 'car-details'
    ? (fleet.find(c => c.id === selectedCarId) || null)
    : null;

  // SPA Route Page View Tracking (GA4)
  useEffect(() => {
    const routePath = (() => {
      switch (currentPage) {
        case 'car-details': return `/cars/${selectedCarId || 'view'}`;
        case 'fleet':       return '/fleet';
        case 'booking':     return `/booking${selectedCarId ? `?car=${selectedCarId}` : ''}`;
        case 'contact':     return '/contact';
        case 'about':       return '/about';
        case 'faqs':        return '/faqs';
        case 'admin':       return '/admin';
        case 'home':
        default:            return '/';
      }
    })();

    const pageTitle = selectedCar 
      ? `${selectedCar.name} | OTTORENTAL Kenya`
      : (document.title || `OTTORENTAL - ${currentPage}`);

    const trackingKey = `${routePath}::${pageTitle}`;
    if (lastTrackedRef.current !== trackingKey) {
      lastTrackedRef.current = trackingKey;
      trackPageView(routePath, pageTitle);
    }
  }, [currentPage, selectedCarId, selectedCar]);

  // Map internal page names to SEO page keys
  const seoPage = (() => {
    switch (currentPage) {
      case 'car-details': return 'car';
      case 'fleet':       return 'fleet';
      case 'booking':     return 'booking';
      case 'contact':     return 'contact';
      case 'about':       return 'contact'; // reuse contact meta (similar intent)
      case 'faqs':        return 'contact';
      case 'admin':       return null;      // don't index admin
      default:            return 'home';
    }
  })();

  const renderPage = () => {
    switch (currentPage) {
      case 'fleet':       return <FleetPage />;
      case 'car-details': return <CarDetailsPage />;
      case 'booking':     return <BookingPage />;
      case 'about':       return <AboutPage />;
      case 'contact':     return <ContactPage />;
      case 'faqs':        return <FaqsPage />;
      case 'admin':       return <AdminDashboard />;
      case 'home':
      default:            return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-black text-zinc-100 font-body selection:bg-amber-400 selection:text-black">
      {/* Dynamic SEO meta + structured data — updates on every page change */}
      {seoPage && <SeoHead page={seoPage} car={selectedCar} />}

      <Navbar />
      <main className="flex-1">
        {renderPage()}
      </main>
      <Footer />
      <CarModal />
      <Toast />
    </div>
  );
}

export default function App() {
  useEffect(() => {
    initGA();
  }, []);

  return (
    <AppProvider>
      <MainRouter />
    </AppProvider>
  );
}
