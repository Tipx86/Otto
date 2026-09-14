import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
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
              <a 
                href="/"
                onClick={(e) => {
                  e.preventDefault();
                  navigateTo('home');
                }}
                className="flex items-center gap-2.5 cursor-pointer select-none group"
                aria-label="OttoRental Home"
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-slate-900 transition-transform group-hover:scale-110">
                  <svg viewBox="0 0 100 100" className="w-full h-full fill-none">
                    <circle cx="50" cy="50" r="36" stroke="currentColor" strokeWidth="15" />
                    <circle cx="50" cy="50" r="14" fill="currentColor" />
                  </svg>
                </div>
                <span className="font-extrabold text-2xl sm:text-3xl tracking-tight text-slate-900 font-sans">
                  Otto<span className="text-blue-600">Rental</span>
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 mt-2"></span>
              </a>
              <p className="text-slate-500 text-xs leading-relaxed max-w-sm">
                Self-drive, chauffeured, and safari vehicle rentals across Kenya. Verified operators, transparent prices, pay with M-Pesa or card.
              </p>
              <div className="pt-2 flex items-center gap-3">
                <a
                  href={`https://api.whatsapp.com/send?phone=${(siteContent.brand?.whatsapp || '254119317161').replace(/[^0-9]/g, '')}&text=${encodeURIComponent('Hello OttoRental, I would like to make an enquiry on available vehicles.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800 font-bold hover:bg-emerald-100 transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>WhatsApp Support</span>
                </a>
              </div>
            </div>

            {/* Vehicles Links */}
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                Vehicles for Hire
              </h4>
              <ul className="space-y-2">
                <li>
                  <a 
                    href="/fleet" 
                    onClick={(e) => { e.preventDefault(); navigateTo('fleet'); }} 
                    className="hover:text-blue-600 transition-colors block"
                  >
                    Economy Small & Medium Cars
                  </a>
                </li>
                <li>
                  <a 
                    href="/cars/premium-suv-prado" 
                    onClick={(e) => { e.preventDefault(); navigateTo('car-details', 'premium-suv-prado'); }} 
                    className="hover:text-blue-600 transition-colors block"
                  >
                    Toyota Prado TX 4x4
                  </a>
                </li>
                <li>
                  <a 
                    href="/cars/luxury-suv-lc200" 
                    onClick={(e) => { e.preventDefault(); navigateTo('car-details', 'luxury-suv-lc200'); }} 
                    className="hover:text-blue-600 transition-colors block"
                  >
                    Land Cruiser V8 LC200
                  </a>
                </li>
                <li>
                  <a 
                    href="/cars/standard-safari" 
                    onClick={(e) => { e.preventDefault(); navigateTo('car-details', 'standard-safari'); }} 
                    className="hover:text-blue-600 transition-colors block"
                  >
                    Masai Mara Safari Land Cruisers
                  </a>
                </li>
                <li>
                  <a 
                    href="/cars/premium-minivan" 
                    onClick={(e) => { e.preventDefault(); navigateTo('car-details', 'premium-minivan'); }} 
                    className="hover:text-blue-600 transition-colors block"
                  >
                    Executive Minivans & Buses
                  </a>
                </li>
              </ul>
            </div>

            {/* Cities Links */}
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                Top Destinations
              </h4>
              <ul className="space-y-2">
                <li>
                  <a 
                    href="/fleet" 
                    onClick={(e) => { e.preventDefault(); navigateTo('fleet'); }} 
                    className="hover:text-blue-600 transition-colors block"
                  >
                    Nairobi & JKIA Airport
                  </a>
                </li>
                <li>
                  <a 
                    href="/fleet" 
                    onClick={(e) => { e.preventDefault(); navigateTo('fleet'); }} 
                    className="hover:text-blue-600 transition-colors block"
                  >
                    Mombasa & Diani Beach
                  </a>
                </li>
                <li>
                  <a 
                    href="/fleet" 
                    onClick={(e) => { e.preventDefault(); navigateTo('fleet'); }} 
                    className="hover:text-blue-600 transition-colors block"
                  >
                    Kisumu Lakeside City
                  </a>
                </li>
                <li>
                  <a 
                    href="/fleet" 
                    onClick={(e) => { e.preventDefault(); navigateTo('fleet'); }} 
                    className="hover:text-blue-600 transition-colors block"
                  >
                    Masai Mara & Naivasha
                  </a>
                </li>
                <li>
                  <a 
                    href="/fleet" 
                    onClick={(e) => { e.preventDefault(); navigateTo('fleet'); }} 
                    className="hover:text-blue-600 transition-colors block"
                  >
                    Malindi Coastal Escape
                  </a>
                </li>
              </ul>
            </div>

            {/* Company & Operators */}
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                About & Operators
              </h4>
              <ul className="space-y-2">
                <li>
                  <a 
                    href="/about" 
                    onClick={(e) => { e.preventDefault(); navigateTo('about'); }} 
                    className="hover:text-blue-600 transition-colors block"
                  >
                    About OttoRental Kenya
                  </a>
                </li>
                <li>
                  <a 
                    href="/contact" 
                    onClick={(e) => { e.preventDefault(); navigateTo('contact'); }} 
                    className="hover:text-blue-600 transition-colors block"
                  >
                    Become an Operator / List Fleet
                  </a>
                </li>
                <li>
                  <a 
                    href="/booking" 
                    onClick={(e) => { e.preventDefault(); navigateTo('booking'); }} 
                    className="hover:text-blue-600 transition-colors block"
                  >
                    Online Booking & Checkout
                  </a>
                </li>
                <li>
                  <a 
                    href="/faqs" 
                    onClick={(e) => { e.preventDefault(); navigateTo('faqs'); }} 
                    className="hover:text-blue-600 transition-colors block"
                  >
                    Rental FAQs & Policies
                  </a>
                </li>
                <li>
                  <a 
                    href="/contact" 
                    onClick={(e) => { e.preventDefault(); navigateTo('contact'); }} 
                    className="hover:text-blue-600 transition-colors block"
                  >
                    24/7 Concierge Desk
                  </a>
                </li>
              </ul>
            </div>

          </div>

          {/* Contact Details Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 py-8 border-t border-slate-200">

            {/* Phone */}
            <a
              href={`tel:${siteContent.brand?.phone || '+254119317161'}`}
              className="flex items-center gap-3 group hover:text-blue-600 transition-colors"
            >
              <div className="w-9 h-9 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 group-hover:bg-blue-100 transition-colors">
                <Phone className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Call Us</p>
                <p className="text-xs font-bold text-slate-800 group-hover:text-blue-600">{siteContent.brand?.phone || '+254 119 317161'}</p>
              </div>
            </a>

            {/* WhatsApp */}
            <a
              href={`https://api.whatsapp.com/send?phone=${(siteContent.brand?.whatsapp || '254119317161').replace(/[^0-9]/g, '')}&text=${encodeURIComponent('Hello OttoRental, I would like to make an enquiry.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 group hover:text-emerald-600 transition-colors"
            >
              <div className="w-9 h-9 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0 group-hover:bg-emerald-100 transition-colors">
                <MessageCircle className="w-4 h-4 text-emerald-600" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">WhatsApp</p>
                <p className="text-xs font-bold text-slate-800 group-hover:text-emerald-600">+{siteContent.brand?.whatsapp || '254 119 317161'}</p>
              </div>
            </a>

            {/* Email */}
            <a
              href={`mailto:${siteContent.brand?.email || 'hello@ottorental.com'}`}
              className="flex items-center gap-3 group hover:text-blue-600 transition-colors"
            >
              <div className="w-9 h-9 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 group-hover:bg-blue-100 transition-colors">
                <Mail className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Email Us</p>
                <p className="text-xs font-bold text-slate-800 group-hover:text-blue-600">{siteContent.brand?.email || 'hello@ottorental.com'}</p>
              </div>
            </a>

            {/* Address */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4 text-slate-500" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Location</p>
                <p className="text-xs font-semibold text-slate-700 leading-relaxed">{siteContent.brand?.address || 'Westlands, Nairobi, Kenya'}</p>
              </div>
            </div>

          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400 text-xs">
            <p>
              © {new Date().getFullYear()}{' '}
              <span
                onClick={() => {
                  if (isAdminAuthenticated) {
                    navigateTo('admin');
                  } else {
                    setAdminModalOpen(true);
                  }
                }}
                className="cursor-default select-none"
                title=""
              >
                {siteContent.brand?.name || 'OttoRental'}
              </span>
              . All rights reserved. Registered rental marketplace & operator logistics in Kenya.
            </p>

            <div className="flex items-center gap-3 text-slate-400 text-[11px]">
              <span>Nairobi · Mombasa · Kisumu · Diani · Malindi</span>
              {isAdminAuthenticated && (
                <button
                  onClick={() => navigateTo('admin')}
                  className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full font-bold transition-all hover:bg-emerald-100 cursor-pointer"
                  title="Admin session active — click to open Control Center"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Admin Session</span>
                </button>
              )}
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
