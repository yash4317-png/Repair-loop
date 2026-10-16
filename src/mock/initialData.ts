import { AuthorizedShop, DeviceInspection, InventoryPart, ShopOffer, User, QuickDispositionRequest, Technician } from '../types';

// High-reliability inline SVG illustrations for devices so images NEVER break
export const DEVICE_SVG_PRESETS = {
  smartphone_cracked: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500" width="100%" height="100%"><rect width="400" height="500" rx="28" fill="%23090d16"/><rect x="24" y="24" width="352" height="452" rx="20" fill="%23131c2e" stroke="%23334155" stroke-width="3"/><rect x="36" y="56" width="328" height="392" rx="12" fill="%23020617"/><circle cx="200" cy="40" r="4" fill="%23475569"/><line x1="80" y1="80" x2="220" y2="280" stroke="%2338bdf8" stroke-width="2" stroke-linecap="round"/><line x1="220" y1="280" x2="310" y2="240" stroke="%2338bdf8" stroke-width="1.8"/><line x1="220" y1="280" x2="160" y2="410" stroke="%2338bdf8" stroke-width="2.2"/><line x1="140" y1="180" x2="290" y2="150" stroke="%230284c7" stroke-width="1.5"/><line x1="180" y1="340" x2="250" y2="390" stroke="%230284c7" stroke-width="1.5"/><text x="200" y="468" fill="%23e2e8f0" font-family="sans-serif" font-size="12" font-weight="bold" text-anchor="middle">Cracked OLED Display Glass</text></svg>',
  smartphone_back: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500" width="100%" height="100%"><rect width="400" height="500" rx="28" fill="%23090d16"/><rect x="24" y="24" width="352" height="452" rx="20" fill="%231e293b" stroke="%23475569" stroke-width="2"/><rect x="44" y="44" width="130" height="130" rx="24" fill="%230f172a" stroke="%23334155" stroke-width="2"/><circle cx="85" cy="85" r="22" fill="%231e293b" stroke="%2364748b" stroke-width="4"/><circle cx="135" cy="85" r="22" fill="%231e293b" stroke="%2364748b" stroke-width="4"/><circle cx="85" cy="135" r="22" fill="%231e293b" stroke="%2364748b" stroke-width="4"/><circle cx="135" cy="135" r="8" fill="%2338bdf8"/><text x="200" y="468" fill="%2394a3b8" font-family="sans-serif" font-size="12" text-anchor="middle">Rear Matte Glass & LiDAR (Pristine)</text></svg>',
  laptop_screen: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 350" width="100%" height="100%"><rect width="500" height="350" rx="16" fill="%23090d16"/><rect x="40" y="30" width="420" height="250" rx="10" fill="%231e293b" stroke="%23475569" stroke-width="2"/><rect x="52" y="42" width="396" height="226" rx="4" fill="%23020617"/><line x1="120" y1="60" x2="260" y2="240" stroke="%23f43f5e" stroke-width="3"/><line x1="260" y1="240" x2="380" y2="180" stroke="%23f43f5e" stroke-width="2.5"/><line x1="220" y1="150" x2="350" y2="90" stroke="%23fb7185" stroke-width="2"/><rect x="20" y="284" width="460" height="24" rx="6" fill="%23334155"/><text x="250" y="335" fill="%23e2e8f0" font-family="sans-serif" font-size="12" font-weight="bold" text-anchor="middle">Liquid Retina XDR Matrix Bleed</text></svg>',
  user_sarah: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="%23059669"/><text x="50" y="62" fill="%23ffffff" font-family="sans-serif" font-size="36" font-weight="bold" text-anchor="middle">SC</text></svg>',
  user_david: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="%230284c7"/><text x="50" y="62" fill="%23ffffff" font-family="sans-serif" font-size="36" font-weight="bold" text-anchor="middle">DM</text></svg>',
  user_marcus: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="%23d97706"/><text x="50" y="62" fill="%23ffffff" font-family="sans-serif" font-size="36" font-weight="bold" text-anchor="middle">MV</text></svg>',
  user_elena: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="%230d9488"/><text x="50" y="62" fill="%23ffffff" font-family="sans-serif" font-size="36" font-weight="bold" text-anchor="middle">ER</text></svg>',
  user_tariq: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="%237c3aed"/><text x="50" y="62" fill="%23ffffff" font-family="sans-serif" font-size="36" font-weight="bold" text-anchor="middle">TA</text></svg>',
  tech_ramesh: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="%23ea580c"/><text x="50" y="62" fill="%23ffffff" font-family="sans-serif" font-size="36" font-weight="bold" text-anchor="middle">RS</text></svg>',
  tech_pooja: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="%23ec4899"/><text x="50" y="62" fill="%23ffffff" font-family="sans-serif" font-size="36" font-weight="bold" text-anchor="middle">PV</text></svg>',
  tech_arjun: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="%236366f1"/><text x="50" y="62" fill="%23ffffff" font-family="sans-serif" font-size="36" font-weight="bold" text-anchor="middle">AM</text></svg>'
};

