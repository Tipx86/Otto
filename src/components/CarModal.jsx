import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Zap, 
  Gauge, 
  Users, 
  Briefcase, 
  ShieldCheck, 
  Check, 
  Sparkles, 
  ArrowRight, 
  Heart,
  Calendar,
  Fuel
} from 'lucide-react';

export default function CarModal() {
  const { 
    quickViewCar, 
    setQuickViewCar, 
    formatPrice, 
    navigateTo, 
    wishlist, 
    toggleWishlist,
    setBookingDraft 
  } = useApp();

  const [selectedImgIndex, setSelectedImgIndex] = useState(0);

  if (!quickViewCar) return null;

  const car = quickViewCar;
  const isSaved = wishlist.includes(car.id);

  const handleBookNow = () => {
    setBookingDraft(prev => ({
      ...prev,
      carId: car.id
    }));
    setQuickViewCar(null);
    navigateTo('booking', car.id);
  };

  const handleGoToDetails = () => {
    setQuickViewCar(null);
    navigateTo('car-details', car.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-zinc-950 border border-amber-400/30 rounded-3xl shadow-[0_0_60px_rgba(212,175,55,0.15)] overflow-hidden my-auto text-zinc-100 max-h-[90vh] flex flex-col">
        
        {/* Header Close & Wishlist Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-900/60">
          <div className="flex items-center gap-3">
            <span className="badge-gold text-xs">{car.category}</span>
            <span className="text-xs uppercase font-semibold text-zinc-400 tracking-wider">
              {car.brand} • {car.year}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleWishlist(car.id)}
              className={`p-2 rounded-full border transition-all ${
                isSaved 
                  ? 'bg-amber-400/20 border-amber-400 text-amber-300' 
                  : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
              }`}
              title="Save to collection"
            >
              <Heart className={`w-4 h-4 ${isSaved ? 'fill-amber-400' : ''}`} />
            </button>

            <button
              onClick={() => setQuickViewCar(null)}
              className="p-2 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body (Scrollable) */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Top Grid: Gallery & Quick Pricing */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Gallery Left */}
            <div className="lg:col-span-7 space-y-3">
              <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800">
                <img
                  src={car.images && car.images[selectedImgIndex] ? car.images[selectedImgIndex] : car.images[0]}
                  alt={car.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Thumbnails */}
              {car.images && car.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {car.images.map((imgUrl, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImgIndex(idx)}
                      className={`relative w-20 aspect-[16/10] rounded-lg overflow-hidden border transition-all flex-shrink-0 ${
                        selectedImgIndex === idx ? 'border-amber-400 ring-2 ring-amber-400/40' : 'border-zinc-800 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Pricing & Summary Right */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
              <div>
                <h2 className="font-display font-extrabold text-2xl text-white uppercase tracking-tight">
                  {car.name}
                </h2>
                <p className="text-xs text-amber-300/80 font-serif italic text-sm mt-1">
                  "{car.tagline || car.description}"
                </p>

                <div className="mt-4 p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-2">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs text-zinc-400 uppercase tracking-wider font-semibold">Daily Rate:</span>
                    <span className="font-display font-extrabold text-2xl text-gold-gradient">
                      {formatPrice(car.dailyPrice)}
                      <span className="text-xs text-zinc-400 font-sans font-normal"> / day</span>
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-zinc-400 pt-2 border-t border-zinc-800">
                    <span>Security Deposit Hold:</span>
                    <span className="text-zinc-200 font-mono font-semibold">{formatPrice(car.securityDeposit)}</span>
                  </div>

                  {car.weeklyDiscount > 0 && (
                    <div className="text-[11px] text-emerald-400 font-medium pt-1">
                      ★ Includes {car.weeklyDiscount}% discount for 7+ day bookings
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5">
                <button
                  onClick={handleBookNow}
                  className="w-full btn-gold py-3.5 text-xs uppercase flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Reserve This Vehicle</span>
                </button>

                <button
                  onClick={handleGoToDetails}
                  className="w-full py-2.5 text-xs uppercase font-semibold text-zinc-300 hover:text-amber-400 border border-zinc-800 hover:border-amber-400/40 rounded-full transition-colors"
                >
                  View Full Vehicle Profile & Specs
                </button>
              </div>
            </div>
          </div>

          {/* Specs Matrix */}
          <div>
            <h4 className="font-display text-xs font-bold uppercase tracking-[0.2em] text-amber-300 mb-3">
              Performance & Specifications
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800">
                <span className="text-zinc-500 uppercase tracking-wider text-[10px] block">0-60 MPH</span>
                <span className="font-bold text-zinc-100 text-sm mt-0.5 font-mono">{car.specs.acceleration}</span>
              </div>
              <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800">
                <span className="text-zinc-500 uppercase tracking-wider text-[10px] block">Horsepower</span>
                <span className="font-bold text-zinc-100 text-sm mt-0.5 font-mono">{car.specs.horsepower}</span>
              </div>
              <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800">
                <span className="text-zinc-500 uppercase tracking-wider text-[10px] block">Engine</span>
                <span className="font-bold text-zinc-100 text-sm mt-0.5 line-clamp-1">{car.specs.engine}</span>
              </div>
              <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800">
                <span className="text-zinc-500 uppercase tracking-wider text-[10px] block">Top Speed</span>
                <span className="font-bold text-zinc-100 text-sm mt-0.5 font-mono">{car.specs.topSpeed}</span>
              </div>
            </div>
          </div>

          {/* Features & Included Perks */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div>
              <h4 className="font-display text-xs font-bold uppercase tracking-[0.2em] text-zinc-300 mb-2.5">
                Key Features & Equipment
              </h4>
              <ul className="space-y-1.5 text-xs text-zinc-400">
                {car.features.map((feat, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-display text-xs font-bold uppercase tracking-[0.2em] text-zinc-300 mb-2.5">
                Complimentary VIP Inclusions
              </h4>
              <ul className="space-y-1.5 text-xs text-zinc-400">
                {car.includedPerks.map((perk, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                    <span>{perk}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
