import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES, BRANDS } from '../data/initialData';
import CarCard from '../components/CarCard';
import { trackSearch } from '../utils/analytics';
import { 
  Search, 
  RotateCcw, 
  X, 
  SlidersHorizontal,
  Car
} from 'lucide-react';

export default function FleetPage() {
  const { fleet, formatPrice, navigateTo } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedBrand, setSelectedBrand] = useState('All Brands');
  const [maxPrice, setMaxPrice] = useState(300); // USD
  const [availableOnly, setAvailableOnly] = useState(false);

  useEffect(() => {
    if (!searchTerm.trim()) return;
    const timer = setTimeout(() => {
      trackSearch(searchTerm.trim(), { search_type: 'fleet_filter' });
    }, 1000);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const filteredCars = useMemo(() => {
    return fleet.filter(car => {
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesName = car.name.toLowerCase().includes(query);
        const matchesModel = (car.model || '').toLowerCase().includes(query);
        const matchesBrand = car.brand.toLowerCase().includes(query);
        const matchesCat = car.category.toLowerCase().includes(query);
        if (!matchesName && !matchesModel && !matchesBrand && !matchesCat) return false;
      }

      if (selectedCategory !== 'ALL' && car.category !== selectedCategory) {
        return false;
      }

      if (selectedBrand !== 'All Brands' && car.brand !== selectedBrand) {
        return false;
      }

      if (car.dailyPrice > maxPrice) {
        return false;
      }

      if (availableOnly && car.status !== 'available') {
        return false;
      }

      return true;
    });
  }, [fleet, searchTerm, selectedCategory, selectedBrand, maxPrice, availableOnly]);

  const handleReset = () => {
    setSearchTerm('');
    setSelectedCategory('ALL');
    setSelectedBrand('All Brands');
    setMaxPrice(300);
    setAvailableOnly(false);
  };

  return (
    <div className="bg-slate-50 min-h-screen text-slate-900 pt-28 pb-20 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Every kind of vehicle
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            From city runabouts to safari Land Cruisers, with transparent daily rates.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          
          <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search models (e.g. Demio, Prado, V-Class, Hiace)..."
                className="w-full pl-10 pr-8 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`category-pill ${
                    selectedCategory === cat ? 'category-pill-active' : 'category-pill-inactive'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Secondary Filter Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-slate-100 text-xs">
            <div>
              <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Make / Brand</label>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full p-2 rounded-lg border border-slate-200 text-slate-700 focus:outline-none"
              >
                {BRANDS.map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between text-[10px] font-bold uppercase text-slate-500 mb-1">
                <span>Max Daily Rate:</span>
                <span className="font-bold text-slate-900">{formatPrice(maxPrice)}</span>
              </div>
              <input
                type="range"
                min={30}
                max={300}
                step={10}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>

            <div className="flex items-end justify-between gap-2">
              <label className="inline-flex items-center gap-2 cursor-pointer pb-2 text-xs font-semibold text-slate-700">
                <input
                  type="checkbox"
                  checked={availableOnly}
                  onChange={(e) => setAvailableOnly(e.target.checked)}
                  className="w-4 h-4 accent-blue-600 rounded"
                />
                <span>Available Now Only</span>
              </label>

              <button
                onClick={handleReset}
                className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors"
                title="Reset Filters"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

        {/* Vehicle Grid (4 columns) */}
        {filteredCars.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredCars.map(car => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 p-8 space-y-4">
            <Car className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="font-bold text-lg text-slate-800">No vehicles match your criteria</h3>
            <p className="text-xs text-slate-500">Try adjusting your category pill or price filter slider.</p>
            <button
              onClick={handleReset}
              className="btn-otto-primary text-xs py-2 px-5"
            >
              Reset Filters
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
