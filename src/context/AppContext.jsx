import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_CARS, INITIAL_BOOKINGS, CURRENCY_RATES } from '../data/initialData';
import { INITIAL_SITE_CONTENT } from '../data/siteContent';
import { trackAddToWishlist, trackLogin } from '../utils/analytics';
import { 
  STORAGE_KEYS, 
  savePersistent, 
  getInitialSync, 
  loadFromIndexedDB 
} from '../utils/storage';

const AppContext = createContext();

export function AppProvider({ children }) {
  // Navigation State
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedCarId, setSelectedCarId] = useState('premium-suv-prado');
  const [quickViewCar, setQuickViewCar] = useState(null);

  // Persistence: Fleet (Immediate sync read + async IndexedDB hydration)
  const [fleet, setFleet] = useState(() => 
    getInitialSync(STORAGE_KEYS.FLEET, INITIAL_CARS)
  );

  // Persistence: Bookings
  const [bookings, setBookings] = useState(() => 
    getInitialSync(STORAGE_KEYS.BOOKINGS, INITIAL_BOOKINGS)
  );

  // Persistence: Site Content (CMS)
  const [siteContent, setSiteContent] = useState(() => 
    getInitialSync(STORAGE_KEYS.SITE_CONTENT, INITIAL_SITE_CONTENT)
  );

  // Persistence: Currency
  const [currency, setCurrency] = useState(() => 
    getInitialSync(STORAGE_KEYS.CURRENCY, 'KSH')
  );

  // Persistence: Wishlist
  const [wishlist, setWishlist] = useState(() => 
    getInitialSync(STORAGE_KEYS.WISHLIST, ['premium-suv-prado', 'luxury-suv-lc300'])
  );

  // Hydrate from IndexedDB on startup (loads high-res device photos & large catalogs safely)
  useEffect(() => {
    async function hydrateStorage() {
      try {
        const idbFleet = await loadFromIndexedDB(STORAGE_KEYS.FLEET);
        if (idbFleet && Array.isArray(idbFleet) && idbFleet.length > 0) {
          setFleet(idbFleet);
        }
        const idbBookings = await loadFromIndexedDB(STORAGE_KEYS.BOOKINGS);
        if (idbBookings && Array.isArray(idbBookings)) {
          setBookings(idbBookings);
        }
        const idbContent = await loadFromIndexedDB(STORAGE_KEYS.SITE_CONTENT);
        if (idbContent && typeof idbContent === 'object') {
          setSiteContent(idbContent);
        }
      } catch (err) {
        console.warn('[Storage] Hydration check failed:', err);
      }
    }
    hydrateStorage();
  }, []);

  // Admin Auth State (session)
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  // Global Toast
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' });

  const showToast = (message, type = 'gold') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 4000);
  };

  // Booking Draft
  const [bookingDraft, setBookingDraft] = useState({
    carId: 'premium-suv-prado',
    rentalMode: 'self-drive', // 'self-drive' | 'chauffeured'
    pickupDate: '2026-09-15',
    pickupTime: '10:00',
    returnDate: '2026-09-18',
    returnTime: '18:00',
    pickupLocation: 'Nairobi',
    dropoffLocation: 'Same as start',
    chauffeur: false,
    airportMeet: false,
    fullProtection: false,
    childSeat: false,
    wifiHotspot: false,
    additionalDriver: false,
    paymentMethod: 'mpesa', // 'mpesa' | 'card' | 'invoice'
    mpesaPhone: '',
    fullName: '',
    email: '',
    phone: '',
    flightNumber: '',
    specialRequests: ''
  });

  // Safe Dual-Layer Persistent Sync (IndexedDB + localStorage)
  useEffect(() => {
    savePersistent(STORAGE_KEYS.FLEET, fleet);
  }, [fleet]);

  useEffect(() => {
    savePersistent(STORAGE_KEYS.BOOKINGS, bookings);
  }, [bookings]);

  useEffect(() => {
    savePersistent(STORAGE_KEYS.SITE_CONTENT, siteContent);
  }, [siteContent]);

  useEffect(() => {
    savePersistent(STORAGE_KEYS.CURRENCY, currency);
  }, [currency]);

  useEffect(() => {
    savePersistent(STORAGE_KEYS.WISHLIST, wishlist);
  }, [wishlist]);

  // Price conversion helper (Supports KSh as prominent, USD, EUR, GBP, AED)
  const formatPrice = (amountUSD, customKsh = null) => {
    if (currency === 'KSH') {
      const ksh = customKsh || Math.round(amountUSD * 128.5);
      return `KSh ${ksh.toLocaleString()}`;
    }
    const info = CURRENCY_RATES[currency] || CURRENCY_RATES.USD;
    const converted = Math.round(amountUSD * info.rate);
    return `${info.symbol}${converted.toLocaleString()}`;
  };

  const getPriceNumber = (amountUSD, customKsh = null) => {
    if (currency === 'KSH') {
      return customKsh || Math.round(amountUSD * 128.5);
    }
    const info = CURRENCY_RATES[currency] || CURRENCY_RATES.USD;
    return Math.round(amountUSD * info.rate);
  };

  // Navigation Helper
  const navigateTo = (page, carId = null) => {
    if (carId) setSelectedCarId(carId);
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Wishlist toggle
  const toggleWishlist = (carId) => {
    setWishlist(prev => {
      const exists = prev.includes(carId);
      const updated = exists ? prev.filter(id => id !== carId) : [...prev, carId];
      if (!exists) {
        const car = fleet.find(c => c.id === carId);
        if (car) trackAddToWishlist(car);
      }
      showToast(exists ? 'Removed from saved vehicles' : 'Saved to your collection', 'gold');
      return updated;
    });
  };

  // Fleet CRUD Actions (Admin)
  const addCar = (newCarData) => {
    const id = newCarData.id || newCarData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now().toString().slice(-4);
    const car = {
      ...newCarData,
      id,
      rating: 5.0,
      reviewCount: 1,
      status: newCarData.status || 'available',
      blockedDates: newCarData.blockedDates || []
    };
    setFleet(prev => [car, ...prev]);
    showToast(`Vehicle "${car.name}" added to the fleet catalog!`, 'success');
    return car;
  };

  const updateCar = (carId, updatedFields) => {
    setFleet(prev => prev.map(car => car.id === carId ? { ...car, ...updatedFields } : car));
    showToast('Vehicle details updated successfully.', 'success');
  };

  const deleteCar = (carId) => {
    setFleet(prev => prev.filter(car => car.id !== carId));
    showToast('Vehicle removed from the fleet system.', 'gold');
  };

  const toggleCarStatus = (carId, newStatus) => {
    setFleet(prev => prev.map(car => car.id === carId ? { ...car, status: newStatus } : car));
    showToast(`Vehicle status updated to: ${newStatus.toUpperCase()}`, 'info');
  };

  const toggleCarBlockedDate = (carId, dateStr) => {
    setFleet(prev => prev.map(car => {
      if (car.id !== carId) return car;
      const currentBlocked = car.blockedDates || [];
      const exists = currentBlocked.includes(dateStr);
      const newBlocked = exists ? currentBlocked.filter(d => d !== dateStr) : [...currentBlocked, dateStr];
      return { ...car, blockedDates: newBlocked };
    }));
  };

  // Bookings CRUD
  const addBooking = (newBookingData) => {
    const refCode = `ELITE-${Math.floor(10000 + Math.random() * 90000)}`;
    const fullBooking = {
      id: refCode,
      createdAt: new Date().toISOString(),
      status: 'Pending',
      ...newBookingData
    };
    setBookings(prev => [fullBooking, ...prev]);
    return fullBooking;
  };

  const updateBookingStatus = (bookingId, newStatus) => {
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: newStatus } : b));
    showToast(`Reservation ${bookingId} status updated to ${newStatus}`, 'gold');
  };

  const deleteBooking = (bookingId) => {
    setBookings(prev => prev.filter(b => b.id !== bookingId));
    showToast(`Reservation ${bookingId} has been archived.`, 'info');
  };

  // Admin Auth
  const adminLogin = (enteredPin) => {
    const validPin = siteContent.brand.securityPin || '8888';
    if (enteredPin.trim() === validPin.trim()) {
      trackLogin('PIN');
      setIsAdminAuthenticated(true);
      showToast('Admin access authorized. Welcome.', 'success');
      return true;
    } else {
      showToast('Invalid Security PIN code.', 'error');
      return false;
    }
  };

  const adminLogout = () => {
    setIsAdminAuthenticated(false);
    showToast('Logged out of Admin Portal.', 'info');
  };

  // CMS Content Management
  const updateSiteContent = (newContent) => {
    setSiteContent(newContent);
    showToast('Website content updated live!', 'success');
  };

  const resetToDefaults = async () => {
    setFleet(INITIAL_CARS);
    setBookings(INITIAL_BOOKINGS);
    setSiteContent(INITIAL_SITE_CONTENT);
    try {
      localStorage.removeItem(STORAGE_KEYS.FLEET);
      localStorage.removeItem(STORAGE_KEYS.BOOKINGS);
      localStorage.removeItem(STORAGE_KEYS.SITE_CONTENT);
      localStorage.removeItem('otto_fleet_v3');
      localStorage.removeItem('otto_fleet_v2');
      await savePersistent(STORAGE_KEYS.FLEET, INITIAL_CARS);
      await savePersistent(STORAGE_KEYS.BOOKINGS, INITIAL_BOOKINGS);
      await savePersistent(STORAGE_KEYS.SITE_CONTENT, INITIAL_SITE_CONTENT);
    } catch {}
    showToast('All fleet and site content reset to Otto defaults.', 'gold');
  };

  const downloadInitialDataJS = () => {
    const fileContent = `// Otto / EliteRide Master Fleet Catalog & Configuration
// Generated from Admin Control Center
export const CURRENCY_RATES = ${JSON.stringify(CURRENCY_RATES, null, 2)};

export const INITIAL_CARS = ${JSON.stringify(fleet, null, 2)};

export const INITIAL_BOOKINGS = ${JSON.stringify(bookings, null, 2)};
`;
    const blob = new Blob([fileContent], { type: 'text/javascript;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'initialData.js';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    showToast('Downloaded updated initialData.js codebase file!', 'success');
  };

  const exportBackupJSON = () => {
    const backup = {
      version: '2.0',
      exportedAt: new Date().toISOString(),
      fleet,
      bookings,
      siteContent
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backup, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `otto_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Backup JSON exported successfully.', 'success');
  };

  const importBackupJSON = (jsonString) => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.fleet) setFleet(parsed.fleet);
      if (parsed.bookings) setBookings(parsed.bookings);
      if (parsed.siteContent) setSiteContent(parsed.siteContent);
      showToast('Backup restored successfully!', 'success');
      return true;
    } catch (err) {
      showToast('Invalid backup file format.', 'error');
      return false;
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        selectedCarId,
        setSelectedCarId,
        navigateTo,
        fleet,
        bookings,
        siteContent,
        currency,
        setCurrency,
        formatPrice,
        getPriceNumber,
        wishlist,
        toggleWishlist,
        quickViewCar,
        setQuickViewCar,
        bookingDraft,
        setBookingDraft,
        toast,
        showToast,
        isAdminAuthenticated,
        adminLogin,
        adminLogout,
        addCar,
        updateCar,
        deleteCar,
        toggleCarStatus,
        toggleCarBlockedDate,
        addBooking,
        updateBookingStatus,
        deleteBooking,
        updateSiteContent,
        resetToDefaults,
        exportBackupJSON,
        importBackupJSON,
        downloadInitialDataJS
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
