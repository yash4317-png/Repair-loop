export type UserRole = 'customer' | 'shopkeeper' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  shopId?: string; // If shopkeeper
  avatar?: string;
  phone?: string;
}

export type DeviceCategory = 'smartphone' | 'laptop' | 'tablet' | 'smartwatch' | 'gaming' | 'audio';

export type DamageSeverity = 'minor' | 'moderate' | 'severe';

export type DamageType = 
  | 'screen_cracked'
  | 'screen_unresponsive'
  | 'battery_degraded'
  | 'battery_swollen'
  | 'chassis_damaged'
  | 'motherboard_fault'
  | 'water_damage'
  | 'camera_broken'
  | 'charging_port_failure'
  | 'speaker_mic_issue';

export interface DamageItem {
  id: string;
  type: DamageType;
  title: string;
  category: 'display' | 'battery' | 'housing' | 'board' | 'peripherals';
  severity: DamageSeverity;
  description: string;
  estimatedFixTimeHours: number;
  typicalPartNeeded: string;
}

export interface DevicePhoto {
  id: string;
  angle: 'front' | 'back' | 'screen_on' | 'damage_closeup' | 'other';
  label: string;
  url: string;
  uploadedAt: string;
}

export interface DeviceInspection {
  id: string;
  trackingNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  category: DeviceCategory;
  brand: string;
  model: string;
  specs: {
    storage?: string;
    ram?: string;
    color?: string;
    serialNumber?: string;
    imeiOrServiceTag?: string;
    isAuthenticOem?: boolean;
    oemVerification?: {
      status: 'verified_authentic' | 'unverified' | 'flagged';
      database: string;
      registeredModel: string;
      activationLock: string;
      purchaseCountry: string;
      hardwareCoverage: string;
    };
  };
  ageMonths: number;
  purchaseYear: number;
  conditionRating: 'mint' | 'good' | 'fair' | 'poor' | 'broken';
  damages: DamageItem[];
  functionalChecks: {
    powersOn: boolean;
    touchWorks: boolean;
    camerasWork: boolean;
    buttonsWork: boolean;
    dataErased: boolean;
    hasOriginalAccessories: boolean;
  };
  photos: DevicePhoto[];
  notes: string;
  submittedAt: string;
  status: 'pending_review' | 'quotes_received' | 'accepted' | 'in_repair' | 'completed' | 'recycled';
  
  // AI Valuation details
  aiValuation: {
    originalRetailPrice: number;
    depreciatedBaseValue: number;
    damageDeduction: number;
    estimatedWorth: number; // Current value as-is
    refurbishedResaleValue: number; // Value once fully repaired
    salvagePartsValue: number; // Value if parted out
    recyclingMaterialsValue: number;
    confidenceScore: number;
    rationale: string[];
  };
  
  acceptedOfferId?: string;
  assignedTechnicianId?: string;
}

export interface InventoryPart {
  id: string;
  shopId: string;
  sku: string;
  name: string;
  category: 'display' | 'battery' | 'housing' | 'board' | 'peripherals' | 'cable';
  compatibleModels: string[];
  quantityInStock: number;
  minThreshold: number;
  unitCost: number; // What shop paid to buy this part
  retailPrice: number; // Recommended customer charge
  condition: 'OEM_New' | 'Aftermarket_A' | 'Refurbished' | 'Harvested';
  lastRestocked: string;
}

export type DispositionChoice = 'fix_and_return' | 'buy_and_refurbish' | 'sell_for_parts' | 'recycle';

export interface ShopOffer {
  id: string;
  inspectionId: string;
  shopId: string;
  shopName: string;
  shopLocation: string;
  shopRating: number;
  disposition: DispositionChoice;
  
  // Financial breakdown
  proposedPrice: number;
  usedInventoryParts: {
    partId: string;
    name: string;
    sku: string;
    unitCost: number;
    chargedCost: number;
    isInStock: boolean;
  }[];
  totalPartsCost: number;
  estimatedLaborHours: number;
  laborRatePerHour: number;
  totalLaborCost: number;
  projectedProfit: number;
  profitMarginPercent: number;
  
  // Delivery & Service terms
  turnaroundDays: number;
  warrantyMonths: number;
  notes: string;
  assignedTechnicianId?: string;
  createdAt: string;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
}

export interface Technician {
  id: string;
  shopId: string;
  name: string;
  role: string;
  avatar: string;
  certifications: string[];
  experienceYears: number;
  rating: number;
  activeBenchJob?: {
    deviceId: string;
    deviceModel: string;
    task: string;
    startedAt: string;
    estCompletionMin: number;
  };
}

export interface AuthorizedShop {
  id: string;
  name: string;
  location: string;
  areaName: string; // e.g. Dehmi Kalan, Bagru, Mahapura
  coordinates: {
    lat: number;
    lng: number;
    x: number; // Map SVG coord
    y: number; // Map SVG coord
  };
  distanceKmFromMUJ: number;
  travelTimeMin: number;
  rating: number;
  specialties: string[];
  authorizedBrands: string[];
  technicianCapacity: number;
  activeJobs: number;
  laborRatePerHour: number;
  avatarUrl: string;
  certifications: string[];
  technicians: Technician[];
}

export interface QuickDispositionRequest {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  category: DeviceCategory;
  brand: string;
  model: string;
  action: 'quick_sell_parts' | 'quick_recycle';
  estimatedPayout: number;
  pickupAddress: string;
  pickupTimeSlot: string;
  createdAt: string;
  status: 'scheduled' | 'picked_up' | 'paid';
  trackingCode: string;
}

export interface RecommendationResult {
  bestOfferId: string;
  recommendedDisposition: DispositionChoice;
  confidenceScore: number;
  headline: string;
  executiveSummary: string;
  comparisonPoints: {
    title: string;
    value: string;
    badge?: string;
  }[];
  reasons: string[];
  tradeOffs: string[];
  circularityScore: number;
}

export interface MultiAgentLogisticsTrace {
  stepNumber: number;
  timestamp: string;
  agentName: string;
  agentRole: 'Customer' | 'Carrier' | 'Repair Depot' | 'Parts Supplier' | 'Refurbisher' | 'Recycler';
  action: string;
  decisionReason: string;
  costImpact: number;
  capacityImpact: string;
  carbonSavedKg: number;
}

// Graph interfaces for MUJ 10km network
export interface RoadGraphNode {
  id: string;
  name: string;
  type: 'muj_campus' | 'service_center' | 'transit_junction' | 'industrial_hub';
  lat: number;
  lng: number;
  x: number; // SVG projection
  y: number; // SVG projection
  distanceKmFromMUJ: number;
  shopId?: string;
}

export interface RoadGraphEdge {
  id: string;
  from: string;
  to: string;
  distanceKm: number;
  speedLimitKmh: number;
  roadName: string;
}
