/**
 * Google Analytics 4 (GA4) Integration
 * Production-ready utility for Otto / EliteRide
 *
 * Requirements fulfilled:
 * - Uses environment variable VITE_GA_MEASUREMENT_ID
 * - Single-load Google tag (gtag.js) script with duplicate prevention
 * - SPA page-view tracking (no duplicate initial loads)
 * - Standard GA4 recommended ecommerce and lead events
 * - Zero PII leakage (strips sensitive personal fields)
 * - Safe graceful degradation if ID is absent or ad-blocked
 */

export const GA_MEASUREMENT_ID = (import.meta.env.VITE_GA_MEASUREMENT_ID || '').trim();

const isBrowser = typeof window !== 'undefined';
const isDev = Boolean(import.meta.env.DEV);

// Disallowed parameter keys that could contain PII or secrets
const SENSITIVE_KEYS = new Set([
  'fullname',
  'name',
  'firstname',
  'lastname',
  'email',
  'phone',
  'phonenumber',
  'mpesaphone',
  'pin',
  'password',
  'token',
  'secret',
  'card',
  'creditcard',
  'cvv',
  'nationalid',
  'idnumber'
]);

// Initialize dataLayer and gtag shim immediately in browser
if (isBrowser) {
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () {
    window.dataLayer.push(arguments);
  };
}

/**
 * Strips any sensitive or PII fields from analytics parameters.
 */
function sanitizeParams(params = {}) {
  if (!params || typeof params !== 'object') return {};
  const sanitized = {};

  for (const [key, val] of Object.entries(params)) {
    const lowerKey = key.toLowerCase();
    if (SENSITIVE_KEYS.has(lowerKey)) {
      continue;
    }
    if (val && typeof val === 'object' && !Array.isArray(val)) {
      sanitized[key] = sanitizeParams(val);
    } else if (Array.isArray(val)) {
      sanitized[key] = val.map(item => (typeof item === 'object' ? sanitizeParams(item) : item));
    } else {
      sanitized[key] = val;
    }
  }

  return sanitized;
}

/**
 * Initializes Google Analytics 4.
 * Safe to call multiple times; only executes once.
 */
export function initGA() {
  if (!isBrowser) return;

  // Gracefully exit if Measurement ID is missing or invalid
  if (!GA_MEASUREMENT_ID || !GA_MEASUREMENT_ID.startsWith('G-')) {
    if (isDev) {
      console.warn('[GA4] VITE_GA_MEASUREMENT_ID is missing or not a valid G- ID. Tracking is disabled.');
    }
    return;
  }

  // Prevent duplicate script injection or initialization
  if (window.__ga_initialized || document.querySelector(`script[src*="googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}"]`)) {
    window.__ga_initialized = true;
    return;
  }

  try {
    // 1. Initialize dataLayer and gtag shim
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () {
      window.dataLayer.push(arguments);
    };

    window.gtag('js', new Date());

    // Configure GA4 with send_page_view: false for custom SPA routing control
    window.gtag('config', GA_MEASUREMENT_ID, {
      send_page_view: false,
      cookie_flags: 'SameSite=None;Secure'
    });

    // 2. Inject official Google tag script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_MEASUREMENT_ID)}`;
    script.onerror = () => {
      console.warn('[GA4] Failed to load gtag.js (possibly ad-blocked). App continues normally.');
    };

    document.head.appendChild(script);
    window.__ga_initialized = true;

    if (isDev) {
      console.info(`[GA4] Initialized successfully with ID: ${GA_MEASUREMENT_ID}`);
    }
  } catch (err) {
    // Analytics failure should never crash the host application
    console.warn('[GA4] Initialization error:', err);
  }
}

/**
 * Generic safe event dispatcher
 */
export function trackEvent(eventName, params = {}) {
  if (!isBrowser || !GA_MEASUREMENT_ID) {
    return;
  }

  // Ensure GA is initialized
  if (!window.__ga_initialized) {
    initGA();
  }

  if (typeof window.gtag !== 'function') {
    return;
  }

  try {
    const cleanParams = sanitizeParams(params);
    window.gtag('event', eventName, cleanParams);

    if (isDev) {
      console.debug(`[GA4 Event] ${eventName}`, cleanParams);
    }
  } catch (err) {
    // Silent fail in production
    if (isDev) {
      console.warn(`[GA4] Failed to track event "${eventName}":`, err);
    }
  }
}

