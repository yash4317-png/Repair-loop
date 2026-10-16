import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Play, 
  RotateCcw, 
  ShieldAlert, 
  CheckCircle2, 
  TrendingUp, 
  Leaf, 
  Truck, 
  Wrench, 
  Box, 
  Recycle, 
  Cpu, 
  Layers, 
  ArrowRight, 
  ArrowLeft,
  Sparkles,
  MessageSquare,
  Clock,
  IndianRupee,
  AlertTriangle,
  ChevronRight,
  Info
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface SimAgentDialogue {
  step: number;
  agentRole: 'Customer' | 'Apex Depot' | 'EcoRefurb' | 'Logistics Carrier' | 'Consensus Arbiter';
  agentName: string;
  avatarIcon: string;
  badgeColor: string;
  bubbleText: string;
  techDetails: string;
  impactMetric: string;
}

const DIALOGUE_STEPS: SimAgentDialogue[] = [
  {
    step: 1,
    agentRole: 'Customer',
    agentName: 'Student Rohan (MUJ Campus Gate 1)',
    avatarIcon: '📱',
    badgeColor: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20',
    bubbleText: '"My iPhone 13 Pro fell outside MUJ Academic Block 1. The front OLED glass is cracked, but cameras and logic board are 100% functional. What is my best circular return path?"',
    techDetails: 'Broadcasted diagnostic telemetry + 2 intake photos to MUJ 10km agent auction ring.',
    impactMetric: 'Device Value: ₹32,000 MSRP'
  },
  {
    step: 2,
    agentRole: 'Apex Depot',
    agentName: 'Apex Central Returns Depot (Fixed Hub)',
    avatarIcon: '🏢',
    badgeColor: 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20',
    bubbleText: '"Warning: My repair bench is backlogged with 42 items. Also, I am completely OUT OF STOCK for iPhone 13 Pro OLED panels. If you route here, customer must wait 12 days or device will be written off for shredding."',
    techDetails: 'Fixed-priority rule would force delivery here, causing depot gridlock and potential landfill waste.',
    impactMetric: 'Queue Delay: +12 Days'
  },
  {
    step: 3,
    agentRole: 'EcoRefurb',
    agentName: 'EcoRefurb Service Center (Bagru NH-48)',
    avatarIcon: '⚡',
    badgeColor: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20',
    bubbleText: '"Bidding for repair! My warehouse has 4 OEM iPhone 13 Pro OLED displays in stock right now, and Technician Ramesh has an open bench tomorrow morning. I offer certified repair for ₹8,800 in 48 hours!"',
    techDetails: 'Matched SKU: DISP-IP13P-OEM in local Bagru inventory. Projected profit margin: 38%.',
    impactMetric: 'Turnaround: 48 Hours'
  },
  {
    step: 4,
    agentRole: 'Logistics Carrier',
    agentName: 'Jaipur Expressway Green Courier',
    avatarIcon: '🚚',
    badgeColor: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20',
    bubbleText: '"Route optimization check: I already have an active EV van traveling from MUJ campus down NH-48 toward Bagru Industrial Area. Adding this package adds only 1.2 km of detour, costing just ₹280 and 0.4 kg CO₂."',
    techDetails: 'Piggybacked on existing freight path, saving ₹1,500 in solo courier dispatch costs.',
    impactMetric: 'Carbon Saved: 3.8 kg CO₂'
  },
  {
    step: 5,
    agentRole: 'Consensus Arbiter',
    agentName: 'FixCycle Autonomous Multi-Agent Engine',
    avatarIcon: '🧠',
    badgeColor: 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20',
    bubbleText: '"Contract finalized! By negotiating autonomously across parts inventory, technician availability, and logistics routes, the return is diverted directly to EcoRefurb Bagru. Customer gets their phone back in 2 days instead of 14, and zero e-waste is generated!"',
    techDetails: 'Result: 10 days saved, ₹11,200 customer savings, 100% circular retention achieved.',
    impactMetric: 'Economic Win: +₹19,200 Net'
  }
];

