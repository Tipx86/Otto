export const INITIAL_CARS = [
  {
    id: "economy-small-car",
    name: "Economy Small Car",
    model: "Mazda Demio or similar",
    brand: "Mazda",
    category: "SMALL CAR",
    year: 2023,
    dailyPrice: 31,
    kshPrice: 4000,
    weeklyDiscount: 10,
    securityDeposit: 200,
    images: [
      "/cars/economy-small-car.png",
      "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80"
    ],
    specs: {
      horsepower: "110 HP",
      acceleration: "9.8s 0-60 mph",
      topSpeed: "115 mph",
      engine: "1.3L - 1.5L SkyActiv-G",
      transmission: "Automatic",
      seats: 5,
      luggage: "2 Bags",
      fuelType: "Petrol"
    },
    features: ["Air Conditioning", "Bluetooth Audio", "Reversing Camera", "Fuel Efficient"],
    includedPerks: ["24/7 Roadside Rescue", "Comprehensive Insurance", "Clean & Sanitized"],
    status: "available",
    blockedDates: [],
    rating: 4.8,
    reviewCount: 92,
    featured: true,
    tagline: "Nimble, highly fuel-efficient city runabout.",
    description: "The Mazda Demio or similar compact hatchback is ideal for city navigation, daily commutes, and budget-friendly exploration with outstanding fuel economy."
  },
  {
    id: "economy-medium-car",
    name: "Economy Medium Car",
    model: "Toyota Axio or similar",
    brand: "Toyota",
    category: "MEDIUM CAR",
    year: 2023,
    dailyPrice: 35,
    kshPrice: 4500,
    weeklyDiscount: 10,
    securityDeposit: 250,
    images: [
      "/cars/economy-medium-car.png",
      "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80"
    ],
    specs: {
      horsepower: "138 HP",
      acceleration: "8.9s 0-60 mph",
      topSpeed: "120 mph",
      engine: "1.5L Dual VVT-i",
      transmission: "Automatic CVT",
      seats: 5,
      luggage: "3 Bags",
      fuelType: "Petrol"
    },
    features: ["Keyless Entry", "Eco Mode", "Dual Airbags", "Spacious Trunk"],
    includedPerks: ["Roadside Rescue", "Comprehensive Cover", "Unlimited City Mileage"],
    status: "available",
    blockedDates: [],
    rating: 4.9,
    reviewCount: 118,
    featured: true,
    tagline: "Reliable comfort for business and weekend family trips.",
    description: "The Toyota Axio or similar sedan delivers the gold standard of reliability. Smooth suspension, generous trunk space, and effortless highway cruising."
  },
  {
    id: "premium-medium-car",
    name: "Premium Medium Car",
    model: "Mercedes C 200 or similar",
    brand: "Mercedes-Benz",
    category: "MEDIUM CAR",
    year: 2024,
    dailyPrice: 140,
    kshPrice: 18000,
    weeklyDiscount: 12,
    securityDeposit: 600,
    images: [
      "/cars/premium-medium-car.png",
      "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=800&q=80"
    ],
    specs: {
      horsepower: "204 HP",
      acceleration: "7.1s 0-60 mph",
      topSpeed: "150 mph",
      engine: "2.0L Turbocharged Mild-Hybrid",
      transmission: "9G-TRONIC Automatic",
      seats: 5,
      luggage: "3 Bags",
      fuelType: "Petrol 95"
    },
    features: ["Burmester Surround Sound", "Ambient Lighting", "MBUX Touchscreen", "Leather Seats"],
    includedPerks: ["Executive Chauffeur Option", "Full Comprehensive Coverage", "Airport Handover"],
    status: "available",
    blockedDates: [],
    rating: 4.9,
    reviewCount: 65,
    featured: true,
    tagline: "Executive refinement and striking German styling.",
    description: "The Mercedes C 200 or similar brings executive refinement and striking German styling. Make an impression at corporate summits or luxury getaways."
  },
  {
    id: "luxury-medium-car",
    name: "Luxury Medium Car",
    model: "Mercedes S 350 or similar",
    brand: "Mercedes-Benz",
    category: "MEDIUM CAR",
    year: 2024,
    dailyPrice: 235,
    kshPrice: 30000,
    weeklyDiscount: 15,
    securityDeposit: 800,
    images: [
      "/cars/luxury-medium-car.png",
      "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=800&q=80"
    ],
    specs: {
      horsepower: "286 HP",
      acceleration: "6.0s 0-60 mph",
      topSpeed: "155 mph",
      engine: "3.0L Inline-6 Turbo Diesel / Petrol",
      transmission: "9G-TRONIC",
      seats: 5,
      luggage: "4 Bags",
      fuelType: "Diesel / Petrol"
    },
    features: ["Panoramic Sunroof", "Active Massage Seats", "Acoustic Glass", "Burmester 3D Sound"],
    includedPerks: ["VIP Chauffeur Available", "Zero Excess Option", "24/7 Priority Concierge"],
    status: "available",
    blockedDates: [],
    rating: 5.0,
    reviewCount: 42,
    featured: true,
    tagline: "First-class luxury executive limousine experience.",
    description: "The Mercedes S 350 or similar flagship sedan is the epitome of executive travel. Whisper-quiet cabin isolation, supple leather, and prestige."
  },
  {
    id: "economy-mid-size-suv",
    name: "Economy Mid-Size SUV",
    model: "Nissan X trail or similar",
    brand: "Nissan",
    category: "MID-SIZE SUV",
    year: 2023,
    dailyPrice: 58,
    kshPrice: 7500,
    weeklyDiscount: 10,
    securityDeposit: 300,
    images: [
      "/cars/economy-mid-size-suv.png",
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80"
    ],
    specs: {
      horsepower: "170 HP",
      acceleration: "9.2s 0-60 mph",
      topSpeed: "125 mph",
      engine: "2.0L / 2.5L 4-Cylinder",
      transmission: "Automatic Xtronic",
      seats: 7,
      luggage: "4 Bags",
      fuelType: "Petrol"
    },
    features: ["Intelligent 4x4", "7-Passenger Seating", "Roof Rails", "High Ground Clearance"],
    includedPerks: ["Roadside Rescue", "Upcountry Travel Approved", "Unlimited Mileage Option"],
    status: "available",
    blockedDates: [],
    rating: 4.8,
    reviewCount: 78,
    featured: true,
    tagline: "Versatile 7-seater SUV with high clearance for all terrains.",
    description: "The Nissan X-Trail or similar crossover SUV is capable of tackling both city streets and unpaved country roads with generous 7-passenger capability."
  },
  {
    id: "standard-mid-size-suv",
    name: "Standard Mid-Size SUV",
    model: "Mazda CX-5 or similar",
    brand: "Mazda",
    category: "MID-SIZE SUV",
    year: 2024,
    dailyPrice: 66,
    kshPrice: 8500,
    weeklyDiscount: 12,
    securityDeposit: 350,
    images: [
      "/cars/standard-mid-size-suv.png",
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80"
    ],
    specs: {
      horsepower: "187 HP",
      acceleration: "8.1s 0-60 mph",
      topSpeed: "130 mph",
      engine: "2.0L / 2.5L SkyActiv AWD",
      transmission: "6-Speed Automatic",
      seats: 5,
      luggage: "4 Bags",
      fuelType: "Petrol"
    },
    features: ["Bose Sound System", "Head-Up Display", "i-Activ AWD", "Premium Interior"],
    includedPerks: ["Full Insurance Included", "Express Handover", "24/7 Roadside Assistance"],
    status: "available",
    blockedDates: [],
    rating: 4.9,
    reviewCount: 88,
    featured: true,
    tagline: "Sleek KODO design with premium interior and punchy AWD.",
    description: "The Mazda CX-5 or similar crossover provides luxurious interior styling combined with confident road grip and punchy acceleration."
  },
  {
    id: "premium-mid-size-suv",
    name: "Premium Mid-Size SUV",
    model: "Mazda CX 8 or similar",
    brand: "Mazda",
    category: "MID-SIZE SUV",
    year: 2024,
    dailyPrice: 70,
    kshPrice: 9000,
    weeklyDiscount: 15,
    securityDeposit: 400,
    images: [
      "/cars/premium-mid-size-suv.png",
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=800&q=80"
    ],
    specs: {
      horsepower: "190 HP",
      acceleration: "8.4s 0-60 mph",
      topSpeed: "130 mph",
      engine: "2.5L SkyActiv-G AWD",
      transmission: "6-Speed Automatic",
      seats: 7,
      luggage: "5 Bags",
      fuelType: "Petrol"
    },
    features: ["Three-Row 7 Seater", "i-Activ AWD", "Power Tailgate", "Nappa Leather"],
    includedPerks: ["Express Handover", "Full Comprehensive Coverage", "24/7 Support"],
    status: "available",
    blockedDates: [],
    rating: 4.9,
    reviewCount: 51,
    featured: true,
    tagline: "Three-row executive luxury SUV for family and business.",
    description: "The Mazda CX-8 or similar combines executive 3-row comfort, whisper-quiet cabin acoustics, and commanding road presence for both city and upcountry tours."
  },
  {
    id: "premium-suv-prado",
    name: "Premium SUV",
    model: "Toyota Prado J150 or similar",
    brand: "Toyota",
    category: "SUV",
    year: 2024,
    dailyPrice: 100,
    kshPrice: 13000,
    weeklyDiscount: 12,
    securityDeposit: 500,
    images: [
      "/cars/premium-suv-prado.png",
      "https://images.unsplash.com/photo-1520050206274-a1ae44613e6d?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80"
    ],
    specs: {
      horsepower: "201 HP",
      acceleration: "9.5s 0-60 mph",
      topSpeed: "110 mph",
      engine: "2.8L D-4D Turbo Diesel / 2.7L Petrol",
      transmission: "6-Speed Automatic 4WD",
      seats: 7,
      luggage: "5 Bags",
      fuelType: "Diesel / Petrol"
    },
    features: ["Full-Time 4WD with Diff Lock", "Cool Box Refrigerator", "Sunroof", "7 Leather Seats"],
    includedPerks: ["Self-Drive or Chauffeur", "Full Comprehensive Cover", "Safari/Upcountry Ready"],
    status: "available",
    blockedDates: [],
    rating: 5.0,
    reviewCount: 140,
    featured: true,
    tagline: "The king of African highways and national parks.",
    description: "The Toyota Prado J150 or similar provides supreme durability and prestige. Renowned 4WD capability for long-distance highway cruising and rough terrain."
  },
  {
    id: "luxury-suv-lc200",
    name: "Luxury SUV",
    model: "Toyota LC200 V8 or similar",
    brand: "Toyota",
    category: "SUV",
    year: 2024,
    dailyPrice: 218,
    kshPrice: 28000,
    weeklyDiscount: 15,
    securityDeposit: 1000,
    images: [
      "/cars/luxury-suv-lc200.png",
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1520050206274-a1ae44613e6d?auto=format&fit=crop&w=800&q=80"
    ],
    specs: {
      horsepower: "381 HP",
      acceleration: "7.0s 0-60 mph",
      topSpeed: "130 mph",
      engine: "4.5L Twin-Turbo V8 Diesel / 4.6L V8 Petrol",
      transmission: "6-Speed Automatic 4WD",
      seats: 7,
      luggage: "6 Bags",
      fuelType: "Diesel / Petrol"
    },
    features: ["V8 Power", "KDSS Suspension", "Crawl Control", "Cool Box", "Ventilated Ottoman Seats"],
    includedPerks: ["VIP Meet & Greet", "Comprehensive Executive Policy", "White-Glove Clean"],
    status: "available",
    blockedDates: [],
    rating: 5.0,
    reviewCount: 89,
    featured: true,
    tagline: "Unrivaled luxury flagship all-terrain sovereign.",
    description: "The Toyota LC200 V8 or similar is the pinnacle of Land Cruiser prestige. Incredible V8 horsepower, serene cabin insulation, and supreme executive status."
  },
  {
    id: "economy-safari",
    name: "Economy Safari",
    model: "Toyota Hiace Safari or similar",
    brand: "Toyota",
    category: "SAFARI",
    year: 2023,
    dailyPrice: 198,
    kshPrice: 25500,
    weeklyDiscount: 10,
    securityDeposit: 600,
    images: [
      "/cars/economy-safari.png",
      "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80"
    ],
    specs: {
      horsepower: "140 HP",
      acceleration: "12s 0-60 mph",
      topSpeed: "100 mph",
      engine: "3.0L D-4D Diesel 4x4",
      transmission: "Manual / Automatic",
      seats: 8,
      luggage: "8 Bags",
      fuelType: "Diesel"
    },
    features: ["Pop-Up Game Viewing Roof", "High-Gain VHF Radio", "Cooler Box", "Charging Inverters"],
    includedPerks: ["Professional Safari Guide Available", "Park Entry Ready", "Unlimited Safari Mileage"],
    status: "available",
    blockedDates: [],
    rating: 4.9,
    reviewCount: 95,
    featured: true,
    tagline: "Custom-built for wildlife photography and Masai Mara game drives.",
    description: "The Toyota Hiace Safari or similar is custom-equipped with an elevated pop-up roof for 360-degree game viewing, high clearance, and charging ports for safari photographers."
  },
  {
    id: "standard-safari",
    name: "Standard Safari",
    model: "Toyota Landcruiser or similar",
    brand: "Toyota",
    category: "SAFARI",
    year: 2024,
    dailyPrice: 272,
    kshPrice: 35000,
    weeklyDiscount: 15,
    securityDeposit: 800,
    images: [
      "/cars/standard-safari.png",
      "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80"
    ],
    specs: {
      horsepower: "202 HP",
      acceleration: "11s 0-60 mph",
      topSpeed: "95 mph",
      engine: "4.2L 1HZ Heavy Duty Diesel",
      transmission: "5-Speed Manual 4x4 Dual-Tank",
      seats: 7,
      luggage: "7 Large Bags",
      fuelType: "Diesel"
    },
    features: ["Dual Pop-Up Roofs", "Heavy Duty Winch & Snorkel", "High Clearance", "Twin Spare Wheels"],
    includedPerks: ["Expert Safari Driver Option", "Unlimited Game Drive Mileage", "24/7 Satellite Tracking"],
    status: "available",
    blockedDates: [],
    rating: 5.0,
    reviewCount: 112,
    featured: true,
    tagline: "The legendary African safari expedition vehicle.",
    description: "The customized Toyota Land Cruiser 70-Series safari vehicle is built to conquer the deepest mud, river crossings, and savannah trails of Masai Mara, Serengeti, and Amboseli."
  },
  {
    id: "premium-pickup-truck",
    name: "Premium Pickup Truck",
    model: "Toyota Hilux (2X Cab) or similar",
    brand: "Toyota",
    category: "PICKUP TRUCK",
    year: 2024,
    dailyPrice: 117,
    kshPrice: 15000,
    weeklyDiscount: 12,
    securityDeposit: 500,
    images: [
      "/cars/premium-pickup-truck.png",
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1520050206274-a1ae44613e6d?auto=format&fit=crop&w=800&q=80"
    ],
    specs: {
      horsepower: "221 HP",
      acceleration: "8.5s 0-60 mph",
      topSpeed: "115 mph",
      engine: "2.4L / 2.8L GD-6 Turbo Diesel 4x4",
      transmission: "6-Speed Automatic",
      seats: 5,
      luggage: "1-Ton Cargo Bed",
      fuelType: "Diesel"
    },
    features: ["Heavy Duty Bedliner", "Leather Interior", "4WD Shift-On-The-Fly", "Tow Bar"],
    includedPerks: ["Site/Project Travel Approved", "Full Insurance", "Roadside Assistance"],
    status: "available",
    blockedDates: [],
    rating: 4.9,
    reviewCount: 64,
    featured: true,
    tagline: "Rugged double-cab muscle with premium executive comforts.",
    description: "The Toyota Hilux Double Cab or similar combines exceptional payload and towing capability paired with modern infotainment and plush 5-seater double-cab interior."
  },
  {
    id: "standard-minivan",
    name: "Standard Minivan",
    model: "Toyota Noah or similar",
    brand: "Toyota",
    category: "MINIVAN",
    year: 2024,
    dailyPrice: 62,
    kshPrice: 8000,
    weeklyDiscount: 12,
    securityDeposit: 300,
    images: [
      "/cars/standard-minivan.png",
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80"
    ],
    specs: {
      horsepower: "152 HP",
      acceleration: "10.2s 0-60 mph",
      topSpeed: "115 mph",
      engine: "2.0L Valvematic",
      transmission: "Automatic CVT",
      seats: 7,
      luggage: "5 Bags",
      fuelType: "Petrol"
    },
    features: ["Dual Power Sliding Doors", "Low Step-In Height", "Versatile 7-Seat Layout", "Dual AC"],
    includedPerks: ["Airport Transfer Ready", "Comprehensive Coverage", "Child Seat Friendly"],
    status: "available",
    blockedDates: [],
    rating: 4.8,
    reviewCount: 62,
    featured: true,
    tagline: "Spacious, comfortable family mobility with dual sliding doors.",
    description: "The Toyota Noah or similar minivan offers comfortable seating for 7 passengers, effortless dual electric sliding doors, and great fuel efficiency for family and group travel."
  },
  {
    id: "premium-minivan",
    name: "Premium Minivan",
    model: "Toyota Alphard or similar",
    brand: "Toyota",
    category: "MINIVAN",
    year: 2024,
    dailyPrice: 125,
    kshPrice: 16000,
    weeklyDiscount: 15,
    securityDeposit: 500,
    images: [
      "/cars/premium-minivan.png",
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80"
    ],
    specs: {
      horsepower: "180 HP",
      acceleration: "9.8s 0-60 mph",
      topSpeed: "115 mph",
      engine: "2.5L Hybrid / Petrol",
      transmission: "Automatic CVT",
      seats: 7,
      luggage: "6 Bags",
      fuelType: "Petrol"
    },
    features: ["Twin Power Sliding Doors", "Captain Reclining Seats", "Dual Sunroofs", "Rear Screen"],
    includedPerks: ["Airport Transfer Ready", "Chauffeur Option", "Full Comprehensive Coverage"],
    status: "available",
    blockedDates: [],
    rating: 4.9,
    reviewCount: 77,
    featured: true,
    tagline: "Executive lounge luxury on wheels for VIP delegations.",
    description: "The Toyota Alphard or similar is known as the private jet of the road. Ottoman captain chairs, electric doors, and smooth air-conditioned tranquility."
  },
  {
    id: "standard-van",
    name: "Standard Van",
    model: "Toyota Hiace or similar",
    brand: "Toyota",
    category: "VAN",
    year: 2024,
    dailyPrice: 117,
    kshPrice: 15000,
    weeklyDiscount: 10,
    securityDeposit: 400,
    images: [
      "/cars/standard-van.png",
      "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80"
    ],
    specs: {
      horsepower: "150 HP",
      acceleration: "13s 0-60 mph",
      topSpeed: "100 mph",
      engine: "2.8L / 3.0L D-4D Diesel",
      transmission: "Automatic / Manual",
      seats: 14,
      luggage: "10 Bags",
      fuelType: "Diesel"
    },
    features: ["Individual AC Vents", "High Roof Clearance", "Luggage Trailer Available", "Microphone PA System"],
    includedPerks: ["Vetted Driver Option", "Comprehensive Insurance", "Airport Group Transfers"],
    status: "available",
    blockedDates: [],
    rating: 4.8,
    reviewCount: 49,
    featured: true,
    tagline: "Group transportation made comfortable, reliable, and cost-effective.",
    description: "The 14-seater Toyota Hiace or similar van is ideal for corporate team outings, wedding parties, church delegations, and large family excursions."
  },
  {
    id: "standard-bus",
    name: "Standard Bus",
    model: "Toyota Coaster or similar",
    brand: "Toyota",
    category: "BUS",
    year: 2024,
    dailyPrice: 202,
    kshPrice: 26000,
    weeklyDiscount: 12,
    securityDeposit: 700,
    images: [
      "/cars/standard-bus.png",
      "https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=800&q=80"
    ],
    specs: {
      horsepower: "175 HP",
      acceleration: "15s 0-60 mph",
      topSpeed: "90 mph",
      engine: "4.0L Turbo Diesel",
      transmission: "6-Speed Manual",
      seats: 28,
      luggage: "20 Bags",
      fuelType: "Diesel"
    },
    features: ["Reclining High-Back Seats", "Ducted Central Air", "Overhead Parcel Racks", "PA Sound System"],
    includedPerks: ["Professional Coach Captain", "Full Commercial Policy", "Multi-Day Tour Rates"],
    status: "available",
    blockedDates: [],
    rating: 4.9,
    reviewCount: 36,
    featured: true,
    tagline: "Executive group coach travel with maximum luggage capacity.",
    description: "The Toyota Coaster or similar 28-seater coach bus features reclining velvet seats, ducted air conditioning, and smooth suspension for long journeys."
  }
];

