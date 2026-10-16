import React from 'react';
import { useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { AuthScreen } from './components/AuthScreen';
import { DeviceInspector } from './components/DeviceInspector';
import { ShopkeeperPortal } from './components/ShopkeeperPortal';
import { CustomerHome } from './components/CustomerHome';
import { CustomerPortal } from './components/CustomerPortal';
import { MujMapPortal } from './components/MujMapPortal';
import { QuickSellRecycle } from './components/QuickSellRecycle';
import { MultiAgentSimulation } from './components/MultiAgentSimulation';

export const App: React.FC = () => {
  const { currentUser, isAuthenticated, activeTab } = useApp();

  if (!isAuthenticated || !currentUser) {
    return <AuthScreen />;
  }

  const isCustomer = currentUser.role === 'customer';
  const isShopkeeper = currentUser.role === 'shopkeeper';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200 relative overflow-x-hidden">
      
      {/* Decorative background shapes */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-violet-500/5 dark:bg-violet-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <Navbar />
      
      <main className="flex-1 pb-16 z-10">
        {/* Shared views accessible to all authenticated users */}
        {activeTab === 'muj_map' && <MujMapPortal />}
        {activeTab === 'multi_agent_sim' && <MultiAgentSimulation />}

        {/* Customer-exclusive views */}
        {isCustomer && (
          <>
            {activeTab === 'customer_home' && <CustomerHome />}
            {activeTab === 'customer_portal' && <CustomerPortal />}
            {activeTab === 'device_inspector' && <DeviceInspector />}
            {activeTab === 'quick_sell' && <QuickSellRecycle />}
            {activeTab === 'shopkeeper_portal' && <CustomerHome />}
          </>
        )}

        {/* Shopkeeper-exclusive views */}
        {isShopkeeper && (
          <>
            {activeTab === 'shopkeeper_portal' && <ShopkeeperPortal />}
            {(activeTab === 'customer_home' || activeTab === 'customer_portal' || activeTab === 'device_inspector' || activeTab === 'quick_sell') && (
              <ShopkeeperPortal />
            )}
          </>
        )}
      </main>

      <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-white/60 dark:bg-slate-900/60 py-6 text-center text-xs text-slate-500 transition-colors z-10">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 FixCycle • Track 06 | PS 25/35 • Manipal University Jaipur Network</p>
          <p className="font-mono text-[11px] text-slate-400">Autonomous Multi-Agent Electronics Negotiation & Circular Disposition</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
