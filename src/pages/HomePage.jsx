import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES, CITIES_WE_SERVE } from '../data/initialData';
import CarCard from '../components/CarCard';
import { trackSearch } from '../utils/analytics';
import { 
  MapPin, 
  Search, 
  Star, 
  Car, 
  User, 
  CheckCircle2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const HERO_CITIES = [
  {
    name: "Nairobi, Kenya",
    locationValue: "Nairobi",
    image: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=2000&q=85",
    description: "Capital & fleet hub"
  },
  {
    name: "Diani, Kenya",
    locationValue: "Diani",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2000&q=85",
    description: "White-sand beaches"
  },
  {
    name: "Mombasa, Kenya",
    locationValue: "Mombasa",
    image: "https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?auto=format&fit=crop&w=2000&q=85",
    description: "Coastal waterfront & old town"
  },
  {
    name: "Kisumu, Kenya",
    locationValue: "Kisumu",
    image: "/kisumu-lake.jpg",
    description: "Lakeside city · Lake Victoria"
  }
];

export default function HomePage() {
  const { 
    fleet, 
    siteContent, 
    navigateTo, 
    setBookingDraft 
  } = useApp();

  const [activeHeroIndex, setActiveHeroIndex] = useState(0);
  const [rentalMode, setRentalMode] = useState('self-drive'); // 'self-drive' | 'chauffeured'
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [startLocation, setStartLocation] = useState('Nairobi');
  const [returnLocation, setReturnLocation] = useState('Same as start');
  const [pickupDate, setPickupDate] = useState('2026-09-15');
  const [returnDate, setReturnDate] = useState('2026-09-18');
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Auto-cycle through the 4 city pictures every 6 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveHeroIndex((prev) => (prev + 1) % HERO_CITIES.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const currentCity = HERO_CITIES[activeHeroIndex];

  // Filtered cars by category
  const filteredCars = fleet.filter(car => {
    if (activeCategory === 'ALL') return true;
    return car.category === activeCategory;
  });

  const handleHeroSearch = (e) => {
    e.preventDefault();
    trackSearch(startLocation, {
      rental_mode: rentalMode,
      pickup_location: startLocation,
      dropoff_location: returnLocation,
      pickup_date: pickupDate,
      return_date: returnDate
    });
    setBookingDraft(prev => ({
      ...prev,
      rentalMode,
      pickupLocation: startLocation,
      dropoffLocation: returnLocation,
      pickupDate,
      returnDate,
      chauffeur: rentalMode === 'chauffeured'
    }));
    navigateTo('fleet');
  };

  return (
    <div className="bg-slate-50 text-slate-900 overflow-x-hidden animate-fade-in">
      
      {/* 1. HERO SECTION (Dynamic 4-City Slideshow: Nairobi, Diani, Mombasa, Kisumu) */}
      <section className="relative min-h-[85vh] sm:min-h-[90vh] flex flex-col justify-between items-center px-4 sm:px-6 lg:px-8 pt-32 pb-16 overflow-hidden">
        
        {/* Layered Cross-Fading Background Images for Smooth Transition */}
        {HERO_CITIES.map((city, idx) => (
          <div
            key={city.name}
            className={`absolute inset-0 z-0 transition-opacity duration-1000 ease-in-out ${
              idx === activeHeroIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
            }`}
            style={{ transitionProperty: 'opacity, transform' }}
          >
            <img
              src={city.image}
              alt={city.name}
              className="w-full h-full object-cover"
            />
            {/* Dark Gradient Overlay for high text contrast */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/35 to-black/75"></div>
          </div>
        ))}

        {/* Center Content */}
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6 my-auto text-white">
          
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.15] text-white">
            {siteContent.hero.title || 'Self drive or chauffeured rentals, anywhere in Kenya'}
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-white/90 font-normal leading-relaxed">
            {siteContent.hero.subtitle || 'Verified operators, transparent prices, pay with M-Pesa or card. All in a few minutes'}
          </p>

          {/* Dynamic Location Tag Pill (Cycles with Active City: Nairobi, Diani, Mombasa, Kisumu) */}
          <div className="pt-2 flex items-center justify-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-black/45 backdrop-blur-md text-xs font-semibold text-white border border-white/20 shadow-lg transition-all">
              <MapPin className="w-3.5 h-3.5 text-white" />
              <span>{currentCity.name}</span>
            </div>
          </div>

          {/* Self Drive vs Chauffeured Switcher Pill */}
          <div className="pt-2 flex justify-center">
            <div className="p-1 rounded-full bg-black/40 backdrop-blur-md border border-white/20 inline-flex items-center gap-1 max-w-full">
              <button
                type="button"
                onClick={() => setRentalMode('self-drive')}
                className={`px-4 sm:px-5 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 sm:gap-2 cursor-pointer whitespace-nowrap ${
                  rentalMode === 'self-drive'
                    ? 'bg-white text-slate-950 shadow-md'
                    : 'text-white hover:text-white/80'
                }`}
              >
                <Car className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>Self drive</span>
              </button>

              <button
                type="button"
                onClick={() => setRentalMode('chauffeured')}
                className={`px-4 sm:px-5 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 sm:gap-2 cursor-pointer whitespace-nowrap ${
                  rentalMode === 'chauffeured'
                    ? 'bg-white text-slate-950 shadow-md'
                    : 'text-white hover:text-white/80'
                }`}
              >
                <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>Chauffeured</span>
              </button>
            </div>
          </div>

        </div>

        {/* Floating Search Capsule Bar */}
        <div className="relative z-10 w-full max-w-4xl mx-auto mt-6">
          <form
            onSubmit={handleHeroSearch}
            className="search-capsule p-3 sm:p-2.5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-slate-900 shadow-xl"
          >
            {/* Start Location */}
            <div className="flex-1 px-3 sm:px-4 py-2 border-b md:border-b-0 md:border-r border-slate-100 md:border-slate-200">
              <label className="text-[10px] sm:text-[11px] font-bold text-slate-900 block uppercase tracking-wider">
                Start location
              </label>
              <select
                value={startLocation}
                onChange={(e) => setStartLocation(e.target.value)}
                className="w-full bg-transparent text-xs sm:text-sm font-semibold text-slate-700 focus:outline-none cursor-pointer mt-1"
              >
                <option value="Nairobi">Nairobi</option>
                <option value="JKIA Airport (Nairobi)">JKIA Airport (Nairobi)</option>
                <option value="Wilson Airport (Nairobi)">Wilson Airport (Nairobi)</option>
                <option value="Mombasa">Mombasa</option>
                <option value="Moi Airport (Mombasa)">Moi Airport (Mombasa)</option>
                <option value="Diani">Diani</option>
                <option value="Kisumu">Kisumu</option>
                <option value="Malindi">Malindi</option>
                <option value="Eldoret">Eldoret</option>
                <option value="Naivasha">Naivasha</option>
              </select>
            </div>

            {/* Return Location */}
            <div className="flex-1 px-3 sm:px-4 py-2 border-b md:border-b-0 md:border-r border-slate-100 md:border-slate-200">
              <label className="text-[10px] sm:text-[11px] font-bold text-slate-900 block uppercase tracking-wider">
                Return location
              </label>
              <select
                value={returnLocation}
                onChange={(e) => setReturnLocation(e.target.value)}
                className="w-full bg-transparent text-xs sm:text-sm font-semibold text-slate-700 focus:outline-none cursor-pointer mt-1"
              >
                <option value="Same as start">Same as start</option>
                <option value="Nairobi">Nairobi</option>
                <option value="Mombasa">Mombasa</option>
                <option value="Diani">Diani</option>
                <option value="Kisumu">Kisumu</option>
                <option value="Malindi">Malindi</option>
              </select>
            </div>

            {/* Dates */}
            <div className="flex-1 px-3 sm:px-4 py-2 relative">
              <label className="text-[10px] sm:text-[11px] font-bold text-slate-900 block uppercase tracking-wider">
                Dates
              </label>
              <div 
                onClick={() => setShowDatePicker(!showDatePicker)}
                className="text-xs sm:text-sm font-semibold text-slate-700 cursor-pointer mt-1 flex items-center justify-between"
              >
                <span>{pickupDate ? `${pickupDate} to ${returnDate}` : 'Add dates'}</span>
              </div>

              {showDatePicker && (
                <div className="absolute top-full left-0 right-0 sm:right-auto mt-3 p-4 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 w-full sm:w-72 space-y-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block">Pick-up Date</label>
                    <input
                      type="date"
                      value={pickupDate}
                      onChange={(e) => setPickupDate(e.target.value)}
                      className="w-full text-xs p-2 border border-slate-200 rounded-lg mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block">Return Date</label>
                    <input
                      type="date"
                      value={returnDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                      className="w-full text-xs p-2 border border-slate-200 rounded-lg mt-1"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowDatePicker(false)}
                    className="w-full btn-otto-primary text-xs py-2"
                  >
                    Done
                  </button>
                </div>
              )}
            </div>

            {/* Search CTA Button */}
            <div className="px-2 py-1 flex items-center justify-end">
              <button
                type="submit"
                className="w-full md:w-12 h-11 md:h-12 rounded-xl md:rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition-all shadow-md hover:scale-105 cursor-pointer flex-shrink-0 font-bold text-xs md:text-base gap-2"
                aria-label="Search vehicles"
              >
                <Search className="w-4 h-4 md:w-5 md:h-5" />
                <span className="md:hidden">Search Vehicles</span>
              </button>
            </div>
          </form>
        </div>

      </section>

      {/* 2. TRUST BADGES ROW (Matching Picture 1) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-4">
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm font-semibold text-emerald-800">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200/80">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Vetted operators</span>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200/80">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Transparent pricing</span>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200/80">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>M-Pesa & card</span>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200/80">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Roadside rescue included</span>
          </div>
        </div>
      </section>

      {/* 3. "EVERY KIND OF VEHICLE" SECTION (Matching Picture 1) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        
        {/* Section Title & Subtitle */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {siteContent.vehicleSection?.title || 'Every kind of vehicle'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            {siteContent.vehicleSection?.subtitle || 'From city runabouts to safari Land Cruisers, with transparent daily rates.'}
          </p>
        </div>

        {/* Category Pills Slider (Matching Picture 1) */}
        <div className="flex items-center justify-start lg:justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`category-pill ${
                activeCategory === cat ? 'category-pill-active' : 'category-pill-inactive'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 4-Column Clean Studio Car Grid (Matching Picture 1) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredCars.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>

        {/* View All Vehicles Button */}
        <div className="text-center pt-4">
          <button
            onClick={() => navigateTo('fleet')}
            className="px-6 py-2.5 rounded-full border border-slate-300 hover:border-slate-400 text-xs font-bold text-slate-800 bg-white shadow-sm hover:bg-slate-50 transition-all uppercase cursor-pointer"
          >
            View all vehicles
          </button>
        </div>

      </section>

      {/* 4. "CITIES WE SERVE" SECTION (Matching Picture 2 & 3) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8 border-t border-slate-200">
        
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {siteContent.citiesSection?.title || 'Cities we serve'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            {siteContent.citiesSection?.subtitle || 'Where to go, when to visit, and how to get around, city by city.'}
          </p>
        </div>

        {/* 3-Column Destination Card Grid with Overlaid Titles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {CITIES_WE_SERVE.map((city, idx) => (
            <div 
              key={idx}
              onClick={() => {
                setStartLocation(city.name);
                navigateTo('fleet');
              }}
              className="destination-card group cursor-pointer shadow-md bg-slate-900"
            >
              <img
                src={city.image}
                alt={city.name}
                className="transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="destination-card-gradient"></div>
              <div className="absolute bottom-4 left-4 text-white z-10">
                <h3 className="font-bold text-base text-white leading-tight">
                  {city.name}
                </h3>
                <p className="text-xs text-white/80 font-normal mt-0.5">
                  {city.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>

      </section>

      {/* 5. "WHAT OUR CUSTOMERS SAY" (Matching Picture 3) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10 border-t border-slate-200">
        
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            What our customers say
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Real trips, verified bookings.
          </p>
        </div>

        {/* 3 Review Cards Side-by-Side */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {siteContent.reviews.map((rev, idx) => (
            <div
              key={idx}
              className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6"
            >
              <div className="space-y-3">
                {/* 5 Orange Stars */}
                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />
                  ))}
                </div>

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                  {rev.quote}
                </p>
              </div>

              {/* User Avatar Circle & Name */}
              <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 font-bold text-xs flex items-center justify-center border border-blue-200 flex-shrink-0">
                  {rev.initials}
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-900">{rev.name}</h4>
                  <p className="text-[11px] text-slate-500">{rev.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </section>

      {/* 6. PROMOTIONAL FEATURE SECTIONS (Matching Picture 4) */}
      
      {/* 6A. Dark Section: "EARN WITH OTTO" */}
      <section className="bg-[#0b0c14] text-white py-20 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-5 space-y-6">
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-blue-400 block">
                {siteContent.earnSection?.badge || 'EARN WITH OTTO'}
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                {siteContent.earnSection?.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                {siteContent.earnSection?.description}
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  onClick={() => navigateTo('contact')}
                  className="px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors cursor-pointer"
                >
                  {siteContent.earnSection?.cta1 || 'Start earning'}
                </button>
                <button
                  onClick={() => navigateTo('about')}
                  className="px-6 py-3 rounded-full bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors border border-slate-700 cursor-pointer"
                >
                  {siteContent.earnSection?.cta2 || 'See how it works'}
                </button>
              </div>
            </div>

            {/* Right 2x2 Grid of Dark Cards */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {siteContent.earnSection?.cards.map((card, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-[#161826] border border-slate-800/80 space-y-2">
                  <h4 className="font-bold text-sm text-white">{card.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{card.text}</p>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* 6B. White Section: "BECOME AN OPERATOR / Meet GoBookKit" */}
      <section className="bg-white text-slate-900 py-20 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left 2 Cards */}
            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {siteContent.operatorSection?.cards.map((card, idx) => (
                <div key={idx} className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <h4 className="font-bold text-sm text-slate-900">{card.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{card.text}</p>
                </div>
              ))}
            </div>

            {/* Right Content */}
            <div className="lg:col-span-6 space-y-6">
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-blue-600 block">
                {siteContent.operatorSection?.badge || 'BECOME AN OPERATOR'}
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
                {siteContent.operatorSection?.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {siteContent.operatorSection?.description}
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  onClick={() => navigateTo('contact')}
                  className="px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors cursor-pointer"
                >
                  {siteContent.operatorSection?.cta1 || 'Explore GoBookKit'}
                </button>
                <button
                  onClick={() => navigateTo('contact')}
                  className="px-6 py-3 rounded-full border border-slate-300 hover:bg-slate-50 text-slate-800 font-bold text-xs transition-colors cursor-pointer"
                >
                  {siteContent.operatorSection?.cta2 || 'List your fleet'}
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6C. Dark Section: "OTTO FOR BUSINESS" */}
      <section className="bg-[#0b0c14] text-white py-20 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-5 space-y-6">
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-blue-400 block">
                {siteContent.businessSection?.badge || 'OTTO FOR BUSINESS'}
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                {siteContent.businessSection?.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                {siteContent.businessSection?.description}
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  onClick={() => navigateTo('contact')}
                  className="px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors cursor-pointer"
                >
                  {siteContent.businessSection?.cta1 || 'Talk to sales'}
                </button>
                <button
                  onClick={() => navigateTo('about')}
                  className="px-6 py-3 rounded-full bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors border border-slate-700 cursor-pointer"
                >
                  {siteContent.businessSection?.cta2 || 'See how it works'}
                </button>
              </div>
            </div>

            {/* Right 2x2 Grid of Dark Cards */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {siteContent.businessSection?.cards.map((card, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-[#161826] border border-slate-800/80 space-y-2">
                  <h4 className="font-bold text-sm text-white">{card.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{card.text}</p>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
