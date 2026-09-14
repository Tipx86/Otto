import { useEffect } from 'react';

/**
 * SeoHead — Injects dynamic SEO metadata and JSON-LD structured data into <head>
 * for Google Rich Results, star ratings, prices, local business listings, breadcrumbs, and FAQs.
 *
 * Usage: <SeoHead page="home|fleet|booking|contact|about|faqs|car" car={selectedCar} />
 */

const SITE_URL = 'https://ottorental.com';
const BRAND_NAME = 'OttoRental';
const PHONE = '+254 119 317161';
const EMAIL = 'hello@ottorental.com';
const WHATSAPP = '+254 119 317161';

// ── Multi-Location AutoRental & LocalBusiness Schema ───────────────────────
const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': ['AutoRental', 'CarRental', 'LocalBusiness'],
  name: BRAND_NAME,
  legalName: 'OttoRental Kenya Ltd',
  alternateName: ['Otto Rental', 'Otto Car Hire Kenya'],
  description:
    'Premium self-drive and chauffeured car hire in Kenya. Book Toyota Prado, Land Cruiser 4x4, Mercedes-Benz, safari tour vans, and compact cars across Nairobi, Mombasa, Diani, Kisumu, and upcountry Kenya.',
  url: SITE_URL,
  telephone: PHONE,
  email: EMAIL,
  logo: `${SITE_URL}/logo-512.png`,
  image: [
    `${SITE_URL}/logo-512.png`,
    `${SITE_URL}/kisumu-lake.jpg`,
    `${SITE_URL}/diani-beach.jpg`
  ],
  priceRange: 'KSh 4,000 – KSh 35,000/day',
  currenciesAccepted: 'KES, USD, EUR, GBP, AED',
  paymentAccepted: 'M-Pesa, Credit Card, Debit Card, Bank Transfer, Cash',
  openingHours: 'Mo-Su 00:00-24:00',
  areaServed: [
    { '@type': 'City', name: 'Nairobi' },
    { '@type': 'City', name: 'Mombasa' },
    { '@type': 'City', name: 'Diani' },
    { '@type': 'City', name: 'Kisumu' },
    { '@type': 'City', name: 'Malindi' },
    { '@type': 'City', name: 'Eldoret' },
    { '@type': 'City', name: 'Naivasha' },
    { '@type': 'Country', name: 'Kenya' }
  ],
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Westlands Commercial Center, Ring Road Parklands',
    addressLocality: 'Nairobi',
    addressRegion: 'Nairobi County',
    postalCode: '00100',
    addressCountry: 'KE'
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: -1.2635,
    longitude: 36.8028
  },
  sameAs: [
    `https://wa.me/${WHATSAPP.replace(/[^0-9]/g, '')}`,
    'https://twitter.com/ottorental',
    'https://instagram.com/ottorental'
  ],
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    reviewCount: '834',
    bestRating: '5',
    worstRating: '1'
  },
  hasMap: 'https://maps.google.com/?q=Westlands+Nairobi+Kenya',
  knowsLanguage: ['en', 'sw']
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
        text: 'Yes! All our SUVs, pickup trucks, and safari vehicles are approved for upcountry travel including Masai Mara, Amboseli, Samburu, and Tsavo. We recommend the Toyota Prado or Land Cruiser for safari routes.'
      }
    },
    {
      '@type': 'Question',
      name: 'What documents do I need to hire a self-drive car in Kenya?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'You need a valid national driving licence (or international driving permit for foreign visitors), national ID or passport, and a security deposit. Minimum age is 23 years.'
      }
    },
    {
      '@type': 'Question',
      name: 'Do you offer airport pickup and drop-off in Nairobi and Mombasa?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. We provide 24/7 VIP airport delivery and pickup at JKIA Terminal 1A, Wilson Airport in Nairobi, Moi International Airport in Mombasa, and Kisumu Airport.'
      }
    },
    {
      '@type': 'Question',
      name: 'What is the cheapest car hire rate in Nairobi?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Our economy small cars start from KSh 4,000 per day (approx. $31 USD). This includes comprehensive insurance, unlimited city mileage, and 24/7 roadside assistance.'
      }
    },
    {
      '@type': 'Question',
      name: 'Can I hire a car with a professional driver/chauffeur in Kenya?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. All our vehicles can be booked with a professional, vetted chauffeur. Our drivers are licensed, background-checked, and experienced in both city traffic and national park safari driving.'
      }
    },
    {
      '@type': 'Question',
      name: 'How do payments and M-Pesa deposits work?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'You can pay instantly via M-Pesa Express (STK Push to your phone), international credit/debit card, or bank transfer. Security deposits are managed digitally with instant release upon vehicle return.'
      }
    },
    {
      '@type': 'Question',
      name: 'Do you have custom safari vehicles for game drives?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. We have custom-built safari tour vans with pop-up game-viewing roofs and Toyota Land Cruiser 70 Series safari 4x4s equipped with cooler boxes, camera charging inverters, and high ground clearance.'
      }
    }
  ]
};

