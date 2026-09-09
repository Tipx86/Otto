import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_CARS, INITIAL_BOOKINGS, CURRENCY_RATES } from '../data/initialData';
import { INITIAL_SITE_CONTENT } from '../data/siteContent';

const AppContext = createContext();

export function AppProvider({ children }) {
  // Navigation State
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedCarId, setSelectedCarId] = useState('premium-suv-prado');
  const [quickViewCar, setQuickViewCar] = useState(null);

  // Persistence: Fleet
  const [fleet, setFleet] = useState(() => {
    try {
      const saved = localStorage.getItem('otto_fleet_v3');
      return saved ? JSON.parse(saved) : INITIAL_CARS;
    } catch {
      return INITIAL_CARS;
    }
  });

  // Persistence: Bookings
  const [bookings, setBookings] = useState(() => {
    try {
      const saved = localStorage.getItem('eliteride_bookings_v1');
      return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
    } catch {
      return INITIAL_BOOKINGS;
    }
  });

  // Persistence: Site Content (CMS)
  const [siteContent, setSiteContent] = useState(() => {
    try {
      const saved = localStorage.getItem('otto_site_content_v3');
      return saved ? JSON.parse(saved) : INITIAL_SITE_CONTENT;
    } catch {
      return INITIAL_SITE_CONTENT;
    }
  });

  // Persistence: Currency (default KSH matching the screenshot)
  const [currency, setCurrency] = useState(() => {
    try {
      return localStorage.getItem('eliteride_currency_v1') || 'KSH';
    } catch {
      return 'KSH';
    }
  });

  // Wishlist
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('eliteride_wishlist_v1');
      return saved ? JSON.parse(saved) : ['premium-suv-prado', 'luxury-suv-lc300'];
    } catch {
      return [];
    }
  });

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

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('otto_fleet_v3', JSON.stringify(fleet));
    } catch (e) {
      console.error('Failed to sync fleet:', e);
    }
  }, [fleet]);

  useEffect(() => {
    try {
      localStorage.setItem('otto_bookings_v2', JSON.stringify(bookings));
    } catch (e) {
      console.error('Failed to sync bookings:', e);
    }
  }, [bookings]);

  useEffect(() => {
    try {
      localStorage.setItem('otto_site_content_v3', JSON.stringify(siteContent));
    } catch (e) {
      console.error('Failed to sync site content:', e);
    }
  }, [siteContent]);

  useEffect(() => {
    try {
      localStorage.setItem('otto_currency_v2', currency);
    } catch (e) {
      console.error('Failed to sync currency:', e);
    }
  }, [currency]);

  useEffect(() => {
    try {
      localStorage.setItem('otto_wishlist_v2', JSON.stringify(wishlist));
    } catch (e) {
      console.error('Failed to sync wishlist:', e);
    }
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

  const resetToDefaults = () => {
    setFleet(INITIAL_CARS);
    setBookings(INITIAL_BOOKINGS);
    setSiteContent(INITIAL_SITE_CONTENT);
    localStorage.removeItem('otto_fleet_v2');
    localStorage.removeItem('otto_bookings_v2');
    localStorage.removeItem('otto_site_content_v2');
    showToast('All fleet and site content reset to Otto demo defaults.', 'gold');
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
        importBackupJSON
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
