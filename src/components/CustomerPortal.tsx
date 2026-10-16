import React, { useState, useMemo } from 'react';
import { 
  Layers, 
  Smartphone, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  IndianRupee, 
  TrendingUp, 
  Recycle, 
  Cpu, 
  Wrench, 
  ArrowRight, 
  ArrowLeft,
  MapPin, 
  Star, 
  QrCode, 
  Plus, 
  Zap, 
  Navigation 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DeviceInspection, DispositionChoice, ShopOffer } from '../types';
import { generateBestRecommendation } from '../services/recommendationService';
import { DEVICE_SVG_PRESETS } from '../mock/initialData';
import { formatRupees } from '../utils/formatters';

export const CustomerPortal: React.FC = () => {
  const { 
    currentUser, 
    inspections, 
    offers, 
    technicians, 
    acceptOffer, 
    setActiveTab 
  } = useApp();

  const [deliveryPref, setDeliveryPref] = useState<'self_pickup' | 'delivery'>('self_pickup');

  const myInspections = useMemo(() => {
    if (currentUser?.role === 'customer') {
      const userDevices = inspections.filter(i => i.customerId === currentUser.id);
      return userDevices.length > 0 ? userDevices : inspections;
    }
    return inspections;
  }, [inspections, currentUser]);

  const [selectedInspectionId, setSelectedInspectionId] = useState<string>(
    myInspections[0]?.id || ''
  );

  const activeInspection = inspections.find(i => i.id === selectedInspectionId) || myInspections[0];

  const inspectionOffers = useMemo(() => {
    if (!activeInspection) return [];
    return offers.filter(o => o.inspectionId === activeInspection.id);
  }, [offers, activeInspection]);

  const recommendation = useMemo(() => {
    if (!activeInspection || inspectionOffers.length === 0) return null;
    return generateBestRecommendation(activeInspection, inspectionOffers);
  }, [activeInspection, inspectionOffers]);

  const acceptedOffer = inspectionOffers.find(o => o.id === activeInspection?.acceptedOfferId || o.status === 'accepted');
  const assignedTech = technicians.find(t => t.id === activeInspection?.assignedTechnicianId);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 relative">
      
      {/* Decorative ambient blobs */}
      <div className="absolute top-10 -left-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setActiveTab('customer_home')}
            className="p-2.5 rounded-2xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all shadow-sm cursor-pointer"
            title="Back to Customer Home"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                Customer Judgments Hub
              </span>
              <span className="text-slate-500 dark:text-slate-400 text-xs">Logged in as {currentUser?.name}</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              My Returns & Authorized Shop Judgments
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Compare repair, refurbish, parts, and recycling offers from certified service centers around Manipal University Jaipur.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('quick_sell')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold text-xs border border-amber-500/30 transition-colors cursor-pointer"
          >
            <Zap className="w-4 h-4 text-amber-500" />
            <span>Quick-Sell / Recycle</span>
          </button>

          <button
            onClick={() => setActiveTab('muj_map')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 text-teal-700 dark:text-teal-300 font-bold text-xs border border-teal-500/30 transition-colors cursor-pointer"
          >
            <MapPin className="w-4 h-4 text-teal-500" />
            <span>MUJ Real Map</span>
          </button>

          <button
            onClick={() => setActiveTab('device_inspector')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-extrabold text-xs shadow-lg shadow-emerald-500/20 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Inspection</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Device Selector List (4 Cols) */}
        <div className="lg:col-span-4 space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
            My Inspected Devices ({myInspections.length})
          </h2>

          {myInspections.map(insp => {
            const isSelected = insp.id === activeInspection?.id;
            const deviceOffers = offers.filter(o => o.inspectionId === insp.id);
            const isAccepted = insp.status === 'accepted';

            return (
              <div
                key={insp.id}
                onClick={() => setSelectedInspectionId(insp.id)}
                className={`p-4 rounded-3xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-white dark:bg-slate-900 border-indigo-500 shadow-xl shadow-indigo-500/10 ring-2 ring-indigo-500/30'
                    : 'bg-white/60 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shrink-0">
                      <img 
                        src={insp.photos[0]?.url || DEVICE_SVG_PRESETS.smartphone_cracked} 
                        alt={insp.model} 
                        className="w-full h-full object-cover" 
                        onError={(e: any) => { e.target.src = DEVICE_SVG_PRESETS.smartphone_cracked; }}
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-sm">{insp.brand} {insp.model}</h3>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">{insp.trackingNumber}</p>
                    </div>
                  </div>

                  {isAccepted ? (
                    <span className="px-2 py-0.5 rounded-lg text-[10px] font-mono bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 font-bold">
                      Booked
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-lg text-[10px] font-mono bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 font-bold">
                      {deviceOffers.length} Judgments
                    </span>
                  )}
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span>As-Is Worth: <strong className="text-emerald-600 dark:text-emerald-400 font-mono">{formatRupees(insp.aiValuation.estimatedWorth)}</strong></span>
                  <span>{insp.damages.length} Damaged Parts</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Judgments, AI Recommendation & Booking (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {activeInspection && (
            <>
              {/* Device Overview Banner */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-lg border border-emerald-500/20">
                        {activeInspection.trackingNumber}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 capitalize">Condition: {activeInspection.conditionRating}</span>
                      <span className="flex items-center gap-1 text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 px-2.5 py-0.5 rounded-lg border border-emerald-500/30">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                        <span>OEM Verified: {activeInspection.specs.imeiOrServiceTag || activeInspection.specs.serialNumber || 'Legit Hardware'}</span>
                      </span>
                    </div>
                    <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                      {activeInspection.brand} {activeInspection.model} ({activeInspection.specs.storage || ''})
                    </h2>
                  </div>

                  {acceptedOffer && (
                    <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-right">
                      <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">Accepted Path</span>
                      <span className="font-extrabold text-slate-900 dark:text-white text-sm capitalize">{acceptedOffer.disposition.replace(/_/g, ' ')}</span>
                      <span className="block text-xs font-mono text-emerald-600 dark:text-emerald-400 mt-0.5">with {acceptedOffer.shopName.split('-')[0]}</span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 text-xs">
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-500 dark:text-slate-400 block mb-1">Hardware Age</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">{activeInspection.ageMonths} Months Old</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-500 dark:text-slate-400 block mb-1">Reported Symptoms</span>
                    <span className="font-bold text-rose-500 dark:text-rose-300">{activeInspection.damages.map(d => d.title).join(', ')}</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-500 dark:text-slate-400 block mb-1">As-Is Valuation</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono text-sm">{formatRupees(activeInspection.aiValuation.estimatedWorth)}</span>
                  </div>
                </div>

                {/* Delivery Preference */}
                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">How would you like to collect your repaired device?</p>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setDeliveryPref('self_pickup')}
                      className={`p-3 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                        deliveryPref === 'self_pickup'
                          ? 'border-indigo-500 bg-indigo-500/10 text-indigo-900 dark:text-white ring-2 ring-indigo-500/20'
                          : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 hover:border-indigo-300'
                      }`}
                    >
                      <span className="font-bold block">🏃 Self Pickup</span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">Save money — collect from shop yourself</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeliveryPref('delivery')}
                      className={`p-3 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                        deliveryPref === 'delivery'
                          ? 'border-violet-500 bg-violet-500/10 text-violet-900 dark:text-white ring-2 ring-violet-500/20'
                          : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 hover:border-violet-300'
                      }`}
                    >
                      <span className="font-bold block">🚚 Doorstep Delivery</span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">We bring it to you (small delivery charge applies)</span>
                    </button>
                  </div>
                  {deliveryPref === 'self_pickup' && (
                    <p className="mt-1.5 text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold">✅ You save the delivery fee by picking up yourself!</p>
                  )}
                </div>
              </div>

              {/* AI Recommendation Banner */}
              {recommendation && !acceptedOffer && (
                <div className="bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-emerald-950/50 dark:via-slate-900 dark:to-teal-950/40 border border-emerald-500/40 rounded-3xl p-6 shadow-2xl relative overflow-hidden transition-colors">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-1.5 rounded-xl bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                      FixCycle AI Value Recommendation
                    </span>
                  </div>

                  <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mb-2">
                    {recommendation.headline}
                  </h3>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                    {recommendation.executiveSummary}
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                    {recommendation.comparisonPoints.map((point, idx) => (
                      <div key={idx} className="p-2.5 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-emerald-500/20 text-center shadow-sm">
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 block mb-0.5">{point.title}</span>
                        <span className="font-extrabold text-emerald-700 dark:text-emerald-300 font-mono text-xs">{point.value}</span>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-3 border-t border-emerald-500/20">
                    <div>
                      <p className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 mb-1.5 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Why this is the best path:</span>
                      </p>
                      <ul className="text-[11px] text-slate-700 dark:text-slate-300 space-y-1 list-disc list-inside">
                        {recommendation.reasons.map((r, i) => (
                          <li key={i}>{r}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <p className="text-[11px] font-bold text-amber-700 dark:text-amber-300 mb-1.5 flex items-center gap-1">
                        <span>Trade-offs to consider:</span>
                      </p>
                      <ul className="text-[11px] text-slate-500 dark:text-slate-400 space-y-1 list-disc list-inside">
                        {recommendation.tradeOffs.map((t, i) => (
                          <li key={i}>{t}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Booking Confirmation Pass with Assigned Technician */}
              {acceptedOffer && (
                <div className="bg-white dark:bg-slate-900 border border-emerald-500/50 rounded-3xl p-6 shadow-2xl space-y-4 transition-colors">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-2xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-300">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 dark:text-white text-base">Booking Confirmed</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">Routing ID: {acceptedOffer.id}</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500 text-white font-mono shadow-sm">
                      ACTIVE WORK ORDER
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                    <div className="sm:col-span-8 space-y-3 text-xs">
                      <p className="text-slate-700 dark:text-slate-300">
                        Your device is booked with <strong>{acceptedOffer.shopName}</strong> ({acceptedOffer.shopLocation}).
                      </p>

                      {assignedTech && (
                        <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3">
                          <img src={assignedTech.avatar} alt={assignedTech.name} className="w-10 h-10 rounded-full" />
                          <div>
                            <span className="text-[10px] text-emerald-700 dark:text-emerald-400 uppercase font-mono font-bold">Assigned Lead Technician</span>
                            <p className="text-xs font-bold text-slate-900 dark:text-white">{assignedTech.name} ({assignedTech.role})</p>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400">★ {assignedTech.rating} Rating • {assignedTech.experienceYears}y exp</p>
                          </div>
                        </div>
                      )}

                      <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1.5 font-mono text-[11px]">
                        <div className="flex justify-between">
                          <span className="text-slate-500 dark:text-slate-400">Chosen Path:</span>
                          <span className="text-slate-900 dark:text-white uppercase font-bold">{acceptedOffer.disposition.replace(/_/g, ' ')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500 dark:text-slate-400">Price / Payout:</span>
                          <span className="text-emerald-600 dark:text-emerald-400 font-bold">{formatRupees(acceptedOffer.proposedPrice)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500 dark:text-slate-400">Estimated Turnaround:</span>
                          <span className="text-teal-600 dark:text-teal-400 font-bold">{acceptedOffer.turnaroundDays} Days</span>
                        </div>
                      </div>
                    </div>

                    <div className="sm:col-span-4 flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center">
                      <QrCode className="w-20 h-20 text-emerald-500 mb-2" />
                      <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">Campus Handover QR</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Side-by-Side Shop Judgments Matrix */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Layers className="w-4 h-4 text-emerald-500" />
                    <span>Authorized Service Center Judgments ({inspectionOffers.length})</span>
                  </h3>
                  <span className="text-xs text-slate-500 dark:text-slate-400">Certified centers within 10 km of MUJ</span>
                </div>

                {inspectionOffers.length === 0 ? (
                  <div className="p-8 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm">
                    <Clock className="w-6 h-6 text-amber-500 mx-auto mb-2 animate-spin" />
                    <p className="text-sm font-semibold text-slate-800 dark:text-white">Awaiting bids from network service centers</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Authorized shops around Dehmi Kalan and Bagru are analyzing device specs.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {inspectionOffers.map(offer => {
                      const isRecommended = recommendation?.bestOfferId === offer.id;

                      let icon = Wrench;
                      let badgeColor = 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20';
                      let pathTitle = 'Fix & Return';

                      if (offer.disposition === 'buy_and_refurbish') {
                        icon = TrendingUp;
                        badgeColor = 'bg-teal-500/10 text-teal-700 dark:text-teal-400 border-teal-500/20';
                        pathTitle = 'Buy & Refurbish';
                      } else if (offer.disposition === 'sell_for_parts') {
                        icon = Cpu;
                        badgeColor = 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20';
                        pathTitle = 'Sell for Parts';
                      } else if (offer.disposition === 'recycle') {
                        icon = Recycle;
                        badgeColor = 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20';
                        pathTitle = 'Eco-Recycle';
                      }

                      return (
                        <div
                          key={offer.id}
                          className={`rounded-3xl border p-5 flex flex-col justify-between transition-all relative ${
                            isRecommended && !activeInspection.acceptedOfferId
                              ? 'bg-white dark:bg-slate-900 border-emerald-500 shadow-xl shadow-emerald-500/10 ring-2 ring-emerald-500/30'
                              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm'
                          }`}
                        >
                          {isRecommended && !activeInspection.acceptedOfferId && (
                            <div className="absolute -top-3 left-4 px-2.5 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-extrabold uppercase tracking-wider shadow-md">
                              AI Best Recommendation
                            </div>
                          )}

                          <div>
                            <div className="flex items-start justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                              <div>
                                <h4 className="font-bold text-slate-900 dark:text-white text-sm">{offer.shopName.split('-')[0]}</h4>
                                <div className="flex items-center gap-1.5 mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                                  <span className="flex items-center gap-0.5 text-amber-500 font-bold">
                                    <Star className="w-3 h-3 fill-amber-500" />
                                    <span>{offer.shopRating}</span>
                                  </span>
                                  <span>•</span>
                                  <span className="truncate">{offer.shopLocation}</span>
                                </div>
                              </div>

                              <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border uppercase ${badgeColor}`}>
                                {pathTitle}
                              </span>
                            </div>

                            <div className="py-4 space-y-2 text-xs">
                              <div className="flex justify-between items-baseline">
                                <span className="text-slate-500 dark:text-slate-400">
                                  {offer.disposition === 'fix_and_return' ? 'Repair Fee:' : 'Cash Payout to You:'}
                                </span>
                                <span className="text-xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400">
                                  {formatRupees(offer.proposedPrice)}
                                </span>
                              </div>

                              <div className="flex justify-between text-slate-500 dark:text-slate-400">
                                <span>Turnaround:</span>
                                <span className="font-mono text-slate-800 dark:text-slate-200 font-bold">{offer.turnaroundDays} Day{offer.turnaroundDays > 1 ? 's' : ''}</span>
                              </div>

                              {offer.notes && (
                                <p className="pt-2 text-[11px] text-slate-600 dark:text-slate-400 italic">
                                  "{offer.notes}"
                                </p>
                              )}
                            </div>
                          </div>

                          {!activeInspection.acceptedOfferId && (
                            <button
                              onClick={() => acceptOffer(activeInspection.id, offer.id)}
                              className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                                isRecommended
                                  ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-500/20'
                                  : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200'
                              }`}
                            >
                              <span>Accept Offer</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          )}

        </div>

      </div>
    </div>
  );
};