// ── Sitelinks Searchbox WebSite Schema ──────────────────────────────────────
const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: BRAND_NAME,
  url: SITE_URL,
  description: 'Premier car hire and vehicle rental marketplace in Kenya — self-drive, safari, and chauffeur.',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${SITE_URL}/fleet?search={search_term_string}`
    },
    'query-input': 'required name=search_term_string'
  }
};

// ── Vehicle & Product Schema (for individual car pages) ────────────────────
const buildVehicleSchema = (car) => {
  if (!car) return null;
  const carUrl = `${SITE_URL}/cars/${car.id}`;
  const images = car.images && car.images.length > 0
    ? car.images.map(img => img.startsWith('http') ? img : `${SITE_URL}${img}`)
    : [`${SITE_URL}/kisumu-lake.jpg`];

  return {
    '@context': 'https://schema.org',
    '@type': ['Product', 'Vehicle'],
    name: `${car.name} — ${car.model || car.brand}`,
    description: car.description || car.tagline || `Rent the ${car.name} in Kenya with OttoRental. Available for self-drive or chauffeured rental.`,
    image: images,
    url: carUrl,
    vehicleModelDate: String(car.year || 2024),
    brand: {
      '@type': 'Brand',
      name: car.brand
    },
    category: car.category,
    vehicleTransmission: car.specs?.transmission || 'Automatic',
    fuelType: car.specs?.fuelType || 'Petrol',
    seatingCapacity: car.specs?.seats || 5,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'KES',
      price: car.kshPrice || Math.round(car.dailyPrice * 128.5),
      priceValidUntil: '2027-12-31',
      itemCondition: 'https://schema.org/UsedCondition',
      availability: car.status === 'available'
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'AutoRental',
        name: BRAND_NAME,
        url: SITE_URL
      },
      url: carUrl,
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        price: car.kshPrice || Math.round(car.dailyPrice * 128.5),
        priceCurrency: 'KES',
        unitText: 'DAY',
        valueAddedTaxIncluded: true
      }
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: String(car.rating || 4.9),
      reviewCount: String(car.reviewCount || 45),
      bestRating: '5',
      worstRating: '1'
    },
    additionalProperty: [
      { '@type': 'PropertyValue', name: 'Seating Capacity', value: `${car.specs?.seats || 5} Seats` },
      { '@type': 'PropertyValue', name: 'Luggage Capacity', value: car.specs?.luggage || '3 Bags' },
      { '@type': 'PropertyValue', name: 'Fuel Type', value: car.specs?.fuelType || 'Petrol' },
      { '@type': 'PropertyValue', name: 'Transmission', value: car.specs?.transmission || 'Automatic' },
      { '@type': 'PropertyValue', name: 'Engine', value: car.specs?.engine || 'Standard' },
      { '@type': 'PropertyValue', name: 'Rental Type', value: 'Self-Drive & Chauffeured' }
    ].filter(p => p.value)
  };
};

// ── Breadcrumb Schema ──────────────────────────────────────────────────────
const buildBreadcrumbSchema = (page, car) => {
  const items = [{ name: 'Home', url: `${SITE_URL}/` }];

  if (page === 'fleet') {
    items.push({ name: 'Fleet Catalog', url: `${SITE_URL}/fleet` });
  } else if (page === 'car' && car) {
    items.push({ name: 'Fleet Catalog', url: `${SITE_URL}/fleet` });
    items.push({ name: car.name, url: `${SITE_URL}/cars/${car.id}` });
  } else if (page === 'booking') {
    items.push({ name: 'Book a Car', url: `${SITE_URL}/booking` });
  } else if (page === 'about') {
    items.push({ name: 'About OttoRental', url: `${SITE_URL}/about` });
  } else if (page === 'contact') {
    items.push({ name: 'Contact & Concierge', url: `${SITE_URL}/contact` });
  } else if (page === 'faqs') {
    items.push({ name: 'Frequently Asked Questions', url: `${SITE_URL}/faqs` });
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };
};

// ── Schema Injection Helpers ───────────────────────────────────────────────
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

// ── Comprehensive Page Metadata (Titles & Descriptions) ────────────────────
const PAGE_META = {
  home: {
    title: 'OttoRental | Car Hire & Safari Rentals in Kenya — Nairobi, Mombasa, Kisumu',
    description:
      'Book self-drive and chauffeured car hire in Kenya from KSh 4,000/day. Toyota Prado, Land Cruiser 4x4, Mercedes & safari vans. Instant M-Pesa booking.',
    keywords:
      'car hire Kenya, car rental Nairobi, self drive Kenya, vehicle hire Nairobi, Toyota Prado hire Kenya, Land Cruiser hire Kenya, safari vehicle rental, cheap car hire Nairobi, car rental Mombasa, car hire Kisumu, car hire Diani'
  },
  fleet: {
    title: 'Full Vehicle Fleet | Economy, SUVs, Safari Cruisers & Luxury — OttoRental Kenya',
    description:
      'Explore our full fleet of 15+ verified vehicles for hire in Kenya. Economy hatchbacks, Toyota Prado 4x4, Safari Land Cruisers, executive minivans & buses.',
    keywords:
      'car hire fleet Kenya, SUV hire Nairobi, Toyota Prado rental Kenya, Land Cruiser safari hire, safari van rental Kenya, luxury car hire Nairobi, Mercedes hire Kenya'
  },
  booking: {
    title: 'Reserve Your Vehicle | Instant Online Car Hire — OttoRental Kenya',
    description:
      'Book your rental car in Kenya in under 2 minutes. Transparent daily pricing, flexible airport delivery, professional chauffeurs, and secure M-Pesa payment.',
    keywords:
      'book car Kenya, car hire booking Nairobi, reserve vehicle Kenya, online car rental Kenya, M-Pesa car rental'
  },
  car: {
    title: 'Vehicle Details | OttoRental Car Hire Kenya',
    description: 'Complete vehicle specifications, transparent daily pricing, and instant booking with OttoRental Kenya.',
    keywords: 'car hire Kenya, vehicle rental Nairobi, self drive Kenya'
  },
  about: {
    title: 'About OttoRental | Kenya’s Premier Car Hire & Safari Marketplace',
    description:
      'Learn how OttoRental connects travelers and businesses with verified rental operators across Nairobi, Mombasa, Kisumu, and upcountry destinations with 24/7 rescue.',
    keywords:
      'about OttoRental, car hire company Kenya, trusted car rental Nairobi, safari vehicle operators Kenya'
  },
  contact: {
    title: 'Contact Concierge & Locations | 24/7 Support — OttoRental Kenya',
    description:
      'Get in touch with OttoRental operations team. 24/7 WhatsApp concierge, airport delivery desk, and corporate fleet bookings across Kenya.',
    keywords:
      'contact OttoRental, car hire customer support Nairobi, WhatsApp car hire Kenya, JKIA car rental contact'
  },
  faqs: {
    title: 'Car Rental FAQs & Policies | M-Pesa, Deposits, Safaris — OttoRental Kenya',
    description:
      'Frequently asked questions about hiring a car in Kenya: driver requirements, M-Pesa payments, security deposits, safari routes, and airport handovers.',
    keywords:
      'car hire FAQs Kenya, Kenya car rental requirements, M-Pesa deposit car hire, driving to Masai Mara rental car'
  }
};

// ── Main SeoHead Component ─────────────────────────────────────────────────
export default function SeoHead({ page = 'home', car = null }) {
  useEffect(() => {
    const meta = PAGE_META[page] || PAGE_META.home;

    // 1. Dynamic Title
    const pageTitle = car
      ? `${car.name} (${car.model || car.brand}) Hire in Kenya | From KSh ${(car.kshPrice || Math.round(car.dailyPrice * 128.5)).toLocaleString()}/day | OttoRental`
      : meta.title;

    document.title = pageTitle;

    // 2. Meta Tag Helper
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

    // 3. Resolve Clean Canonical URL & Images
    const pageUrl = car
      ? `${SITE_URL}/cars/${car.id}`
      : `${SITE_URL}${page !== 'home' ? `/${page}` : '/'}`;

    const desc = car
      ? `Hire the ${car.name} (${car.model || car.brand}) in Kenya from KSh ${(car.kshPrice || Math.round(car.dailyPrice * 128.5)).toLocaleString()}/day. ${car.tagline || ''} Instant booking via M-Pesa & card.`
      : meta.description;

    const imageUrl = car?.images?.[0]
      ? (car.images[0].startsWith('http') ? car.images[0] : `${SITE_URL}${car.images[0]}`)
      : `${SITE_URL}/kisumu-lake.jpg`;

    // 4. Inject Primary Meta
    setMeta('description', desc);
    setMeta(
      'keywords',
      car
        ? `${car.name} hire Kenya, ${car.brand} rental Nairobi, ${car.category?.toLowerCase()} rental Kenya, ${meta.keywords}`
        : meta.keywords
    );
    setMeta('robots', 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1');
    setMeta('author', BRAND_NAME);

    // 5. Geo Targeting
    setMeta('geo.region', 'KE');
    setMeta('geo.placename', 'Nairobi, Kenya');
    setMeta('geo.position', '-1.2635;36.8028');
    setMeta('ICBM', '-1.2635, 36.8028');

    // 6. Open Graph
    setMeta('og:type', car ? 'product' : page === 'home' ? 'website' : 'article', true);
    setMeta('og:site_name', BRAND_NAME, true);
    setMeta('og:title', pageTitle, true);
    setMeta('og:description', desc, true);
    setMeta('og:url', pageUrl, true);
    setMeta('og:image', imageUrl, true);
    setMeta('og:image:width', '1200', true);
    setMeta('og:image:height', '630', true);
    setMeta('og:image:alt', car ? `${car.name} available for hire with OttoRental Kenya` : 'OttoRental — Premium Car Hire in Kenya', true);
    setMeta('og:locale', 'en_KE', true);

    // 7. Twitter Card
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', pageTitle);
    setMeta('twitter:description', desc);
    setMeta('twitter:image', imageUrl);

    // 8. Canonical Link
    let canonEl = document.querySelector('link[rel="canonical"]');
    if (!canonEl) {
      canonEl = document.createElement('link');
      canonEl.rel = 'canonical';
      document.head.appendChild(canonEl);
    }
    canonEl.href = pageUrl;

    // 9. Structured Data JSON-LD Injections
    injectSchema('schema-website', websiteSchema);
    injectSchema('schema-localbusiness', localBusinessSchema);
    injectSchema('schema-breadcrumb', buildBreadcrumbSchema(page, car));

    // FAQ schema on Home and FAQs pages
    if (page === 'home' || page === 'faqs') {
      injectSchema('schema-faq', faqSchema);
    } else {
      removeSchema('schema-faq');
    }

    // Vehicle schema on individual car pages
    if (car) {
      injectSchema('schema-vehicle', buildVehicleSchema(car));
    } else {
      removeSchema('schema-vehicle');
    }
  }, [page, car]);

  return null;
}
