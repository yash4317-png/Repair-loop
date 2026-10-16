import { DeviceInspection, RecommendationResult, ShopOffer } from '../types';
import { formatRupees } from '../utils/formatters';

export function generateBestRecommendation(
  inspection: DeviceInspection,
  offers: ShopOffer[]
): RecommendationResult | null {
  if (offers.length === 0) return null;

  // Score each offer based on customer net value, turnaround time, shop rating, warranty, and circularity
  const scoredOffers = offers.map(offer => {
    let circularityScore = 50;
    let netFinancialValue = 0; // Rupee value retained or received by customer
    
    if (offer.disposition === 'fix_and_return') {
      circularityScore = 95; // Keeps entire device in use, avoids new manufacturing
      // Net value: Restored device worth minus repair cost
      netFinancialValue = inspection.aiValuation.refurbishedResaleValue - offer.proposedPrice;
    } else if (offer.disposition === 'buy_and_refurbish') {
      circularityScore = 85; // Refurbished and re-entered into circulation
      netFinancialValue = offer.proposedPrice; // Immediate cash in customer pocket
    } else if (offer.disposition === 'sell_for_parts') {
      circularityScore = 70; // High value components reused to fix other devices
      netFinancialValue = offer.proposedPrice;
    } else {
      circularityScore = 50; // Materials recycled
      netFinancialValue = offer.proposedPrice;
    }

    // Composite utility score
    const speedScore = Math.max(0, 10 - offer.turnaroundDays) * 5;
    const ratingScore = offer.shopRating * 15;
    const warrantyBonus = offer.warrantyMonths * 3;

    // Scale financial value normalized for INR
    const normalizedFinValue = netFinancialValue / 100;
    const totalScore = (normalizedFinValue * 1.2) + (circularityScore * 0.8) + speedScore + ratingScore + warrantyBonus;

    return {
      offer,
      circularityScore,
      netFinancialValue,
      totalScore
    };
  });

  // Sort descending by composite score
  scoredOffers.sort((a, b) => b.totalScore - a.totalScore);
  const best = scoredOffers[0];
  const bestOffer = best.offer;

  let headline = '';
  let executiveSummary = '';
  const reasons: string[] = [];
  const tradeOffs: string[] = [];

  if (bestOffer.disposition === 'fix_and_return') {
    headline = `Recommended: Fix & Keep with ${bestOffer.shopName}`;
    executiveSummary = `Repairing your ${inspection.brand} ${inspection.model} is the most economically sound and environmentally circular path. For a ${formatRupees(bestOffer.proposedPrice)} repair fee, you preserve ${formatRupees(inspection.aiValuation.refurbishedResaleValue)} in device utility instead of spending ${formatRupees(inspection.aiValuation.originalRetailPrice)} on a brand-new replacement.`;
    reasons.push(`Preserves ${formatRupees(best.netFinancialValue)} in net retained hardware utility.`);
    reasons.push(`${bestOffer.warrantyMonths}-month service warranty with genuine OEM parts.`);
    reasons.push(`Fast ${bestOffer.turnaroundDays}-day turnaround with verified local technician.`);
    reasons.push(`Highest circularity score (${best.circularityScore}/100) — prevents ~54 kg of manufacturing CO₂ emissions.`);
    tradeOffs.push(`Requires paying ${formatRupees(bestOffer.proposedPrice)} upfront rather than receiving instant cash.`);
  } else if (bestOffer.disposition === 'buy_and_refurbish') {
    headline = `Recommended: Instant Cash Buyout with ${bestOffer.shopName}`;
    executiveSummary = `Selling your device for certified refurbishment offers the cleanest trade-off. You get ${formatRupees(bestOffer.proposedPrice)} cash deposited immediately with zero repair risks, while the device is sustainably restored for a second life.`;
    reasons.push(`Guaranteed cash payout of ${formatRupees(bestOffer.proposedPrice)} upon drop-off or pickup.`);
    reasons.push(`Device is certified under R2v3 circular refurbishment standard.`);
    reasons.push(`Zero personal risk of residual hardware failures or repair hassle.`);
    tradeOffs.push(`You forfeit the device and will need an alternative phone/laptop.`);
  } else if (bestOffer.disposition === 'sell_for_parts') {
    headline = `Recommended: Parts Salvage with ${bestOffer.shopName}`;
    executiveSummary = `Due to the extent of internal damage, harvesting functional components (camera module, chassis, logic chips) yields ${formatRupees(bestOffer.proposedPrice)} cash, while supplying critical spare parts to local repair technicians.`;
    reasons.push(`Recovers ${formatRupees(bestOffer.proposedPrice)} cash from heavily damaged hardware.`);
    reasons.push(`Key modules provide critical spare parts to avoid e-waste.`);
    tradeOffs.push(`Device will be disassembled and cannot be recovered later.`);
  } else {
    headline = `Recommended: Certified Eco-Recycling with ${bestOffer.shopName}`;
    executiveSummary = `Safely recycle hazardous materials with full chain-of-custody documentation and an eco-incentive payout of ${formatRupees(bestOffer.proposedPrice)}.`;
    reasons.push(`100% Zero-landfill precious metal hydrometallurgical recovery.`);
    reasons.push(`Certified data destruction certificate provided.`);
    tradeOffs.push(`Lower monetary payout compared to resale or repair.`);
  }

  return {
    bestOfferId: bestOffer.id,
    recommendedDisposition: bestOffer.disposition,
    confidenceScore: 0.95,
    circularityScore: best.circularityScore,
    headline,
    executiveSummary,
    comparisonPoints: [
      {
        title: 'Net Value Retained / Payout',
        value: bestOffer.disposition === 'fix_and_return' ? `+${formatRupees(best.netFinancialValue)} Utility` : `${formatRupees(bestOffer.proposedPrice)} Cash Payout`,
        badge: 'Best Value'
      },
      {
        title: 'Turnaround Time',
        value: `${bestOffer.turnaroundDays} Day${bestOffer.turnaroundDays > 1 ? 's' : ''}`,
        badge: 'Express'
      },
      {
        title: 'Shop Rating',
        value: `★ ${bestOffer.shopRating} / 5.0`
      },
      {
        title: 'Circularity Impact',
        value: `${best.circularityScore} / 100 Score`,
        badge: 'Eco-Champion'
      }
    ],
    reasons,
    tradeOffs
  };
}
