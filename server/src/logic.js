export function calculateDeviceValuation(input) {
  let baseRetailPrice = 69900;
  const modelUpper = (input.model || '').toUpperCase();
  const brandUpper = (input.brand || '').toUpperCase();

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
    baseRetailPrice = modelUpper.includes('PRO') ? 84900 : 44900;
  } else if (input.category === 'smartwatch') {
    baseRetailPrice = 34900;
  } else {
    baseRetailPrice = 39900;
  }

  const ageYears = Math.max(0.1, (input.ageMonths || 0) / 12);
  const depreciationFactor = Math.max(0.2, Math.pow(0.72, ageYears));
  const depreciatedBaseValue = Math.round(baseRetailPrice * depreciationFactor);

  let damageDeduction = 0;
  const rationale = [];
  rationale.push(`Estimated original MSRP: ₹${baseRetailPrice.toLocaleString('en-IN')}.`);
  rationale.push(`Age of ${input.ageMonths} months retains ~${Math.round(depreciationFactor * 100)}% base value.`);

  (input.damages || []).forEach(dmg => {
    let penalty = 0;
    if (dmg.category === 'display') penalty = dmg.severity === 'severe' ? 14500 : dmg.severity === 'moderate' ? 9500 : 4500;
    else if (dmg.category === 'battery') penalty = dmg.severity === 'severe' ? 5800 : 3800;
    else if (dmg.category === 'board') penalty = dmg.severity === 'severe' ? 19000 : 11000;
    else if (dmg.category === 'housing') penalty = dmg.severity === 'severe' ? 6800 : 3200;
    else penalty = 5200;
    damageDeduction += penalty;
    rationale.push(`${dmg.title || dmg.category}: -₹${penalty.toLocaleString('en-IN')}`);
  });

  if (input.functionalChecks && !input.functionalChecks.powersOn) {
    damageDeduction += 9500;
    rationale.push('Device does not power on: -₹9,500 diagnostic penalty');
  }

  const salvageFloor = Math.max(2000, Math.round(depreciatedBaseValue * 0.22));
  const estimatedWorth = Math.max(salvageFloor, depreciatedBaseValue - damageDeduction);

  return {
    originalRetailPrice: baseRetailPrice,
    depreciatedBaseValue,
    damageDeduction,
    estimatedWorth,
    refurbishedResaleValue: Math.round(depreciatedBaseValue * 0.92),
    salvagePartsValue: Math.round(depreciatedBaseValue * 0.45),
    recyclingMaterialsValue: input.category === 'laptop' ? 3500 : input.category === 'smartphone' ? 2000 : 1500,
    confidenceScore: 0.93,
    rationale
  };
}

