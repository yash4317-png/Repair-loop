import React, { useState } from 'react';
import { 
  RotateCcw, 
  Home,
  Wrench, 
  Smartphone, 
  Layers, 
  Activity, 
  MapPin, 
  ChevronDown, 
  LogOut, 
  RefreshCw,
  Zap,
  Sun,
  Moon
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Navbar: React.FC = () => {
  const { 
    currentUser, 
    users, 
    theme,
    toggleTheme,
    activeTab, 
    setActiveTab, 
    switchUserById, 
    logoutUser,
    resetDemoData,
    inspections
  } = useApp();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  if (!currentUser) return null;

  const isCustomer = currentUser.role === 'customer';
  const isShopkeeper = currentUser.role === 'shopkeeper';
  const pendingInspectionsCount = inspections.filter(i => i.status === 'pending_review' || i.status === 'quotes_received').length;

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setActiveTab(isCustomer ? 'customer_home' : 'shopkeeper_portal')}
              className="flex items-center gap-2.5 text-left group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-700 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-200">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L14.5 8H19.5L15.5 12L17 18L12 14.5L7 18L8.5 12L4.5 8H9.5L12 2Z" fill="white" fillOpacity="0.9" />
                  <path d="M19 12a7 7 0 01-7 7m-5-3a7 7 0 017-9" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                  <circle cx="12" cy="12" r="2.5" fill="white" fillOpacity="0.6" />
                </svg>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white">Fix<span className="text-indigo-500">Cycle</span></span>
                  <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 rounded-md">MUJ Jaipur</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">Circular Electronics Routing</p>
              </div>
            </button>
          </div>

          {/* Navigation Links STRICTLY GATED BY ROLE */}
          <nav className="hidden md:flex items-center gap-1">
            {isCustomer && (
              <>
                <button
                  onClick={() => setActiveTab('customer_home')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                    activeTab === 'customer_home'
                      ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30 font-semibold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <Home className="w-4 h-4 text-indigo-500" />
                  <span>Home</span>
                </button>

                <button
                  onClick={() => setActiveTab('device_inspector')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                    activeTab === 'device_inspector'
                      ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30 font-semibold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <Smartphone className="w-4 h-4 text-indigo-500" />
                  <span>Device Inspector</span>
                </button>

                <button
                  onClick={() => setActiveTab('customer_portal')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                    activeTab === 'customer_portal'
                      ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30 font-semibold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <Layers className="w-4 h-4 text-indigo-500" />
                  <span>My Returns & Judgments</span>
                  {pendingInspectionsCount > 0 && (
                    <span className="ml-1 px-1.5 py-0.2 bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 text-xs rounded-full border border-indigo-500/30 font-mono">
                      {pendingInspectionsCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setActiveTab('quick_sell')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                    activeTab === 'quick_sell'
                      ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 font-semibold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <Zap className="w-4 h-4 text-amber-500" />
                  <span>Quick Sell / Recycle</span>
                </button>

                <button
                  onClick={() => setActiveTab('muj_map')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                    activeTab === 'muj_map'
                      ? 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/30 font-semibold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <MapPin className="w-4 h-4 text-teal-500" />
                  <span>MUJ 10km Map</span>
                </button>

                <button
                  onClick={() => setActiveTab('multi_agent_sim')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                    activeTab === 'multi_agent_sim'
                      ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/30 font-semibold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <Activity className="w-4 h-4 text-purple-500" />
                  <span>Multi-Agent Sim</span>
                </button>
              </>
            )}

            {isShopkeeper && (
              <>
                <button
                  onClick={() => setActiveTab('shopkeeper_portal')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                    activeTab === 'shopkeeper_portal'
                      ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 font-semibold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <Wrench className="w-4 h-4 text-amber-500" />
                  <span>Workshop & Inventory</span>
                </button>

                <button
                  onClick={() => setActiveTab('muj_map')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                    activeTab === 'muj_map'
                      ? 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/30 font-semibold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <MapPin className="w-4 h-4 text-teal-500" />
                  <span>MUJ 10km Map</span>
                </button>

                <button
                  onClick={() => setActiveTab('multi_agent_sim')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                    activeTab === 'multi_agent_sim'
                      ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/30 font-semibold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <Activity className="w-4 h-4 text-purple-500" />
                  <span>Multi-Agent Sim (PS 25)</span>
                </button>
              </>
            )}
          </nav>

          {/* Right Controls: Theme Toggle, Persona Switcher & Log Out */}
          <div className="flex items-center gap-2.5">
            
            {/* Light / Dark Mode Toggle Button */}
            <button
              onClick={toggleTheme}
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-amber-500 dark:hover:text-amber-400 border border-slate-200 dark:border-slate-700/80 transition-colors cursor-pointer"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400 transition-transform rotate-0 hover:rotate-45" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700 transition-transform -rotate-12 hover:rotate-0" />
              )}
            </button>

            {/* Quick Switch Persona Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600 transition-all text-left cursor-pointer"
              >
                <img 
                  src={currentUser.avatar || 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="%2310b981"/></svg>'} 
                  alt={currentUser.name} 
                  className="w-7 h-7 rounded-full object-cover ring-2 ring-emerald-500/40"
                />
                <div className="hidden sm:block">
                  <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-tight flex items-center gap-1">
                    {currentUser.name.split(' ')[0]}
                    {isShopkeeper ? (
                      <span className="text-[10px] text-amber-700 dark:text-amber-400 font-mono bg-amber-500/10 px-1 rounded">Depot</span>
                    ) : (
                      <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-mono bg-emerald-500/10 px-1 rounded">Student</span>
                    )}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-1.5 border-b border-slate-100 dark:border-slate-800/80">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Switch Test Persona</p>
                  </div>

                  <div className="py-1">
                    {users.map(u => (
                      <button
                        key={u.id}
                        onClick={() => {
                          switchUserById(u.id);
                          setIsUserMenuOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors cursor-pointer ${
                          u.id === currentUser.id ? 'bg-slate-100 dark:bg-slate-800/90 text-slate-900 dark:text-white font-medium' : 'text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        <img src={u.avatar} alt={u.name} className="w-7 h-7 rounded-full object-cover" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs truncate">{u.name}</p>
                          <p className="text-[10px] text-slate-400 truncate capitalize">
                            {u.role === 'customer' ? 'Customer (MUJ Student)' : 'Service Center Lead'}
                          </p>
                        </div>
                        {u.id === currentUser.id && (
                          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        )}
                      </button>
                    ))}
                  </div>

                  <div className="border-t border-slate-100 dark:border-slate-800/80 px-2 pt-2 mt-1 flex items-center justify-between">
                    <button
                      onClick={() => {
                        logoutUser();
                        setIsUserMenuOpen(false);
                      }}
                      className="text-xs text-rose-500 dark:text-rose-400 hover:text-rose-600 font-medium px-2 py-1 rounded hover:bg-rose-500/10 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Log Out</span>
                    </button>
                    <button
                      onClick={() => {
                        resetDemoData();
                        setIsUserMenuOpen(false);
                      }}
                      className="text-[11px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center gap-1 px-2 py-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      <RefreshCw className="w-3 h-3" />
                      Reset Demo
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Direct Logout Button */}
            <button
              onClick={logoutUser}
              title="Log out and switch role"
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700/60 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>

          </div>

        </div>
      </div>
      
      {/* Mobile nav bar */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-200 dark:border-slate-800/80 py-2 bg-white/95 dark:bg-slate-900/95 text-xs">
        {isCustomer ? (
          <>
            <button
              onClick={() => setActiveTab('device_inspector')}
              className={`flex flex-col items-center gap-1 ${activeTab === 'device_inspector' ? 'text-indigo-500 font-medium' : 'text-slate-500'}`}
            >
              <Smartphone className="w-4 h-4" />
              <span>Inspector</span>
            </button>
            <button
              onClick={() => setActiveTab('customer_portal')}
              className={`flex flex-col items-center gap-1 ${activeTab === 'customer_portal' ? 'text-indigo-500 font-medium' : 'text-slate-500'}`}
            >
              <Layers className="w-4 h-4" />
              <span>Returns</span>
            </button>
            <button
              onClick={() => setActiveTab('quick_sell')}
              className={`flex flex-col items-center gap-1 ${activeTab === 'quick_sell' ? 'text-amber-500 font-medium' : 'text-slate-500'}`}
            >
              <Zap className="w-4 h-4" />
              <span>Quick Sell</span>
            </button>
            <button
              onClick={() => setActiveTab('muj_map')}
              className={`flex flex-col items-center gap-1 ${activeTab === 'muj_map' ? 'text-teal-500 font-medium' : 'text-slate-500'}`}
            >
              <MapPin className="w-4 h-4" />
              <span>Real Map</span>
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setActiveTab('shopkeeper_portal')}
              className={`flex flex-col items-center gap-1 ${activeTab === 'shopkeeper_portal' ? 'text-amber-500 font-medium' : 'text-slate-500'}`}
            >
              <Wrench className="w-4 h-4" />
              <span>Shop Depot</span>
            </button>
            <button
              onClick={() => setActiveTab('multi_agent_sim')}
              className={`flex flex-col items-center gap-1 ${activeTab === 'multi_agent_sim' ? 'text-purple-500 font-medium' : 'text-slate-500'}`}
            >
              <Activity className="w-4 h-4" />
              <span>Simulation</span>
            </button>
          </>
        )}
      </div>
    </header>
  );
};
