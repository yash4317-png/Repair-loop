import { parseJson, toNumber } from './db.js';

export function publicUser(row) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role,
    shopId: row.shop_id || undefined,
    phone: row.phone || undefined,
    avatar: row.avatar || undefined
  };
}

export function mapTechnician(row) {
  const tech = {
    id: row.id,
    shopId: row.shop_id,
    name: row.name,
    role: row.role_title,
    avatar: row.avatar,
    certifications: parseJson(row.certifications, []),
    experienceYears: toNumber(row.experience_years),
    rating: toNumber(row.rating)
  };
  if (row.bench_device_id) {
    tech.activeBenchJob = {
      deviceId: row.bench_device_id,
      deviceModel: row.bench_model,
      task: row.bench_task,
      startedAt: row.bench_started_at,
      estCompletionMin: toNumber(row.bench_est_min)
    };
  }
  return tech;
}

export function mapShop(row, technicians = []) {
  return {
    id: row.id,
    name: row.name,
    location: row.location,
    areaName: row.area_name,
    coordinates: {
      lat: toNumber(row.lat),
      lng: toNumber(row.lng),
      x: toNumber(row.map_x),
      y: toNumber(row.map_y)
    },
    distanceKmFromMUJ: toNumber(row.distance_km),
    travelTimeMin: toNumber(row.travel_time_min),
    rating: toNumber(row.rating),
    specialties: parseJson(row.specialties, []),
    authorizedBrands: parseJson(row.authorized_brands, []),
    technicianCapacity: toNumber(row.technician_capacity),
    activeJobs: toNumber(row.active_jobs),
    laborRatePerHour: toNumber(row.labor_rate_per_hour),
    avatarUrl: row.avatar_url,
    certifications: parseJson(row.certifications, []),
    technicians: technicians.filter(t => t.shopId === row.id)
  };
}

export function mapPart(row) {
  return {
    id: row.id,
    shopId: row.shop_id,
    sku: row.sku,
    name: row.name,
    category: row.category,
    compatibleModels: parseJson(row.compatible_models, []),
    quantityInStock: toNumber(row.quantity_in_stock),
    minThreshold: toNumber(row.min_threshold),
    unitCost: toNumber(row.unit_cost),
    retailPrice: toNumber(row.retail_price),
    condition: row.part_condition,
    lastRestocked: row.last_restocked instanceof Date
      ? row.last_restocked.toISOString().slice(0, 10)
      : String(row.last_restocked).slice(0, 10)
  };
}

export function mapInspection(row) {
  return {
    id: row.id,
    trackingNumber: row.tracking_number,
    customerId: row.customer_id,
    customerName: row.customer_name,
    customerEmail: row.customer_email,
    category: row.category,
    brand: row.brand,
    model: row.model,
    specs: parseJson(row.specs, {}),
    ageMonths: toNumber(row.age_months),
    purchaseYear: toNumber(row.purchase_year),
    conditionRating: row.condition_rating,
    damages: parseJson(row.damages, []),
    functionalChecks: parseJson(row.functional_checks, {}),
    photos: parseJson(row.photos, []),
    notes: row.notes || '',
    submittedAt: row.submitted_at instanceof Date ? row.submitted_at.toISOString() : row.submitted_at,
    status: row.status,
    aiValuation: parseJson(row.ai_valuation, {}),
    acceptedOfferId: row.accepted_offer_id || undefined,
    assignedTechnicianId: row.assigned_technician_id || undefined
  };
}

export function mapOffer(row) {
  return {
    id: row.id,
    inspectionId: row.inspection_id,
    shopId: row.shop_id,
    shopName: row.shop_name,
    shopLocation: row.shop_location,
    shopRating: toNumber(row.shop_rating),
    disposition: row.disposition,
    proposedPrice: toNumber(row.proposed_price),
    usedInventoryParts: parseJson(row.used_inventory_parts, []),
    totalPartsCost: toNumber(row.total_parts_cost),
    estimatedLaborHours: toNumber(row.estimated_labor_hours),
    laborRatePerHour: toNumber(row.labor_rate_per_hour),
    totalLaborCost: toNumber(row.total_labor_cost),
    projectedProfit: toNumber(row.projected_profit),
    profitMarginPercent: toNumber(row.profit_margin_percent),
    turnaroundDays: toNumber(row.turnaround_days),
    warrantyMonths: toNumber(row.warranty_months),
    notes: row.notes || '',
    createdAt: row.created_at instanceof Date ? row.created_at.toISOString() : row.created_at,
    status: row.status
  };
}

export function mapQuickRequest(row) {
  return {
    id: row.id,
    customerId: row.customer_id,
    customerName: row.customer_name,
    customerEmail: row.customer_email,
    category: row.category,
    brand: row.brand,
    model: row.model,
    action: row.action,
    estimatedPayout: toNumber(row.estimated_payout),
    pickupAddress: row.pickup_address,
    pickupTimeSlot: row.pickup_time_slot,
    createdAt: row.created_at instanceof Date ? row.created_at.toISOString() : row.created_at,
    status: row.status,
    trackingCode: row.tracking_code
  };
}

export async function loadBootstrap(db) {
  const [users] = await db.query('SELECT * FROM users ORDER BY created_at ASC');
  const [shops] = await db.query('SELECT * FROM shops');
  const [technicians] = await db.query('SELECT * FROM technicians');
  const [inventory] = await db.query('SELECT * FROM inventory_parts');
  const [inspections] = await db.query('SELECT * FROM inspections ORDER BY submitted_at DESC');
  const [offers] = await db.query('SELECT * FROM offers ORDER BY created_at DESC');
  const [quickRequests] = await db.query('SELECT * FROM quick_requests ORDER BY created_at DESC');

  const mappedTechs = technicians.map(mapTechnician);
  return {
    users: users.map(publicUser),
    shops: shops.map(row => mapShop(row, mappedTechs)),
    technicians: mappedTechs,
    inventory: inventory.map(mapPart),
    inspections: inspections.map(mapInspection),
    offers: offers.map(mapOffer),
    quickRequests: quickRequests.map(mapQuickRequest)
  };
}
