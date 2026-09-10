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

const getInitialPage = () => {
  if (typeof window === 'undefined') return 'home';
  const path = window.location.pathname.replace(/^\/+|\/+$/g, '').toLowerCase();
  if (path === 'admin') return 'admin';
  if (path === 'fleet' || path === 'cars') return 'fleet';
  if (path === 'booking') return 'booking';
  if (path === 'contact') return 'contact';
  if (path === 'about') return 'about';
  if (path === 'faqs') return 'faqs';
  return 'home';
};

export function AppProvider({ children }) {
  // Navigation State
  const [currentPage, setCurrentPage] = useState(getInitialPage);
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

  // Helper to purge legacy brand strings
  const sanitizeContent = (c) => {
    if (!c || typeof c !== 'object') return c;
    const brand = { ...c.brand };
    if (brand.email && (brand.email.toLowerCase().includes('eliteride') || brand.email.toLowerCase().includes('ottorental.co.ke'))) {
      brand.email = 'hello@ottorental.com';
    }
    if (brand.name && brand.name.toLowerCase().includes('eliteride')) {
      brand.name = 'OttoRental';
    }
    return { ...c, brand };
  };

  // Persistence: Site Content (CMS)
  const [siteContent, setSiteContent] = useState(() => 
    sanitizeContent(getInitialSync(STORAGE_KEYS.SITE_CONTENT, INITIAL_SITE_CONTENT))
  );

  // Persistence: Inquiries
  const [inquiries, setInquiries] = useState(() => 
    getInitialSync(STORAGE_KEYS.INQUIRIES, [])
  );

  // Persistence: Currency
  const [currency, setCurrency] = useState(() => 
    getInitialSync(STORAGE_KEYS.CURRENCY, 'KSH')
  );

  // Persistence: Wishlist
  const [wishlist, setWishlist] = useState(() => 
    getInitialSync(STORAGE_KEYS.WISHLIST, ['premium-suv-prado', 'luxury-suv-lc300'])
  );

  // Cloud Sync Status
  const [cloudSyncStatus, setCloudSyncStatus] = useState({
    configured: false,
    blobConfigured: false,
    source: 'local',
    lastSync: null,
    syncing: false
  });

  // Hydrate from Local Storage first, then check Cloud KV for Cross-Device Synchronization
  useEffect(() => {
    let isMounted = true;

    async function hydrateStorageAndCloud() {
      // 1. Instant local IndexedDB hydration
      try {
        const idbFleet = await loadFromIndexedDB(STORAGE_KEYS.FLEET);
        if (isMounted && idbFleet && Array.isArray(idbFleet) && idbFleet.length > 0) {
          setFleet(idbFleet);
        }
        const idbBookings = await loadFromIndexedDB(STORAGE_KEYS.BOOKINGS);
        if (isMounted && idbBookings && Array.isArray(idbBookings)) {
          setBookings(idbBookings);
        }
        const idbContent = await loadFromIndexedDB(STORAGE_KEYS.SITE_CONTENT);
        if (isMounted && idbContent && typeof idbContent === 'object') {
          setSiteContent(sanitizeContent(idbContent));
        }
        const idbInquiries = await loadFromIndexedDB(STORAGE_KEYS.INQUIRIES);
        if (isMounted && idbInquiries && Array.isArray(idbInquiries)) {
          setInquiries(idbInquiries);
        }
      } catch (err) {
        console.warn('[Storage] Local hydration warning:', err);
      }

      // 2. Fetch master state from Cloud KV (cross-device sync)
      try {
        const fleetRes = await fetch('/api/fleet');
        if (fleetRes.ok) {
          const json = await fleetRes.json();
          if (isMounted) {
            setCloudSyncStatus(prev => ({
              ...prev,
              configured: Boolean(json.configured),
              blobConfigured: Boolean(json.blobConfigured),
              source: json.source || 'local'
            }));

            // If cloud has master inventory, sync to this device!
            if (json.source === 'cloud' && Array.isArray(json.data) && json.data.length > 0) {
              setFleet(json.data);
              await savePersistent(STORAGE_KEYS.FLEET, json.data);
              setCloudSyncStatus(prev => ({
                ...prev,
                lastSync: new Date().toLocaleTimeString()
              }));
            }
          }
        }

        // Fetch master CMS content from cloud
        const contentRes = await fetch('/api/content');
        if (contentRes.ok) {
          const contentJson = await contentRes.json();
          if (isMounted && contentJson.source === 'cloud' && contentJson.data) {
            const clean = sanitizeContent(contentJson.data);
            setSiteContent(clean);
            await savePersistent(STORAGE_KEYS.SITE_CONTENT, clean);
          }
        }

        // Fetch master bookings from cloud
        const bookingsRes = await fetch('/api/bookings');
        if (bookingsRes.ok) {
          const bookingsJson = await bookingsRes.json();
          if (isMounted && bookingsJson.configured && Array.isArray(bookingsJson.data) && bookingsJson.data.length > 0) {
            setBookings(bookingsJson.data);
            await savePersistent(STORAGE_KEYS.BOOKINGS, bookingsJson.data);
          }
        }

        // Fetch master inquiries from cloud
        const inqRes = await fetch('/api/inquiries');
        if (inqRes.ok) {
          const inqJson = await inqRes.json();
          if (isMounted && inqJson.configured && Array.isArray(inqJson.data) && inqJson.data.length > 0) {
            setInquiries(inqJson.data);
            await savePersistent(STORAGE_KEYS.INQUIRIES, inqJson.data);
          }
        }
      } catch (err) {
        // Dev server or offline
        console.info('[Cloud Sync] Running in local offline mode:', err.message);
      }
    }

    hydrateStorageAndCloud();
    return () => { isMounted = false; };
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

  // Cloud Synchronization Handlers
  const syncFleetToCloud = async (overrideFleet = null) => {
    const dataToSend = overrideFleet || fleet;
    setCloudSyncStatus(prev => ({ ...prev, syncing: true }));
    try {
      const res = await fetch('/api/fleet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fleet: dataToSend })
      });
      const json = await res.json();
      if (json.configured) {
        if (json.data && Array.isArray(json.data)) {
          setFleet(json.data);
          await savePersistent(STORAGE_KEYS.FLEET, json.data);
        }
        setCloudSyncStatus({
          configured: true,
          blobConfigured: Boolean(json.blobConfigured),
          source: 'cloud',
          lastSync: new Date().toLocaleTimeString(),
          syncing: false
        });
        showToast(
          json.blobConfigured 
            ? 'Fleet & HD photos successfully synced to Cloud & Blob CDN!' 
            : 'Fleet synced to Vercel KV database!', 
          'success'
        );
        return true;
      } else {
        setCloudSyncStatus({
          configured: false,
          blobConfigured: Boolean(json.blobConfigured),
          source: 'local',
          lastSync: null,
          syncing: false
        });
        showToast('Saved locally. Connect Vercel KV in your Vercel Dashboard to sync to all devices.', 'info');
        return false;
      }
    } catch (err) {
      setCloudSyncStatus(prev => ({ ...prev, syncing: false }));
      console.warn('[Cloud Sync] Failed:', err);
      return false;
    }
  };

  const syncContentToCloud = async (overrideContent = null) => {
    const dataToSend = overrideContent || siteContent;
    try {
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ siteContent: dataToSend })
      });
      const json = await res.json();
      if (json.configured) {
        if (json.data && typeof json.data === 'object') {
          setSiteContent(json.data);
          await savePersistent(STORAGE_KEYS.SITE_CONTENT, json.data);
        }
        showToast('Website content synced to cloud database!', 'success');
      }
    } catch (err) {
      console.warn('[Content Cloud Sync] Failed:', err);
    }
  };

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

  // Popstate listener for back/forward browser navigation
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPage(getInitialPage());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Navigation Helper
  const navigateTo = (page, carId = null) => {
    if (carId) setSelectedCarId(carId);
    setCurrentPage(page);
    try {
      const url = page === 'home' ? '/' : `/${page}`;
      if (window.location.pathname !== url) {
        window.history.pushState(null, '', url);
      }
    } catch {}
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

  // Fleet CRUD Actions (Admin) with automatic cloud sync
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
    const updatedFleet = [car, ...fleet];
    setFleet(updatedFleet);
    syncFleetToCloud(updatedFleet);
    showToast(`Vehicle "${car.name}" added to the fleet catalog!`, 'success');
    return car;
  };

  const updateCar = (carId, updatedFields) => {
    const updatedFleet = fleet.map(car => car.id === carId ? { ...car, ...updatedFields } : car);
    setFleet(updatedFleet);
    syncFleetToCloud(updatedFleet);
    showToast('Vehicle details updated successfully.', 'success');
  };

  const deleteCar = (carId) => {
    const updatedFleet = fleet.filter(car => car.id !== carId);
    setFleet(updatedFleet);
    syncFleetToCloud(updatedFleet);
    showToast('Vehicle removed from the fleet system.', 'gold');
  };

  const toggleCarStatus = (carId, newStatus) => {
    const updatedFleet = fleet.map(car => car.id === carId ? { ...car, status: newStatus } : car);
    setFleet(updatedFleet);
    syncFleetToCloud(updatedFleet);
    showToast(`Vehicle status updated to: ${newStatus.toUpperCase()}`, 'info');
  };

  const toggleCarBlockedDate = (carId, dateStr) => {
    const updatedFleet = fleet.map(car => {
      if (car.id !== carId) return car;
      const currentBlocked = car.blockedDates || [];
      const exists = currentBlocked.includes(dateStr);
      const newBlocked = exists ? currentBlocked.filter(d => d !== dateStr) : [...currentBlocked, dateStr];
      return { ...car, blockedDates: newBlocked };
    });
    setFleet(updatedFleet);
    syncFleetToCloud(updatedFleet);
  };

  // Bookings CRUD
  const addBooking = (newBookingData) => {
    const refCode = `OTTO-${Math.floor(10000 + Math.random() * 90000)}`;
    const fullBooking = {
      id: refCode,
      createdAt: new Date().toISOString(),
      status: 'Pending',
      ...newBookingData
    };
    setBookings(prev => [fullBooking, ...prev]);

    // Push reservation to cloud
    try {
      fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ booking: fullBooking })
      }).catch(() => {});
    } catch {}

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

  // Inquiries Handling
  const addInquiry = async (inquiryData) => {
    const newInquiry = {
      id: `INQ-${Math.floor(10000 + Math.random() * 90000)}`,
      createdAt: new Date().toISOString(),
      status: 'pending',
      ...inquiryData
    };
    const updated = [newInquiry, ...inquiries];
    setInquiries(updated);
    await savePersistent(STORAGE_KEYS.INQUIRIES, updated);

    // Sync to Cloud KV
    try {
      fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inquiry: newInquiry })
      }).catch(() => {});
    } catch {}

    return newInquiry;
  };

  const deleteInquiry = async (inquiryId) => {
    const updated = inquiries.filter(i => i.id !== inquiryId);
    setInquiries(updated);
    await savePersistent(STORAGE_KEYS.INQUIRIES, updated);
    showToast(`Inquiry ${inquiryId} archived.`, 'info');
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
    syncContentToCloud(newContent);
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
      syncFleetToCloud(INITIAL_CARS);
      syncContentToCloud(INITIAL_SITE_CONTENT);
    } catch {}
    showToast('All fleet and site content reset to Otto defaults.', 'gold');
  };

  const downloadInitialDataJS = () => {
    const fileContent = `// Otto / OTTORENTAL Master Fleet Catalog & Configuration
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
      if (parsed.fleet) {
        setFleet(parsed.fleet);
        syncFleetToCloud(parsed.fleet);
      }
      if (parsed.bookings) setBookings(parsed.bookings);
      if (parsed.siteContent) {
        setSiteContent(parsed.siteContent);
        syncContentToCloud(parsed.siteContent);
      }
      showToast('Backup restored and pushed to cloud!', 'success');
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
        downloadInitialDataJS,
        cloudSyncStatus,
        syncFleetToCloud,
        syncContentToCloud,
        inquiries,
        addInquiry,
        deleteInquiry
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
