import { DeviceInspection, InventoryPart, ShopOffer } from '../types';

export interface MatchedPart {
  part: InventoryPart;
  matchingDamageTitle: string;
  isAvailable: boolean;
  cost: number;
  recommendedCustomerPrice: number;
}

export function matchDamageToInventory(
  damages: DeviceInspection['damages'],
  deviceModel: string,
  inventory: InventoryPart[]
): MatchedPart[] {
  const matches: MatchedPart[] = [];
  const normalizedModel = deviceModel.toLowerCase().trim();

  damages.forEach(dmg => {
    // Search inventory for matching category and model compatibility
    const found = inventory.find(p => {
      const categoryMatch = p.category === dmg.category;
      const modelMatch = p.compatibleModels.some(m => 
        normalizedModel.includes(m.toLowerCase()) || m.toLowerCase().includes(normalizedModel)
      );
      return categoryMatch && modelMatch;
    });

    if (found) {
      matches.push({
        part: found,
        matchingDamageTitle: dmg.title,
        isAvailable: found.quantityInStock > 0,
        cost: found.unitCost,
        recommendedCustomerPrice: found.retailPrice
      });
    } else {
      // Mock standard market procurement fallback if not in stock
      const estimatedCost = dmg.category === 'display' ? 75 : dmg.category === 'battery' ? 20 : 50;
      const placeholderPart: InventoryPart = {
        id: `virtual_part_${dmg.id}`,
        shopId: '',
        sku: `ORDER-${dmg.category.toUpperCase()}-REQ`,
        name: `Procure: OEM ${dmg.typicalPartNeeded || dmg.category}`,
        category: dmg.category,
        compatibleModels: [deviceModel],
        quantityInStock: 0,
        minThreshold: 1,
        unitCost: estimatedCost,
        retailPrice: Math.round(estimatedCost * 1.8),
        condition: 'OEM_New',
        lastRestocked: 'N/A (External Supplier)'
      };
      matches.push({
        part: placeholderPart,
        matchingDamageTitle: dmg.title,
        isAvailable: false,
        cost: estimatedCost,
        recommendedCustomerPrice: Math.round(estimatedCost * 1.8)
      });
    }
  });

  return matches;
}

export function calculateProfitAnalysis(params: {
  disposition: 'fix_and_return' | 'buy_and_refurbish' | 'sell_for_parts' | 'recycle';
  proposedPrice: number; // For Fix: fee charged. For Buy/Parts: payout to customer.
  matchedParts: MatchedPart[];
  laborHours: number;
  laborRatePerHour: number;
  aiValuation: DeviceInspection['aiValuation'];
}) {
  const { disposition, proposedPrice, matchedParts, laborHours, laborRatePerHour, aiValuation } = params;

  // Parts cost (using shop inventory cost if in stock, or supplier procurement cost)
  const totalPartsCost = matchedParts.reduce((sum, m) => sum + m.cost, 0);
  const totalLaborCost = Math.round(laborHours * laborRatePerHour);

  let projectedRevenue = 0;
  let totalExpenses = 0;
  let projectedProfit = 0;

  if (disposition === 'fix_and_return') {
    // Customer pays repair fee
    projectedRevenue = proposedPrice;
    totalExpenses = totalPartsCost + totalLaborCost;
    projectedProfit = projectedRevenue - totalExpenses;
  } else if (disposition === 'buy_and_refurbish') {
    // Shop buys device for proposedPrice, fixes it, and resells at refurbished market value
    projectedRevenue = aiValuation.refurbishedResaleValue;
    totalExpenses = proposedPrice + totalPartsCost + totalLaborCost;
    projectedProfit = projectedRevenue - totalExpenses;
  } else if (disposition === 'sell_for_parts') {
    // Shop buys device for proposedPrice, disassembles it, and harvests components
    projectedRevenue = aiValuation.salvagePartsValue;
    totalExpenses = proposedPrice + totalLaborCost; // Disassembly labor
    projectedProfit = projectedRevenue - totalExpenses;
  } else {
    // Recycle: green subsidy + materials recovery
    projectedRevenue = aiValuation.recyclingMaterialsValue + 20; // Material + eco credit
    totalExpenses = proposedPrice + (laborHours * 15);
    projectedProfit = projectedRevenue - totalExpenses;
  }

  const profitMarginPercent = projectedRevenue > 0 
    ? Math.round((projectedProfit / projectedRevenue) * 1000) / 10 
    : 0;

  return {
    totalPartsCost,
    totalLaborCost,
    projectedRevenue,
    totalExpenses,
    projectedProfit: Math.round(projectedProfit),
    profitMarginPercent
  };
}