export const MultiAgentSimulation: React.FC = () => {
  const { setActiveTab, currentUser } = useApp();

  const [activeStep, setActiveStep] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  useEffect(() => {
    let timer: any;
    if (isPlaying) {
      timer = setInterval(() => {
        setActiveStep(prev => {
          if (prev >= DIALOGUE_STEPS.length) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 2500);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  const currentDialogue = DIALOGUE_STEPS[activeStep - 1] || DIALOGUE_STEPS[0];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 relative">
      
      {/* Top Header with Back Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-8 border-b border-slate-200 dark:border-slate-800 gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setActiveTab(currentUser?.role === 'customer' ? 'customer_home' : 'shopkeeper_portal')}
            className="p-2.5 rounded-2xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all shadow-sm cursor-pointer"
            title="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-700 dark:text-purple-400 border border-purple-500/20">
                Hackathon Track 06 • Problem Statement 25/35
              </span>
              <span className="text-slate-500 dark:text-slate-400 text-xs font-mono">Interactive Multi-Agent Decision Simulator</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Why Multi-Agent Return Routing Solves E-Waste
            </h1>
          </div>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => {
              setActiveStep(1);
              setIsPlaying(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md shadow-purple-500/20 transition-all cursor-pointer"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>{isPlaying ? 'Playing Story...' : 'Auto-Play Story'}</span>
          </button>

          <button
            onClick={() => {
              setIsPlaying(false);
              setActiveStep(1);
            }}
            className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            title="Reset to Step 1"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* The 30-Second Plain English Explainer Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 mb-8 shadow-xl transition-colors">
        <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-3">
          <Info className="w-5 h-5 text-purple-500" />
          <span>The Core Problem in Plain English: Rigid Rules vs. Autonomous Multi-Agent Negotiation</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          
          <div className="p-4 rounded-2xl bg-rose-500/5 dark:bg-rose-500/10 border border-rose-500/20 space-y-1.5">
            <span className="font-extrabold text-rose-700 dark:text-rose-400 text-sm flex items-center gap-1.5">
              <span>❌ The Old Way (What Amazon / Apple / BestBuy do today)</span>
            </span>
            <p className="text-slate-700 dark:text-slate-300">
              When a phone is returned, software follows a <strong>rigid rule</strong>: always send it to one central mega-depot.
            </p>
            <p className="text-slate-500 dark:text-slate-400">
              <strong>The Failure:</strong> The central depot gets backlogged with 10,000 devices, runs out of spare screens, and stamps fixable phones as "Beyond Economical Repair" — throwing 60% of repairable electronics straight into landfills!
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 space-y-1.5">
            <span className="font-extrabold text-emerald-700 dark:text-emerald-400 text-sm flex items-center gap-1.5">
              <span>✅ The FixCycle Solution (PS 25 Autonomous Negotiation)</span>
            </span>
            <p className="text-slate-700 dark:text-slate-300">
              Instead of one rigid warehouse, <strong>5 local shops run autonomous AI agents</strong> that bid based on their live spare parts stock and technician availability.
            </p>
            <p className="text-slate-500 dark:text-slate-400">
              <strong>The Result:</strong> The broken phone is routed directly to EcoRefurb Bagru because they already have the screen in stock and a free bench. <strong>Turnaround drops from 14 days to 48 hours, and 100% of e-waste is prevented!</strong>
            </p>
          </div>

        </div>
      </div>

      {/* Main Interactive Arena */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Interactive Story Step View (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6 transition-colors">
            
            {/* Step navigation pills */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Step-by-Step Negotiation Trace
              </span>
              <div className="flex items-center gap-1">
                {DIALOGUE_STEPS.map(d => (
                  <button
                    key={d.step}
                    onClick={() => {
                      setIsPlaying(false);
                      setActiveStep(d.step);
                    }}
                    className={`w-7 h-7 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                      activeStep === d.step
                        ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20 scale-110'
                        : activeStep > d.step
                        ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                    }`}
                  >
                    {d.step}
                  </button>
                ))}
              </div>
            </div>

            {/* Speaking Agent Card */}
            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-4 transition-all">
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl p-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                    {currentDialogue.avatarIcon}
                  </span>
                  <div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${currentDialogue.badgeColor}`}>
                      {currentDialogue.agentRole}
                    </span>
                    <h3 className="font-extrabold text-slate-900 dark:text-white text-base mt-0.5">
                      {currentDialogue.agentName}
                    </h3>
                  </div>
                </div>

                <span className="px-3 py-1 rounded-xl bg-purple-500/10 text-purple-700 dark:text-purple-400 font-mono text-xs font-bold border border-purple-500/20">
                  {currentDialogue.impactMetric}
                </span>
              </div>

              {/* Speech Bubble */}
              <div className="relative p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md">
                <p className="text-sm sm:text-base font-medium text-slate-800 dark:text-slate-100 italic leading-relaxed">
                  {currentDialogue.bubbleText}
                </p>
                <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 font-mono flex items-center gap-2">
                  <Activity className="w-3.5 h-3.5 text-purple-500" />
                  <span>{currentDialogue.techDetails}</span>
                </div>
              </div>

            </div>

            {/* Interactive Step Navigator Buttons */}
            <div className="flex items-center justify-between pt-2">
              <button
                disabled={activeStep <= 1}
                onClick={() => setActiveStep(prev => Math.max(1, prev - 1))}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs transition-colors cursor-pointer disabled:opacity-40"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous Step</span>
              </button>

              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                Step {activeStep} of {DIALOGUE_STEPS.length}
              </span>

              <button
                disabled={activeStep >= DIALOGUE_STEPS.length}
                onClick={() => setActiveStep(prev => Math.min(DIALOGUE_STEPS.length, prev + 1))}
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md shadow-purple-500/20 transition-all cursor-pointer disabled:opacity-40"
              >
                <span>Next Step</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>

        {/* Right Column: Head-to-Head Performance Scorecard (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6 transition-colors">
            
            <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
              <span className="text-xs font-bold text-purple-700 dark:text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-purple-500" />
                <span>Simulation Outcome Scorecard</span>
              </span>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mt-1">
                FixCycle vs. Fixed Central Depot
              </h3>
            </div>

            {/* Metrics Comparison Bars */}
            <div className="space-y-4 text-xs">
              
              {/* Turnaround Time */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex justify-between font-semibold">
                  <span className="text-slate-700 dark:text-slate-300">Customer Turnaround Delay</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-mono font-bold">85% Faster</span>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">FixCycle: 48 Hours</span>
                    <span className="text-slate-500 font-mono">2 Days</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full w-[15%]" />
                  </div>
                </div>
                <div className="space-y-1 pt-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-rose-600 dark:text-rose-400 font-bold">Fixed Depot: 336 Hours</span>
                    <span className="text-slate-500 font-mono">14 Days</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                    <div className="h-full bg-rose-500 rounded-full w-[100%]" />
                  </div>
                </div>
              </div>

              {/* Retained Economic Value */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex justify-between font-semibold">
                  <span className="text-slate-700 dark:text-slate-300">Retained Device Economic Value</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-mono font-bold">+62% Higher</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-center pt-1">
                  <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-emerald-500/30">
                    <span className="text-[10px] text-slate-400 block">FixCycle</span>
                    <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">₹32,000</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-rose-500/30">
                    <span className="text-[10px] text-slate-400 block">Fixed Baseline</span>
                    <span className="text-base font-extrabold text-rose-600 dark:text-rose-400 font-mono">₹11,500</span>
                  </div>
                </div>
              </div>

              {/* Landfill Prevention */}
              <div className="p-4 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-teal-500/20 text-teal-700 dark:text-teal-300 text-xl shrink-0">
                  ♻️
                </div>
                <div>
                  <span className="font-bold text-teal-800 dark:text-teal-200 block text-xs">
                    100% Circular Closed Loop
                  </span>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                    Zero items dumped into landfills. Unfixable chips are harvested for spare silicon or hydrometallurgically recycled.
                  </p>
                </div>
              </div>

            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
