import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import confetti from 'canvas-confetti';
import { trackPurchase } from '../utils/analytics';
import { 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  CreditCard, 
  ShieldCheck, 
  Printer, 
  MessageCircle,
  Smartphone,
  CheckCircle2,
  Building,
  User,
  Car
} from 'lucide-react';

export default function BookingPage() {
  const { 
    fleet, 
    formatPrice, 
    bookingDraft, 
    setBookingDraft, 
    addBooking, 
    navigateTo, 
    siteContent 
  } = useApp();

  const [step, setStep] = useState(1);
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [weekendPolicyError, setWeekendPolicyError] = useState('');

  // Form State
  const [carId, setCarId] = useState(bookingDraft.carId || fleet[0]?.id || 'premium-suv-prado');
  const [rentalMode, setRentalMode] = useState(bookingDraft.rentalMode || 'self-drive');
  const [pickupDate, setPickupDate] = useState(bookingDraft.pickupDate || '2026-09-15');
  const [returnDate, setReturnDate] = useState(bookingDraft.returnDate || '2026-09-18');
  const [pickupTime, setPickupTime] = useState(bookingDraft.pickupTime || '10:00');
  const [returnTime, setReturnTime] = useState(bookingDraft.returnTime || '18:00');
  const [pickupLocation, setPickupLocation] = useState(bookingDraft.pickupLocation || 'Nairobi');
  const [dropoffLocation, setDropoffLocation] = useState(bookingDraft.dropoffLocation || 'Same as start');

  // Add-ons State (all default to false so Self Drive shows pure base rate)
  const [chauffeur, setChauffeur] = useState(
    rentalMode === 'chauffeured' ? true : Boolean(bookingDraft.chauffeur)
  );
  const [fullProtection, setFullProtection] = useState(Boolean(bookingDraft.fullProtection));
  const [airportMeet, setAirportMeet] = useState(Boolean(bookingDraft.airportMeet));
  const [childSeat, setChildSeat] = useState(Boolean(bookingDraft.childSeat));

  // Passenger Identification & Payment
  const [fullName, setFullName] = useState(bookingDraft.fullName || '');
  const [email, setEmail] = useState(bookingDraft.email || '');
  const [phone, setPhone] = useState(bookingDraft.phone || '');
  const [paymentMethod, setPaymentMethod] = useState('mpesa'); // 'mpesa' | 'card' | 'invoice'
  const [mpesaPhone, setMpesaPhone] = useState(bookingDraft.mpesaPhone || '');
  const [specialRequests, setSpecialRequests] = useState(bookingDraft.specialRequests || '');

  const [errors, setErrors] = useState({});

  const selectedCar = fleet.find(c => c.id === carId) || fleet[0];

  // ── Weekend Minimum Booking Policy ────────────────────────────────────────
  // Returns the minimum required days if the booking overlaps a weekend
  // (Friday=5, Saturday=6, Sunday=0), or 0 if no weekend overlap.
  const getWeekendMinimum = (start, end, dailyRateKsh) => {
    const s = new Date(start);
    const e = new Date(end);
    // Walk each day in the range to detect any Fri/Sat/Sun
    let hasWeekend = false;
    const cursor = new Date(s);
    while (cursor <= e) {
      const dow = cursor.getDay(); // 0=Sun,1=Mon,...,5=Fri,6=Sat
      if (dow === 0 || dow === 5 || dow === 6) {
        hasWeekend = true;
        break;
      }
      cursor.setDate(cursor.getDate() + 1);
    }
    if (!hasWeekend) return 0;
    if (dailyRateKsh < 7000) return 3;
    if (dailyRateKsh <= 20000) return 2;
    return 0; // no restriction for >20,000
  };

  const validateStep1AndContinue = () => {
    setWeekendPolicyError('');
    const rate = selectedCar?.kshPrice || 0;
    const minDays = getWeekendMinimum(pickupDate, returnDate, rate);
    if (minDays > 0 && calculation.days < minDays) {
      const rateLabel =
        rate < 7000
          ? 'vehicles under KSh 7,000/day'
          : 'vehicles priced KSh 7,000 – 20,000/day';
      setWeekendPolicyError(
        `Weekend policy: ${rateLabel} require a minimum of ${minDays} days when booking includes a Friday, Saturday, or Sunday. Your current selection is only ${calculation.days} day${calculation.days !== 1 ? 's' : ''}.`
      );
      return;
    }
    setStep(2);
  };

  // Pricing Calculation
  const calculation = useMemo(() => {
    if (!selectedCar) return { days: 1, baseSubtotal: 0, addOnsTotal: 0, grandTotal: 0 };
    
    const start = new Date(pickupDate);
    const end = new Date(returnDate);
    const diffTime = Math.max(1000 * 60 * 60 * 24, end.getTime() - start.getTime());
    const days = Math.max(1, Math.round(diffTime / (1000 * 60 * 60 * 24)));

    const baseKsh = days * (selectedCar.kshPrice || 4000);
    const baseSubtotal = days * selectedCar.dailyPrice;

    let addOnsKsh = 0;
    let addOns = [];

    // Chauffeur is KSh 2,500/day for all vehicles (only added if chauffeured mode or opted in)
    const isChauffeurActive = rentalMode === 'chauffeured' || chauffeur;
    if (isChauffeurActive) {
      const p = 2500 * days;
      addOnsKsh += p;
      addOns.push({ name: 'Professional Chauffeur', price: 2500, days });
    }
    if (fullProtection) {
      const p = 1200 * days;
      addOnsKsh += p;
      addOns.push({ name: 'Zero Excess Damage Waiver', price: 1200, days });
    }
    if (airportMeet) {
      addOnsKsh += 2000;
      addOns.push({ name: 'Airport VIP Meet & Greet', price: 2000, days: 1 });
    }
    if (childSeat) {
      const p = 500 * days;
      addOnsKsh += p;
      addOns.push({ name: 'Child Safety Seat', price: 500, days });
    }

    const grandTotalKsh = baseKsh + addOnsKsh;
    const grandTotalUSD = baseSubtotal + Math.round(addOnsKsh / 128.5);

    return {
      days,
      baseKsh,
      baseSubtotal,
      addOns,
      addOnsKsh,
      grandTotalKsh,
      grandTotalUSD,
      securityDeposit: selectedCar.securityDeposit
    };
  }, [selectedCar, pickupDate, returnDate, chauffeur, rentalMode, fullProtection, airportMeet, childSeat]);

  const validateStep3 = () => {
    const errs = {};
    if (!fullName.trim()) errs.fullName = 'Full name is required';
    if (!email.trim() || !email.includes('@')) errs.email = 'Valid email is required';
    if (!phone.trim()) errs.phone = 'Phone number is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const getFormattedWhatsAppMessage = (bookingObj) => {
    const addOnsText = calculation.addOns.length > 0 
      ? calculation.addOns.map(a => `  • ${a.name} (${formatPrice(Math.round(a.price / 128.5), a.price * (a.days || 1))})`).join('\n')
      : '  • Standard Comprehensive Cover';

    return `*NEW OTTORENTAL BOOKING REQUEST* 🚗✨
━━━━━━━━━━━━━━━━━━━━━
🔖 *Booking Ref:* ${bookingObj.id}
🚘 *Vehicle:* ${selectedCar.name} (${selectedCar.category})
⚙️ *Rental Mode:* ${rentalMode === 'chauffeured' || chauffeur ? 'With Chauffeur' : 'Self-Drive'}

📅 *Dates:* ${pickupDate} to ${returnDate} (${calculation.days} Days)
⏰ *Times:* ${pickupTime} - ${returnTime}
📍 *Pickup Location:* ${pickupLocation}
🏁 *Return Location:* ${dropoffLocation}

🛡️ *Add-ons & Options:*
${addOnsText}

👤 *PASSENGER DETAILS:*
• *Name:* ${fullName}
• *Phone:* ${phone}
• *Email:* ${email}
${specialRequests ? `• *Special Requests:* ${specialRequests}\n` : ''}
💰 *TOTAL AMOUNT:*
• *Kenya Shillings:* KSh ${calculation.grandTotalKsh.toLocaleString()}
• *USD Equivalent:* $${calculation.grandTotalUSD}
━━━━━━━━━━━━━━━━━━━━━
Hello OTTORENTAL Concierge, I have submitted this reservation and would like to confirm vehicle availability and handover.`;
  };

  const handleSubmitBooking = (e) => {
    e.preventDefault();
    if (!validateStep3()) return;

    const newBooking = addBooking({
      carId: selectedCar.id,
      carName: selectedCar.name,
      customer: {
        fullName,
        email,
        phone,
        mpesaPhone: phone,
        paymentMethod: 'whatsapp',
        pickupLocation,
        dropoffLocation,
        specialRequests
      },
      dates: {
        pickupDate,
        pickupTime,
        returnDate,
        returnTime,
        days: calculation.days
      },
      pricing: {
        dailyRate: selectedCar.dailyPrice,
        grandTotal: calculation.grandTotalUSD,
        grandTotalKsh: calculation.grandTotalKsh,
        securityDeposit: selectedCar.securityDeposit,
        currency: 'KSH'
      },
      addOns: calculation.addOns
    });

    trackPurchase(newBooking);
    setConfirmedBooking(newBooking);
    setStep(4);

    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (err) {}

    // Open WhatsApp directly with full booking manifest prefilled
    const waNumber = (siteContent.brand?.whatsapp || '254119317161').replace(/[^0-9]/g, '');
    const waText = getFormattedWhatsAppMessage(newBooking);
    const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(waText)}`;
    
    // Open in a new tab/window
    window.open(waUrl, '_blank');
  };

  return (
    <div className="bg-slate-50 min-h-screen text-slate-900 pt-28 pb-20 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {step === 4 ? 'Booking Request Submitted!' : 'Reserve your vehicle'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            {step === 4 
              ? 'Your booking details have been submitted and sent to our WhatsApp Concierge desk.'
              : 'Verified operators, transparent pricing, direct WhatsApp reservation.'}
          </p>
        </div>

        {/* Stepper (1 to 3) */}
        {step < 4 && (
          <div className="max-w-xl mx-auto flex items-center justify-between relative px-2">
            <div className="absolute top-4 left-6 right-6 h-0.5 bg-slate-200 -translate-y-1/2 z-0"></div>
            {[
              { num: 1, title: 'Vehicle' },
              { num: 2, title: 'Add-ons' },
              { num: 3, title: 'Passenger Details' }
            ].map((item) => (
              <div key={item.num} className="relative z-10 flex flex-col items-center">
                <div 
                  className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                    step === item.num
                      ? 'bg-blue-600 text-white ring-4 ring-blue-100 shadow-md'
                      : step > item.num
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white border border-slate-300 text-slate-400'
                  }`}
                >
                  {step > item.num ? <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : item.num}
                </div>
                <span className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-wider mt-1.5 ${
                  step === item.num ? 'text-blue-600' : 'text-slate-400'
                }`}>
                  {item.title}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Flow Content */}
        {step < 4 ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Form Steps (7 cols) */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              
              {/* Step 1: Vehicle & Itinerary */}
              {step === 1 && (
                <div className="space-y-5 animate-fade-in">
                  <div className="border-b border-slate-100 pb-3">
                    <h3 className="font-bold text-base text-slate-900">
                      Step 1: Choose Vehicle & Schedule
                    </h3>
                  </div>

                  {/* Mode Toggle */}
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setRentalMode('self-drive');
                        setChauffeur(false);
                      }}
                      className={`p-3 rounded-xl text-xs font-bold border flex items-center justify-center gap-2 cursor-pointer transition-all ${
                        rentalMode === 'self-drive'
                          ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <Car className="w-4 h-4" />
                      <span>Self Drive</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setRentalMode('chauffeured');
                        setChauffeur(true);
                      }}
                      className={`p-3 rounded-xl text-xs font-bold border flex items-center justify-center gap-2 cursor-pointer transition-all ${
                        rentalMode === 'chauffeured'
                          ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <User className="w-4 h-4" />
                      <span>With Chauffeur (+KSh 2,500/day)</span>
                    </button>
                  </div>

                  {/* Vehicle Select */}
                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Select Vehicle</label>
                    <select
                      value={carId}
                      onChange={(e) => setCarId(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                    >
                      {fleet.map(c => (
                        <option key={c.id} value={c.id}>
                          {c.name} — {formatPrice(c.dailyPrice, c.kshPrice)}/day ({c.model || c.brand})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Locations */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Pick-up Location</label>
                      <select
                        value={pickupLocation}
                        onChange={(e) => setPickupLocation(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                      >
                        <option value="Nairobi">Nairobi</option>
                        <option value="JKIA Airport (Nairobi)">JKIA Airport Terminal 1A</option>
                        <option value="Wilson Airport (Nairobi)">Wilson Airport</option>
                        <option value="Mombasa">Mombasa</option>
                        <option value="Diani">Diani Beach</option>
                        <option value="Kisumu">Kisumu</option>
                        <option value="Malindi">Malindi</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Return Location</label>
                      <select
                        value={dropoffLocation}
                        onChange={(e) => setDropoffLocation(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                      >
                        <option value="Same as start">Same as start location</option>
                        <option value="Nairobi">Nairobi</option>
                        <option value="Mombasa">Mombasa</option>
                        <option value="Diani">Diani Beach</option>
                      </select>
                    </div>
                  </div>

                  {/* Dates & Times */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold uppercase text-slate-700 block mb-1">Start Date</label>
                      <div className="relative">
                        <input
                          type="date"
                          value={pickupDate}
                          onChange={(e) => { setPickupDate(e.target.value); setWeekendPolicyError(''); }}
                          onClick={(e) => e.target.showPicker && e.target.showPicker()}
                          className="w-full p-2.5 bg-slate-50 border border-slate-300 hover:border-blue-400 focus:border-blue-600 focus:bg-white rounded-xl text-xs font-bold text-slate-900 cursor-pointer transition-all"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase text-slate-700 block mb-1">Return Date</label>
                      <div className="relative">
                        <input
                          type="date"
                          value={returnDate}
                          onChange={(e) => { setReturnDate(e.target.value); setWeekendPolicyError(''); }}
                          onClick={(e) => e.target.showPicker && e.target.showPicker()}
                          className="w-full p-2.5 bg-slate-50 border border-slate-300 hover:border-blue-400 focus:border-blue-600 focus:bg-white rounded-xl text-xs font-bold text-slate-900 cursor-pointer transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Weekend Policy Error Banner */}
                  {weekendPolicyError && (
                    <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-amber-50 border border-amber-300 text-amber-800 text-xs animate-fade-in">
                      <Calendar className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                      <span className="font-semibold leading-relaxed">{weekendPolicyError}</span>
                    </div>
                  )}

                  <div className="pt-3 flex justify-end">
                    <button
                      type="button"
                      onClick={validateStep1AndContinue}
                      className="btn-otto-primary text-xs py-3 px-6"
                    >
                      <span>Continue to Add-ons</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Add-ons */}
              {step === 2 && (
                <div className="space-y-4 animate-fade-in">
                  <div className="border-b border-slate-100 pb-3">
                    <h3 className="font-bold text-base text-slate-900">
                      Step 2: Protection & Add-ons
                    </h3>
                  </div>

                  <div className="space-y-3">
                    <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer">
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={fullProtection}
                          onChange={(e) => setFullProtection(e.target.checked)}
                          className="w-4 h-4 accent-blue-600 rounded mt-0.5"
                        />
                        <div>
                          <span className="font-bold text-xs text-slate-900 block">Zero Excess Damage Waiver</span>
                          <span className="text-[11px] text-slate-500">Covers tires, glass, and bodywork with zero liability.</span>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-slate-900 whitespace-nowrap">+ KSh 1,200/day</span>
                    </label>

                    <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors">
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={chauffeur || rentalMode === 'chauffeured'}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            setChauffeur(checked);
                            setRentalMode(checked ? 'chauffeured' : 'self-drive');
                          }}
                          className="w-4 h-4 accent-blue-600 rounded mt-0.5 cursor-pointer"
                        />
                        <div>
                          <span className="font-bold text-xs text-slate-900 block">Vetted Driver / Chauffeur</span>
                          <span className="text-[11px] text-slate-500">Professional, smartly dressed driver for city or safari.</span>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-slate-900 whitespace-nowrap">+ KSh 2,500/day</span>
                    </label>

                    <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer">
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={airportMeet}
                          onChange={(e) => setAirportMeet(e.target.checked)}
                          className="w-4 h-4 accent-blue-600 rounded mt-0.5"
                        />
                        <div>
                          <span className="font-bold text-xs text-slate-900 block">Airport Terminal Meet & Greet</span>
                          <span className="text-[11px] text-slate-500">Driver awaits at arrivals with nameboard and assists with luggage.</span>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-slate-900 whitespace-nowrap">+ KSh 2,000 once</span>
                    </label>

                    <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer">
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={childSeat}
                          onChange={(e) => setChildSeat(e.target.checked)}
                          className="w-4 h-4 accent-blue-600 rounded mt-0.5"
                        />
                        <div>
                          <span className="font-bold text-xs text-slate-900 block">Child Safety Seat</span>
                          <span className="text-[11px] text-slate-500">Comfortable certified infant/toddler car seat.</span>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-slate-900 whitespace-nowrap">+ KSh 500/day</span>
                    </label>
                  </div>

                  <div className="pt-3 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="px-5 py-2.5 rounded-full border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="btn-otto-primary text-xs py-3 px-6"
                    >
                      <span>Continue to Details</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Passenger & Booking Details (Matching Screenshot 2) */}
              {step === 3 && (
                <form onSubmit={handleSubmitBooking} className="space-y-4 animate-fade-in">
                  <div className="border-b border-slate-100 pb-3">
                    <h3 className="font-bold text-base text-slate-900">
                      Step 3: Passenger Details
                    </h3>
                  </div>

                  {/* Personal Details Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                    <div className="sm:col-span-2">
                      <label className="text-[10px] font-bold uppercase text-slate-700 block mb-1">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Wanjiru Kariuki"
                        className={`w-full p-3 bg-slate-50 border rounded-xl text-xs font-semibold text-slate-900 ${
                          errors.fullName ? 'border-rose-500 ring-2 ring-rose-100' : 'border-slate-200 focus:border-blue-500'
                        }`}
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase text-slate-700 block mb-1">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="wanjiru@example.com"
                        className={`w-full p-3 bg-slate-50 border rounded-xl text-xs font-semibold text-slate-900 ${
                          errors.email ? 'border-rose-500 ring-2 ring-rose-100' : 'border-slate-200 focus:border-blue-500'
                        }`}
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase text-slate-700 block mb-1">Mobile Phone *</label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+254 712 345678"
                        className={`w-full p-3 bg-slate-50 border rounded-xl text-xs font-semibold text-slate-900 ${
                          errors.phone ? 'border-rose-500 ring-2 ring-rose-100' : 'border-slate-200 focus:border-blue-500'
                        }`}
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-[10px] font-bold uppercase text-slate-700 block mb-1">Special Requests / Destination</label>
                      <textarea
                        rows={3}
                        value={specialRequests}
                        onChange={(e) => setSpecialRequests(e.target.value)}
                        placeholder="e.g. Traveling to Masai Mara, early airport pickup..."
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="px-5 py-2.5 rounded-full border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="py-3.5 px-7 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs uppercase font-extrabold flex items-center gap-2 shadow-md hover:scale-[1.02] transition-all cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Confirm & Book via WhatsApp</span>
                    </button>
                  </div>
                </form>
              )}

            </div>

            {/* Right Summary Sidebar (5 cols) */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                <img
                  src={selectedCar.images?.[0]}
                  alt={selectedCar.name}
                  className="w-20 h-14 object-contain bg-slate-50 rounded-xl p-1"
                />
                <div>
                  <h4 className="font-bold text-sm text-slate-900">{selectedCar.name}</h4>
                  <span className="text-xs text-slate-500">{selectedCar.model || selectedCar.brand}</span>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-600">
                  <span>Duration:</span>
                  <span className="font-bold text-slate-900">{calculation.days} Days ({pickupDate} - {returnDate})</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span>Location:</span>
                  <span className="font-semibold text-slate-900">{pickupLocation}</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span>Base Rate:</span>
                  <span className="font-semibold">{formatPrice(calculation.baseSubtotal, calculation.baseKsh)}</span>
                </div>
                {calculation.addOnsKsh > 0 && (
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Add-ons:</span>
                    <span className="font-semibold">{formatPrice(Math.round(calculation.addOnsKsh / 128.5), calculation.addOnsKsh)}</span>
                  </div>
                )}
                <div className="pt-3 border-t border-slate-200 flex items-baseline justify-between text-sm font-bold text-slate-900">
                  <span>Total Amount:</span>
                  <span className="text-xl font-extrabold text-blue-600">
                    {formatPrice(calculation.grandTotalUSD, calculation.grandTotalKsh)}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-800 space-y-1">
                <div className="flex items-center gap-1.5 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Otto Transparent Guarantee</span>
                </div>
                <p>No hidden charges. Instant SMS & WhatsApp booking confirmation.</p>
              </div>
            </div>

          </div>
        ) : (
          /* Step 4: Confirmation Voucher */
          <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-xl space-y-6 text-slate-900 text-center animate-fade-in print:p-0 print:border-none print:shadow-none">
            
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <Check className="w-7 h-7 stroke-[3]" />
            </div>

            <div>
              <span className="text-xs uppercase font-bold text-slate-400">Booking Reference</span>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-wider font-mono">
                {confirmedBooking?.id}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Thank you, <strong className="text-slate-900">{confirmedBooking?.customer.fullName}</strong>. Your reservation is confirmed!
              </p>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-left space-y-3 text-xs">
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500 font-semibold">Vehicle:</span>
                <span className="font-bold text-slate-900">{confirmedBooking?.carName}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500 font-semibold">Dates:</span>
                <span className="text-slate-900">{confirmedBooking?.dates.pickupDate} to {confirmedBooking?.dates.returnDate} ({confirmedBooking?.dates.days} Days)</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500 font-semibold">Handover Location:</span>
                <span className="text-slate-900">{confirmedBooking?.customer.pickupLocation}</span>
              </div>
              <div className="flex justify-between pt-1 text-sm font-bold">
                <span>Total Amount:</span>
                <span className="text-blue-600 font-extrabold">{formatPrice(confirmedBooking?.pricing.grandTotal, confirmedBooking?.pricing.grandTotalKsh)}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2 print:hidden">
              <a
                href={`https://wa.me/${(siteContent.brand?.whatsapp || '254119317161').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(confirmedBooking ? getFormattedWhatsAppMessage(confirmedBooking) : 'Hello OTTORENTAL')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-6 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase flex items-center gap-2 shadow-md transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Open WhatsApp Chat</span>
              </a>

              <button
                onClick={() => navigateTo('home')}
                className="px-6 py-3 rounded-full border border-slate-300 hover:bg-slate-50 text-xs font-bold text-slate-700"
              >
                Back to Home
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