export const CATEGORIES = [
  "ALL",
  "SMALL CAR",
  "MEDIUM CAR",
  "MID-SIZE SUV",
  "SUV",
  "SAFARI",
  "PICKUP TRUCK",
  "MINIVAN",
  "VAN",
  "BUS"
];

export const BRANDS = [
  "All Brands",
  "Toyota",
  "Mercedes-Benz",
  "Mazda",
  "Nissan",
  "BMW",
  "Range Rover",
  "Porsche",
  "Ford"
];

export const CURRENCY_RATES = {
  KSH: { symbol: "KSh ", rate: 128.5, label: "KSh (Kenya)", isKshBase: true },
  USD: { symbol: "$", rate: 1, label: "USD ($)" },
  EUR: { symbol: "€", rate: 0.92, label: "EUR (€)" },
  GBP: { symbol: "£", rate: 0.79, label: "GBP (£)" },
  AED: { symbol: "AED ", rate: 3.67, label: "AED (د.إ)" }
};

export const CITIES_WE_SERVE = [
  {
    name: "Nairobi",
    subtitle: "Capital · fleet hub",
    image: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Mombasa",
    subtitle: "Coast · old town",
    image: "https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Diani",
    subtitle: "White-sand beaches",
    image: "/diani-beach.jpg"
  },
  {
    name: "Kisumu",
    subtitle: "Lakeside city",
    image: "/kisumu-lake.jpg"
  },
  {
    name: "Malindi",
    subtitle: "Coastal escape",
    image: "/malindi-dhow.jpg"
  },
  {
    name: "Kakamega",
    subtitle: "Rainforest country",
    image: "/kakamega-rocks.jpg"
  },
  {
    name: "Kericho",
    subtitle: "Tea highlands",
    image: "/kericho-tea.jpg"
  },
  {
    name: "Kisii",
    subtitle: "Soapstone hills",
    image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Homa Bay",
    subtitle: "Lake · Ruma park",
    image: "https://images.unsplash.com/photo-1534567153574-2b12153a87f0?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Bungoma",
    subtitle: "Below Mount Elgon",
    image: "https://images.unsplash.com/photo-1534177616072-ef7dc120449d?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Migori",
    subtitle: "Border · heritage",
    image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Siaya",
    subtitle: "Wetlands · lakeshore",
    image: "/siaya-fisherman.jpg"
  }
];

export const INITIAL_BOOKINGS = [
  {
    id: "OTTO-89241",
    createdAt: "2026-09-07T14:30:00Z",
    carId: "premium-suv-prado",
    carName: "Toyota Prado TX/TXL",
    customer: {
      fullName: "Wanjiru Kariuki",
      email: "wanjiru.k@safari-ventures.co.ke",
      phone: "+254 712 345678",
      flightNumber: "KQ 102",
      pickupLocation: "JKIA Airport Terminal 1A (Nairobi)",
      dropoffLocation: "JKIA Airport Terminal 1A (Nairobi)",
      specialRequests: "Self-drive safari trip to Masai Mara with comprehensive insurance and child safety seat."
    },
    dates: {
      pickupDate: "2026-09-12",
      pickupTime: "10:00",
      returnDate: "2026-09-19",
      returnTime: "18:00",
      days: 7
    },
    pricing: {
      dailyRate: 150,
      subtotal: 1050,
      addOnsTotal: 140,
      securityDeposit: 600,
      grandTotal: 1190,
      currency: "KSH"
    },
    addOns: [
      { id: "full_protection", name: "Zero Excess Protection", price: 20, quantity: 7 }
    ],
    status: "Confirmed"
  }
];