export const INITIAL_USERS: User[] = [
  {
    id: 'user_cust_1',
    name: 'Aarav Sharma (MUJ Student)',
    email: 'aarav.sharma@jaipur.manipal.edu',
    role: 'customer',
    phone: '+91 98290 12345',
    avatar: DEVICE_SVG_PRESETS.user_sarah
  },
  {
    id: 'user_cust_2',
    name: 'Devika Patel (MUJ Hosteler)',
    email: 'devika.patel@jaipur.manipal.edu',
    role: 'customer',
    phone: '+91 94140 54321',
    avatar: DEVICE_SVG_PRESETS.user_david
  },
  {
    id: 'user_shop_1',
    name: 'Mukesh Verma (Apex Tech Lead)',
    email: 'mukesh@apexrepair.in',
    role: 'shopkeeper',
    shopId: 'shop_apex',
    phone: '+91 98280 34567',
    avatar: DEVICE_SVG_PRESETS.user_marcus
  },
  {
    id: 'user_shop_2',
    name: 'Ananya Roy (EcoRefurb Lead)',
    email: 'ananya@ecorefurb.in',
    role: 'shopkeeper',
    shopId: 'shop_ecorefurb',
    phone: '+91 98299 87654',
    avatar: DEVICE_SVG_PRESETS.user_elena
  },
  {
    id: 'user_shop_3',
    name: 'Tanmay Agarwal (Bagru Parts)',
    email: 'tanmay@siliconsalvage.in',
    role: 'shopkeeper',
    shopId: 'shop_silicon',
    phone: '+91 98285 45678',
    avatar: DEVICE_SVG_PRESETS.user_tariq
  }
];

export const INITIAL_TECHNICIANS: Technician[] = [
  {
    id: 'tech_1',
    shopId: 'shop_apex',
    name: 'Ramesh Sharma',
    role: 'Master Micro-soldering Tech',
    avatar: DEVICE_SVG_PRESETS.tech_ramesh,
    certifications: ['Apple Certified Mac Tech (ACMT)', 'IPC-7711/7721 Rework Specialist'],
    experienceYears: 8,
    rating: 4.9,
    activeBenchJob: {
      deviceId: 'insp_001',
      deviceModel: 'iPhone 13 Pro',
      task: 'TrueTone OLED calibration & laser bezel bonding',
      startedAt: '10:15 AM',
      estCompletionMin: 35
    }
  },
  {
    id: 'tech_2',
    shopId: 'shop_apex',
    name: 'Pooja Verma',
    role: 'Display & Battery Specialist',
    avatar: DEVICE_SVG_PRESETS.tech_pooja,
    certifications: ['Samsung Certified Mobile Tech', 'Battery Safety Handling Level 3'],
    experienceYears: 5,
    rating: 4.8,
    activeBenchJob: {
      deviceId: 'insp_005',
      deviceModel: 'Dell XPS 15',
      task: 'Battery swelling replacement & thermal paste repaste',
      startedAt: '10:45 AM',
      estCompletionMin: 20
    }
  },
  {
    id: 'tech_3',
    shopId: 'shop_apex',
    name: 'Arjun Mehta',
    role: 'Diagnostic & Quality Engineer',
    avatar: DEVICE_SVG_PRESETS.tech_arjun,
    certifications: ['CompTIA A+', 'ESD Control Supervisor'],
    experienceYears: 4,
    rating: 4.7
  },
  {
    id: 'tech_4',
    shopId: 'shop_ecorefurb',
    name: 'Vikram Rathore',
    role: 'Refurbishment Lead Engineer',
    avatar: DEVICE_SVG_PRESETS.tech_ramesh,
    certifications: ['R2v3 Circular Electronics Inspector', 'SMT Soldering'],
    experienceYears: 6,
    rating: 4.9
  }
];

