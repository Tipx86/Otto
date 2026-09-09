import React from 'react';
import { useApp } from '../context/AppContext';
import { Camera } from 'lucide-react';

export default function CarCard({ car }) {
  const { formatPrice, navigateTo, setBookingDraft } = useApp();

  const handleCardClick = () => {
    setBookingDraft(prev => ({
      ...prev,
      carId: car.id
    }));
    navigateTo('car-details', car.id);
  };

  const photoCount = car.images?.length || 1;

  return (
    <div
      onClick={handleCardClick}
      className="otto-car-card p-5 flex flex-col justify-between cursor-pointer group bg-white text-slate-900 select-none"
    >
      {/* Vehicle Studio Image with seamless backdrop, soft floor shadow & zoom */}
      <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-gradient-to-b from-slate-50/90 via-white to-slate-100/60 border border-slate-100/80 flex items-center justify-center p-3 mb-3">
        {/* Soft floor shadow under transparent vehicle */}
        <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 w-4/5 h-2.5 bg-slate-950/15 blur-[5px] rounded-[100%] pointer-events-none transition-all duration-500 group-hover:scale-95 group-hover:opacity-70" />

        <img
          src={car.images?.[0]}
          alt={car.name}
          className="w-full h-full object-contain relative z-10 filter drop-shadow-[0_4px_10px_rgba(0,0,0,0.06)] transition-all duration-500 ease-out group-hover:scale-105 group-hover:-translate-y-1.5"
          loading="lazy"
        />

        {photoCount > 1 && (
          <div className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold flex items-center gap-1 shadow-sm opacity-90 group-hover:opacity-100 z-20">
            <Camera className="w-3 h-3 text-blue-400" />
            <span>{photoCount} Photos</span>
          </div>
        )}
      </div>

      {/* Car Info matching screenshot */}
      <div className="space-y-1">
        <h3 className="font-bold text-sm text-slate-900 group-hover:text-blue-600 transition-colors leading-tight">
          {car.name}
        </h3>
        <p className="text-xs text-slate-500 line-clamp-1">
          {car.model || `${car.brand} or similar`}
        </p>
        <div className="pt-2 font-bold text-sm text-slate-900">
          {formatPrice(car.dailyPrice, car.kshPrice)}<span className="text-xs font-normal text-slate-500">/day</span>
        </div>
      </div>
    </div>
  );
}
