import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldCheck, 
  Sparkles, 
  Award, 
  UserCheck, 
  CheckCircle2, 
  ArrowRight,
  Car,
  Building,
  Users
} from 'lucide-react';

export default function AboutPage() {
  const { siteContent, navigateTo } = useApp();

  return (
    <div className="bg-slate-50 min-h-screen text-slate-900 pt-28 pb-20 space-y-16 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Editorial Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider">
            About EliteRide
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Kenya's Premier Self-Drive & Chauffeured Rental Marketplace
          </h1>
          <p className="text-xs sm:text-base text-slate-600 leading-relaxed font-normal">
            We connect travelers, businesses, and safari adventurers with verified vehicle operators across Nairobi, Mombasa, Diani, Kisumu, and upcountry destinations with instant M-Pesa payments and transparent pricing.
          </p>
        </div>

        {/* Hero Banner Visual */}
        <div className="relative rounded-3xl overflow-hidden aspect-[21/9] bg-slate-900 shadow-md">
          <img
            src="https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1800&q=85"
            alt="EliteRide Fleet in Masai Mara"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
          <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 text-white">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 block">Our Promise</span>
              <h3 className="font-extrabold text-xl sm:text-2xl">Verified Operators & Roadside Rescue Guaranteed</h3>
            </div>
            <button
              onClick={() => navigateTo('fleet')}
              className="btn-otto-primary text-xs py-2.5 px-6 uppercase"
            >
              Explore Vehicles
            </button>
          </div>
        </div>

        {/* Pillars Grid */}
        <div className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-1">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Why Rent with EliteRide?</h2>
            <p className="text-xs sm:text-sm text-slate-500">Built for seamless mobility, trust, and transparent rates.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900">
                100% Vetted Operators
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Every vehicle and fleet operator undergoes strict document verification, commercial insurance audit, and mechanical health inspection.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900">
                Instant M-Pesa & Card Checkout
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                No cash hassles. Reserve and pay deposits securely via M-Pesa STK Push or international debit/credit cards with instant confirmation.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900">
                Professional Vetted Drivers
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Need a driver? Hire experienced, smartly dressed, defensive-driving certified chauffeurs and safari guides on an hourly or daily basis.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Card */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm text-center space-y-5 max-w-3xl mx-auto">
          <h3 className="text-2xl font-extrabold text-slate-900">Ready to hit the road?</h3>
          <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
            From city runabouts in Nairobi to 4x4 safari Land Cruisers for the Masai Mara, EliteRide has the perfect vehicle for your journey.
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={() => navigateTo('fleet')}
              className="btn-otto-primary text-xs py-3 px-8 uppercase"
            >
              Browse Vehicles
            </button>
            <button
              onClick={() => navigateTo('contact')}
              className="px-6 py-3 rounded-full border border-slate-300 hover:bg-slate-50 text-xs font-bold text-slate-700"
            >
              Contact Concierge
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
