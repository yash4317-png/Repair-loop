import React, { useState } from 'react';
import { 
  Wrench, 
  Box, 
  Inbox, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  Plus, 
  Search, 
  Layers, 
  IndianRupee, 
  AlertTriangle,
  Eye,
  Store,
  Sparkles,
  UserCheck,
  ArrowLeft,
  X,
  MapPin,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DeviceInspection, InventoryPart } from '../types';
import { ShopDecisionModal } from './ShopDecisionModal.modified';
import { formatRupees } from '../utils/formatters';

export const ShopkeeperPortal: React.FC = () => {
  const { 
    currentUser, 
    shops, 
    inventory, 
    inspections, 
    offers, 
    technicians,
    assignTechnicianToInspection,
    addInventoryPart, 
    updateInventoryStock, 
    switchUserById,
    setActiveTab
  } = useApp();

  const activeShopId = currentUser?.shopId || 'shop_apex';
  const activeShop = shops.find(s => s.id === activeShopId) || shops[0];

  const [activeSubTab, setActiveSubTab] = useState<'requests' | 'inventory' | 'benches'>('requests');
  const [selectedInspectionForModal, setSelectedInspectionForModal] = useState<DeviceInspection | null>(null);
  const [reassignModalJob, setReassignModalJob] = useState<{ inspectionId: string; currentTechId: string } | null>(null);
  
  // Inventory filters & new part modal
  const [inventorySearch, setInventorySearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isAddPartOpen, setIsAddPartOpen] = useState(false);
  
  const [newPartName, setNewPartName] = useState('');
  const [newPartSku, setNewPartSku] = useState('');
  const [newPartCategory, setNewPartCategory] = useState<'display' | 'battery' | 'housing' | 'board' | 'peripherals'>('display');
  const [newPartModel, setNewPartModel] = useState('');
  const [newPartQty, setNewPartQty] = useState(5);
  const [newPartCost, setNewPartCost] = useState(45);
  const [newPartPrice, setNewPartPrice] = useState(95);

  const shopInventory = inventory.filter(p => p.shopId === activeShopId);
  const filteredInventory = shopInventory.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(inventorySearch.toLowerCase()) || 
                          p.sku.toLowerCase().includes(inventorySearch.toLowerCase()) ||
                          p.compatibleModels.some(m => m.toLowerCase().includes(inventorySearch.toLowerCase()));
    const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const shopOffers = offers.filter(o => o.shopId === activeShopId);
  const activeOrders = shopOffers.filter(o => o.status === 'accepted');

  const shopTechnicians = technicians.filter(t => t.shopId === activeShopId);

  const handleCreatePart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPartName || !newPartSku) return;

    addInventoryPart({
      shopId: activeShopId,
      sku: newPartSku,
      name: newPartName,
      category: newPartCategory,
      compatibleModels: [newPartModel || 'Universal'],
      quantityInStock: newPartQty,
      minThreshold: 2,
      unitCost: newPartCost,
      retailPrice: newPartPrice,
      condition: 'OEM_New'
    });

    setIsAddPartOpen(false);
    setNewPartName('');
    setNewPartSku('');
    setNewPartModel('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      
      {/* Top Shop Banner & Shop Switcher */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 mb-8 shadow-xl transition-colors">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-4">
            <img 
              src={activeShop.avatarUrl} 
              alt={activeShop.name} 
              className="w-14 h-14 rounded-2xl object-cover ring-2 ring-amber-500/40" 
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">{activeShop.name}</h1>
                <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
                  Authorized MUJ Center
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{activeShop.location} • ★ {activeShop.rating} Rating</p>
            </div>
          </div>

          {/* Quick Switch Shop Button Strip */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-slate-500 dark:text-slate-400 mr-1 hidden sm:inline">Active Center:</span>
            {shops.map(s => (
              <button
                key={s.id}
                onClick={() => {
                  const targetUser = s.id === 'shop_apex' ? 'user_shop_1' : s.id === 'shop_ecorefurb' ? 'user_shop_2' : 'user_shop_3';
                  switchUserById(targetUser);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  s.id === activeShopId
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {s.name.split('-')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Live Shop Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
            <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1">Assigned Technicians</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">{shopTechnicians.length}</span>
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-mono font-bold">Active</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
            <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1">Spare Parts In Stock</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-amber-600 dark:text-amber-400 font-mono">{shopInventory.reduce((acc, p) => acc + p.quantityInStock, 0)}</span>
              <span className="text-xs text-slate-500 font-mono">({shopInventory.length} SKUs)</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
            <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1">Hourly Labor Rate</span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">{formatRupees(activeShop.laborRatePerHour)}</span>
              <span className="text-xs text-slate-500">/hr</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
            <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1">Active Bench Jobs</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-teal-600 dark:text-teal-400 font-mono">{activeOrders.length || 1}</span>
              <span className="text-xs text-slate-500">In Progress</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sub Tabs: Requests / Inventory / Technicians */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 mb-6 gap-6">
        <button
          onClick={() => setActiveSubTab('requests')}
          className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
            activeSubTab === 'requests'
              ? 'border-amber-500 text-amber-600 dark:text-amber-400'
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <Inbox className="w-4 h-4" />
          <span>Incoming Device Inspection Pool</span>
          <span className="px-1.5 py-0.2 bg-amber-500/20 text-amber-700 dark:text-amber-300 text-xs rounded-full font-mono font-bold">
            {inspections.length}
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('inventory')}
          className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
            activeSubTab === 'inventory'
              ? 'border-amber-500 text-amber-600 dark:text-amber-400'
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <Box className="w-4 h-4" />
          <span>Spare Parts Inventory</span>
          <span className="px-1.5 py-0.2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs rounded-full font-mono">
            {shopInventory.length}
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('benches')}
          className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
            activeSubTab === 'benches'
              ? 'border-amber-500 text-amber-600 dark:text-amber-400'
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <Wrench className="w-4 h-4" />
          <span>Workshop Benches & Technicians</span>
          <span className="px-1.5 py-0.2 bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs rounded-full font-mono font-bold">
            {shopTechnicians.length}
          </span>
        </button>
      </div>

      {/* SubTab 1: Incoming Device Inspection Pool */}
      {activeSubTab === 'requests' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Customer Inspections Awaiting Quotation & Disposition
            </h2>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              Live broadcast across all 5 MUJ authorized shops
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {inspections.map(insp => {
              const myOffer = offers.find(o => o.inspectionId === insp.id && o.shopId === activeShopId);
              const isAccepted = insp.status === 'accepted';
              const isAcceptedByMe = isAccepted && myOffer?.id === insp.acceptedOfferId;

              return (
                <div 
                  key={insp.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-500/50 rounded-3xl p-5 shadow-lg flex flex-col justify-between transition-all"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div>
                        <span className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500 block">
                          {insp.trackingNumber}
                        </span>
                        <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                          {insp.brand} {insp.model}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{insp.specs.storage || ''} • {insp.specs.color || ''}</p>
                      </div>

                      {isAcceptedByMe ? (
                        <span className="px-2.5 py-1 rounded-xl text-[10px] font-bold font-mono bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                          Won Order
                        </span>
                      ) : myOffer ? (
                        <span className="px-2.5 py-1 rounded-xl text-[10px] font-bold font-mono bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                          Bid Placed
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-xl text-[10px] font-bold font-mono bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-500/30">
                          Pending Review
                        </span>
                      )}
                    </div>

                    {/* Photos Preview */}
                    <div className="relative rounded-2xl overflow-hidden aspect-video bg-slate-100 dark:bg-slate-950 mb-3 border border-slate-200 dark:border-slate-800">
                      <img 
                        src={insp.photos[0]?.url} 
                        alt={insp.model} 
                        className="w-full h-full object-cover" 
                      />
                      <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-lg bg-slate-900/80 backdrop-blur-sm text-[10px] text-white">
                        {insp.photos.length} Photos Provided
                      </span>
                    </div>

                    {/* Condition & AI Worth Metrics */}
                    <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                      <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                        <span className="text-[10px] text-slate-400 block">AI As-Is Worth</span>
                        <span className="font-extrabold text-emerald-600 dark:text-emerald-400 font-mono text-sm">{formatRupees(insp.aiValuation.estimatedWorth)}</span>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                        <span className="text-[10px] text-slate-400 block">Refurb Resale</span>
                        <span className="font-extrabold text-teal-600 dark:text-teal-400 font-mono text-sm">{formatRupees(insp.aiValuation.refurbishedResaleValue)}</span>
                      </div>
                    </div>

                    {/* Damages Tag Cloud */}
                    <div className="mb-4">
                      <span className="text-[10px] font-semibold text-slate-400 block mb-1">Reported Damages:</span>
                      <div className="flex flex-wrap gap-1">
                        {insp.damages.map(d => (
                          <span key={d.id} className="px-2 py-0.5 rounded-md text-[10px] bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                            {d.title.split(' ')[0]} {d.title.split(' ')[1] || ''}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions: Submit Offer / Revise Offer */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                    <button
                      onClick={() => setSelectedInspectionForModal(insp)}
                      className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-indigo-500/20 transition-all cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>{myOffer ? 'Revise Bid / Disposition' : 'Inspect & Submit Offer'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SubTab 2: Inventory Management */}
      {activeSubTab === 'inventory' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1 max-w-md">
              <div className="relative w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search parts by name, SKU or model..."
                  value={inventorySearch}
                  onChange={e => setInventorySearch(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-amber-500"
                />
              </div>

              <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                <option value="all">All Categories</option>
                <option value="display">Screens / OLED</option>
                <option value="battery">Batteries</option>
                <option value="housing">Chassis & Glass</option>
                <option value="board">Logic Boards</option>
                <option value="peripherals">Cameras & Ports</option>
              </select>
            </div>

            <button
              onClick={() => setIsAddPartOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 transition-all cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Spare Part</span>
            </button>
          </div>

          {/* Parts Table */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xl transition-colors">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-950/80 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 font-semibold">
                  <tr>
                    <th className="py-3 px-4">Part Details / SKU</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Compatible Models</th>
                    <th className="py-3 px-4">Cost vs Retail</th>
                    <th className="py-3 px-4 text-center">In Stock</th>
                    <th className="py-3 px-4 text-right">Quick Stock Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredInventory.map(part => (
                    <tr key={part.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4">
                        <span className="font-bold text-slate-900 dark:text-white block">{part.name}</span>
                        <span className="font-mono text-[10px] text-slate-400">{part.sku}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="capitalize px-2 py-0.5 rounded text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                          {part.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-300 font-medium">
                        {part.compatibleModels.slice(0, 2).join(', ')}
                        {part.compatibleModels.length > 2 && ' +more'}
                      </td>
                      <td className="py-3 px-4 font-mono">
                        <span className="text-rose-500 dark:text-rose-400">{formatRupees(part.unitCost)} cost</span>
                        <span className="text-slate-400 mx-1">/</span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">{formatRupees(part.retailPrice)}</span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`px-2.5 py-1 rounded-lg font-mono font-bold text-xs ${
                          part.quantityInStock <= part.minThreshold 
                            ? 'bg-rose-500/20 text-rose-600 dark:text-rose-300 border border-rose-500/30' 
                            : 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                        }`}>
                          {part.quantityInStock}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right space-x-1.5">
                        <button
                          onClick={() => updateInventoryStock(part.id, -1)}
                          disabled={part.quantityInStock <= 0}
                          className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs cursor-pointer disabled:opacity-40"
                          title="Consume 1 Part"
                        >
                          -1
                        </button>
                        <button
                          onClick={() => updateInventoryStock(part.id, 1)}
                          className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs cursor-pointer"
                          title="Restock +1 Part"
                        >
                          +1
                        </button>
                        <button
                          onClick={() => updateInventoryStock(part.id, 5)}
                          className="px-2 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-700 dark:text-amber-300 font-bold text-xs border border-amber-500/30 cursor-pointer"
                          title="Restock Batch +5"
                        >
                          +5
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SubTab 3: Workshop Benches & Technician Staffing */}
      {activeSubTab === 'benches' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Certified Technicians Roster & Live Bench Load
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Assign and monitor technician workbench queues for {activeShop.name}.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-xl border border-emerald-500/20">
              {shopTechnicians.length} Technicians On Duty
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {shopTechnicians.map(tech => {
              const assignedInspection = inspections.find(i => i.assignedTechnicianId === tech.id);
              
              return (
                <div 
                  key={tech.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col justify-between transition-colors"
                >
                  <div>
                    <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                      <img 
                        src={tech.avatar} 
                        alt={tech.name} 
                        className="w-12 h-12 rounded-2xl object-cover ring-2 ring-emerald-500/30"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-slate-900 dark:text-white text-sm">{tech.name}</h3>
                          <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                            ★ {tech.rating}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">{tech.role} • {tech.experienceYears} yrs exp</p>
                      </div>
                    </div>

                    {/* Bench Status Badge */}
                    <div className="py-3 flex items-center justify-between text-xs">
                      <span className="text-slate-500 dark:text-slate-400">Current Bench Status:</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase font-mono ${
                        assignedInspection || tech.activeBenchJob
                          ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30'
                          : 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                      }`}>
                        {assignedInspection || tech.activeBenchJob ? 'Busy (On Bench)' : 'Available'}
                      </span>
                    </div>

                    {/* Active Assignment Info */}
                    {assignedInspection ? (
                      <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-emerald-500/30 mb-3 space-y-1">
                        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">
                          Assigned Job On Bench
                        </span>
                        <p className="text-xs font-bold text-slate-900 dark:text-white">
                          {assignedInspection.brand} {assignedInspection.model}
                        </p>
                        <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                          Tracking: {assignedInspection.trackingNumber}
                        </p>
                      </div>
                    ) : tech.activeBenchJob ? (
                      <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-amber-500/30 mb-3 space-y-1">
                        <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider block">
                          In Progress: {tech.activeBenchJob.task}
                        </span>
                        <p className="text-xs font-bold text-slate-900 dark:text-white">
                          {tech.activeBenchJob.deviceModel}
                        </p>
                      </div>
                    ) : (
                      <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-dashed border-slate-200 dark:border-slate-800 mb-3 text-center text-xs text-slate-400">
                        Bench open for incoming repairs
                      </div>
                    )}

                    {/* Certifications */}
                    <div className="mb-4">
                      <span className="text-[10px] text-slate-400 block mb-1">Certifications:</span>
                      <div className="flex flex-wrap gap-1">
                        {tech.certifications.map((s: string) => (
                          <span key={s} className="px-2 py-0.5 rounded text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Reassign action */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-slate-500 font-mono">
                      Completed: <strong className="text-slate-900 dark:text-white">{Math.round(tech.experienceYears * 42 + 15)}</strong> jobs
                    </span>
                    <button
                      onClick={() => {
                        const firstAccepted = inspections.find(i => i.status === 'accepted' || i.status === 'pending_review');
                        if (firstAccepted) {
                          assignTechnicianToInspection(firstAccepted.id, tech.id, 'Priority bench restoration');
                        }
                      }}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-amber-500/20 text-slate-700 dark:text-slate-300 hover:text-amber-700 dark:hover:text-amber-300 text-xs font-semibold border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                    >
                      Assign Job
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Decision / Quotation Modal */}
      {selectedInspectionForModal && (
        <ShopDecisionModal 
          inspection={selectedInspectionForModal}
          onClose={() => setSelectedInspectionForModal(null)}
        />
      )}

      {/* Add New Part Modal */}
      {isAddPartOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Add New Inventory Spare Part</h3>
              <button onClick={() => setIsAddPartOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePart} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">Part Name</label>
                <input
                  type="text"
                  required
                  value={newPartName}
                  onChange={e => setNewPartName(e.target.value)}
                  placeholder="e.g. iPhone 15 Pro OLED Display"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">SKU</label>
                  <input
                    type="text"
                    required
                    value={newPartSku}
                    onChange={e => setNewPartSku(e.target.value)}
                    placeholder="e.g. DISP-IP15P-OEM"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 font-mono text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">Category</label>
                  <select
                    value={newPartCategory}
                    onChange={e => setNewPartCategory(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 cursor-pointer"
                  >
                    <option value="display">Display</option>
                    <option value="battery">Battery</option>
                    <option value="housing">Housing</option>
                    <option value="board">Logic Board</option>
                    <option value="peripherals">Peripherals</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">Compatible Model</label>
                <input
                  type="text"
                  value={newPartModel}
                  onChange={e => setNewPartModel(e.target.value)}
                  placeholder="e.g. iPhone 15 Pro"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">Initial Qty</label>
                  <input
                    type="number"
                    min="1"
                    value={newPartQty}
                    onChange={e => setNewPartQty(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 font-mono text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">Unit Cost ($)</label>
                  <input
                    type="number"
                    min="1"
                    value={newPartCost}
                    onChange={e => setNewPartCost(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 font-mono text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">Retail ($)</label>
                  <input
                    type="number"
                    min="1"
                    value={newPartPrice}
                    onChange={e => setNewPartPrice(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 font-mono text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddPartOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-500/20 cursor-pointer"
                >
                  Add Part
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
