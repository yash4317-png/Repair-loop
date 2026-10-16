import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  AuthorizedShop, 
  DeviceInspection, 
  InventoryPart, 
  ShopOffer, 
  User,
  Technician,
  QuickDispositionRequest
} from '../types';
import { 
  AUTHORIZED_SHOPS, 
  INITIAL_INSPECTIONS, 
  INITIAL_INVENTORY, 
  INITIAL_OFFERS, 
  INITIAL_USERS,
  INITIAL_TECHNICIANS,
  INITIAL_QUICK_REQUESTS
} from '../mock/initialData';
import { api, getToken, setToken } from '../api/client';

export type ActiveNavTab = 
  | 'customer_home'
  | 'customer_portal' 
  | 'device_inspector' 
  | 'quick_sell' 
  | 'muj_map'
  | 'shopkeeper_portal' 
  | 'multi_agent_sim';

interface AppContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  theme: 'dark' | 'light';
  users: User[];
  shops: AuthorizedShop[];
  inventory: InventoryPart[];
  inspections: DeviceInspection[];
  offers: ShopOffer[];
  technicians: Technician[];
  quickRequests: QuickDispositionRequest[];
  activeTab: ActiveNavTab;
  selectedInspectionId: string | null;
  backendOnline: boolean;
  apiError: string | null;
  authBusy: boolean;
  
  setActiveTab: (tab: ActiveNavTab) => void;
  setSelectedInspectionId: (id: string | null) => void;
  setCurrentUser: (user: User | null) => void;
  toggleTheme: () => void;
  loginUser: (user: User) => Promise<void>;
  loginWithPassword: (email: string, password: string) => Promise<void>;
  registerAccount: (data: { name: string; email: string; password: string; role: string }) => Promise<void>;
  logoutUser: () => void;
  switchUserById: (userId: string) => Promise<void>;
  
  submitNewInspection: (data: Omit<DeviceInspection, 'id' | 'trackingNumber' | 'submittedAt' | 'status'>) => Promise<DeviceInspection>;
  submitShopOffer: (offerData: Omit<ShopOffer, 'id' | 'createdAt' | 'status'>) => Promise<ShopOffer>;
  acceptOffer: (inspectionId: string, offerId: string) => Promise<void>;
  submitQuickRequest: (data: Omit<QuickDispositionRequest, 'id' | 'createdAt' | 'status' | 'trackingCode'>) => Promise<QuickDispositionRequest>;
  assignTechnicianToInspection: (inspectionId: string, technicianId: string, taskDescription?: string) => Promise<void>;
  addInventoryPart: (part: Omit<InventoryPart, 'id' | 'lastRestocked'>) => Promise<void>;
  updateInventoryStock: (partId: string, quantityChange: number) => Promise<void>;
  resetDemoData: () => Promise<void>;
  
  getOffersForInspection: (inspectionId: string) => ShopOffer[];
  getShopById: (shopId: string) => AuthorizedShop | undefined;
  getInspectionById: (inspectionId: string) => DeviceInspection | undefined;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface BootstrapPayload {
  users: User[];
  shops: AuthorizedShop[];
  inventory: InventoryPart[];
  inspections: DeviceInspection[];
  offers: ShopOffer[];
  technicians: Technician[];
  quickRequests: QuickDispositionRequest[];
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [shops, setShops] = useState<AuthorizedShop[]>(AUTHORIZED_SHOPS);
  const [inventory, setInventory] = useState<InventoryPart[]>(INITIAL_INVENTORY);
  const [inspections, setInspections] = useState<DeviceInspection[]>(INITIAL_INSPECTIONS);
  const [offers, setOffers] = useState<ShopOffer[]>(INITIAL_OFFERS);
  const [technicians, setTechnicians] = useState<Technician[]>(INITIAL_TECHNICIANS);
  const [quickRequests, setQuickRequests] = useState<QuickDispositionRequest[]>(INITIAL_QUICK_REQUESTS);
  const [activeTab, setActiveTab] = useState<ActiveNavTab>('customer_home');
  const [selectedInspectionId, setSelectedInspectionId] = useState<string | null>(null);
  const [backendOnline, setBackendOnline] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [authBusy, setAuthBusy] = useState(true);
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('repairloop_theme_v3');
    return saved === 'light' ? 'light' : 'dark';
  });

  const applyBootstrap = (data: BootstrapPayload) => {
    setUsers(data.users);
    setShops(data.shops);
    setInventory(data.inventory);
    setInspections(data.inspections);
    setOffers(data.offers);
    setTechnicians(data.technicians);
    setQuickRequests(data.quickRequests);
  };

  const applyAuthResult = (payload: { token: string; user: User; bootstrap: BootstrapPayload }) => {
    setToken(payload.token);
    setCurrentUser(payload.user);
    setIsAuthenticated(true);
    applyBootstrap(payload.bootstrap);
    setActiveTab(payload.user.role === 'shopkeeper' ? 'shopkeeper_portal' : 'customer_home');
    setApiError(null);
  };

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
    localStorage.setItem('repairloop_theme_v3', theme);
  }, [theme]);

  useEffect(() => {
    let cancelled = false;
    const boot = async () => {
      try {
        await api.health();
        if (cancelled) return;
        setBackendOnline(true);
        const token = getToken();
        if (token) {
          const payload = await api.me();
          if (!cancelled) applyAuthResult(payload);
        }
      } catch (err) {
        if (!cancelled) {
          setBackendOnline(false);
          setApiError(err instanceof Error ? err.message : 'API unavailable');
        }
      } finally {
        if (!cancelled) setAuthBusy(false);
      }
    };
    boot();
    return () => { cancelled = true; };
  }, []);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const loginUser = async (user: User) => {
    if (backendOnline) {
      const payload = await api.demo({ email: user.email, userId: user.id });
      applyAuthResult(payload);
      return;
    }
    setCurrentUser(user);
    setIsAuthenticated(true);
    setActiveTab(user.role === 'shopkeeper' ? 'shopkeeper_portal' : 'customer_home');
  };

  const loginWithPassword = async (email: string, password: string) => {
    if (!backendOnline) {
      const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (existing) await loginUser(existing);
      else throw new Error('MySQL API is offline. Start the backend to register new accounts.');
      return;
    }
    const payload = await api.login(email, password);
    applyAuthResult(payload);
  };

  const registerAccount = async (data: { name: string; email: string; password: string; role: string }) => {
    if (!backendOnline) throw new Error('MySQL API is offline. Start the backend to register.');
    const payload = await api.register(data);
    applyAuthResult(payload);
  };

  const logoutUser = () => {
    setToken(null);
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  const switchUserById = async (userId: string) => {
    if (backendOnline) {
      const payload = await api.demo({ userId });
      applyAuthResult(payload);
      return;
    }
    const found = users.find(u => u.id === userId);
    if (found) await loginUser(found);
  };

  const submitNewInspection = async (data: Omit<DeviceInspection, 'id' | 'trackingNumber' | 'submittedAt' | 'status'>): Promise<DeviceInspection> => {
    if (backendOnline) {
      const result = await api.createInspection(data);
      setInspections(prev => [result.inspection, ...prev]);
      if (result.autoOffer) setOffers(prev => [result.autoOffer, ...prev]);
      return result.inspection;
    }

    const newInspection: DeviceInspection = {
      ...data,
      id: `insp_${Date.now()}`,
      trackingNumber: `RPL-MUJ-${Math.floor(1000 + Math.random() * 9000)}`,
      submittedAt: new Date().toISOString(),
      status: 'pending_review'
    };
    setInspections(prev => [newInspection, ...prev]);
    return newInspection;
  };

  const submitShopOffer = async (offerData: Omit<ShopOffer, 'id' | 'createdAt' | 'status'>): Promise<ShopOffer> => {
    if (backendOnline) {
      const result = await api.createOffer(offerData);
      setOffers(prev => [result.offer, ...prev]);
      setInspections(prev => prev.map(insp =>
        insp.id === offerData.inspectionId
          ? { ...insp, status: insp.status === 'pending_review' ? 'quotes_received' : insp.status }
          : insp
      ));
      return result.offer;
    }

    const newOffer: ShopOffer = {
      ...offerData,
      id: `offer_${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'pending'
    };
    setOffers(prev => [newOffer, ...prev]);
    return newOffer;
  };

  const acceptOffer = async (inspectionId: string, offerId: string) => {
    if (backendOnline) {
      const result = await api.acceptOffer(offerId, inspectionId);
      setOffers(prev => prev.map(o => o.inspectionId === inspectionId ? { ...o, status: o.id === offerId ? 'accepted' : 'declined' } : o));
      setInspections(prev => prev.map(insp => insp.id === inspectionId ? { ...insp, status: 'accepted', acceptedOfferId: offerId, assignedTechnicianId: result.assignedTechnicianId } : insp));
      return;
    }
    setOffers(prev => prev.map(o => o.inspectionId === inspectionId ? { ...o, status: o.id === offerId ? 'accepted' : 'declined' } : o));
    setInspections(prev => prev.map(insp => insp.id === inspectionId ? { ...insp, status: 'accepted', acceptedOfferId: offerId } : insp));
  };

  const submitQuickRequest = async (data: Omit<QuickDispositionRequest, 'id' | 'createdAt' | 'status' | 'trackingCode'>): Promise<QuickDispositionRequest> => {
    if (backendOnline) {
      const result = await api.createQuickRequest(data);
      setQuickRequests(prev => [result.request, ...prev]);
      return result.request;
    }
    const newReq: QuickDispositionRequest = {
      ...data,
      id: `quick_${Date.now()}`,
      trackingCode: `QUICK-MUJ-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
      status: 'scheduled'
    };
    setQuickRequests(prev => [newReq, ...prev]);
    return newReq;
  };

  const assignTechnicianToInspection = async (inspectionId: string, technicianId: string, taskDescription?: string) => {
    if (backendOnline) {
      const result = await api.assignTechnician(inspectionId, technicianId, taskDescription);
      setInspections(prev => prev.map(i => i.id === inspectionId ? { ...i, assignedTechnicianId: technicianId } : i));
      if (result.technician) {
        setTechnicians(prev => prev.map(t => t.id === technicianId ? result.technician : t));
      }
      return;
    }
    setInspections(prev => prev.map(i => i.id === inspectionId ? { ...i, assignedTechnicianId: technicianId } : i));
  };

  const addInventoryPart = async (partData: Omit<InventoryPart, 'id' | 'lastRestocked'>) => {
    if (backendOnline) {
      const result = await api.addInventoryPart(partData);
      setInventory(prev => [result.part, ...prev]);
      return;
    }
    setInventory(prev => [{ ...partData, id: `part_${Date.now()}`, lastRestocked: new Date().toISOString().split('T')[0] }, ...prev]);
  };

  const updateInventoryStock = async (partId: string, quantityChange: number) => {
    if (backendOnline) {
      const result = await api.updateInventoryStock(partId, quantityChange);
      setInventory(prev => prev.map(p => p.id === partId ? result.part : p));
      return;
    }
    setInventory(prev => prev.map(p => p.id === partId ? { ...p, quantityInStock: Math.max(0, p.quantityInStock + quantityChange) } : p));
  };

  const resetDemoData = async () => {
    if (backendOnline) {
      const payload = await api.resetDemo();
      applyAuthResult(payload);
      setSelectedInspectionId(null);
      return;
    }
    setCurrentUser(INITIAL_USERS[0]);
    setIsAuthenticated(true);
    setShops(AUTHORIZED_SHOPS);
    setInventory(INITIAL_INVENTORY);
    setInspections(INITIAL_INSPECTIONS);
    setOffers(INITIAL_OFFERS);
    setTechnicians(INITIAL_TECHNICIANS);
    setQuickRequests(INITIAL_QUICK_REQUESTS);
    setActiveTab('customer_home');
    setSelectedInspectionId(null);
  };

  const getOffersForInspection = (inspectionId: string) => offers.filter(o => o.inspectionId === inspectionId);
  const getShopById = (shopId: string) => shops.find(s => s.id === shopId);
  const getInspectionById = (inspectionId: string) => inspections.find(i => i.id === inspectionId);

  return (
    <AppContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        theme,
        users,
        shops,
        inventory,
        inspections,
        offers,
        technicians,
        quickRequests,
        activeTab,
        selectedInspectionId,
        backendOnline,
        apiError,
        authBusy,
        setActiveTab,
        setSelectedInspectionId,
        setCurrentUser,
        toggleTheme,
        loginUser,
        loginWithPassword,
        registerAccount,
        logoutUser,
        switchUserById,
        submitNewInspection,
        submitShopOffer,
        acceptOffer,
        submitQuickRequest,
        assignTechnicianToInspection,
        addInventoryPart,
        updateInventoryStock,
        resetDemoData,
        getOffersForInspection,
        getShopById,
        getInspectionById
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
