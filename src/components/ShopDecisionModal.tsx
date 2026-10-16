import React, { useState, useMemo } from 'react';
import { 
  X, 
  Wrench, 
  IndianRupee, 
  Layers, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  AlertCircle, 
  Box, 
  TrendingUp, 
  Tag, 
  RefreshCw, 
  Recycle, 
  Cpu, 
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DeviceInspection, DispositionChoice } from '../types';
import { matchDamageToInventory, calculateProfitAnalysis } from '../services/inventoryMatchingService';
import { formatRupees } from '../utils/formatters';

interface ShopDecisionModalProps {
  inspection: DeviceInspection;
  onClose: () => void;
}

export const ShopDecisionModal: React.FC<ShopDecisionModalProps> = ({ inspection, onClose }) => {
  const { currentUser, inventory, getShopById, submitShopOffer } = useApp();
  
  const shopId = currentUser?.shopId || 'shop_apex';
  const shop = getShopById(shopId);

  // Active disposition choice
  const [disposition, setDisposition] = useState<DispositionChoice>('fix_and_return');

  // Pricing inputs - using string state so users can backspace and type freely without glitching!
  const defaultProposedPrice = useMemo(() => {
    if (disposition === 'fix_and_return') {
      return Math.round(inspection.aiValuation.depreciatedBaseValue * 0.42);
    } else if (disposition === 'buy_and_refurbish') {
      return Math.round(inspection.aiValuation.estimatedWorth * 1.05);
    } else if (disposition === 'sell_for_parts') {
      return Math.round(inspection.aiValuation.salvagePartsValue * 0.85);
    } else {
      return Math.max(25, inspection.aiValuation.recyclingMaterialsValue);
    }
  }, [disposition, inspection]);

  const [priceInput, setPriceInput] = useState<string>(() => String(defaultProposedPrice));
  const proposedPrice = useMemo(() => {
    const val = parseFloat(priceInput);
    return isNaN(val) ? 0 : val;
  }, [priceInput]);

  const [laborHours, setLaborHours] = useState<number>(1.5);
  const [turnaroundDays, setTurnaroundDays] = useState<number>(2);
  const [warrantyMonths, setWarrantyMonths] = useState<number>(12);
  const [notes, setNotes] = useState<string>('Certified OEM restoration using in-stock parts. Full diagnostic passed.');
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter shop inventory for this specific shop
  const shopInventory = useMemo(() => {
    return inventory.filter(item => item.shopId === shopId);
  }, [inventory, shopId]);

  // Match inspected damages to shop's inventory
  const matchedParts = useMemo(() => {
    return matchDamageToInventory(inspection.damages, inspection.model, shopInventory);
  }, [inspection, shopInventory]);

  // Profitability calculations
  const laborRate = shop?.laborRatePerHour || 50;
  const financialAnalysis = useMemo(() => {
    return calculateProfitAnalysis({
      disposition,
      proposedPrice: proposedPrice > 0 ? proposedPrice : defaultProposedPrice,
      matchedParts,
      laborHours,
      laborRatePerHour: laborRate,
      aiValuation: inspection.aiValuation
    });
  }, [disposition, proposedPrice, defaultProposedPrice, matchedParts, laborHours, laborRate, inspection]);

  const handleDispositionChange = (choice: DispositionChoice) => {
    setDisposition(choice);
    let newPrice = 0;
    if (choice === 'fix_and_return') {
      newPrice = Math.round(inspection.aiValuation.depreciatedBaseValue * 0.42);
      setWarrantyMonths(12);
      setTurnaroundDays(2);
      setNotes('Certified OEM restoration using in-stock parts. Full diagnostic passed.');
    } else if (choice === 'buy_and_refurbish') {
      newPrice = Math.round(inspection.aiValuation.estimatedWorth * 1.05);
      setWarrantyMonths(0);
      setTurnaroundDays(1);
      setNotes('Instant cash buyout. We absorb refurbishment cost and resell with warranty.');
    } else if (choice === 'sell_for_parts') {
      newPrice = Math.round(inspection.aiValuation.salvagePartsValue * 0.85);
      setWarrantyMonths(0);
      setTurnaroundDays(1);
      setNotes('Component salvage payout. Useful for harvesting working logic chips and camera.');
    } else {
      newPrice = Math.max(25, inspection.aiValuation.recyclingMaterialsValue);
      setWarrantyMonths(0);
      setTurnaroundDays(3);
      setNotes('Certified hydrometallurgical recycling and precious metal extraction.');
    }
    setPriceInput(String(newPrice));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const usedParts = matchedParts.map(m => ({
      partId: m.part.id,
      name: m.part.name,
      sku: m.part.sku,
      unitCost: m.cost,
      chargedCost: m.recommendedCustomerPrice,
      isInStock: m.isAvailable
    }));

    submitShopOffer({
      inspectionId: inspection.id,
      shopId,
      shopName: shop?.name || 'Authorized Service Center',
      shopLocation: shop?.location || 'Local Depot',
      shopRating: shop?.rating || 4.9,
      disposition,
      proposedPrice: proposedPrice > 0 ? proposedPrice : defaultProposedPrice,
      usedInventoryParts: usedParts,
      totalPartsCost: financialAnalysis.totalPartsCost,
      estimatedLaborHours: laborHours,
      laborRatePerHour: laborRate,
      totalLaborCost: financialAnalysis.totalLaborCost,
      projectedProfit: financialAnalysis.projectedProfit,
      profitMarginPercent: financialAnalysis.profitMarginPercent,
      turnaroundDays,
      warrantyMonths,
      notes: notes || `Offer submitted by ${shop?.name}`
    });

    setTimeout(() => {
      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  const currentPhoto = inspection.photos[selectedPhotoIndex] || inspection.photos[0];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200" onClick={onClose}>
      <div className="relative w-full max-w-5xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl my-8 overflow-hidden transition-colors" onClick={e => e.stopPropagation()}>
        
        {/* Top Header with CLEAR BACK BUTTON */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-semibold text-xs transition-all shadow-sm cursor-pointer"
              title="Return to Device Inspection Pool"
            >
              <ArrowLeft className="w-4 h-4 text-emerald-500" />
              <span>&larr; Back to Inspection Pool</span>
            </button>
            
            <div className="hidden sm:block">
              <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
                Tracking: {inspection.trackingNumber}
              </span>
            </div>
          </div>

          <div className="text-right flex items-center gap-3">
            <div className="hidden md:block">
              <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">
                {inspection.brand} {inspection.model}
              </h2>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">{shop?.name}</span>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Device Photos, AI Worth & Matched Inventory (6 cols) */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Photos & Condition Viewer */}
            <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 transition-colors">
              <div className="relative rounded-xl overflow-hidden aspect-[4/3] bg-slate-100 dark:bg-slate-900 mb-3 border border-slate-200 dark:border-slate-800">
                {currentPhoto ? (
                  <img src={currentPhoto.url} alt={currentPhoto.label} className="w-full h-full object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full text-slate-500">No Photo</div>
                )}
                <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-lg bg-slate-900/80 backdrop-blur-sm text-xs font-medium text-white border border-slate-700/60">
                  {currentPhoto?.label || 'Device Photo'}
                </div>
              </div>

              {/* Photo thumbnails */}
              {inspection.photos.length > 1 && (
                <div className="flex gap-2">
                  {inspection.photos.map((p, idx) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setSelectedPhotoIndex(idx)}
                      className={`relative w-14 h-14 rounded-lg overflow-hidden border transition-all cursor-pointer ${
                        selectedPhotoIndex === idx 
                          ? 'border-amber-500 ring-2 ring-amber-500/20' 
                          : 'border-slate-200 dark:border-slate-800 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={p.url} alt={p.label} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* AI Diagnostics & Value Matrix */}
            <div className="bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800/90 rounded-2xl p-4 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-500" />
                  <span>AI Valuation & Market Benchmark</span>
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">Age: {inspection.ageMonths} mos</span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mb-0.5">As-Is Worth</p>
                  <p className="font-extrabold text-emerald-600 dark:text-emerald-400 font-mono text-base">{formatRupees(inspection.aiValuation.estimatedWorth)}</p>
                </div>
                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mb-0.5">Refurb Resale</p>
                  <p className="font-extrabold text-teal-600 dark:text-teal-400 font-mono text-base">{formatRupees(inspection.aiValuation.refurbishedResaleValue)}</p>
                </div>
                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mb-0.5">Parts Harvest</p>
                  <p className="font-extrabold text-amber-600 dark:text-amber-400 font-mono text-base">{formatRupees(inspection.aiValuation.salvagePartsValue)}</p>
                </div>
              </div>

              {/* Reported Damages */}
              <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800/80">
                <p className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-2">Reported Damage Symptoms:</p>
                <div className="space-y-1.5">
                  {inspection.damages.map(dmg => (
                    <div key={dmg.id} className="flex items-center justify-between text-xs bg-white dark:bg-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800">
                      <span className="text-slate-800 dark:text-slate-200">{dmg.title}</span>
                      <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                        {dmg.severity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* In-Stock Parts Auto-Matching */}
            <div className="bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800/90 rounded-2xl p-4 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Box className="w-4 h-4 text-amber-500" />
                  <span>Inventory Auto-Match for This Device</span>
                </span>
                <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">Shop: {shop?.name.split('-')[0]}</span>
              </div>

              <div className="space-y-2">
                {matchedParts.map((item, idx) => (
                  <div 
                    key={idx}
                    className={`p-2.5 rounded-xl border text-xs flex items-center justify-between ${
                      item.isAvailable 
                        ? 'bg-emerald-500/5 border-emerald-500/30 text-slate-800 dark:text-slate-200'
                        : 'bg-amber-500/5 border-amber-500/30 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900 dark:text-slate-200">{item.part.name}</span>
                        {item.isAvailable ? (
                          <span className="px-1.5 py-0.2 text-[9px] font-mono bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 rounded">
                            {item.part.quantityInStock} In Stock
                          </span>
                        ) : (
                          <span className="px-1.5 py-0.2 text-[9px] font-mono bg-amber-500/20 text-amber-700 dark:text-amber-300 rounded">
                            Procurement Needed
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 font-mono">
                        SKU: {item.part.sku} • Cost: {formatRupees(item.cost)}
                      </p>
                    </div>

                    <div className="text-right font-mono">
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">{formatRupees(item.cost)}</span>
                      <span className="block text-[10px] text-slate-400">Shop Cost</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: 4-Way Decision & Live Profit Margin Calculator (6 cols) */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* 4 Action Options Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                Select Shop Decision / Return Path
              </label>
              
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  {
                    id: 'fix_and_return',
                    label: '1. Fix & Return',
                    desc: 'Repair device with parts & return to customer',
                    icon: Wrench,
                  },
                  {
                    id: 'buy_and_refurbish',
                    label: '2. Buy & Refurbish',
                    desc: 'Cash buyout, refurbish and resell for profit',
                    icon: TrendingUp,
                  },
                  {
                    id: 'sell_for_parts',
                    label: '3. Sell for Parts',
                    desc: 'Scrap buyout, harvest components into stock',
                    icon: Cpu,
                  },
                  {
                    id: 'recycle',
                    label: '4. Eco-Recycle',
                    desc: 'Safe certified e-waste dismantling',
                    icon: Recycle,
                  }
                ].map(opt => {
                  const Icon = opt.icon;
                  const isSelected = disposition === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleDispositionChange(opt.id as DispositionChoice)}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'border-amber-500 bg-amber-500/10 text-slate-900 dark:text-white shadow-md shadow-amber-500/10 ring-2 ring-amber-500/20'
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Icon className={`w-4 h-4 ${isSelected ? 'text-amber-500' : 'text-slate-400'}`} />
                        <span className="text-xs font-bold">{opt.label}</span>
                      </div>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">{opt.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Financial & Terms Configuration */}
            <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4 transition-colors">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white flex items-center justify-between">
                <span>Quotation & Financial Model</span>
                <span className="text-[10px] font-mono text-amber-600 dark:text-amber-400 font-semibold">Tech Labor: {formatRupees(laborRate)}/hr</span>
              </h3>

              {/* Proposed Price - Controlled string input so backspace works smoothly */}
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  {disposition === 'fix_and_return' ? 'Repair Fee Charged to Customer (₹)' : 'Cash Payout Offered to Customer (₹)'}
                </label>
                <div className="relative">
                  <IndianRupee className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="number"
                    required
                    min="1"
                    value={priceInput}
                    onChange={e => setPriceInput(e.target.value)}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                    placeholder="Enter price in ₹..."
                  />
                </div>
              </div>

              {/* Labor & Turnaround */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Labor Bench Time</label>
                  <select
                    value={laborHours}
                    onChange={e => setLaborHours(Number(e.target.value))}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 cursor-pointer"
                  >
                    <option value={0.5}>0.5 Hours ({formatRupees(0.5 * laborRate)})</option>
                    <option value={1.0}>1.0 Hour ({formatRupees(1.0 * laborRate)})</option>
                    <option value={1.5}>1.5 Hours ({formatRupees(1.5 * laborRate)})</option>
                    <option value={2.0}>2.0 Hours ({formatRupees(2.0 * laborRate)})</option>
                    <option value={3.0}>3.0 Hours ({formatRupees(3.0 * laborRate)})</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Turnaround Days</label>
                  <select
                    value={turnaroundDays}
                    onChange={e => setTurnaroundDays(Number(e.target.value))}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 cursor-pointer"
                  >
                    <option value={1}>1 Day (Express)</option>
                    <option value={2}>2 Days (Standard)</option>
                    <option value={3}>3 Days</option>
                    <option value={5}>5 Days</option>
                  </select>
                </div>
              </div>

              {disposition === 'fix_and_return' && (
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Warranty Provided</label>
                  <select
                    value={warrantyMonths}
                    onChange={e => setWarrantyMonths(Number(e.target.value))}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 cursor-pointer"
                  >
                    <option value={3}>3 Months Warranty</option>
                    <option value={6}>6 Months Warranty</option>
                    <option value={12}>12 Months Comprehensive</option>
                  </select>
                </div>
              )}

              {/* Notes */}
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Technician Notes to Customer</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Explain why this path is best, what parts will be used..."
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Live Profit Margin Dashboard */}
            <div className="bg-gradient-to-br from-white via-slate-50 to-amber-500/5 dark:from-slate-900 dark:to-slate-950 border border-amber-500/40 rounded-2xl p-5 shadow-xl transition-colors">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                  <span>Shop Profitability & Margin Analysis</span>
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                  {financialAnalysis.profitMarginPercent}% Margin
                </span>
              </div>

              <div className="py-4 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Gross Projected Revenue</span>
                  <span className="font-mono text-slate-900 dark:text-slate-200 font-bold">{formatRupees(financialAnalysis.projectedRevenue)}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Parts Cost (Inventory / Order)</span>
                  <span className="font-mono text-rose-500">-{formatRupees(financialAnalysis.totalPartsCost)}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Technician Labor ({laborHours}h @ {formatRupees(laborRate)}/h)</span>
                  <span className="font-mono text-rose-500">-{formatRupees(financialAnalysis.totalLaborCost)}</span>
                </div>
                {disposition !== 'fix_and_return' && (
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Customer Buyout Payout</span>
                    <span className="font-mono text-rose-500">-{formatRupees(proposedPrice)}</span>
                  </div>
                )}
                
                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex justify-between items-baseline">
                  <span className="font-bold text-slate-900 dark:text-slate-200">Net Shop Profit</span>
                  <span className={`text-xl font-extrabold font-mono ${financialAnalysis.projectedProfit >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500'}`}>
                    {financialAnalysis.projectedProfit >= 0 ? `+${formatRupees(financialAnalysis.projectedProfit)}` : `-${formatRupees(Math.abs(financialAnalysis.projectedProfit))}`}
                  </span>
                </div>
              </div>

              {/* Submit Offer & Cancel Buttons */}
              <div className="flex items-center gap-3 mt-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="py-3 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition-colors cursor-pointer"
                >
                  Cancel & Go Back
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Submitting Offer...</span>
                  ) : (
                    <>
                      <span>Submit {disposition.replace(/_/g, ' ').toUpperCase()} Decision</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

            </div>

          </div>

        </form>

      </div>
    </div>
  );
};
