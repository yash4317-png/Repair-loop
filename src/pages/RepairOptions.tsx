import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Truck, ArrowLeft, Phone } from 'lucide-react';
import { useApp } from '../context/AppContext';

/**
 * New page that presents three primary actions for a device inspection:
 *   • Repair – request a full fix & return
 *   • Buy for Parts – sell the device for salvage value
 *   • Recycle – eco‑recycling for a material payout
 *
 * It also includes a delivery/pickup toggle so the customer can choose free campus
 * pickup (saving money) or self‑pickup.
 */
export const RepairOptions: React.FC = () => {
  const { setActiveTab } = useApp();
  const [delivery, setDelivery] = useState<'pickup' | 'self'>('pickup');

  const handleRepair = () => setActiveTab('device_inspector');
  const handleBuyParts = () => setActiveTab('quick_sell');
  const handleRecycle = () => setActiveTab('quick_sell');

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8 bg-white dark:bg-slate-900 rounded-xl shadow-lg">
      <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Choose How to Proceed</h1>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={handleRepair}
          className="flex flex-col items-center p-4 rounded-lg border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:border-emerald-600 transition"
        >
          <Truck className="w-6 h-6 text-emerald-600" />
          <span className="mt-2 text-sm font-medium text-emerald-700 dark:text-emerald-200">Repair</span>
        </button>
        <button
          onClick={handleBuyParts}
          className="flex flex-col items-center p-4 rounded-lg border border-amber-300 bg-amber-50 hover:bg-amber-100 dark:bg-amber-900/30 dark:border-amber-600 transition"
        >
          <CheckCircle2 className="w-6 h-6 text-amber-600" />
          <span className="mt-2 text-sm font-medium text-amber-700 dark:text-amber-200">Buy for Parts</span>
        </button>
        <button
          onClick={handleRecycle}
          className="flex flex-col items-center p-4 rounded-lg border border-teal-300 bg-teal-50 hover:bg-teal-100 dark:bg-teal-900/30 dark:border-teal-600 transition"
        >
          <ArrowRight className="w-6 h-6 text-teal-600" />
          <span className="mt-2 text-sm font-medium text-teal-700 dark:text-teal-200">Recycle</span>
        </button>
      </div>

      {/* Delivery / Pickup Toggle */}
      <div className="flex items-center justify-center gap-4 mt-6">
        <button
          onClick={() => setDelivery('pickup')}
          className={`px-4 py-2 rounded ${delivery === 'pickup' ? 'bg-green-600 text-white' : 'bg-gray-200 dark:bg-slate-700'} transition`}
        >
          Free Campus Pickup (save money)
        </button>
        <button
          onClick={() => setDelivery('self')}
          className={`px-4 py-2 rounded ${delivery === 'self' ? 'bg-green-600 text-white' : 'bg-gray-200 dark:bg-slate-700'} transition`}
        >
          I’ll Pick Up My Device
        </button>
      </div>
    </div>
  );
};