// Authorized shops situated around Manipal University Jaipur (MUJ) and surrounding 10 km
export const AUTHORIZED_SHOPS: AuthorizedShop[] = [
  {
    id: 'shop_apex',
    name: 'Apex Precision Care - MUJ Campus Complex',
    location: 'Gate 2 Commercial Plaza, Manipal University Jaipur',
    areaName: 'MUJ Campus / Dehmi Kalan',
    coordinates: { lat: 26.8450, lng: 75.5670, x: 260, y: 190 },
    distanceKmFromMUJ: 0.8,
    travelTimeMin: 3,
    rating: 4.9,
    specialties: ['OEM Screen Replacements', 'Micro-soldering', 'Fast Student Turnaround'],
    authorizedBrands: ['Apple', 'Samsung', 'Dell', 'HP'],
    technicianCapacity: 5,
    activeJobs: 2,
    laborRatePerHour: 450,
    avatarUrl: DEVICE_SVG_PRESETS.user_marcus,
    certifications: ['Apple Authorized Service Provider', 'Samsung Care+', 'IPC-A-610'],
    technicians: [INITIAL_TECHNICIANS[0], INITIAL_TECHNICIANS[1], INITIAL_TECHNICIANS[2]]
  },
  {
    id: 'shop_ecorefurb',
    name: 'EcoRefurb Direct - Dehmi Kalan Tech Park',
    location: 'Near Toll Plaza, Jaipur-Ajmer Expressway, Dehmi Kalan',
    areaName: 'Dehmi Kalan (2.3 km)',
    coordinates: { lat: 26.8375, lng: 75.5810, x: 340, y: 240 },
    distanceKmFromMUJ: 2.3,
    travelTimeMin: 6,
    rating: 4.8,
    specialties: ['Buyouts & Resale Refurbishing', 'MacBook Upgrades', 'Grade-A Resale'],
    authorizedBrands: ['Apple', 'Lenovo', 'HP', 'Sony'],
    technicianCapacity: 8,
    activeJobs: 3,
    laborRatePerHour: 350,
    avatarUrl: DEVICE_SVG_PRESETS.user_elena,
    certifications: ['R2v3 Certified Refurbisher', 'e-Stewards Partner', 'ISO 14001'],
    technicians: [INITIAL_TECHNICIANS[3]]
  },
  {
    id: 'shop_silicon',
    name: 'Silicon Salvage & Board Lab - Bagru Industrial Hub',
    location: 'RIICO Industrial Area, Phase II, Bagru',
    areaName: 'Bagru Industrial Area (5.8 km)',
    coordinates: { lat: 26.8120, lng: 75.5410, x: 130, y: 360 },
    distanceKmFromMUJ: 5.8,
    travelTimeMin: 12,
    rating: 4.7,
    specialties: ['Component Harvesting', 'Motherboard Salvage', 'Rare Laptop Boards'],
    authorizedBrands: ['All Brands', 'Gaming PCs', 'Tablets'],
    technicianCapacity: 6,
    activeJobs: 2,
    laborRatePerHour: 300,
    avatarUrl: DEVICE_SVG_PRESETS.user_tariq,
    certifications: ['Hardware Harvesting Certified', 'Zero Landfill Partner'],
    technicians: []
  },
  {
    id: 'shop_greenmatrix',
    name: 'GreenMatrix E-Waste Depot - Mahapura Center',
    location: 'Mahapura Industrial Zone, Ajmer Highway',
    areaName: 'Mahapura Logistics (8.1 km)',
    coordinates: { lat: 26.8620, lng: 75.6450, x: 450, y: 120 },
    distanceKmFromMUJ: 8.1,
    travelTimeMin: 16,
    rating: 4.9,
    specialties: ['Safe E-Waste Dismantling', 'Precious Metal Hydrometallurgy', 'Hazardous Cell Recovery'],
    authorizedBrands: ['All Electronics'],
    technicianCapacity: 10,
    activeJobs: 3,
    laborRatePerHour: 220,
    avatarUrl: DEVICE_SVG_PRESETS.user_david,
    certifications: ['WEEE Certified', 'EPA & Rajasthan Pollution Control Board Gold'],
    technicians: []
  },
  {
    id: 'shop_bhankrota',
    name: 'Jaipur West Electronics Care - Bhankrota Junction',
    location: 'Bhankrota Main Crossroad, Sirsi Road Junction',
    areaName: 'Bhankrota (9.7 km)',
    coordinates: { lat: 26.8710, lng: 75.6820, x: 530, y: 70 },
    distanceKmFromMUJ: 9.7,
    travelTimeMin: 19,
    rating: 4.8,
    specialties: ['High-Volume Repairs', 'Screen Glass Lamination', 'Quick Battery Swap'],
    authorizedBrands: ['OnePlus', 'Xiaomi', 'Apple', 'Dell'],
    technicianCapacity: 7,
    activeJobs: 4,
    laborRatePerHour: 280,
    avatarUrl: DEVICE_SVG_PRESETS.user_sarah,
    certifications: ['ISO 9001 Certified Repair Facility'],
    technicians: []
  }
];

