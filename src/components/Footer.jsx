import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  KeyRound, 
  Phone, 
  Mail, 
  MapPin, 
  MessageCircle, 
  ShieldCheck, 
  Check 
} from 'lucide-react';
import AdminLoginModal from './AdminLoginModal';

export default function Footer() {
  const { siteContent, navigateTo, isAdminAuthenticated } = useApp();
  const [adminModalOpen, setAdminModalOpen] = useState(false);

  return (
    <>
      <footer className="bg-white text-slate-600 text-xs py-16 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            
            {/* Brand Col */}
            <div className="lg:col-span-2 space-y-4">
              <div 
                onClick={() => navigateTo('home')}
                className="flex items-center gap-1.5 cursor-pointer select-none"
              >
                <span className="font-extrabold text-2xl sm:text-3xl tracking-tight text-slate-900 font-sans">
                  Elite<span className="text-blue-600">Ride</span>
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 mt-2"></span>
              </div>
              <p className="text-slate-500 text-xs leading-relaxed max-w-sm">
                Self-drive, chauffeured, and safari vehicle rentals across Kenya. Verified operators, transparent prices, pay with M-Pesa or card.
              </p>
              <div className="pt-2 flex items-center gap-3">
                <a
                  href={`https://wa.me/${siteContent.brand.whatsapp}?text=Hello%20EliteRide`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800 font-bold"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>WhatsApp Support</span>
                </a>
              </div>
            </div>

            {/* Vehicles Links */}
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                Vehicles
              </h4>
              <ul className="space-y-2">
                <li><button onClick={() => navigateTo('fleet')} className="hover:text-blue-600 transition-colors">Small & Medium Cars</button></li>
                <li><button onClick={() => navigateTo('fleet')} className="hover:text-blue-600 transition-colors">Mid-Size & Luxury SUVs</button></li>
                <li><button onClick={() => navigateTo('fleet')} className="hover:text-blue-600 transition-colors">Masai Mara 4x4 Cruisers</button></li>
                <li><button onClick={() => navigateTo('fleet')} className="hover:text-blue-600 transition-colors">Executive Minivans & Buses</button></li>
                <li><button onClick={() => navigateTo('fleet')} className="hover:text-blue-600 transition-colors">Supercars & Limousines</button></li>
              </ul>
            </div>

            {/* Cities Links */}
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                Top Destinations
              </h4>
              <ul className="space-y-2">
                <li><button onClick={() => navigateTo('fleet')} className="hover:text-blue-600 transition-colors">Nairobi & JKIA Airport</button></li>
                <li><button onClick={() => navigateTo('fleet')} className="hover:text-blue-600 transition-colors">Mombasa & Diani Beach</button></li>
                <li><button onClick={() => navigateTo('fleet')} className="hover:text-blue-600 transition-colors">Kisumu Lakeside</button></li>
                <li><button onClick={() => navigateTo('fleet')} className="hover:text-blue-600 transition-colors">Masai Mara & Naivasha</button></li>
                <li><button onClick={() => navigateTo('fleet')} className="hover:text-blue-600 transition-colors">Malindi Coastal Escape</button></li>
              </ul>
            </div>

            {/* Company & Operators */}
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                Operators & Business
              </h4>
              <ul className="space-y-2">
                <li><button onClick={() => navigateTo('contact')} className="hover:text-blue-600 transition-colors">Become an Operator</button></li>
                <li><button onClick={() => navigateTo('about')} className="hover:text-blue-600 transition-colors">EliteRide for Business</button></li>
                <li><button onClick={() => navigateTo('about')} className="hover:text-blue-600 transition-colors">Earn with EliteRide</button></li>
                <li><button onClick={() => navigateTo('faqs')} className="hover:text-blue-600 transition-colors">Rental FAQs & Terms</button></li>
                <li><button onClick={() => navigateTo('contact')} className="hover:text-blue-600 transition-colors">Concierge Desk</button></li>
              </ul>
            </div>

          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400 text-xs">
            <p>
              © {new Date().getFullYear()} {siteContent.brand.name || 'EliteRide'}. All rights reserved. Registered rental marketplace & operator logistics.
            </p>

            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  if (isAdminAuthenticated) {
                    navigateTo('admin');
                  } else {
                    setAdminModalOpen(true);
                  }
                }}
                className="flex items-center gap-1.5 text-slate-500 hover:text-blue-600 transition-colors cursor-pointer"
              >
                <KeyRound className="w-3.5 h-3.5 text-blue-600" />
                <span>Admin CMS</span>
                {isAdminAuthenticated && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>}
              </button>
            </div>
          </div>

        </div>
      </footer>

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={adminModalOpen}
        onClose={() => setAdminModalOpen(false)}
      />
    </>
  );
}