export function generateBestRecommendation(inspection, offers) {
  if (!offers.length) return null;

  const scored = offers.map(offer => {
    let circularityScore = 50;
    let netFinancialValue = 0;
    if (offer.disposition === 'fix_and_return') {
      circularityScore = 95;
      netFinancialValue = inspection.aiValuation.refurbishedResaleValue - offer.proposedPrice;
    } else if (offer.disposition === 'buy_and_refurbish') {
      circularityScore = 85;
      netFinancialValue = offer.proposedPrice;
    } else if (offer.disposition === 'sell_for_parts') {
      circularityScore = 70;
      netFinancialValue = offer.proposedPrice;
    } else {
      circularityScore = 50;
      netFinancialValue = offer.proposedPrice;
    }
    const speedScore = Math.max(0, 10 - offer.turnaroundDays) * 5;
    const ratingScore = offer.shopRating * 15;
    const warrantyBonus = offer.warrantyMonths * 3;
    const totalScore = (netFinancialValue / 100) * 1.2 + circularityScore * 0.8 + speedScore + ratingScore + warrantyBonus;
    return { offer, circularityScore, netFinancialValue, totalScore };
  });

  scored.sort((a, b) => b.totalScore - a.totalScore);
  const best = scored[0];
  const bestOffer = best.offer;
  const inr = n => `₹${Math.round(n).toLocaleString('en-IN')}`;

  let headline = `Recommended: ${bestOffer.disposition} with ${bestOffer.shopName}`;
  let executiveSummary = `Best composite path for ${inspection.brand} ${inspection.model}.`;
  const reasons = [];
  const tradeOffs = [];

  if (bestOffer.disposition === 'fix_and_return') {
    headline = `Recommended: Fix & Keep with ${bestOffer.shopName}`;
    executiveSummary = `Repairing your ${inspection.brand} ${inspection.model} preserves ${inr(inspection.aiValuation.refurbishedResaleValue)} in device utility for a ${inr(bestOffer.proposedPrice)} repair fee.`;
    reasons.push(`Preserves ${inr(best.netFinancialValue)} in retained hardware utility.`);
    reasons.push(`${bestOffer.warrantyMonths}-month service warranty.`);
    tradeOffs.push(`Requires paying ${inr(bestOffer.proposedPrice)} instead of taking instant cash.`);
  } else if (bestOffer.disposition === 'buy_and_refurbish') {
    headline = `Recommended: Instant Cash Buyout with ${bestOffer.shopName}`;
    executiveSummary = `Selling for certified refurbishment pays ${inr(bestOffer.proposedPrice)} immediately.`;
    reasons.push(`Guaranteed cash payout of ${inr(bestOffer.proposedPrice)}.`);
    tradeOffs.push('You forfeit the device.');
  } else if (bestOffer.disposition === 'sell_for_parts') {
    headline = `Recommended: Parts Salvage with ${bestOffer.shopName}`;
    executiveSummary = `Harvesting components yields ${inr(bestOffer.proposedPrice)} cash.`;
    reasons.push(`Recovers ${inr(bestOffer.proposedPrice)} from damaged hardware.`);
    tradeOffs.push('Device will be disassembled.');
  } else {
    headline = `Recommended: Certified Eco-Recycling with ${bestOffer.shopName}`;
    executiveSummary = `Certified recycling with an eco-incentive of ${inr(bestOffer.proposedPrice)}.`;
    reasons.push('Chain-of-custody recycling and data destruction.');
    tradeOffs.push('Lower monetary payout than repair or resale.');
  }

  return {
    bestOfferId: bestOffer.id,
    recommendedDisposition: bestOffer.disposition,
    confidenceScore: 0.95,
    circularityScore: best.circularityScore,
    headline,
    executiveSummary,
    comparisonPoints: [
      { title: 'Net Value Retained / Payout', value: bestOffer.disposition === 'fix_and_return' ? `+${inr(best.netFinancialValue)} Utility` : `${inr(bestOffer.proposedPrice)} Cash Payout`, badge: 'Best Value' },
      { title: 'Turnaround Time', value: `${bestOffer.turnaroundDays} day(s)`, badge: 'Express' },
      { title: 'Shop Rating', value: `★ ${bestOffer.shopRating} / 5.0` },
      { title: 'Circularity Impact', value: `${best.circularityScore} / 100 Score`, badge: 'Eco-Champion' }
    ],
    reasons,
    tradeOffs
  };
}