export const INITIAL_INVENTORY: InventoryPart[] = [
  // Apex Precision Care (MUJ Campus)
  {
    id: 'part_apex_1',
    shopId: 'shop_apex',
    sku: 'DISP-IP13P-OEM',
    name: 'iPhone 13 Pro Super Retina XDR OLED Display (OEM)',
    category: 'display',
    compatibleModels: ['iPhone 13 Pro'],
    quantityInStock: 4,
    minThreshold: 2,
    unitCost: 6800,
    retailPrice: 15600,
    condition: 'OEM_New',
    lastRestocked: '2026-10-01'
  },
  {
    id: 'part_apex_2',
    shopId: 'shop_apex',
    sku: 'BATT-IP13P-OEM',
    name: 'iPhone 13 Pro 3095mAh High-Capacity Battery Pack',
    category: 'battery',
    compatibleModels: ['iPhone 13 Pro'],
    quantityInStock: 8,
    minThreshold: 3,
    unitCost: 1800,
    retailPrice: 4800,
    condition: 'OEM_New',
    lastRestocked: '2026-10-08'
  },
  {
    id: 'part_apex_3',
    shopId: 'shop_apex',
    sku: 'CAM-IP13P-TRIPLE',
    name: 'iPhone 13 Pro Triple Camera Module Assembly',
    category: 'peripherals',
    compatibleModels: ['iPhone 13 Pro'],
    quantityInStock: 2,
    minThreshold: 1,
    unitCost: 4400,
    retailPrice: 10500,
    condition: 'OEM_New',
    lastRestocked: '2026-09-20'
  },
  {
    id: 'part_apex_4',
    shopId: 'shop_apex',
    sku: 'DISP-MBP14-M1',
    name: 'MacBook Pro 14" Liquid Retina XDR Display Lid Assembly',
    category: 'display',
    compatibleModels: ['MacBook Pro 14" M1', 'MacBook Pro 14" M2'],
    quantityInStock: 1,
    minThreshold: 1,
    unitCost: 24000,
    retailPrice: 42000,
    condition: 'Refurbished',
    lastRestocked: '2026-09-15'
  },
  {
    id: 'part_apex_5',
    shopId: 'shop_apex',
    sku: 'BATT-S23U-5000',
    name: 'Samsung Galaxy S23 Ultra 5000mAh Battery Cell',
    category: 'battery',
    compatibleModels: ['Galaxy S23 Ultra'],
    quantityInStock: 6,
    minThreshold: 2,
    unitCost: 1900,
    retailPrice: 5200,
    condition: 'OEM_New',
    lastRestocked: '2026-10-05'
  },

  // EcoRefurb Dehmi Kalan
  {
    id: 'part_eco_1',
    shopId: 'shop_ecorefurb',
    sku: 'DISP-IP13P-GRADEA',
    name: 'iPhone 13 Pro Refurbished Original OLED Assembly',
    category: 'display',
    compatibleModels: ['iPhone 13 Pro'],
    quantityInStock: 3,
    minThreshold: 2,
    unitCost: 5200,
    retailPrice: 12800,
    condition: 'Refurbished',
    lastRestocked: '2026-10-02'
  },
  {
    id: 'part_eco_2',
    shopId: 'shop_ecorefurb',
    sku: 'BATT-IP13P-CERT',
    name: 'iPhone 13 Pro High-Cycle Tested Battery',
    category: 'battery',
    compatibleModels: ['iPhone 13 Pro'],
    quantityInStock: 12,
    minThreshold: 4,
    unitCost: 1400,
    retailPrice: 4200,
    condition: 'Aftermarket_A',
    lastRestocked: '2026-10-10'
  },
  {
    id: 'part_eco_3',
    shopId: 'shop_ecorefurb',
    sku: 'CASE-IP13P-GRAPHITE',
    name: 'iPhone 13 Pro Stainless Steel Chassis & Rear Glass',
    category: 'housing',
    compatibleModels: ['iPhone 13 Pro'],
    quantityInStock: 2,
    minThreshold: 1,
    unitCost: 3200,
    retailPrice: 7500,
    condition: 'Harvested',
    lastRestocked: '2026-09-28'
  },

  // Silicon Salvage Bagru
  {
    id: 'part_silicon_1',
    shopId: 'shop_silicon',
    sku: 'LOGIC-IP13P-UNLOCKED',
    name: 'iPhone 13 Pro Logic Board 256GB (Tested Working)',
    category: 'board',
    compatibleModels: ['iPhone 13 Pro'],
    quantityInStock: 1,
    minThreshold: 1,
    unitCost: 8800,
    retailPrice: 19500,
    condition: 'Harvested',
    lastRestocked: '2026-09-18'
  },
  {
    id: 'part_silicon_2',
    shopId: 'shop_silicon',
    sku: 'PORT-IP13P-FLEX',
    name: 'iPhone 13 Pro Lightning Charge Port & Mic Flex Cable',
    category: 'cable',
    compatibleModels: ['iPhone 13 Pro'],
    quantityInStock: 9,
    minThreshold: 3,
    unitCost: 650,
    retailPrice: 2800,
    condition: 'OEM_New',
    lastRestocked: '2026-10-09'
  }
];

