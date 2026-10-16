import bcrypt from 'bcryptjs';
import { getPool, initDatabase } from './db.js';

const DEMO_PASSWORD = 'demo123';

function avatar(initials, color) {
  return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="%23${color}"/><text x="50" y="62" fill="%23ffffff" font-family="sans-serif" font-size="36" font-weight="bold" text-anchor="middle">${initials}</text></svg>`;
}

const PHOTO_CRACKED = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500"><rect width="400" height="500" rx="28" fill="%23090d16"/><rect x="24" y="24" width="352" height="452" rx="20" fill="%23131c2e"/><line x1="80" y1="80" x2="220" y2="280" stroke="%2338bdf8" stroke-width="2"/><text x="200" y="468" fill="%23e2e8f0" font-size="14" text-anchor="middle" font-family="sans-serif">Cracked OLED</text></svg>';
const PHOTO_BACK = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500"><rect width="400" height="500" rx="28" fill="%23090d16"/><rect x="24" y="24" width="352" height="452" rx="20" fill="%231e293b"/><text x="200" y="468" fill="%2394a3b8" font-size="14" text-anchor="middle" font-family="sans-serif">Rear glass</text></svg>';
const PHOTO_LAPTOP = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 350"><rect width="500" height="350" rx="16" fill="%23090d16"/><rect x="40" y="30" width="420" height="250" rx="10" fill="%231e293b"/><line x1="120" y1="60" x2="260" y2="240" stroke="%23f43f5e" stroke-width="3"/><text x="250" y="330" fill="%23e2e8f0" font-size="14" text-anchor="middle" font-family="sans-serif">Display bleed</text></svg>';

export async function seedDatabase(force = false) {
  const db = await getPool();
  const [countRows] = await db.query('SELECT COUNT(*) AS c FROM users');
  if (countRows[0].c > 0 && !force) return { seeded: false, message: 'Database already has data' };

  await db.query('SET FOREIGN_KEY_CHECKS = 0');
  await db.query('TRUNCATE TABLE quick_requests');
  await db.query('TRUNCATE TABLE offers');
  await db.query('TRUNCATE TABLE inspections');
  await db.query('TRUNCATE TABLE inventory_parts');
  await db.query('TRUNCATE TABLE technicians');
  await db.query('TRUNCATE TABLE users');
  await db.query('TRUNCATE TABLE shops');
  await db.query('SET FOREIGN_KEY_CHECKS = 1');

  const passwordHash = bcrypt.hashSync(DEMO_PASSWORD, 10);

  const shops = [
    ['shop_apex', 'Apex Precision Care - MUJ Campus Complex', 'Gate 2 Commercial Plaza, Manipal University Jaipur', 'MUJ Campus / Dehmi Kalan', 26.845, 75.567, 260, 190, 0.8, 3, 4.9, ['OEM Screen Replacements', 'Micro-soldering', 'Fast Student Turnaround'], ['Apple', 'Samsung', 'Dell', 'HP'], 5, 2, 450, avatar('MV', 'd97706'), ['Apple Authorized Service Provider', 'Samsung Care+', 'IPC-A-610']],
    ['shop_ecorefurb', 'EcoRefurb Direct - Dehmi Kalan Tech Park', 'Near Toll Plaza, Jaipur-Ajmer Expressway, Dehmi Kalan', 'Dehmi Kalan (2.3 km)', 26.8375, 75.581, 340, 240, 2.3, 6, 4.8, ['Buyouts & Resale Refurbishing', 'MacBook Upgrades', 'Grade-A Resale'], ['Apple', 'Lenovo', 'HP', 'Sony'], 8, 3, 350, avatar('ER', '0d9488'), ['R2v3 Certified Refurbisher', 'e-Stewards Partner', 'ISO 14001']],
    ['shop_silicon', 'Silicon Salvage & Board Lab - Bagru Industrial Hub', 'RIICO Industrial Area, Phase II, Bagru', 'Bagru Industrial Area (5.8 km)', 26.812, 75.541, 130, 360, 5.8, 12, 4.7, ['Component Harvesting', 'Motherboard Salvage', 'Rare Laptop Boards'], ['All Brands', 'Gaming PCs', 'Tablets'], 6, 2, 300, avatar('TA', '7c3aed'), ['Hardware Harvesting Certified', 'Zero Landfill Partner']],
    ['shop_greenmatrix', 'GreenMatrix E-Waste Depot - Mahapura Center', 'Mahapura Industrial Zone, Ajmer Highway', 'Mahapura Logistics (8.1 km)', 26.862, 75.645, 450, 120, 8.1, 16, 4.9, ['Safe E-Waste Dismantling', 'Precious Metal Hydrometallurgy'], ['All Electronics'], 10, 3, 220, avatar('DM', '0284c7'), ['WEEE Certified', 'RPCB Gold']],
    ['shop_bhankrota', 'Jaipur West Electronics Care - Bhankrota Junction', 'Bhankrota Main Crossroad, Sirsi Road Junction', 'Bhankrota (9.7 km)', 26.871, 75.682, 530, 70, 9.7, 19, 4.8, ['High-Volume Repairs', 'Screen Glass Lamination', 'Quick Battery Swap'], ['OnePlus', 'Xiaomi', 'Apple', 'Dell'], 7, 4, 280, avatar('SC', '059669'), ['ISO 9001 Certified Repair Facility']]
  ];

  for (const s of shops) {
    await db.query(
      `INSERT INTO shops (id, name, location, area_name, lat, lng, map_x, map_y, distance_km, travel_time_min, rating, specialties, authorized_brands, technician_capacity, active_jobs, labor_rate_per_hour, avatar_url, certifications)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      s.map((v, i) => (i === 11 || i === 12 || i === 17 ? JSON.stringify(v) : v))
    );
  }

  const users = [
    ['user_cust_1', 'Sarah Chen (MUJ Student)', 'sarah.chen@jaipur.manipal.edu', 'customer', null, '+91 98290 12345', avatar('SC', '059669')],
    ['user_cust_2', 'David Miller', 'david.m@example.com', 'customer', null, '+91 94140 54321', avatar('DM', '0284c7')],
    ['user_shop_1', 'Marcus Vance (Apex Tech Lead)', 'marcus@apexrepair.in', 'shopkeeper', 'shop_apex', '+91 98280 34567', avatar('MV', 'd97706')],
    ['user_shop_2', 'Elena Rostova (EcoRefurb)', 'elena@ecorefurb.in', 'shopkeeper', 'shop_ecorefurb', '+91 98299 87654', avatar('ER', '0d9488')],
    ['user_shop_3', 'Tariq Al-Mansoor (Bagru Parts)', 'tariq@siliconsalvage.in', 'shopkeeper', 'shop_silicon', '+91 98285 45678', avatar('TA', '7c3aed')]
  ];

  for (const u of users) {
    await db.query(
      `INSERT INTO users (id, name, email, password_hash, role, shop_id, phone, avatar)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [u[0], u[1], u[2], passwordHash, u[3], u[4], u[5], u[6]]
    );
  }

  const techs = [
    ['tech_1', 'shop_apex', 'Ramesh Sharma', 'Master Micro-soldering Tech', avatar('RS', 'ea580c'), ['Apple Certified Mac Tech (ACMT)', 'IPC-7711/7721 Rework Specialist'], 8, 4.9, 'insp_001', 'iPhone 13 Pro', 'TrueTone OLED calibration & laser bezel bonding', '10:15 AM', 35],
    ['tech_2', 'shop_apex', 'Pooja Verma', 'Display & Battery Specialist', avatar('PV', 'ec4899'), ['Samsung Certified Mobile Tech', 'Battery Safety Handling Level 3'], 5, 4.8, 'insp_005', 'Dell XPS 15', 'Battery swelling replacement & thermal paste repaste', '10:45 AM', 20],
    ['tech_3', 'shop_apex', 'Arjun Mehta', 'Diagnostic & Quality Engineer', avatar('AM', '6366f1'), ['CompTIA A+', 'ESD Control Supervisor'], 4, 4.7, null, null, null, null, null],
    ['tech_4', 'shop_ecorefurb', 'Vikram Rathore', 'Refurbishment Lead Engineer', avatar('VR', 'ea580c'), ['R2v3 Circular Electronics Inspector', 'SMT Soldering'], 6, 4.9, null, null, null, null, null]
  ];

  for (const t of techs) {
    await db.query(
      `INSERT INTO technicians (id, shop_id, name, role_title, avatar, certifications, experience_years, rating, bench_device_id, bench_model, bench_task, bench_started_at, bench_est_min)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [t[0], t[1], t[2], t[3], t[4], JSON.stringify(t[5]), t[6], t[7], t[8], t[9], t[10], t[11], t[12]]
    );
  }

  const parts = [
    ['part_apex_1', 'shop_apex', 'DISP-IP13P-OEM', 'iPhone 13 Pro Super Retina XDR OLED Display (OEM)', 'display', ['iPhone 13 Pro'], 4, 2, 6800, 15600, 'OEM_New', '2026-10-01'],
    ['part_apex_2', 'shop_apex', 'BATT-IP13P-OEM', 'iPhone 13 Pro 3095mAh High-Capacity Battery Pack', 'battery', ['iPhone 13 Pro'], 8, 3, 1800, 4800, 'OEM_New', '2026-10-08'],
    ['part_apex_3', 'shop_apex', 'CAM-IP13P-TRIPLE', 'iPhone 13 Pro Triple Camera Module Assembly', 'peripherals', ['iPhone 13 Pro'], 2, 1, 4400, 10500, 'OEM_New', '2026-09-20'],
    ['part_apex_4', 'shop_apex', 'DISP-MBP14-M1', 'MacBook Pro 14" Liquid Retina XDR Display Lid Assembly', 'display', ['MacBook Pro 14" M1', 'MacBook Pro 14" M2'], 1, 1, 24000, 42000, 'Refurbished', '2026-09-15'],
    ['part_apex_5', 'shop_apex', 'BATT-S23U-5000', 'Samsung Galaxy S23 Ultra 5000mAh Battery Cell', 'battery', ['Galaxy S23 Ultra'], 6, 2, 1900, 5200, 'OEM_New', '2026-10-05'],
    ['part_eco_1', 'shop_ecorefurb', 'DISP-IP13P-GRADEA', 'iPhone 13 Pro Refurbished Original OLED Assembly', 'display', ['iPhone 13 Pro'], 3, 2, 5200, 12800, 'Refurbished', '2026-10-02'],
    ['part_eco_2', 'shop_ecorefurb', 'BATT-IP13P-CERT', 'iPhone 13 Pro High-Cycle Tested Battery', 'battery', ['iPhone 13 Pro'], 12, 4, 1400, 4200, 'Aftermarket_A', '2026-10-10'],
    ['part_eco_3', 'shop_ecorefurb', 'CASE-IP13P-GRAPHITE', 'iPhone 13 Pro Stainless Steel Chassis & Rear Glass', 'housing', ['iPhone 13 Pro'], 2, 1, 3200, 7500, 'Harvested', '2026-09-28'],
    ['part_silicon_1', 'shop_silicon', 'LOGIC-IP13P-UNLOCKED', 'iPhone 13 Pro Logic Board 256GB (Tested Working)', 'board', ['iPhone 13 Pro'], 1, 1, 8800, 19500, 'Harvested', '2026-09-18'],
    ['part_silicon_2', 'shop_silicon', 'PORT-IP13P-FLEX', 'iPhone 13 Pro Lightning Charge Port & Mic Flex Cable', 'cable', ['iPhone 13 Pro'], 9, 3, 650, 2800, 'OEM_New', '2026-10-09']
  ];

  for (const p of parts) {
    await db.query(
      `INSERT INTO inventory_parts (id, shop_id, sku, name, category, compatible_models, quantity_in_stock, min_threshold, unit_cost, retail_price, part_condition, last_restocked)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [p[0], p[1], p[2], p[3], p[4], JSON.stringify(p[5]), p[6], p[7], p[8], p[9], p[10], p[11]]
    );
  }

  const insp1 = {
    id: 'insp_001',
    trackingNumber: 'RPL-MUJ-8942',
    customerId: 'user_cust_1',
    customerName: 'Sarah Chen',
    customerEmail: 'sarah.chen@jaipur.manipal.edu',
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
      { id: 'dmg_1', type: 'screen_cracked', title: 'Front Screen Shattered with Spiderweb Cracks', category: 'display', severity: 'severe', description: 'Deep impact crack across front glass.', estimatedFixTimeHours: 1, typicalPartNeeded: 'OLED Display Assembly' },
      { id: 'dmg_2', type: 'battery_degraded', title: 'Battery Health Degraded (76% Max Capacity)', category: 'battery', severity: 'moderate', description: 'Needs charging multiple times a day.', estimatedFixTimeHours: 0.5, typicalPartNeeded: '3095mAh High-Capacity Battery Pack' }
    ],
    functionalChecks: { powersOn: true, touchWorks: false, camerasWork: true, buttonsWork: true, dataErased: true, hasOriginalAccessories: true },
    photos: [
      { id: 'photo_1', angle: 'front', label: 'Front Screen Glass Fracture', url: PHOTO_CRACKED, uploadedAt: '2026-10-14T09:12:00Z' },
      { id: 'photo_2', angle: 'back', label: 'Back Matte Glass (Pristine)', url: PHOTO_BACK, uploadedAt: '2026-10-14T09:13:00Z' }
    ],
    notes: 'Dropped on pavement outside MUJ Academic Block 1.',
    submittedAt: '2026-10-14 09:15:00',
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
      rationale: ['Device age (22 months) retains ~52% of base value.', 'Shattered OLED display incurs -₹14,000.', 'Battery degraded (<80%) incurs -₹4,000.']
    }
  };

  const insp2 = {
    id: 'insp_002',
    trackingNumber: 'RPL-MUJ-7731',
    customerId: 'user_cust_2',
    customerName: 'David Miller',
    customerEmail: 'david.m@example.com',
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
        database: 'Apple Global Serial Validation',
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
      { id: 'dmg_3', type: 'screen_cracked', title: 'Liquid Retina XDR Internal Matrix Bleed', category: 'display', severity: 'severe', description: 'Vertical lines covering 60% of screen.', estimatedFixTimeHours: 1.5, typicalPartNeeded: '14" Display Lid Assembly' }
    ],
    functionalChecks: { powersOn: true, touchWorks: true, camerasWork: true, buttonsWork: true, dataErased: false, hasOriginalAccessories: true },
    photos: [{ id: 'photo_4', angle: 'front', label: 'Internal Display Matrix Shattered', url: PHOTO_LAPTOP, uploadedAt: '2026-10-15T08:00:00Z' }],
    notes: 'Closed lid with pen inside in library.',
    submittedAt: '2026-10-15 08:05:00',
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
      rationale: ['M1 Pro silicon retains strong commercial value.', 'Mini-LED display lid replacement needed.']
    }
  };

  for (const insp of [insp1, insp2]) {
    await db.query(
      `INSERT INTO inspections (id, tracking_number, customer_id, customer_name, customer_email, category, brand, model, specs, age_months, purchase_year, condition_rating, damages, functional_checks, photos, notes, submitted_at, status, ai_valuation)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [insp.id, insp.trackingNumber, insp.customerId, insp.customerName, insp.customerEmail, insp.category, insp.brand, insp.model, JSON.stringify(insp.specs), insp.ageMonths, insp.purchaseYear, insp.conditionRating, JSON.stringify(insp.damages), JSON.stringify(insp.functionalChecks), JSON.stringify(insp.photos), insp.notes, insp.submittedAt, insp.status, JSON.stringify(insp.aiValuation)]
    );
  }

  const offers = [
    ['offer_apex_001', 'insp_001', 'shop_apex', 'Apex Precision Care - MUJ Campus Complex', 'Gate 2 Commercial Plaza, MUJ (0.8 km)', 4.9, 'fix_and_return', 220, [{ partId: 'part_apex_1', name: 'iPhone 13 Pro OLED Display (OEM)', sku: 'DISP-IP13P-OEM', unitCost: 85, chargedCost: 130, isInStock: true }, { partId: 'part_apex_2', name: 'iPhone 13 Pro 3095mAh High-Capacity Battery Pack', sku: 'BATT-IP13P-OEM', unitCost: 22, chargedCost: 40, isInStock: true }], 107, 1.5, 450, 67.5, 45.5, 20.7, 1, 12, 'Located directly at MUJ Campus Gate 2! Same-day pickup between lectures.', '2026-10-14 11:30:00', 'pending'],
    ['offer_eco_001', 'insp_001', 'shop_ecorefurb', 'EcoRefurb Direct - Dehmi Kalan', 'Jaipur-Ajmer Expressway, Dehmi Kalan (2.3 km)', 4.8, 'buy_and_refurbish', 295, [{ partId: 'part_eco_1', name: 'iPhone 13 Pro Refurbished OLED Assembly', sku: 'DISP-IP13P-GRADEA', unitCost: 65, chargedCost: 65, isInStock: true }], 65, 1.2, 350, 42, 88, 29.8, 1, 0, 'Instant cash payment! Free courier pickup from MUJ hostel.', '2026-10-14 12:15:00', 'pending'],
    ['offer_silicon_001', 'insp_001', 'shop_silicon', 'Silicon Salvage - Bagru Industrial Hub', 'RIICO Industrial Area, Bagru (5.8 km)', 4.7, 'sell_for_parts', 190, [], 0, 0.8, 300, 24, 76, 28.5, 1, 0, 'Parts harvest cash payout for student lab supplies.', '2026-10-14 13:00:00', 'pending'],
    ['offer_green_001', 'insp_001', 'shop_greenmatrix', 'GreenMatrix E-Waste - Mahapura', 'Mahapura Industrial Zone (8.1 km)', 4.9, 'recycle', 35, [], 0, 0.5, 220, 11, 16, 32, 2, 0, 'Certified Zero-Landfill recycling certificate.', '2026-10-14 14:10:00', 'pending']
  ];

  for (const o of offers) {
    await db.query(
      `INSERT INTO offers (id, inspection_id, shop_id, shop_name, shop_location, shop_rating, disposition, proposed_price, used_inventory_parts, total_parts_cost, estimated_labor_hours, labor_rate_per_hour, total_labor_cost, projected_profit, profit_margin_percent, turnaround_days, warranty_months, notes, created_at, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [o[0], o[1], o[2], o[3], o[4], o[5], o[6], o[7], JSON.stringify(o[8]), o[9], o[10], o[11], o[12], o[13], o[14], o[15], o[16], o[17], o[18], o[19]]
    );
  }

  await db.query(
    `INSERT INTO quick_requests (id, customer_id, customer_name, customer_email, category, brand, model, action, estimated_payout, pickup_address, pickup_time_slot, created_at, status, tracking_code)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ['quick_001', 'user_cust_1', 'Sarah Chen', 'sarah.chen@jaipur.manipal.edu', 'smartphone', 'Samsung', 'Galaxy S20 FE', 'quick_sell_parts', 7500, 'Hostel Block B4, Manipal University Jaipur, Dehmi Kalan', 'Today, 4:00 PM - 6:00 PM', '2026-10-15 11:00:00', 'scheduled', 'QUICK-MUJ-9421']
  );

  return { seeded: true, demoPassword: DEMO_PASSWORD };
}

const isDirectRun = process.argv[1] && process.argv[1].replace(/\\/g, '/').endsWith('/seed.js');
if (isDirectRun) {
  const force = process.argv.includes('--force');
  initDatabase()
    .then(() => seedDatabase(force || true))
    .then(result => {
      console.log('Seed complete', result);
      process.exit(0);
    })
    .catch(err => {
      console.error(err);
      process.exit(1);
    });
}
