import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CURRENCY_RATES } from '../data/initialData';
import { 
  Menu, 
  X, 
  KeyRound, 
  ChevronDown, 
  Globe, 
  Car, 
  MapPin, 
  Briefcase, 
  HelpCircle, 
  Phone,
  ShieldCheck,
  Building2
} from 'lucide-react';
import AdminLoginModal from './AdminLoginModal';

export default function Navbar() {
  const { 
    currentPage, 
    navigateTo, 
    siteContent, 
    currency, 
    setCurrency, 
    isAdminAuthenticated 
  } = useApp();

  const [menuOpen, setMenuOpen] = useState(false);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [adminModalOpen, setAdminModalOpen] = useState(false);

  const handleNavClick = (pageId) => {
    navigateTo(pageId);
    setMenuOpen(false);
  };

  // Determine if header is over light page or hero
  const isHomePage = currentPage === 'home';

  return (
    <>
      <header className={`absolute top-0 left-0 right-0 z-30 w-full px-6 sm:px-12 py-6 flex items-center justify-between transition-all ${
        isHomePage ? 'text-white' : 'text-slate-900 bg-white/90 backdrop-blur-md border-b border-slate-200'
      }`}>
        
        {/* Brand Logo - Official bullseye mark + bold typography */}
        <div 
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-2 sm:gap-2.5 cursor-pointer group select-none"
        >
          <div className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center transition-transform group-hover:scale-110">
            <svg viewBox="0 0 100 100" className="w-full h-full fill-none">
              <circle cx="50" cy="50" r="36" stroke="currentColor" strokeWidth="15" />
              <circle cx="50" cy="50" r="14" fill="currentColor" />
            </svg>
          </div>
          <span className={`font-extrabold text-2xl sm:text-3xl tracking-tight font-sans ${
            isHomePage ? 'text-white' : 'text-slate-900'
          }`}>
            Elite<span className="text-blue-600">Ride</span>
          </span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 mt-2"></span>
        </div>

        {/* Right Navigation Actions */}
        <div className="flex items-center gap-3 sm:gap-4">
          
          {/* Become an Operator / List Fleet */}
          <button
            onClick={() => handleNavClick('contact')}
            className={`hidden md:inline-flex items-center text-sm font-semibold transition-colors cursor-pointer px-3 py-1.5 ${
              isHomePage ? 'text-white/90 hover:text-white' : 'text-slate-700 hover:text-blue-600'
            }`}
          >
            Become an Operator
          </button>

          {/* Currency Switcher Pill (e.g. KSh, USD, EUR) */}
          <div className="relative">
            <button
              onClick={() => setCurrencyOpen(!currencyOpen)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1 border ${
                isHomePage
                  ? 'bg-white/20 hover:bg-white/30 backdrop-blur-md text-white border-white/20'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
              }`}
            >
              <span>{currency === 'KSH' ? 'KSh' : currency}</span>
              <ChevronDown className="w-3 h-3 opacity-80" />
            </button>

            {currencyOpen && (
              <div className="absolute right-0 mt-2 w-36 rounded-2xl bg-white border border-slate-200 shadow-2xl py-1.5 z-50 text-xs text-slate-800">
                {Object.keys(CURRENCY_RATES).map((currKey) => (
                  <button
                    key={currKey}
                    onClick={() => {
                      setCurrency(currKey);
                      setCurrencyOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 hover:bg-slate-50 transition-colors flex items-center justify-between ${
                      currency === currKey ? 'text-blue-600 font-bold bg-blue-50' : 'text-slate-700'
                    }`}
                  >
                    <span>{CURRENCY_RATES[currKey].label}</span>
                    <span className="font-mono opacity-60">{CURRENCY_RATES[currKey].symbol}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Menu Drawer Button (Circular Pill) */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all shadow-sm cursor-pointer ${
              isHomePage
                ? 'bg-slate-900/80 hover:bg-slate-900 text-white border-white/15'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200'
            }`}
            aria-label="Toggle navigation menu"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

        </div>

      </header>

      {/* Slide-out Menu Drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm bg-white text-slate-900 p-8 flex flex-col justify-between h-full border-l border-slate-200 shadow-2xl overflow-y-auto">
            
            <div className="space-y-8">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 flex items-center justify-center text-slate-900">
                    <svg viewBox="0 0 100 100" className="w-full h-full fill-none">
                      <circle cx="50" cy="50" r="36" stroke="currentColor" strokeWidth="15" />
                      <circle cx="50" cy="50" r="14" fill="currentColor" />
                    </svg>
                  </div>
                  <span className="font-extrabold text-2xl tracking-tight text-slate-900">
                    Elite<span className="text-blue-600">Ride</span>
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1"></span>
                </div>
                <button
                  onClick={() => setMenuOpen(false)}
                  className="p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-900"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="space-y-2">
                {[
                  { id: 'home', label: 'Home', icon: Globe },
                  { id: 'fleet', label: 'Every Kind of Vehicle', icon: Car },
                  { id: 'booking', label: 'Book a Rental', icon: ShieldCheck },
                  { id: 'about', label: 'About Us', icon: Building2 },
                  { id: 'contact', label: 'Concierge & Operator Portal', icon: Phone },
                  { id: 'faqs', label: 'Rental FAQs & Terms', icon: HelpCircle }
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = currentPage === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`w-full text-left p-3 rounded-xl text-sm font-semibold flex items-center gap-3 transition-colors ${
                        isActive ? 'bg-blue-600 text-white font-bold' : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                      }`}
                    >
                      <Icon className="w-4 h-4 opacity-75" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Bottom Admin & Contact inside Drawer */}
            <div className="pt-6 border-t border-slate-100 space-y-3 text-xs text-slate-500">
              <div className="flex items-center justify-between">
                <span>Direct Hotline:</span>
                <span className="text-slate-900 font-bold">{siteContent.brand.phone}</span>
              </div>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  if (isAdminAuthenticated) {
                    navigateTo('admin');
                  } else {
                    setAdminModalOpen(true);
                  }
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 flex items-center justify-center gap-2 border border-slate-200 font-semibold"
              >
                <KeyRound className="w-3.5 h-3.5 text-blue-600" />
                <span>Admin CMS Dashboard</span>
                {isAdminAuthenticated && <span className="w-2 h-2 rounded-full bg-emerald-500"></span>}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={adminModalOpen}
        onClose={() => setAdminModalOpen(false)}
      />
    </>
  );
}
