import { DamageItem, DeviceCategory } from '../types';

interface ValuationInput {
  category: DeviceCategory;
  brand: string;
  model: string;
  ageMonths: number;
  damages: DamageItem[];
  functionalChecks: {
    powersOn: boolean;
    touchWorks: boolean;
    camerasWork: boolean;
    buttonsWork: boolean;
  };
}

export function calculateDeviceValuation(input: ValuationInput) {
  // Baseline retail prices by brand / model heuristic (in Indian Rupees ₹)
  let baseRetailPrice = 69900;
  const modelUpper = input.model.toUpperCase();
  const brandUpper = input.brand.toUpperCase();

  if (input.category === 'smartphone') {
    if (modelUpper.includes('PRO MAX') || modelUpper.includes('ULTRA')) baseRetailPrice = 129900;
    else if (modelUpper.includes('PRO') || modelUpper.includes('PLUS')) baseRetailPrice = 99900;
    else if (brandUpper.includes('APPLE') || brandUpper.includes('SAMSUNG')) baseRetailPrice = 79900;
    else baseRetailPrice = 49900;
  } else if (input.category === 'laptop') {
    if (modelUpper.includes('MACBOOK PRO') || modelUpper.includes('DELL XPS')) baseRetailPrice = 189900;
    else if (modelUpper.includes('MACBOOK AIR') || modelUpper.includes('THINKPAD')) baseRetailPrice = 119900;
    else baseRetailPrice = 74900;
  } else if (input.category === 'tablet') {
    if (modelUpper.includes('PRO')) baseRetailPrice = 84900;
    else baseRetailPrice = 44900;
  } else if (input.category === 'smartwatch') {
    baseRetailPrice = 34900;
  } else {
    baseRetailPrice = 39900;
  }

  // Depreciation curve based on age in months (standard electronics depreciation)
  // Value = Base * (0.85 ^ (age / 12))
  const ageYears = Math.max(0.1, input.ageMonths / 12);
  const depreciationFactor = Math.max(0.20, Math.pow(0.72, ageYears));
  const depreciatedBaseValue = Math.round(baseRetailPrice * depreciationFactor);

  // Damage deductions calculation (in Indian Rupees ₹)
  let damageDeduction = 0;
  const rationale: string[] = [];

  rationale.push(`Estimated original MSRP: ₹${baseRetailPrice.toLocaleString('en-IN')}.`);
  rationale.push(`Age of ${input.ageMonths} months retains ~${Math.round(depreciationFactor * 100)}% base value (₹${depreciatedBaseValue.toLocaleString('en-IN')}).`);

  input.damages.forEach(dmg => {
    let penalty = 0;
    if (dmg.category === 'display') {
      penalty = dmg.severity === 'severe' ? 14500 : dmg.severity === 'moderate' ? 9500 : 4500;
      rationale.push(`Display damage (${dmg.severity}): -₹${penalty.toLocaleString('en-IN')}`);
    } else if (dmg.category === 'battery') {
      penalty = dmg.severity === 'severe' ? 5800 : 3800;
      rationale.push(`Battery degradation (${dmg.severity}): -₹${penalty.toLocaleString('en-IN')}`);
    } else if (dmg.category === 'board') {
      penalty = dmg.severity === 'severe' ? 19000 : 11000;
      rationale.push(`Logic board / power issue: -₹${penalty.toLocaleString('en-IN')}`);
    } else if (dmg.category === 'housing') {
      penalty = dmg.severity === 'severe' ? 6800 : 3200;
      rationale.push(`Chassis / cosmetic damage: -₹${penalty.toLocaleString('en-IN')}`);
    } else if (dmg.category === 'peripherals') {
      penalty = 5200;
      rationale.push(`Camera / peripheral fault: -₹${penalty.toLocaleString('en-IN')}`);
    }
    damageDeduction += penalty;
  });

  if (!input.functionalChecks.powersOn) {
    damageDeduction += 9500;
    rationale.push('Device does not power on: -₹9,500 diagnostic penalty');
  }

  // Cap damage deduction so worth doesn't go below scrap threshold
  const salvageFloor = Math.max(2000, Math.round(depreciatedBaseValue * 0.22));
  const estimatedWorth = Math.max(salvageFloor, depreciatedBaseValue - damageDeduction);
  
  // Refurbished market resale price (once fully repaired and certified)
  const refurbishedResaleValue = Math.round(depreciatedBaseValue * 0.92);

  // Harvestable parts salvage value (logic board, camera, chassis if undamaged)
  const salvagePartsValue = Math.round(depreciatedBaseValue * 0.45);

  // Raw recycling materials recovery value (gold, copper, lithium, aluminum)
  const recyclingMaterialsValue = input.category === 'laptop' ? 3500 : input.category === 'smartphone' ? 2000 : 1500;

  return {
    originalRetailPrice: baseRetailPrice,
    depreciatedBaseValue,
    damageDeduction,
    estimatedWorth,
    refurbishedResaleValue,
    salvagePartsValue,
    recyclingMaterialsValue,
    confidenceScore: 0.93,
    rationale
  };
}
