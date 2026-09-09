import { useEffect } from 'react';

/**
 * SeoHead — Injects dynamic JSON-LD structured data into <head>
 * for Google Rich Results (star ratings, prices, business info, FAQ).
 *
 * Usage: <SeoHead page="home" car={null} />
 */

const SITE_URL = 'https://ottorental.com';
const BRAND_NAME = 'EliteRide';
const PHONE = '+254 119 317161';
const EMAIL = 'reservations@ottorental.com';
const WHATSAPP = '+254 119 317161';

// ── Local Business Schema (shown on every page) ────────────────────────────
const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': ['LocalBusiness', 'CarRental'],
  name: BRAND_NAME,
  description:
    'Premium self-drive and chauffeured car hire in Kenya. Book a Toyota Prado, Land Cruiser, Mercedes, safari van, and more across Nairobi, Mombasa, Kisumu, and upcountry destinations.',
  url: SITE_URL,
  telephone: PHONE,
  email: EMAIL,
  logo: `${SITE_URL}/favicon.svg`,
  image: `${SITE_URL}/kisumu-lake.jpg`,
  priceRange: 'KSh 4,500 – KSh 35,000/day',
  currenciesAccepted: 'KES, USD',
  paymentAccepted: 'M-Pesa, Bank Transfer, Cash',
  openingHours: 'Mo-Su 06:00-22:00',
  areaServed: [
    { '@type': 'City', name: 'Nairobi' },
    { '@type': 'City', name: 'Mombasa' },
    { '@type': 'City', name: 'Kisumu' },
    { '@type': 'City', name: 'Diani' },
    { '@type': 'City', name: 'Malindi' },
    { '@type': 'Country', name: 'Kenya' },
  ],
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Nairobi',
    addressRegion: 'Nairobi County',
    addressCountry: 'KE',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: -1.2921,
    longitude: 36.8219,
  },
  sameAs: [
    `https://wa.me/${WHATSAPP.replace(/[^0-9]/g, '')}`,
  ],
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    reviewCount: '834',
    bestRating: '5',
    worstRating: '1',
  },
  hasMap: 'https://maps.google.com/?q=Nairobi+Kenya',
  knowsLanguage: ['en', 'sw'],
};

// ── FAQ Schema ─────────────────────────────────────────────────────────────
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Can I drive a rental car to Masai Mara or upcountry Kenya?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! All our SUVs, pickup trucks, and safari vehicles are approved for upcountry travel including Masai Mara, Amboseli, Samburu, and Tsavo. We recommend the Toyota Prado or Land Cruiser for safari routes.',
      },
    },
    {
      '@type': 'Question',
      name: 'What documents do I need to hire a self-drive car in Kenya?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'You need a valid national driving licence (or international driving permit for foreign visitors), national ID or passport, and a security deposit. Minimum age is 23 years.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do you offer airport pickup and drop-off in Nairobi?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. We offer VIP airport meet-and-greet at JKIA Terminal 1A and Wilson Airport in Nairobi. Add the Airport Meet & Greet option during booking for KSh 2,000.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the cheapest car hire rate in Nairobi?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Our economy small cars start from KSh 4,500 per day (approx. $35 USD). This includes comprehensive insurance and 24/7 roadside assistance.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I hire a car with a driver/chauffeur in Kenya?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. All our vehicles can be booked with a professional vetted chauffeur for an additional KSh 3,500 per day. Our drivers are licensed, background-checked, and experienced in both city and safari driving.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do you have safari vehicles for game drives?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. We have custom-built safari tour vans with pop-up game-viewing roofs and Toyota Land Cruiser 70 Series safari 4x4s. Both are equipped with cooler boxes, camera charging ports, and high ground clearance for Masai Mara, Amboseli, and Tsavo.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is there a minimum rental period?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The standard minimum is 1 day. For weekend bookings (Friday to Sunday), vehicles under KSh 7,000/day require a minimum of 3 days, and vehicles between KSh 7,000–20,000/day require a minimum of 2 days.',
      },
    },
  ],
};

