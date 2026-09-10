import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { trackGenerateLead } from '../utils/analytics';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  MessageCircle, 
  Send, 
  Check, 
  Building, 
  Plane, 
  ShieldCheck,
  CheckCircle2,
  Users
} from 'lucide-react';

export default function ContactPage() {
  const { siteContent, showToast } = useApp();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    serviceInterest: 'Car Rental Inquiry',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    trackGenerateLead(formData.serviceInterest || 'General Inquiry', 'Contact Page Form');
    setSubmitted(true);
    showToast('Inquiry submitted. An OTTORENTAL concierge will contact you shortly.', 'success');
  };

  return (
    <div className="bg-slate-50 min-h-screen text-slate-900 pt-28 pb-20 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider">
            <span>24/7 Concierge & Support</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Direct Concierge Access
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Connect directly with our operations team for bespoke arrangements, safari bookings, corporate fleets, or operator partnerships.
          </p>
        </div>

        {/* Main Grid: Form (Left) & Hotline / Office Info (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Contact Form Card (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="font-bold text-lg text-slate-900">
                Send a Bespoke Inquiry
              </h3>
              <p className="text-xs text-slate-500">Average response time is under 15 minutes.</p>
            </div>

            {submitted ? (
              <div className="text-center py-12 space-y-4 animate-fade-in">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                  <Check className="w-7 h-7 stroke-[3]" />
                </div>
                <h3 className="font-bold text-xl text-slate-900">
                  Inquiry Logged Successfully
                </h3>
                <p className="text-xs text-slate-600 max-w-md mx-auto">
                  Thank you, <strong className="text-slate-900">{formData.name}</strong>. An OTTORENTAL concierge has received your request and will connect with you immediately via phone or WhatsApp.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: '', email: '', phone: '', serviceInterest: 'Car Rental Inquiry', message: '' });
                  }}
                  className="px-6 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-800 transition-colors uppercase cursor-pointer"
                >
                  Send Another Request
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-xs font-bold uppercase text-slate-700 tracking-wider">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Wanjiru Kariuki"
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase text-slate-700 tracking-wider">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="wanjiru@example.com"
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase text-slate-700 tracking-wider">
                      Mobile Phone / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+254 712 345678"
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-xs font-bold uppercase text-slate-700 tracking-wider">
                      Nature of Inquiry
                    </label>
                    <select
                      value={formData.serviceInterest}
                      onChange={(e) => setFormData({ ...formData, serviceInterest: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none"
                    >
                      <option value="Car Rental Inquiry">Vehicle Rental Inquiry</option>
                      <option value="Safari Expedition">Masai Mara / Safari 4x4 Booking</option>
                      <option value="Corporate Fleet Account">OTTORENTAL for Business Corporate Account</option>
                      <option value="Operator Listing">Become a Verified Operator (List Fleet)</option>
                      <option value="Airport Handover">Airport VIP Terminal Handover</option>
                    </select>
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-xs font-bold uppercase text-slate-700 tracking-wider">
                      Itinerary Details & Preferences
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Please specify dates, preferred vehicle models, destination, or driver requirements..."
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full btn-otto-primary py-3 text-xs uppercase tracking-wider font-extrabold flex items-center justify-center gap-2 shadow-md cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Transmit Inquiry to OTTORENTAL Concierge</span>
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Right Cards: Hotline, WhatsApp, Showroom & Hubs (5 cols) */}
          <div className="lg:col-span-5 space-y-5">
            
            {/* 24/7 Phone Concierge Box */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 block">Immediate VIP Dispatch</span>
                  <h4 className="font-extrabold text-lg text-slate-900">24/7 Phone Concierge</h4>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                For priority bookings, flight arrivals, or chauffeur dispatch, reach our senior operations team anytime:
              </p>

              <div className="space-y-2 pt-1 font-mono text-xs">
                <a 
                  href={`tel:${siteContent.brand.phone.replace(/[^0-9+]/g, '')}`}
                  className="block p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold hover:bg-slate-100 transition-colors"
                >
                  Kenya Hotline: {siteContent.brand.phone}
                </a>
                <a 
                  href={`tel:${siteContent.brand.internationalPhone.replace(/[^0-9+]/g, '')}`}
                  className="block p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  International: {siteContent.brand.internationalPhone}
                </a>
              </div>

              {/* WhatsApp Button */}
              <div className="pt-2">
                <a
                  href={`https://api.whatsapp.com/send?phone=${(siteContent.brand?.whatsapp || '254119317161').replace(/[^0-9]/g, '')}&text=${encodeURIComponent('Hello OttoRental, I would like to make an enquiry on available vehicles and car hire services.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase transition-colors shadow-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Instant WhatsApp Concierge</span>
                </a>
              </div>
            </div>

            {/* Hubs & Office Details */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <Building className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="space-y-0.5">
                  <span className="font-bold text-slate-900 uppercase block">Headquarters & Showroom</span>
                  <p className="text-slate-600">{siteContent.brand.address}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-3 border-t border-slate-100">
                <Plane className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="space-y-0.5">
                  <span className="font-bold text-slate-900 uppercase block">Airport Handover Points</span>
                  <p className="text-slate-600">JKIA Terminal 1A & 1D, Wilson Airport, Moi Airport Mombasa, Kisumu & Diani Airstrip.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-3 border-t border-slate-100">
                <Mail className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="space-y-0.5">
                  <span className="font-bold text-slate-900 uppercase block">Direct Inquiries</span>
                  <a href={`mailto:${siteContent.brand.email}`} className="text-blue-600 font-semibold hover:underline">
                    {siteContent.brand.email}
                  </a>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
