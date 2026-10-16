import React, { useMemo } from 'react';
import { 
  Smartphone, 
  Laptop, 
  Tablet, 
  Recycle, 
  Leaf, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  Plus, 
  TrendingUp, 
  Layers, 
  Wrench, 
  Cpu, 
  Clock, 
  CheckCircle2, 
  Zap, 
  AlertCircle, 
  MapPin, 
  ChevronRight,
  RotateCcw,
  TreeDeciduous,
  Car,
  Lightbulb,
  Award,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DEVICE_SVG_PRESETS } from '../mock/initialData';
import { formatRupees } from '../utils/formatters';

export const CustomerHome: React.FC = () => {
  const { currentUser, inspections, offers, setActiveTab, setSelectedInspectionId } = useApp();

  // Filter devices entered by current customer
  const myDevices = useMemo(() => {
    if (currentUser?.role === 'customer') {
      const userDevices = inspections.filter(i => i.customerId === currentUser.id);
      return userDevices.length > 0 ? userDevices : inspections;
    }
    return inspections;
  }, [inspections, currentUser]);

  // Aggregate user impact metrics
  const totalUserPortfolioWorth = useMemo(() => {
    return myDevices.reduce((sum, d) => sum + d.aiValuation.estimatedWorth, 0);
  }, [myDevices]);

  const totalUserCarbonSavedKg = useMemo(() => {
    return myDevices.reduce((sum, d) => {
      const baseSavings = d.category === 'laptop' ? 276 : d.category === 'smartphone' ? 68 : 120;
      return sum + baseSavings;
    }, 0);
  }, [myDevices]);

  // Equivalencies
  const treeEquivalents = Math.round(totalUserCarbonSavedKg / 21);
  const carKmEquivalents = Math.round(totalUserCarbonSavedKg * 4.2);
  const kwhElectricityEquivalents = Math.round(totalUserCarbonSavedKg * 1.25);

  const handleDeviceClick = (deviceId: string) => {
    setSelectedInspectionId(deviceId);
    setActiveTab('customer_portal');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 relative">
      
      {/* Decorative ambient curved background shapes */}
      <div className="absolute top-12 left-10 w-96 h-96 bg-emerald-500/10 dark:bg-emerald-500/15 rounded-[3rem] blur-3xl pointer-events-none -rotate-12"></div>
      <div className="absolute top-80 right-10 w-96 h-96 bg-teal-500/10 dark:bg-teal-500/15 rounded-[3rem] blur-3xl pointer-events-none rotate-12"></div>
      <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-amber-500/5 dark:bg-amber-500/10 rounded-[2.5rem] blur-2xl pointer-events-none"></div>

      {/* Hero Welcome Banner with Layered Curved Square Edges */}
      <div className="relative rounded-[2.5rem] p-8 sm:p-10 mb-8 border border-emerald-500/30 bg-gradient-to-br from-white/95 via-emerald-500/5 to-teal-500/10 dark:from-slate-900/95 dark:via-emerald-950/20 dark:to-teal-950/30 backdrop-blur-xl shadow-2xl overflow-hidden transition-all">
        
        {/* Layered decorative curved squircle accents */}
        <div className="absolute -top-12 -right-12 w-64 h-64 rounded-[3.5rem] border border-emerald-500/20 bg-emerald-500/5 pointer-events-none rotate-45"></div>
        <div className="absolute -bottom-16 right-28 w-48 h-48 rounded-[2.8rem] border border-teal-500/20 bg-teal-500/5 pointer-events-none -rotate-12"></div>

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-700 dark:text-emerald-300 text-xs font-semibold mb-4">
            <Sparkles className="w-4 h-4 text-emerald-500" />
            <span>Manipal University Jaipur Circular Electronics Return Path</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 dark:from-emerald-400 dark:to-teal-300">{currentUser?.name.split(' ')[0]}</span>.
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-3 leading-relaxed">
            Your centralized portal for verified device diagnostics, circular repair judgments, e-waste abatement, and certified local electronics disposition.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-6">
            <button
              onClick={() => setActiveTab('device_inspector')}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-extrabold text-sm shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:-translate-y-0.5 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Inspect & Verify a Device</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveTab('quick_sell')}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-bold text-sm shadow-sm transition-all cursor-pointer"
            >
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Instant Quick-Sell / Recycle</span>
            </button>

            <button
              onClick={() => setActiveTab('muj_map')}
              className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold text-sm border border-emerald-500/30 transition-all cursor-pointer"
            >
              <MapPin className="w-4 h-4 text-emerald-500" />
              <span>10km Repair Map</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Column (3R & Carbon Footprint) vs Right Side Column (My Registered Devices) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ========================================================================= */}
        {/* LEFT / CENTER COLUMN: E-Waste 3R Matrix & Carbon Footprint Engine (7 Cols) */}
        {/* ========================================================================= */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Section 1: The 3R Circular Electronics Matrix (Reduce, Reuse, Recycle) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-6 sm:p-7 shadow-xl space-y-6 transition-colors">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    Circular Electronics Framework
                  </span>
                </div>
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
                  Our Contribution to Reduce, Reuse & Dispose E-Waste
                </h2>
              </div>
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400 self-start sm:self-auto bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-xl">
                Track 06 • PS 25/35
              </span>
            </div>

            {/* 3 Pillars: Reduce, Reuse, Recycle */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Pillar 1: REDUCE */}
              <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-950/70 border border-emerald-500/25 flex flex-col justify-between space-y-3">
                <div>
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-lg mb-3 shadow-inner">
                    🛡️
                  </div>
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block">
                    1. Reduce
                  </span>
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white mt-0.5">
                    Preventing Landfill Dump
                  </h3>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                    By diagnosing component-level faults, <strong>84.6%</strong> of discarded devices around MUJ are prevented from entering toxic e-waste landfills.
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-500">Lifespan Extension</span>
                    <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">+2.4 Years</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-500">Hazardous Lead Avoided</span>
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-200">18.4 kg</span>
                  </div>
                </div>
              </div>

              {/* Pillar 2: REUSE */}
              <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-950/70 border border-teal-500/25 flex flex-col justify-between space-y-3">
                <div>
                  <div className="w-10 h-10 rounded-2xl bg-teal-500/15 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold text-lg mb-3 shadow-inner">
                    ⚡
                  </div>
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 block">
                    2. Reuse
                  </span>
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white mt-0.5">
                    Component Harvesting
                  </h3>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                    Working sub-assemblies (OLED matrix, logic boards, cameras) are harvested and immediately cataloged into our 5 authorized shop spare parts pools.
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-500">Parts Harvested</span>
                    <span className="font-mono font-bold text-teal-600 dark:text-teal-400">890+ SKUs</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-500">Student Price Discount</span>
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-200">-45% MSRP</span>
                  </div>
                </div>
              </div>

              {/* Pillar 3: DISPOSE & RECYCLE */}
              <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-950/70 border border-purple-500/25 flex flex-col justify-between space-y-3">
                <div>
                  <div className="w-10 h-10 rounded-2xl bg-purple-500/15 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold text-lg mb-3 shadow-inner">
                    ♻️
                  </div>
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 block">
                    3. Dispose Cleanly
                  </span>
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white mt-0.5">
                    Hydrometallurgical Recovery
                  </h3>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                    Unfixable electronics go to Bagru Industrial Area certified e-waste processors for zero-emission acid extraction of gold, copper, and cobalt.
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-500">Gold Recovered</span>
                    <span className="font-mono font-bold text-amber-500">340 g / ton</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-500">Landfill Diversion</span>
                    <span className="font-mono font-bold text-purple-600 dark:text-purple-400">100% Closed Loop</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Rare & Critical Minerals Extraction Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-teal-500/10 border border-amber-500/25 text-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 text-amber-500" />
                  <span>Strategic Raw Materials Recovered by FixCycle Network (2026 YTD):</span>
                </span>
                <span className="text-[10px] font-mono text-slate-500">Govt. Certified R2v3 Recyclers</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                <div className="p-2 rounded-xl bg-white/70 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-500 block">Refined Gold (Au)</span>
                  <span className="font-mono font-bold text-amber-500">1.42 kg</span>
                </div>
                <div className="p-2 rounded-xl bg-white/70 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-500 block">Pure Copper (Cu)</span>
                  <span className="font-mono font-bold text-orange-500">284 kg</span>
                </div>
                <div className="p-2 rounded-xl bg-white/70 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-500 block">Lithium & Cobalt</span>
                  <span className="font-mono font-bold text-teal-600 dark:text-teal-400">96 kg</span>
                </div>
                <div className="p-2 rounded-xl bg-white/70 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-500 block">Palladium & Silver</span>
                  <span className="font-mono font-bold text-purple-600 dark:text-purple-400">3.8 kg</span>
                </div>
              </div>
            </div>

          </div>

          {/* Section 2: How We Reduce the Carbon Footprint of a Device */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-6 sm:p-7 shadow-xl space-y-6 transition-colors">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <Leaf className="w-4 h-4 text-emerald-500" />
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    Emissions Avoidance Engineering
                  </span>
                </div>
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
                  How FixCycle Reduces Device Carbon Footprints
                </h2>
              </div>

              <div className="p-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-right">
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 uppercase font-mono font-bold block">Your Avoided Footprint</span>
                <span className="text-xl font-extrabold font-mono text-slate-900 dark:text-white">{totalUserCarbonSavedKg} kg CO₂e</span>
              </div>
            </div>

            {/* The Science: Manufacturing vs Repair Emissions */}
            <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 space-y-4">
              <span className="text-xs font-bold text-slate-900 dark:text-white block">
                The Science: Where Does a Device's Carbon Footprint Come From?
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                <strong>Over 80%</strong> of a consumer electronics device's lifetime carbon footprint is generated during <em>raw extraction and semiconductor fabrication</em> before you ever turn it on. When you repair rather than replace, you eliminate that entire manufacturing emissions spike.
              </p>

              {/* Head-to-Head Carbon Bar Comparison */}
              <div className="space-y-3 pt-2">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">1. Manufacturing a Brand New Smartphone</span>
                    <span className="font-mono font-extrabold text-rose-600 dark:text-rose-400">72.0 kg CO₂e</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-rose-500 to-red-600 rounded-full w-[100%]" />
                  </div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 block">
                    Silicon wafer etching, rare earth mining, global freight supply chains.
                  </span>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-semibold text-emerald-700 dark:text-emerald-300">2. FixCycle Local Screen / Battery Restoration</span>
                    <span className="font-mono font-extrabold text-emerald-600 dark:text-emerald-400">8.5 kg CO₂e (88% Savings!)</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full w-[12%]" />
                  </div>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono mt-0.5 block font-bold">
                    Net Carbon Avoidance: -63.5 kg CO₂e kept out of atmosphere!
                  </span>
                </div>
              </div>
            </div>

            {/* Real-World Environmental Equivalency Visualizers */}
            <div>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-3 uppercase tracking-wider">
                What Your Personal Ecological Savings Equal In Real Life:
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0">
                    <TreeDeciduous className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-mono font-extrabold text-lg text-emerald-700 dark:text-emerald-300 block leading-tight">
                      {treeEquivalents} Trees
                    </span>
                    <span className="text-[11px] text-slate-600 dark:text-slate-400">
                      Carbon absorbed over an entire year
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-teal-500/20 text-teal-700 dark:text-teal-300 flex items-center justify-center shrink-0">
                    <Car className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-mono font-extrabold text-lg text-teal-700 dark:text-teal-300 block leading-tight">
                      {carKmEquivalents} km
                    </span>
                    <span className="text-[11px] text-slate-600 dark:text-slate-400">
                      Of fossil-fuel passenger car driving avoided
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0">
                    <Lightbulb className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-mono font-extrabold text-lg text-amber-700 dark:text-amber-300 block leading-tight">
                      {kwhElectricityEquivalents} kWh
                    </span>
                    <span className="text-[11px] text-slate-600 dark:text-slate-400">
                      Grid energy saved from coal combustion
                    </span>
                  </div>
                </div>

              </div>
            </div>

          </div>

        </div>

        {/* ========================================================================= */}
        {/* RIGHT SIDE COLUMN: Registered Devices Entered on App (5 Cols)           */}
        {/* ========================================================================= */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="sticky top-24 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-6 shadow-2xl space-y-6 transition-colors">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block">
                  Customer Portfolio
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">
                  My Entered Devices
                </h3>
              </div>

              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                {myDevices.length} Devices
              </span>
            </div>

            {/* Quick Portfolio Stats */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400 block text-[10px] mb-0.5">As-Is Cash Worth</span>
                <span className="font-extrabold text-emerald-600 dark:text-emerald-400 font-mono text-base">
                  {formatRupees(totalUserPortfolioWorth)}
                </span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400 block text-[10px] mb-0.5">Network Shop Offers</span>
                <span className="font-extrabold text-amber-600 dark:text-amber-400 font-mono text-base">
                  {offers.length} Bids Active
                </span>
              </div>
            </div>

            {/* List of Entered Devices */}
            <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
              {myDevices.map(device => {
                const deviceOffers = offers.filter(o => o.inspectionId === device.id);
                const isAccepted = device.status === 'accepted';
                const hasImei = device.specs.imeiOrServiceTag || device.specs.serialNumber;

                return (
                  <div
                    key={device.id}
                    onClick={() => handleDeviceClick(device.id)}
                    className="p-4 rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 hover:bg-white dark:hover:bg-slate-800/80 hover:border-emerald-500/40 hover:shadow-lg transition-all cursor-pointer group"
                  >
                    <div className="flex items-start gap-3">
                      
                      {/* Thumbnail with Squircle Border */}
                      <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-200 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 shrink-0">
                        <img 
                          src={device.photos[0]?.url || DEVICE_SVG_PRESETS.smartphone_cracked} 
                          alt={device.model} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 truncate">
                            {device.trackingNumber}
                          </span>
                          {isAccepted ? (
                            <span className="px-2 py-0.5 rounded-lg text-[9px] font-mono font-bold bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                              Booked
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-lg text-[9px] font-mono font-bold bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                              {deviceOffers.length} Judgments
                            </span>
                          )}
                        </div>

                        <h4 className="font-extrabold text-sm text-slate-900 dark:text-white truncate mt-0.5">
                          {device.brand} {device.model}
                        </h4>

                        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono truncate">
                          {device.specs.storage || ''} • {device.specs.color || ''}
                        </p>
                      </div>

                    </div>

                    {/* OEM Legitimacy Badge */}
                    <div className="mt-3 pt-2.5 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-700 dark:text-emerald-400">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                        <span>OEM Verified Original</span>
                      </div>

                      <span className="font-mono text-[11px] text-slate-900 dark:text-white font-extrabold">
                        {formatRupees(device.aiValuation.estimatedWorth)}
                      </span>
                    </div>

                    {/* View Judgments CTA */}
                    <div className="mt-2 text-right">
                      <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 group-hover:underline inline-flex items-center gap-1">
                        <span>View Multi-Shop Judgments</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>

                  </div>
                );
              })}
            </div>

            {/* Quick Action Button to Add More */}
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setActiveTab('device_inspector')}
                className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-extrabold text-xs shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+ Inspect & Register Another Device</span>
              </button>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