// ── Website / WebSite Schema ───────────────────────────────────────────────
const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: BRAND_NAME,
  url: SITE_URL,
  description: 'Car hire and vehicle rental in Kenya — self-drive, safari, chauffeur.',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${SITE_URL}/?page=fleet&search={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
};

// ── Vehicle Schema (for individual car pages) ──────────────────────────────
const buildVehicleSchema = (car) => {
  if (!car) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${car.name} — ${car.model || car.brand}`,
    description: car.description || car.tagline,
    image: car.images || [],
    brand: {
      '@type': 'Brand',
      name: car.brand,
    },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'KES',
      price: car.kshPrice,
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        price: car.kshPrice,
        priceCurrency: 'KES',
        unitText: 'DAY',
      },
      availability: car.status === 'available'
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: BRAND_NAME,
      },
      url: `${SITE_URL}/?page=car&id=${car.id}`,
    },
    aggregateRating: car.rating
      ? {
          '@type': 'AggregateRating',
          ratingValue: car.rating,
          reviewCount: car.reviewCount || 10,
          bestRating: 5,
          worstRating: 1,
        }
      : undefined,
    additionalProperty: [
      { '@type': 'PropertyValue', name: 'Seats', value: car.specs?.seats },
      { '@type': 'PropertyValue', name: 'Fuel Type', value: car.specs?.fuelType },
      { '@type': 'PropertyValue', name: 'Transmission', value: car.specs?.transmission },
    ].filter(p => p.value),
  };
};

// ── Breadcrumb Schema ──────────────────────────────────────────────────────
const buildBreadcrumbSchema = (page, car) => {
  const items = [{ name: 'Home', url: SITE_URL }];

  if (page === 'fleet') {
    items.push({ name: 'Our Fleet', url: `${SITE_URL}/?page=fleet` });
  } else if (page === 'car' && car) {
    items.push({ name: 'Fleet', url: `${SITE_URL}/?page=fleet` });
    items.push({ name: car.name, url: `${SITE_URL}/?page=car&id=${car.id}` });
  } else if (page === 'booking') {
    items.push({ name: 'Book a Car', url: `${SITE_URL}/?page=booking` });
  } else if (page === 'contact') {
    items.push({ name: 'Contact Us', url: `${SITE_URL}/?page=contact` });
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
};

// ── Inject helper ──────────────────────────────────────────────────────────
const injectSchema = (id, schema) => {
  if (!schema) return;
  let el = document.getElementById(id);
  if (!el) {
    el = document.createElement('script');
    el.id = id;
    el.type = 'application/ld+json';
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(schema, null, 0);
};

const removeSchema = (id) => {
  const el = document.getElementById(id);
  if (el) el.remove();
};

// ── Page meta titles + descriptions ───────────────────────────────────────
const PAGE_META = {
  home: {
    title: 'Ride With Us | Car Hire & Safari Rentals in Kenya — Nairobi, Mombasa, Kisumu',
    description:
      'Book a self-drive or chauffeured vehicle in Kenya from KSh 4,500/day. Toyota Prado, Land Cruiser, Mercedes, safari vans & more. Nairobi · Mombasa · Kisumu. Instant WhatsApp booking.',
    keywords:
      'car hire Kenya, car rental Nairobi, self drive Kenya, vehicle hire Nairobi, Toyota Prado hire, Land Cruiser hire Kenya, chauffeur service Nairobi, safari vehicle rental, cheap car hire Nairobi, car rental Mombasa, car hire Kisumu',
  },
  fleet: {
    title: 'Our Fleet | Economy Cars, SUVs, Safari Vans & Luxury Vehicles — Ride With Us Kenya',
    description:
      'Browse our full fleet of 15+ vehicles available for hire in Kenya. Economy cars from KSh 4,500/day, Toyota Prado, Land Cruiser V8, safari vans, Mercedes, and executive minivans.',
    keywords:
      'car hire fleet Kenya, SUV hire Nairobi, Toyota Prado rental Kenya, Land Cruiser hire, safari van rental, luxury car hire Kenya, Mercedes hire Nairobi',
  },
  booking: {
    title: 'Book Your Vehicle | Ride With Us — Car Hire Kenya',
    description:
      'Complete your vehicle booking in 3 easy steps. Select your car, add extras like a chauffeur or airport meet-and-greet, and confirm via WhatsApp instantly.',
    keywords:
      'book car Kenya, car hire booking Nairobi, reserve vehicle Kenya, online car rental Kenya',
  },
  car: {
    title: 'Vehicle Details | Ride With Us — Car Hire Kenya',
    description: 'Full specifications, pricing, and booking for this vehicle.',
    keywords: 'car hire Kenya, vehicle rental',
  },
  contact: {
    title: 'Contact Us | Ride With Us — Car Hire Kenya',
    description:
      'Get in touch with Ride With Us car hire. WhatsApp, phone, or email our team for reservations, fleet enquiries, and corporate accounts.',
    keywords:
      'contact car hire Kenya, car rental enquiry Nairobi, WhatsApp car hire Kenya',
  },
};

// ── Main Component ─────────────────────────────────────────────────────────
export default function SeoHead({ page = 'home', car = null }) {
  useEffect(() => {
    const meta = PAGE_META[page] || PAGE_META.home;

    // ── Page title
    document.title = car
      ? `${car.name} — ${car.model || car.brand} | Rent from KSh ${(car.kshPrice || 0).toLocaleString()}/day | Ride With Us Kenya`
      : meta.title;

    // ── Meta description
    const setMeta = (name, content, isProperty = false) => {
      const attr = isProperty ? 'property' : 'name';
      let el = document.querySelector(`meta[${attr}="${name}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    const desc = car ? car.description || car.tagline || meta.description : meta.description;
    const pageUrl = car
      ? `${SITE_URL}/?page=car&id=${car.id}`
      : `${SITE_URL}${page !== 'home' ? `/?page=${page}` : ''}`;
    const imageUrl = car?.images?.[0] || `${SITE_URL}/kisumu-lake.jpg`;

    setMeta('description', desc);
    setMeta('keywords', car
      ? `${car.name} hire Kenya, ${car.brand} rental Kenya, ${car.category?.toLowerCase()} hire Nairobi, ${meta.keywords}`
      : meta.keywords);
    setMeta('robots', 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1');
    setMeta('author', BRAND_NAME);

    // ── Geo targeting
    setMeta('geo.region', 'KE');
    setMeta('geo.placename', 'Nairobi, Kenya');
    setMeta('geo.position', '-1.2921;36.8219');
    setMeta('ICBM', '-1.2921, 36.8219');

    // ── Open Graph (Facebook, WhatsApp previews)
    setMeta('og:type', page === 'home' ? 'website' : 'article', true);
    setMeta('og:site_name', BRAND_NAME, true);
    setMeta('og:title', document.title, true);
    setMeta('og:description', desc, true);
    setMeta('og:url', pageUrl, true);
    setMeta('og:image', imageUrl, true);
    setMeta('og:image:width', '1200', true);
    setMeta('og:image:height', '630', true);
    setMeta('og:image:alt', car ? `${car.name} available for hire in Kenya` : 'Ride With Us — Car Hire in Kenya', true);
    setMeta('og:locale', 'en_KE', true);

    // ── Twitter Card
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', document.title);
    setMeta('twitter:description', desc);
    setMeta('twitter:image', imageUrl);

    // ── Canonical URL
    let canonEl = document.querySelector('link[rel="canonical"]');
    if (!canonEl) {
      canonEl = document.createElement('link');
      canonEl.rel = 'canonical';
      document.head.appendChild(canonEl);
    }
    canonEl.href = pageUrl;

    // ── JSON-LD Structured Data ──────────────────────────────────────────
    injectSchema('schema-website', websiteSchema);
    injectSchema('schema-localbusiness', localBusinessSchema);
    injectSchema('schema-breadcrumb', buildBreadcrumbSchema(page, car));

    if (page === 'home') {
      injectSchema('schema-faq', faqSchema);
    } else {
      removeSchema('schema-faq');
    }

    if (car) {
      injectSchema('schema-vehicle', buildVehicleSchema(car));
    } else {
      removeSchema('schema-vehicle');
    }
  }, [page, car]);

  return null; // Renders nothing — all output is injected into <head>
}