export function runReturnNetworkSimulation() {
  return {
    negotiatedAllocations: [
      { deviceId: 'SIM-01', model: 'iPhone 13 Pro', assignedAgent: 'Apex Precision Care (MUJ)', path: 'Fix & Return', netValue: 21600, turnaroundDays: 2, carbonSavedKg: 54 },
      { deviceId: 'SIM-02', model: 'MacBook Pro 14"', assignedAgent: 'EcoRefurb Direct (Dehmi Kalan)', path: 'Buy & Refurbish', netValue: 36800, turnaroundDays: 3, carbonSavedKg: 85 },
      { deviceId: 'SIM-03', model: 'Galaxy S22', assignedAgent: 'Silicon Salvage (Bagru)', path: 'Sell for Parts', netValue: 11600, turnaroundDays: 1, carbonSavedKg: 32 },
      { deviceId: 'SIM-04', model: 'iPad Air 5th Gen', assignedAgent: 'EcoRefurb Direct (Dehmi Kalan)', path: 'Buy & Refurbish', netValue: 23200, turnaroundDays: 2, carbonSavedKg: 48 },
      { deviceId: 'SIM-05', model: 'Dell XPS 15', assignedAgent: 'Apex Precision Care (MUJ)', path: 'Fix & Return', netValue: 30400, turnaroundDays: 1, carbonSavedKg: 62 }
    ],
    fixedPriorityAllocations: [
      { deviceId: 'SIM-01', model: 'iPhone 13 Pro', assignedAgent: 'Apex Depot (Default)', path: 'Fix & Return', netValue: 17600, turnaroundDays: 6, carbonSavedKg: 54, overloadFlag: true },
      { deviceId: 'SIM-02', model: 'MacBook Pro 14"', assignedAgent: 'Apex Depot (Default)', path: 'Fix & Return', netValue: 24800, turnaroundDays: 9, carbonSavedKg: 60, overloadFlag: true },
      { deviceId: 'SIM-03', model: 'Galaxy S22', assignedAgent: 'Unsorted Scrap', path: 'Scrapped to Waste', netValue: -1600, turnaroundDays: 12, carbonSavedKg: 0, overloadFlag: true },
      { deviceId: 'SIM-04', model: 'iPad Air 5th Gen', assignedAgent: 'Apex Depot (Default)', path: 'Fix & Return', netValue: 14400, turnaroundDays: 8, carbonSavedKg: 40, overloadFlag: true },
      { deviceId: 'SIM-05', model: 'Dell XPS 15', assignedAgent: 'Apex Depot (Default)', path: 'Fix & Return', netValue: 23200, turnaroundDays: 5, carbonSavedKg: 55, overloadFlag: true }
    ],
    traceLogs: [
      { stepNumber: 1, timestamp: '10:00:15', agentName: 'Customer Return Point (MUJ Campus Hub)', agentRole: 'Customer', action: 'Broadcast 5 Returned Electronics to Network', decisionReason: 'Batch aggregated from campus returns.', costImpact: 0, capacityImpact: '5 Units Pending Routing', carbonSavedKg: 0 },
      { stepNumber: 2, timestamp: '10:00:18', agentName: 'Carrier Agent (Jaipur Express EV Logistics)', agentRole: 'Carrier', action: 'Calculated Dynamic Transit Costs & Distance Matrices', decisionReason: 'Grouped SIM-01 and SIM-05 for same-day delivery.', costImpact: -1500, capacityImpact: '2 Routes Optimized', carbonSavedKg: 4.2 },
      { stepNumber: 3, timestamp: '10:00:22', agentName: 'Apex Precision Depot Agent', agentRole: 'Repair Depot', action: 'Accepted SIM-01 & SIM-05; Rejected SIM-03', decisionReason: 'High OEM parts in inventory for SIM-01/05.', costImpact: 24800, capacityImpact: 'Bench Utilization: 82%', carbonSavedKg: 52.8 },
      { stepNumber: 4, timestamp: '10:00:27', agentName: 'EcoRefurb Direct Hub Agent', agentRole: 'Refurbisher', action: 'Counter-Offered Buyout for SIM-02 & SIM-04', decisionReason: 'Secondary market channels for M1 MacBooks and iPads.', costImpact: 38400, capacityImpact: 'Refurb Line Capacity: 65%', carbonSavedKg: 78.5 },
      { stepNumber: 5, timestamp: '10:00:33', agentName: 'Silicon Salvage Exchange Agent', agentRole: 'Parts Supplier', action: 'Acquired SIM-03 for Component Harvesting', decisionReason: 'Harvested OLED panel and camera modules.', costImpact: 11200, capacityImpact: 'Parts Warehouse +2 Modules', carbonSavedKg: 31 },
      { stepNumber: 6, timestamp: '10:00:40', agentName: 'GreenMatrix Recycling Agent', agentRole: 'Recycler', action: 'Received Spent Battery Hazardous Waste', decisionReason: 'Closed-loop hydrometallurgy in Bagru.', costImpact: 2000, capacityImpact: 'Eco-Destruction Verified', carbonSavedKg: 14.5 }
    ],
    summaryMetrics: {
      negotiatedTotalValue: 123600,
      baselineTotalValue: 78400,
      valueImprovementPercent: 57.6,
      negotiatedCarbonSavedKg: 281,
      baselineCarbonSavedKg: 209,
      depotBottleneckReductionPercent: 68,
      eWasteDivertedKg: 14.8
    }
  };
}