export const INITIAL_INSPECTIONS: DeviceInspection[] = [
  {
    id: 'insp_001',
    trackingNumber: 'RPL-MUJ-8942',
    customerId: 'user_cust_1',
    customerName: 'Aarav Sharma',
    customerEmail: 'aarav.sharma@jaipur.manipal.edu',
    category: 'smartphone',
    brand: 'Apple',
    model: 'iPhone 13 Pro',
    specs: {
      storage: '256 GB',
      color: 'Sierra Blue',
      serialNumber: 'C39DN8XK0D6',
      imeiOrServiceTag: '354892110294812',
      isAuthenticOem: true,
      oemVerification: {
        status: 'verified_authentic',
        database: 'Apple GSX Global Hardware Registry',
        registeredModel: 'iPhone 13 Pro (A2638) - Global / India Spec',
        activationLock: 'Clean & Unlocked (Ready for Service)',
        purchaseCountry: 'India (Authorized Retail Channel)',
        hardwareCoverage: 'Original OEM Motherboard & Cameras'
      }
    },
    ageMonths: 22,
    purchaseYear: 2024,
    conditionRating: 'fair',
    damages: [
      {
        id: 'dmg_1',
        type: 'screen_cracked',
        title: 'Front Screen Shattered with Spiderweb Cracks',
        category: 'display',
        severity: 'severe',
        description: 'Deep impact crack across front glass. Touch responsiveness is erratic in the top left quadrant.',
        estimatedFixTimeHours: 1.0,
        typicalPartNeeded: 'OLED Display Assembly'
      },
      {
        id: 'dmg_2',
        type: 'battery_degraded',
        title: 'Battery Health Degraded (76% Max Capacity)',
        category: 'battery',
        severity: 'moderate',
        description: 'Battery requires charging multiple times a day. Service warning triggered in iOS settings.',
        estimatedFixTimeHours: 0.5,
        typicalPartNeeded: '3095mAh High-Capacity Battery Pack'
      }
    ],
    functionalChecks: {
      powersOn: true,
      touchWorks: false,
      camerasWork: true,
      buttonsWork: true,
      dataErased: true,
      hasOriginalAccessories: true
    },
    photos: [
      {
        id: 'photo_1',
        angle: 'front',
        label: 'Front Screen Glass Fracture',
        url: DEVICE_SVG_PRESETS.smartphone_cracked,
        uploadedAt: '2026-10-14T09:12:00Z'
      },
      {
        id: 'photo_2',
        angle: 'back',
        label: 'Back Matte Glass (Pristine, No Cracks)',
        url: DEVICE_SVG_PRESETS.smartphone_back,
        uploadedAt: '2026-10-14T09:13:00Z'
      }
    ],
    notes: 'Dropped on pavement outside MUJ Academic Block 1. Looking for repair vs trade-in comparison.',
    submittedAt: '2026-10-14T09:15:00Z',
    status: 'quotes_received',
    aiValuation: {
      originalRetailPrice: 119900,
      depreciatedBaseValue: 42000,
      damageDeduction: 18000,
      estimatedWorth: 24000,
      refurbishedResaleValue: 38500,
      salvagePartsValue: 16500,
      recyclingMaterialsValue: 2200,
      confidenceScore: 0.94,
      rationale: [
        'Device age (22 months) retains ~52% of base generational value.',
        'Shattered OLED display incurs -₹14,000 deduction.',
        'Battery degraded (<80%) incurs -₹4,000 deduction.',
        'Chassis, motherboard, LiDAR and triple camera system are in Grade-A condition.'
      ]
    }
  },
  {
    id: 'insp_002',
    trackingNumber: 'RPL-MUJ-7731',
    customerId: 'user_cust_2',
    customerName: 'Devika Patel',
    customerEmail: 'devika.patel@jaipur.manipal.edu',
    category: 'laptop',
    brand: 'Apple',
    model: 'MacBook Pro 14" M1',
    specs: {
      storage: '512 GB SSD',
      ram: '16 GB',
      color: 'Space Gray',
      serialNumber: 'C02G94D8MD6M',
      imeiOrServiceTag: 'C02G94D8MD6M',
      isAuthenticOem: true,
      oemVerification: {
        status: 'verified_authentic',
        database: 'Apple Global Serial Validation & GSMA',
        registeredModel: 'MacBook Pro 14-inch (M1 Pro, 2021)',
        activationLock: 'Find My Mac Disabled (Clean)',
        purchaseCountry: 'India',
        hardwareCoverage: 'Authentic Apple Silicon Motherboard'
      }
    },
    ageMonths: 36,
    purchaseYear: 2023,
    conditionRating: 'poor',
    damages: [
      {
        id: 'dmg_3',
        type: 'screen_cracked',
        title: 'Liquid Retina XDR Internal Matrix Bleed',
        category: 'display',
        severity: 'severe',
        description: 'Vertical lines and black ink blotch covering 60% of screen.',
        estimatedFixTimeHours: 1.5,
        typicalPartNeeded: '14" Display Lid Assembly'
      }
    ],
    functionalChecks: {
      powersOn: true,
      touchWorks: true,
      camerasWork: true,
      buttonsWork: true,
      dataErased: false,
      hasOriginalAccessories: true
    },
    photos: [
      {
        id: 'photo_4',
        angle: 'front',
        label: 'Internal Display Matrix Shattered',
        url: DEVICE_SVG_PRESETS.laptop_screen,
        uploadedAt: '2026-10-15T08:00:00Z'
      }
    ],
    notes: 'Closed lid with pen inside in library. Still outputs HDMI display to external monitor.',
    submittedAt: '2026-10-15T08:05:00Z',
    status: 'pending_review',
    aiValuation: {
      originalRetailPrice: 194900,
      depreciatedBaseValue: 82000,
      damageDeduction: 36000,
      estimatedWorth: 46000,
      refurbishedResaleValue: 78000,
      salvagePartsValue: 38000,
      recyclingMaterialsValue: 3500,
      confidenceScore: 0.91,
      rationale: [
        'M1 Pro silicon retains strong commercial value.',
        'Mini-LED display lid replacement needed (-₹36,000).',
        'Logic board, 16GB RAM, battery and chassis remain pristine.'
      ]
    }
  }
];

