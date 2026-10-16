import React, { useState, useEffect, useRef } from 'react';
import { 
  MapPin, 
  Navigation, 
  ArrowLeft, 
  Compass, 
  CheckCircle2, 
  Clock, 
  Star, 
  Phone, 
  Wrench, 
  Sparkles,
  Layers,
  ChevronRight,
  Maximize2,
  RefreshCw,
  Radio,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AuthorizedShop } from '../types';
import { MUJ_GRAPH_NODES, calculateShortestPathFromMUJ, ShortestPathResult } from '../services/mujGraphService';
import L from 'leaflet';
import { formatRupees } from '../utils/formatters';

export const MujMapPortal: React.FC = () => {
  const { shops, setActiveTab, currentUser } = useApp();
  
  const [selectedShopId, setSelectedShopId] = useState<string>('shop_apex');
  const [activeRadiusKm, setActiveRadiusKm] = useState<number>(10);
  const [mapMode, setMapMode] = useState<'osm' | 'radar'>('osm');
  const [routeResult, setRouteResult] = useState<ShortestPathResult | null>(() => calculateShortestPathFromMUJ('node_apex'));

  const selectedShop = shops.find(s => s.id === selectedShopId) || shops[0];

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);
  const routePolylineRef = useRef<L.Polyline | null>(null);

  // Initialize and maintain REAL Leaflet OpenStreetMap safely
  useEffect(() => {
    if (mapMode !== 'osm') return;
    if (!mapContainerRef.current) return;

    // Clean up if container was somehow already initialized
    if ((mapContainerRef.current as any)._leaflet_id) {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      delete (mapContainerRef.current as any)._leaflet_id;
    }

    try {
      // Manipal University Jaipur Coordinates: [26.8439, 75.5652]
      const map = L.map(mapContainerRef.current, {
        center: [26.8439, 75.5652],
        zoom: 12,
        zoomControl: true,
        attributionControl: false
      });

      // Standard OSM Tile Layer
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19
      }).addTo(map);

      // Distance circles around MUJ
      L.circle([26.8439, 75.5652], {
        radius: 2000,
        color: '#10b981',
        weight: 1.5,
        dashArray: '6, 6',
        fillOpacity: 0.04
      }).addTo(map);

      L.circle([26.8439, 75.5652], {
        radius: 5000,
        color: '#f59e0b',
        weight: 1.5,
        dashArray: '6, 6',
        fillOpacity: 0.03
      }).addTo(map);

      L.circle([26.8439, 75.5652], {
        radius: 10000,
        color: '#8b5cf6',
        weight: 1.5,
        dashArray: '6, 6',
        fillOpacity: 0.02
      }).addTo(map);

      const markersGroup = L.layerGroup().addTo(map);
      markersRef.current = markersGroup;
      mapInstanceRef.current = map;

      // Invalidate size after container settles
      const timer = setTimeout(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      }, 250);

      return () => {
        clearTimeout(timer);
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        }
      };
    } catch (err) {
      console.warn("Leaflet map init warning:", err);
    }
  }, [mapMode]);

  // Update Leaflet markers and route polyline when selected shop or radius changes
  useEffect(() => {
    if (mapMode !== 'osm') return;
    const map = mapInstanceRef.current;
    const markersGroup = markersRef.current;
    if (!map || !markersGroup) return;

    markersGroup.clearLayers();

    // 1. Manipal University Jaipur Campus Marker
    const mujIcon = L.divIcon({
      className: 'muj-campus-pin',
      html: `<div style="background: linear-gradient(135deg, #10b981, #047857); color: white; padding: 5px 10px; border-radius: 9999px; font-weight: 800; font-size: 11px; border: 2.5px solid white; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.3); display: flex; align-items: center; gap: 4px; white-space: nowrap; cursor: pointer;">★ MUJ Campus Hub</div>`,
      iconSize: [140, 30],
      iconAnchor: [70, 15]
    });

    L.marker([26.8439, 75.5652], { icon: mujIcon })
      .addTo(markersGroup)
      .bindPopup('<b>Manipal University Jaipur</b><br>Central Return & Intake Hub (Jaipur-Ajmer Expressway)');

    // 2. Plot authorized service centers within active radius
    shops.forEach(s => {
      if (s.distanceKmFromMUJ <= activeRadiusKm) {
        const isSelected = s.id === selectedShopId;
        const color = isSelected ? '#f59e0b' : '#3b82f6';

        const shopIcon = L.divIcon({
          className: 'shop-pin',
          html: `<div style="background: ${color}; color: white; width: 32px; height: 32px; border-radius: 50%; font-weight: bold; font-size: 13px; border: 2.5px solid white; box-shadow: 0 8px 16px -2px rgba(0,0,0,0.35); display: flex; align-items: center; justify-content: center; transform: ${isSelected ? 'scale(1.25)' : 'scale(1)'}; transition: transform 0.2s; cursor: pointer;">🔧</div>`,
          iconSize: [32, 32],
          iconAnchor: [16, 16]
        });

        const m = L.marker([s.coordinates.lat, s.coordinates.lng], { icon: shopIcon })
          .addTo(markersGroup)
          .bindPopup(`<b>${s.name}</b><br>${s.distanceKmFromMUJ} km from MUJ<br>★ ${s.rating} Rating<br><b>${s.location}</b>`);

        m.on('click', () => {
          handleSelectShop(s);
        });
      }
    });

    // 3. Draw route polyline from MUJ to selected shop
    if (routePolylineRef.current) {
      map.removeLayer(routePolylineRef.current);
      routePolylineRef.current = null;
    }

    if (selectedShop) {
      const polyCoords: [number, number][] = [
        [26.8439, 75.5652], // MUJ Campus
        [26.8420, 75.5665], // Expressway exit
        [selectedShop.coordinates.lat, selectedShop.coordinates.lng] // Target shop
      ];

      const polyline = L.polyline(polyCoords, {
        color: '#10b981',
        weight: 4,
        opacity: 0.9,
        dashArray: '6, 8',
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(map);

      routePolylineRef.current = polyline;
      map.panTo([selectedShop.coordinates.lat, selectedShop.coordinates.lng], { animate: true });
    }
  }, [selectedShopId, activeRadiusKm, shops, mapMode]);

  const handleSelectShop = (shop: AuthorizedShop) => {
    setSelectedShopId(shop.id);
    const targetNode = MUJ_GRAPH_NODES.find(n => n.shopId === shop.id);
    if (targetNode) {
      setRouteResult(calculateShortestPathFromMUJ(targetNode.id));
    }
  };

  const filteredShops = shops.filter(s => s.distanceKmFromMUJ <= activeRadiusKm);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 relative">
      
      {/* Top Header with Back Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-8 border-b border-slate-200 dark:border-slate-800 gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setActiveTab(currentUser?.role === 'shopkeeper' ? 'shopkeeper_portal' : 'customer_home')}
            className="p-2.5 rounded-2xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all shadow-sm cursor-pointer"
            title="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                Manipal University Jaipur 10 km Radius
              </span>
              <span className="text-slate-500 dark:text-slate-400 text-xs">Lat 26.8439° N, Lng 75.5652° E</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Authorized Repair Center Network Map
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Real geographic routing across Dehmi Kalan, Bagru, Mahapura, and Bhankrota along the Jaipur-Ajmer Expressway NH-48.
            </p>
          </div>
        </div>

        {/* Radius Filter & Map Mode Pills */}
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          {/* Radius selector */}
          <div className="flex items-center gap-1 p-1 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            {[
              { label: '2 km', km: 2 },
              { label: '5 km', km: 5 },
              { label: '10 km', km: 10 }
            ].map(pill => (
              <button
                key={pill.km}
                onClick={() => setActiveRadiusKm(pill.km)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeRadiusKm === pill.km
                    ? 'bg-emerald-500 text-white font-bold shadow-md shadow-emerald-500/20'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {pill.label}
              </button>
            ))}
          </div>

          {/* Map view mode toggle: OSM Live Tiles vs High-Contrast Radar */}
          <div className="flex items-center gap-1 p-1 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <button
              onClick={() => setMapMode('osm')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                mapMode === 'osm'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Street Map</span>
            </button>
            <button
              onClick={() => setMapMode('radar')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                mapMode === 'radar'
                  ? 'bg-teal-500 text-white font-bold shadow-md shadow-teal-500/20'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              <span>Vector Radar</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Interactive Map Container (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-2xl relative overflow-hidden transition-colors">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 text-xs">
              <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-emerald-500" />
                <span>
                  {mapMode === 'osm' ? 'Live OpenStreetMap • Jaipur-Ajmer Expressway NH-48' : 'High-Resolution Vector Radar Schematic'}
                </span>
              </span>
              <span className="text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                {filteredShops.length} Authorized Centers in {activeRadiusKm} km
              </span>
            </div>

            {/* Map View 1: Real Leaflet OpenStreetMap */}
            {mapMode === 'osm' && (
              <div className="relative mt-3 rounded-2xl overflow-hidden h-[440px] border border-slate-200 dark:border-slate-800 shadow-inner bg-slate-100 dark:bg-slate-950">
                <div ref={mapContainerRef} className="w-full h-full" />
              </div>
            )}

            {/* Map View 2: High-Resolution Interactive Vector Radar Map (Always 100% reliable) */}
            {mapMode === 'radar' && (
              <div className="relative mt-3 rounded-2xl overflow-hidden h-[440px] border border-slate-200 dark:border-slate-800 shadow-inner bg-slate-950 p-4 flex flex-col justify-between">
                
                {/* SVG Radar Graphic */}
                <svg className="w-full h-full" viewBox="0 0 600 400">
                  <defs>
                    <radialGradient id="radarPulse" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                      <stop offset="60%" stopColor="#059669" stopOpacity="0.08" />
                      <stop offset="100%" stopColor="#047857" stopOpacity="0" />
                    </radialGradient>
                  </defs>

                  {/* Distance concentric radar rings */}
                  <circle cx="300" cy="200" r="180" fill="none" stroke="#64748b" strokeWidth="1" strokeDasharray="4 4" opacity="0.4" />
                  <text x="305" y="30" fill="#94a3b8" fontSize="10" fontFamily="monospace">10 km boundary</text>

                  <circle cx="300" cy="200" r="110" fill="none" stroke="#f59e0b" strokeWidth="1" strokeDasharray="4 4" opacity="0.5" />
                  <text x="305" y="100" fill="#f59e0b" fontSize="10" fontFamily="monospace">5 km radius</text>

                  <circle cx="300" cy="200" r="55" fill="url(#radarPulse)" stroke="#10b981" strokeWidth="1.5" strokeDasharray="3 3" />
                  <text x="305" y="155" fill="#10b981" fontSize="10" fontFamily="monospace">2 km campus zone</text>

                  {/* Jaipur-Ajmer Expressway NH-48 Spine */}
                  <line x1="80" y1="360" x2="520" y2="40" stroke="#475569" strokeWidth="6" strokeLinecap="round" />
                  <line x1="80" y1="360" x2="520" y2="40" stroke="#f59e0b" strokeWidth="2" strokeDasharray="8 6" strokeLinecap="round" />
                  <text x="440" y="55" fill="#e2e8f0" fontSize="10" fontWeight="bold">Jaipur-Ajmer Expressway (NH-48)</text>

                  {/* Road connection to Bagru */}
                  <line x1="300" y1="200" x2="140" y2="280" stroke="#10b981" strokeWidth="2.5" strokeDasharray="5 5" opacity="0.8" />
                  {/* Road connection to Mahapura */}
                  <line x1="300" y1="200" x2="420" y2="130" stroke="#10b981" strokeWidth="2.5" strokeDasharray="5 5" opacity="0.8" />
                  {/* Road connection to Bhankrota */}
                  <line x1="300" y1="200" x2="490" y2="80" stroke="#10b981" strokeWidth="2.5" strokeDasharray="5 5" opacity="0.8" />

                  {/* Center Node: MUJ Campus */}
                  <g transform="translate(300, 200)">
                    <circle r="14" fill="#10b981" stroke="#ffffff" strokeWidth="3" />
                    <text x="0" y="4" fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="middle">★</text>
                    <rect x="-65" y="20" width="130" height="20" rx="10" fill="#064e3b" stroke="#10b981" strokeWidth="1" />
                    <text x="0" y="34" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">MUJ Campus Hub</text>
                  </g>

                  {/* Shop 1: Apex Electronics (Inside Campus / Dehmi Kalan 1.8km) */}
                  <g 
                    transform="translate(260, 160)" 
                    className="cursor-pointer"
                    onClick={() => handleSelectShop(shops.find(s => s.id === 'shop_apex') || shops[0])}
                  >
                    <circle r={selectedShopId === 'shop_apex' ? 14 : 10} fill="#f59e0b" stroke="#ffffff" strokeWidth="2" />
                    <text x="18" y="4" fill="#f59e0b" fontSize="11" fontWeight="bold">Apex MUJ (1.8 km)</text>
                  </g>

                  {/* Shop 2: EcoRefurb Bagru (4.6 km) */}
                  <g 
                    transform="translate(140, 280)" 
                    className="cursor-pointer"
                    onClick={() => handleSelectShop(shops.find(s => s.id === 'shop_ecorefurb') || shops[1])}
                  >
                    <circle r={selectedShopId === 'shop_ecorefurb' ? 14 : 10} fill={selectedShopId === 'shop_ecorefurb' ? '#f59e0b' : '#3b82f6'} stroke="#ffffff" strokeWidth="2" />
                    <text x="-120" y="4" fill="#60a5fa" fontSize="11" fontWeight="bold">EcoRefurb Bagru (4.6 km)</text>
                  </g>

                  {/* Shop 3: Silicon Salvage Bagru Ind. (7.2 km) */}
                  <g 
                    transform="translate(100, 330)" 
                    className="cursor-pointer"
                    onClick={() => handleSelectShop(shops.find(s => s.id === 'shop_silicon') || shops[2])}
                  >
                    <circle r={selectedShopId === 'shop_silicon' ? 14 : 10} fill={selectedShopId === 'shop_silicon' ? '#f59e0b' : '#a855f7'} stroke="#ffffff" strokeWidth="2" />
                    <text x="18" y="4" fill="#c084fc" fontSize="11" fontWeight="bold">Silicon Salvage (7.2 km)</text>
                  </g>

                  {/* Shop 4: GreenMatrix Mahapura (6.1 km) */}
                  <g 
                    transform="translate(420, 130)" 
                    className="cursor-pointer"
                    onClick={() => handleSelectShop(shops.find(s => s.id === 'shop_greenmatrix') || shops[3])}
                  >
                    <circle r={selectedShopId === 'shop_greenmatrix' ? 14 : 10} fill={selectedShopId === 'shop_greenmatrix' ? '#f59e0b' : '#3b82f6'} stroke="#ffffff" strokeWidth="2" />
                    <text x="18" y="4" fill="#60a5fa" fontSize="11" fontWeight="bold">GreenMatrix Mahapura (6.1 km)</text>
                  </g>

                  {/* Shop 5: Jaipur West Bhankrota (9.4 km) */}
                  <g 
                    transform="translate(490, 80)" 
                    className="cursor-pointer"
                    onClick={() => handleSelectShop(shops.find(s => s.id === 'shop_jaipurwest') || shops[4])}
                  >
                    <circle r={selectedShopId === 'shop_jaipurwest' ? 14 : 10} fill={selectedShopId === 'shop_jaipurwest' ? '#f59e0b' : '#3b82f6'} stroke="#ffffff" strokeWidth="2" />
                    <text x="-155" y="4" fill="#60a5fa" fontSize="11" fontWeight="bold">Jaipur West Bhankrota (9.4 km)</text>
                  </g>
                </svg>

                <div className="flex items-center justify-between text-[11px] text-slate-400 px-2">
                  <span>Click any pin to recalculate shortest routing</span>
                  <span className="font-mono text-emerald-400">Green = Active Selected Route</span>
                </div>
              </div>
            )}

            {/* Live Shortest Route Drawer */}
            {routeResult && (
              <div className="mt-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-emerald-500/30 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Navigation className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Dijkstra Shortest Route from MUJ Campus to {selectedShop.name.split('-')[0]}</span>
                  </span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                    {routeResult.totalDistanceKm} km • ~{routeResult.estDrivingMinutes} mins
                  </span>
                </div>

                <div className="space-y-1 pt-1">
                  {routeResult.turns.map((step, idx) => (
                    <div key={idx} className="text-[11px] text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[9px] font-mono flex items-center justify-center font-bold">
                        {idx + 1}
                      </span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Right: Selected Shop Profile & Technician Staffing (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5 transition-colors">
            
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-mono font-bold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
                  {selectedShop.distanceKmFromMUJ} km from MUJ
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1.5">{selectedShop.name}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                  <span>{selectedShop.location}</span>
                </p>
              </div>

              <div className="text-right">
                <div className="flex items-center gap-1 text-amber-500 font-bold text-sm">
                  <Star className="w-4 h-4 fill-amber-500" />
                  <span>{selectedShop.rating}</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">Verified Center</span>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-2.5 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400 block text-[10px] mb-0.5">Travel Time from MUJ</span>
                <span className="font-extrabold text-emerald-600 dark:text-emerald-400 font-mono text-sm">{selectedShop.travelTimeMin} Minutes</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400 block text-[10px] mb-0.5">Labor Hourly Rate</span>
                <span className="font-extrabold text-teal-600 dark:text-teal-400 font-mono text-sm">{formatRupees(selectedShop.laborRatePerHour)}/hr</span>
              </div>
            </div>

            {/* Specializations */}
            <div>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-2">Shop Capabilities & Specializations:</span>
              <div className="flex flex-wrap gap-1.5">
                {selectedShop.specialties.map((spec: string) => (
                  <span 
                    key={spec}
                    className="px-2.5 py-1 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            </div>

            {/* Contact details */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Direct Contact:</span>
                <span className="font-mono text-slate-900 dark:text-white font-bold">+91 98290 {10000 + selectedShop.distanceKmFromMUJ * 400}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Working Hours:</span>
                <span className="text-slate-900 dark:text-white">9:00 AM – 8:00 PM (Daily)</span>
              </div>
            </div>

            {/* All Centers Quick Switch List */}
            <div>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-2">
                All 5 MUJ Network Authorized Centers:
              </span>
              <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                {shops.map(s => {
                  const isCur = s.id === selectedShopId;
                  return (
                    <button
                      key={s.id}
                      onClick={() => handleSelectShop(s)}
                      className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between text-xs transition-all cursor-pointer ${
                        isCur
                          ? 'border-amber-500 bg-amber-500/10 font-bold shadow-sm'
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${isCur ? 'bg-amber-500' : 'bg-slate-400'}`} />
                        <span className="text-slate-900 dark:text-white truncate max-w-[180px]">{s.name}</span>
                      </div>
                      <span className="font-mono text-slate-500 dark:text-slate-400 text-[11px]">{s.distanceKmFromMUJ} km</span>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