/**
 * Track SPA Route / Page View
 */
export function trackPageView(pagePath, pageTitle) {
  if (!isBrowser) return;

  const path = pagePath || window.location.pathname + window.location.search;
  const title = pageTitle || document.title;
  const location = window.location.origin + path;

  trackEvent('page_view', {
    page_path: path,
    page_title: title,
    page_location: location
  });
}

/**
 * Recommended GA4 Events:
 */

/**
 * 1. view_item — Vehicle detail viewed
 */
export function trackViewItem(car) {
  if (!car) return;
  trackEvent('view_item', {
    currency: 'KES',
    value: car.kshPrice || 0,
    items: [
      {
        item_id: car.id,
        item_name: car.name,
        item_category: car.category || 'Rental',
        item_brand: car.brand || 'Vehicle',
        price: car.kshPrice || 0,
        quantity: 1
      }
    ]
  });
}

/**
 * 2. select_item — Car card clicked from fleet catalog
 */
export function trackSelectItem(car, listName = 'Fleet Catalog') {
  if (!car) return;
  trackEvent('select_item', {
    item_list_name: listName,
    items: [
      {
        item_id: car.id,
        item_name: car.name,
        item_category: car.category || 'Rental',
        item_brand: car.brand || 'Vehicle',
        price: car.kshPrice || 0,
        quantity: 1
      }
    ]
  });
}

/**
 * 3. search — Location / date / keyword search
 */
export function trackSearch(searchTerm, extraParams = {}) {
  if (!searchTerm) return;
  trackEvent('search', {
    search_term: String(searchTerm),
    ...extraParams
  });
}

/**
 * 4. begin_checkout — User enters booking funnel
 */
export function trackBeginCheckout(car, calculation = {}) {
  if (!car) return;
  const value = calculation.grandTotalKsh || car.kshPrice || 0;
  trackEvent('begin_checkout', {
    currency: 'KES',
    value,
    items: [
      {
        item_id: car.id,
        item_name: car.name,
        item_category: car.category || 'Rental',
        price: car.kshPrice || 0,
        quantity: 1
      }
    ]
  });
}

/**
 * 5. purchase — Booking finalized and sent to WhatsApp concierge
 * Strictly no customer PII (phone/email/name) sent to GA4
 */
export function trackPurchase(booking) {
  if (!booking) return;
  const total = booking.pricing?.grandTotalKsh || 0;
  trackEvent('purchase', {
    transaction_id: booking.id,
    value: total,
    currency: 'KES',
    rental_days: booking.dates?.days || 1,
    items: [
      {
        item_id: booking.carId,
        item_name: booking.carName,
        price: total,
        quantity: 1
      }
    ]
  });
}

/**
 * 6. generate_lead — Concierge contact form submission
 * Strictly no personal details
 */
export function trackGenerateLead(leadType = 'General Inquiry', leadSource = 'Contact Form') {
  trackEvent('generate_lead', {
    lead_type: leadType,
    lead_source: leadSource
  });
}

/**
 * 7. add_to_wishlist — Saved vehicle to collection
 */
export function trackAddToWishlist(car) {
  if (!car) return;
  trackEvent('add_to_wishlist', {
    currency: 'KES',
    value: car.kshPrice || 0,
    items: [
      {
        item_id: car.id,
        item_name: car.name,
        item_category: car.category || 'Rental',
        price: car.kshPrice || 0,
        quantity: 1
      }
    ]
  });
}

/**
 * 8. login — Admin authentication event
 */
export function trackLogin(method = 'PIN') {
  trackEvent('login', {
    method
  });
}

// Auto-initialize when loaded in browser if valid Measurement ID is present
if (isBrowser && GA_MEASUREMENT_ID && GA_MEASUREMENT_ID.startsWith('G-')) {
  initGA();
}
