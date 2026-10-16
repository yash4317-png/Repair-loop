import React, { useState } from 'react';
import { 
  ArrowLeft, 
  IndianRupee, 
  Recycle, 
  Cpu, 
  CheckCircle2, 
  Truck, 
  QrCode, 
  Calendar, 
  Sparkles,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DeviceCategory } from '../types';
import { formatRupees } from '../utils/formatters';

export const QuickSellRecycle: React.FC = () => {
  const { currentUser, submitQuickRequest, setActiveTab } = useApp();

  const [category, setCategory] = useState<DeviceCategory>('smartphone');
  const [brand, setBrand] = useState('Apple');
  const [model, setModel] = useState('iPhone 12');
  const [action, setAction] = useState<'quick_sell_parts' | 'quick_recycle'>('quick_sell_parts');
  const [pickupAddress, setPickupAddress] = useState('Hostel Block B4, Room 312, Manipal University Jaipur');
  const [pickupTimeSlot, setPickupTimeSlot] = useState('Today, 4:00 PM - 6:00 PM');
  const [confirmedRequest, setConfirmedRequest] = useState<any | null>(null);

  const estimatedPayout = action === 'quick_sell_parts' ? 11500 : 2500;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    const req = submitQuickRequest({
      customerId: currentUser.id,
      customerName: currentUser.name,
      customerEmail: currentUser.email,
      category,
      brand,
      model,
      action,
      estimatedPayout,
      pickupAddress,
      pickupTimeSlot
    });

    setConfirmedRequest(req);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 relative">
      
      {/* Header */}
      <div className="flex items-center gap-4 pb-6 mb-8 border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveTab('customer_home')}
          className="p-2.5 rounded-2xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all shadow-sm cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
              No Inspection Required
            </span>
            <span className="text-slate-500 dark:text-slate-400 text-xs">Direct Cash Buyout or Eco-Recycle</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Instant Sell for Parts or Eco-Recycle
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Skip inspection questions and photo uploads. Get an instant guaranteed payout for parts or certified zero-landfill recycling with free MUJ campus courier pickup.
          </p>
        </div>
      </div>

      {confirmedRequest ? (
        <div className="bg-white dark:bg-slate-900 border border-emerald-500/40 rounded-3xl p-8 shadow-2xl space-y-6 transition-colors">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Pickup Voucher Generated!</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">Tracking: {confirmedRequest.trackingCode}</p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500 text-white font-mono">
              CONFIRMED
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-6">
            <div className="sm:col-span-8 space-y-3 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Device:</span>
                  <span className="text-slate-900 dark:text-white font-bold">{confirmedRequest.brand} {confirmedRequest.model}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Disposition:</span>
                  <span className="text-amber-600 dark:text-amber-400 font-bold uppercase">{confirmedRequest.action.replace(/_/g, ' ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Payout Amount:</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-extrabold font-mono text-base">{formatRupees(confirmedRequest.estimatedPayout)} Cash</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Campus Pickup Slot:</span>
                  <span className="text-slate-800 dark:text-slate-200">{confirmedRequest.pickupTimeSlot}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Pickup Address:</span>
                  <span className="text-slate-700 dark:text-slate-300 truncate max-w-xs">{confirmedRequest.pickupAddress}</span>
                </div>
              </div>

              <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                Our certified courier from Dehmi Kalan will arrive with a secure tamper-evident bag. Payment will be credited via UPI or cash immediately upon handover.
              </p>
            </div>

            <div className="sm:col-span-4 flex flex-col items-center justify-center p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center">
              <QrCode className="w-24 h-24 text-emerald-500 mb-2" />
              <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">Courier Handover QR</span>
            </div>
          </div>

          <button
            onClick={() => {
              setConfirmedRequest(null);
              setActiveTab('customer_portal');
            }}
            className="w-full py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold text-xs transition-colors cursor-pointer"
          >
            Return to My Returns Dashboard
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6 transition-colors">
          
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-3">
              1. Choose Instant Path
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setAction('quick_sell_parts')}
                className={`p-4 rounded-3xl border text-left transition-all cursor-pointer ${
                  action === 'quick_sell_parts'
                    ? 'border-amber-500 bg-amber-500/10 text-slate-900 dark:text-white ring-2 ring-amber-500/20'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <Cpu className="w-5 h-5 text-amber-500" />
                  <span className="font-bold text-sm text-slate-900 dark:text-white">Sell for Parts (Instant Cash)</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  We harvest undamaged logic chips, cameras, and batteries for repair depots.
                </p>
                <span className="inline-block mt-3 font-mono font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                  ~₹11,500 Instant Cash
                </span>
              </button>

              <button
                type="button"
                onClick={() => setAction('quick_recycle')}
                className={`p-4 rounded-3xl border text-left transition-all cursor-pointer ${
                  action === 'quick_recycle'
                    ? 'border-emerald-500 bg-emerald-500/10 text-slate-900 dark:text-white ring-2 ring-emerald-500/20'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <Recycle className="w-5 h-5 text-emerald-500" />
                  <span className="font-bold text-sm text-slate-900 dark:text-white">Certified Eco-Recycle</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Certified Zero-Landfill hydrometallurgical recycling. Safe metal extraction.
                </p>
                <span className="inline-block mt-3 font-mono font-bold text-teal-600 dark:text-teal-400 text-sm">
                  ~₹2,500 Green Reward + Certificate
                </span>
              </button>
            </div>
          </div>

          {/* Device details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as any)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white cursor-pointer"
              >
                <option value="smartphone">Smartphone</option>
                <option value="laptop">Laptop / PC</option>
                <option value="tablet">Tablet</option>
                <option value="smartwatch">Smartwatch</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Brand</label>
              <input
                type="text"
                required
                value={brand}
                onChange={e => setBrand(e.target.value)}
                placeholder="e.g. Apple, Samsung"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Model</label>
              <input
                type="text"
                required
                value={model}
                onChange={e => setModel(e.target.value)}
                placeholder="e.g. iPhone 12, Galaxy S21"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Pickup logistics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Pickup Address (Hostel / Campus)</label>
              <input
                type="text"
                required
                value={pickupAddress}
                onChange={e => setPickupAddress(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Preferred Time Window</label>
              <select
                value={pickupTimeSlot}
                onChange={e => setPickupTimeSlot(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white cursor-pointer"
              >
                <option value="Today, 4:00 PM - 6:00 PM">Today, 4:00 PM - 6:00 PM</option>
                <option value="Tomorrow, 10:00 AM - 1:00 PM">Tomorrow, 10:00 AM - 1:00 PM</option>
                <option value="Tomorrow, 2:00 PM - 5:00 PM">Tomorrow, 2:00 PM - 5:00 PM</option>
              </select>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-emerald-500/30 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500 dark:text-slate-400 block">Instant Estimated Payout</span>
              <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
                ${estimatedPayout} {action === 'quick_sell_parts' ? 'Cash' : 'Eco-Credit'}
              </span>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
              Free Campus Pickup
            </span>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold text-sm shadow-xl shadow-amber-500/20 transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Confirm Handover & Schedule Pickup</span>
            <ChevronRight className="w-4 h-4" />
          </button>

        </form>
      )}

    </div>
  );
};
