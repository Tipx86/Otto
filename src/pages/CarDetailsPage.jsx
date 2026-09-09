import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { trackViewItem, trackBeginCheckout } from '../utils/analytics';
import { 
  ChevronLeft, 
  ChevronRight,
  MapPin, 
  Calendar, 
  Check, 
  ShieldCheck, 
  CreditCard, 
  User, 
  Fuel, 
  Users, 
  Briefcase, 
  Zap,
  Phone,
  MessageCircle,
  Clock, 
  ArrowRight,
  X,
  Maximize2
} from 'lucide-react';

export default function CarDetailsPage() {
  const { 
    fleet, 
    selectedCarId, 
    formatPrice, 
    navigateTo, 
    setBookingDraft, 
    siteContent 
  } = useApp();

  const car = fleet.find(c => c.id === selectedCarId) || fleet[0];

  const [pickupDate, setPickupDate] = useState('2026-09-15');
  const [returnDate, setReturnDate] = useState('2026-09-18');
  const [startLocation, setStartLocation] = useState('Nairobi');
  const [chauffeurIncluded, setChauffeurIncluded] = useState(false);
  const [fullProtection, setFullProtection] = useState(false);

  // Calculation
  const calculation = useMemo(() => {
    const start = new Date(pickupDate);
    const end = new Date(returnDate);
    const diffTime = Math.max(1000 * 60 * 60 * 24, end.getTime() - start.getTime());
    const days = Math.max(1, Math.round(diffTime / (1000 * 60 * 60 * 24)));

    const baseSubtotal = days * car.dailyPrice;
    let addOns = 0;
    if (chauffeurIncluded) addOns += 20 * days; // KSh 2,500/day (~$20/day) chauffeur
    if (fullProtection) addOns += 10 * days;

    const grandTotal = baseSubtotal + addOns;

    return {
      days,
      baseSubtotal,
      addOns,
      grandTotal,
      deposit: car.securityDeposit
    };
  }, [pickupDate, returnDate, car.dailyPrice, car.securityDeposit, chauffeurIncluded, fullProtection]);

  useEffect(() => {
    if (car) {
      trackViewItem(car);
    }
  }, [car]);

  const handleBookNow = () => {
    trackBeginCheckout(car, calculation);
    setBookingDraft({
      carId: car.id,
      rentalMode: chauffeurIncluded ? 'chauffeured' : 'self-drive',
      pickupDate,
      returnDate,
      pickupTime: '10:00',
      returnTime: '18:00',
      pickupLocation: startLocation,
      dropoffLocation: startLocation,
      chauffeur: chauffeurIncluded,
      fullProtection,
      airportMeet: false,
      childSeat: false,
      wifiHotspot: false,
      additionalDriver: false,
      paymentMethod: 'mpesa',
      fullName: '',
      email: '',
      phone: '',
      flightNumber: '',
      specialRequests: ''
    });
    navigateTo('booking', car.id);
  };

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const images = car.images && car.images.length > 0 ? car.images : ['https://images.unsplash.com/photo-1520050206274-a1ae44613e6d?auto=format&fit=crop&w=800&q=80'];

  const nextPhoto = (e) => {
    if (e) e.stopPropagation();
    setActiveImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevPhoto = (e) => {
    if (e) e.stopPropagation();
    setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="bg-slate-50 min-h-screen text-slate-900 pt-28 pb-20 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Back Link */}
        <button
          onClick={() => navigateTo('fleet')}
          className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1 transition-colors uppercase tracking-wider cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to All Vehicles</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Studio Photo & Specs (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Main Interactive Studio Car Photo Container */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              
              {/* Main Image Display with Next/Prev and Zoom */}
              <div 
                onClick={() => setIsLightboxOpen(true)}
                className="relative bg-gradient-to-b from-slate-50/90 via-white to-slate-100/70 border border-slate-100 rounded-2xl overflow-hidden flex items-center justify-center min-h-[300px] sm:min-h-[360px] p-6 cursor-pointer group select-none"
                title="Click to view full screen photos"
              >
                {/* Floor shadow */}
                <div className="absolute bottom-6 w-3/5 h-4 bg-slate-900/15 blur-lg rounded-[100%] pointer-events-none transition-all duration-300 group-hover:scale-95" />

                <img
                  src={images[activeImageIndex]}
                  alt={`${car.name} - Photo ${activeImageIndex + 1}`}
                  className="max-h-72 sm:max-h-80 w-auto object-contain relative z-10 filter drop-shadow-md transition-transform duration-500 group-hover:scale-105"
                />

                {/* Photo Index / Total Counter Pill */}
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-bold flex items-center gap-1.5 shadow-sm z-20">
                  <span>Photo {activeImageIndex + 1} of {images.length}</span>
                  {activeImageIndex === 0 && <span className="bg-blue-600 text-[9px] px-1.5 py-0.5 rounded-full uppercase">Cover</span>}
                </div>

                {/* Tap to expand hint */}
                <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-semibold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>View full size</span>
                </div>

                {/* Left Arrow Button (if multiple images) */}
                {images.length > 1 && (
                  <button
                    type="button"
                    onClick={prevPhoto}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-slate-800 flex items-center justify-center shadow-lg border border-slate-200 transition-all opacity-80 group-hover:opacity-100 cursor-pointer"
                    aria-label="Previous photo"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                )}

                {/* Right Arrow Button (if multiple images) */}
                {images.length > 1 && (
                  <button
                    type="button"
                    onClick={nextPhoto}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-slate-800 flex items-center justify-center shadow-lg border border-slate-200 transition-all opacity-80 group-hover:opacity-100 cursor-pointer"
                    aria-label="Next photo"
                  >
                    <ChevronLeft className="w-5 h-5 rotate-180" />
                  </button>
                )}
              </div>

              {/* Multi-Photo Thumbnail Strip */}
              {images.length > 1 && (
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between text-[11px] font-bold uppercase text-slate-500">
                    <span>Vehicle Photo Gallery ({images.length} Available):</span>
                    <span className="text-blue-600 lowercase font-normal">Click any photo to preview</span>
                  </div>

                  <div className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-none">
                    {images.map((imgUrl, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveImageIndex(idx)}
                        className={`relative rounded-xl overflow-hidden bg-slate-50 border p-1 aspect-[16/11] w-20 sm:w-24 flex-shrink-0 transition-all cursor-pointer ${
                          activeImageIndex === idx
                            ? 'border-blue-600 ring-2 ring-blue-500 shadow-sm scale-105'
                            : 'border-slate-200 hover:border-slate-400 opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={imgUrl}
                          alt=""
                          className="w-full h-full object-contain"
                        />
                        {idx === 0 && (
                          <span className="absolute bottom-1 left-1 bg-slate-900/80 text-white text-[8px] px-1 rounded font-bold uppercase">
                            Cover
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* Vehicle Title & Model */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center gap-2">
                <span className="category-pill category-pill-active text-[10px]">
                  {car.category}
                </span>
                <span className="text-xs font-semibold text-slate-500">
                  {car.brand} • {car.year}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {car.name}
              </h1>
              <p className="text-sm font-semibold text-slate-600">
                {car.model || `${car.brand} or similar`}
              </p>
              <p className="text-xs text-slate-500 leading-relaxed pt-1">
                {car.description}
              </p>
            </div>

            {/* Technical Specs Strip */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400">
                Vehicle Specifications
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-400 text-[10px] uppercase block">Seating</span>
                  <span className="font-bold text-slate-800">{car.specs?.seats || 5} Seats</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-400 text-[10px] uppercase block">Luggage</span>
                  <span className="font-bold text-slate-800">{car.specs?.luggage || '3 Bags'}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-400 text-[10px] uppercase block">Engine / Fuel</span>
                  <span className="font-bold text-slate-800">{car.specs?.engine}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-400 text-[10px] uppercase block">Transmission</span>
                  <span className="font-bold text-slate-800">{car.specs?.transmission}</span>
                </div>
              </div>
            </div>

            {/* Included Features */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400">
                Included Features & Perks
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {car.features?.map((f, i) => (
                  <div key={i} className="flex items-center gap-2 text-slate-700">
                    <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span>{f}</span>
                  </div>
                ))}
                {car.includedPerks?.map((p, i) => (
                  <div key={i} className="flex items-center gap-2 text-slate-700">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                    <span>{p}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right: Booking Box (5 cols) */}
          <div className="lg:col-span-5 sticky top-28 space-y-4">
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-lg space-y-5">
              
              <div className="flex items-baseline justify-between border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Daily Rate</span>
                  <span className="text-2xl font-extrabold text-slate-900">
                    {formatPrice(car.dailyPrice, car.kshPrice)}
                  </span>
                  <span className="text-xs text-slate-500 font-normal"> / day</span>
                </div>

                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  <Check className="w-3 h-3 text-emerald-600" /> Instant booking
                </span>
              </div>

              {/* Location & Dates Form */}
              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-bold uppercase text-[10px] text-slate-500 block mb-1">Pick-up Location</label>
                  <select
                    value={startLocation}
                    onChange={(e) => setStartLocation(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-semibold focus:outline-none"
                  >
                    <option value="Nairobi">Nairobi City</option>
                    <option value="JKIA Airport (Nairobi)">JKIA Airport Terminal 1A</option>
                    <option value="Wilson Airport (Nairobi)">Wilson Airport</option>
                    <option value="Mombasa">Mombasa</option>
                    <option value="Diani">Diani Beach</option>
                    <option value="Kisumu">Kisumu</option>
                    <option value="Malindi">Malindi</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-bold uppercase text-[10px] text-slate-700 block mb-1">Start Date</label>
                    <div className="relative">
                      <input
                        type="date"
                        value={pickupDate}
                        onChange={(e) => setPickupDate(e.target.value)}
                        onClick={(e) => e.target.showPicker && e.target.showPicker()}
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 hover:border-blue-400 focus:border-blue-600 focus:bg-white rounded-xl text-slate-900 font-bold text-xs cursor-pointer transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="font-bold uppercase text-[10px] text-slate-700 block mb-1">Return Date</label>
                    <div className="relative">
                      <input
                        type="date"
                        value={returnDate}
                        onChange={(e) => setReturnDate(e.target.value)}
                        onClick={(e) => e.target.showPicker && e.target.showPicker()}
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 hover:border-blue-400 focus:border-blue-600 focus:bg-white rounded-xl text-slate-900 font-bold text-xs cursor-pointer transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Chauffeur Toggle */}
                <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={chauffeurIncluded}
                      onChange={(e) => setChauffeurIncluded(e.target.checked)}
                      className="w-4 h-4 accent-blue-600 rounded"
                    />
                    <span className="font-semibold text-slate-800">Add Professional Chauffeur</span>
                  </div>
                  <span className="text-[11px] font-bold text-blue-600">+ KSh 3,500/day</span>
                </label>

                {/* Zero Excess Protection */}
                <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={fullProtection}
                      onChange={(e) => setFullProtection(e.target.checked)}
                      className="w-4 h-4 accent-blue-600 rounded"
                    />
                    <span className="font-semibold text-slate-800">Zero Excess Protection</span>
                  </div>
                  <span className="text-[11px] font-bold text-blue-600">+ KSh 1,200/day</span>
                </label>
              </div>

              {/* Price Calculation */}
              <div className="pt-3 border-t border-slate-100 space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-slate-600">
                  <span>{calculation.days} Days Rental:</span>
                  <span className="font-semibold">{formatPrice(calculation.baseSubtotal, calculation.days * (car.kshPrice || 4500))}</span>
                </div>
                {calculation.addOns > 0 && (
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Add-ons:</span>
                    <span className="font-semibold">{formatPrice(calculation.addOns, calculation.days * (chauffeurIncluded ? 3500 : 0) + (fullProtection ? calculation.days * 1200 : 0))}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-slate-200 flex items-baseline justify-between text-sm font-bold text-slate-900">
                  <span>Estimated Total:</span>
                  <span className="text-xl font-extrabold text-blue-600">
                    {formatPrice(calculation.grandTotal, calculation.days * (car.kshPrice || 4500) + (chauffeurIncluded ? calculation.days * 3500 : 0) + (fullProtection ? calculation.days * 1200 : 0))}
                  </span>
                </div>
              </div>

              {/* Book CTA */}
              <button
                onClick={handleBookNow}
                className="w-full btn-otto-primary py-3.5 text-xs uppercase tracking-wider font-extrabold flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <span>Book This Vehicle</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-[11px] text-slate-400 text-center">
                Pay with M-Pesa or Card • Free cancellation up to 48 hours
              </p>

            </div>
          </div>

        </div>

        {/* Full Screen Photo Lightbox Modal */}
        {isLightboxOpen && (
          <div 
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 animate-fade-in text-white select-none"
            onClick={() => setIsLightboxOpen(false)}
          >
            {/* Top Bar with Counter and Close */}
            <div className="flex items-center justify-between z-10" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center gap-3">
                <span className="font-extrabold text-base sm:text-lg tracking-tight">
                  {car.name}
                </span>
                <span className="px-3 py-1 rounded-full bg-white/10 text-xs font-mono font-bold">
                  {activeImageIndex + 1} / {images.length}
                </span>
                {activeImageIndex === 0 && (
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-bold uppercase">
                    Primary Cover Photo
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={() => setIsLightboxOpen(false)}
                className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                title="Close gallery (Esc)"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Center Large Photo View */}
            <div 
              className="relative flex-1 flex items-center justify-center my-4 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={images[activeImageIndex]}
                alt={`${car.name} photo`}
                className="max-h-[70vh] max-w-full object-contain drop-shadow-2xl transition-all duration-300"
              />

              {/* Left Button */}
              {images.length > 1 && (
                <button
                  type="button"
                  onClick={prevPhoto}
                  className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center border border-white/20 shadow-2xl transition-all cursor-pointer"
                  title="Previous photo"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              )}

              {/* Right Button */}
              {images.length > 1 && (
                <button
                  type="button"
                  onClick={nextPhoto}
                  className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center border border-white/20 shadow-2xl transition-all cursor-pointer"
                  title="Next photo"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              )}
            </div>

            {/* Bottom Thumbnails Strip */}
            {images.length > 1 && (
              <div 
                className="flex items-center justify-center gap-2 overflow-x-auto py-2 scrollbar-none z-10"
                onClick={(e) => e.stopPropagation()}
              >
                {images.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-16 h-12 rounded-lg overflow-hidden bg-slate-900 border transition-all cursor-pointer p-0.5 ${
                      activeImageIndex === idx
                        ? 'border-blue-500 ring-2 ring-blue-400 scale-110'
                        : 'border-white/20 opacity-50 hover:opacity-90'
                    }`}
                  >
                    <img
                      src={imgUrl}
                      alt=""
                      className="w-full h-full object-contain"
                    />
                  </button>
                ))}
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