export const INITIAL_OFFERS: ShopOffer[] = [
  {
    id: 'offer_apex_001',
    inspectionId: 'insp_001',
    shopId: 'shop_apex',
    shopName: 'Apex Precision Care - MUJ Campus Complex',
    shopLocation: 'Gate 2 Commercial Plaza, MUJ (0.8 km)',
    shopRating: 4.9,
    disposition: 'fix_and_return',
    proposedPrice: 220,
    usedInventoryParts: [
      {
        partId: 'part_apex_1',
        name: 'iPhone 13 Pro OLED Display (OEM)',
        sku: 'DISP-IP13P-OEM',
        unitCost: 85,
        chargedCost: 130,
        isInStock: true
      },
      {
        partId: 'part_apex_2',
        name: 'iPhone 13 Pro 3095mAh High-Capacity Battery Pack',
        sku: 'BATT-IP13P-OEM',
        unitCost: 22,
        chargedCost: 40,
        isInStock: true
      }
    ],
    totalPartsCost: 107,
    estimatedLaborHours: 1.5,
    laborRatePerHour: 450,
    totalLaborCost: 67.5,
    projectedProfit: 45.5,
    profitMarginPercent: 20.7,
    turnaroundDays: 1, // On campus!
    warrantyMonths: 12,
    notes: 'Located directly at MUJ Campus Gate 2! Same-day pickup between lectures. Genuine TrueTone calibrated.',
    createdAt: '2026-10-14T11:30:00Z',
    status: 'pending'
  },
  {
    id: 'offer_eco_001',
    inspectionId: 'insp_001',
    shopId: 'shop_ecorefurb',
    shopName: 'EcoRefurb Direct - Dehmi Kalan',
    shopLocation: 'Jaipur-Ajmer Expressway, Dehmi Kalan (2.3 km)',
    shopRating: 4.8,
    disposition: 'buy_and_refurbish',
    proposedPrice: 295, // Cash payout to Sarah!
    usedInventoryParts: [
      {
        partId: 'part_eco_1',
        name: 'iPhone 13 Pro Refurbished OLED Assembly',
        sku: 'DISP-IP13P-GRADEA',
        unitCost: 65,
        chargedCost: 65,
        isInStock: true
      }
    ],
    totalPartsCost: 65,
    estimatedLaborHours: 1.2,
    laborRatePerHour: 350,
    totalLaborCost: 42,
    projectedProfit: 88,
    profitMarginPercent: 29.8,
    turnaroundDays: 1,
    warrantyMonths: 0,
    notes: 'Instant cash payment! Free courier pickup from your MUJ hostel or apartment in Dehmi Kalan.',
    createdAt: '2026-10-14T12:15:00Z',
    status: 'pending'
  },
  {
    id: 'offer_silicon_001',
    inspectionId: 'insp_001',
    shopId: 'shop_silicon',
    shopName: 'Silicon Salvage - Bagru Industrial Hub',
    shopLocation: 'RIICO Industrial Area, Bagru (5.8 km)',
    shopRating: 4.7,
    disposition: 'sell_for_parts',
    proposedPrice: 190,
    usedInventoryParts: [],
    totalPartsCost: 0,
    estimatedLaborHours: 0.8,
    laborRatePerHour: 300,
    totalLaborCost: 24,
    projectedProfit: 76,
    profitMarginPercent: 28.5,
    turnaroundDays: 1,
    warrantyMonths: 0,
    notes: 'Parts harvest cash payout. We harvest the uncorrupted logic chips and camera for student lab supplies.',
    createdAt: '2026-10-14T13:00:00Z',
    status: 'pending'
  },
  {
    id: 'offer_green_001',
    inspectionId: 'insp_001',
    shopId: 'shop_greenmatrix',
    shopName: 'GreenMatrix E-Waste - Mahapura',
    shopLocation: 'Mahapura Industrial Zone (8.1 km)',
    shopRating: 4.9,
    disposition: 'recycle',
    proposedPrice: 35,
    usedInventoryParts: [],
    totalPartsCost: 0,
    estimatedLaborHours: 0.5,
    laborRatePerHour: 220,
    totalLaborCost: 11,
    projectedProfit: 16,
    profitMarginPercent: 32.0,
    turnaroundDays: 2,
    warrantyMonths: 0,
    notes: 'Certified Zero-Landfill recycling certificate + ₹3,000 green credit reward.',
    createdAt: '2026-10-14T14:10:00Z',
    status: 'pending'
  }
];

export const INITIAL_QUICK_REQUESTS: QuickDispositionRequest[] = [
  {
    id: 'quick_001',
    customerId: 'user_cust_1',
    customerName: 'Sarah Chen',
    customerEmail: 'sarah.chen@jaipur.manipal.edu',
    category: 'smartphone',
    brand: 'Samsung',
    model: 'Galaxy S20 FE',
    action: 'quick_sell_parts',
    estimatedPayout: 7500,
    pickupAddress: 'Hostel Block B4, Manipal University Jaipur, Dehmi Kalan',
    pickupTimeSlot: 'Today, 4:00 PM - 6:00 PM',
    createdAt: '2026-10-15T11:00:00Z',
    status: 'scheduled',
    trackingCode: 'QUICK-MUJ-9421'
  }
];
