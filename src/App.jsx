import React from 'react';
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
import './styles/theme.css';

function MainRouter() {
  const { currentPage, fleet, selectedCarId } = useApp();

  // Resolve the currently-viewed car (for SEO meta on car detail pages)
  const selectedCar = currentPage === 'car-details'
    ? (fleet.find(c => c.id === selectedCarId) || null)
    : null;

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
  return (
    <AppProvider>
      <MainRouter />
    </AppProvider>
  );
}
