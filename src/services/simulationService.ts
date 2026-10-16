import { MultiAgentLogisticsTrace } from '../types';

export interface SimulationResult {
  negotiatedAllocations: {
    deviceId: string;
    model: string;
    assignedAgent: string;
    path: string;
    netValue: number;
    turnaroundDays: number;
    carbonSavedKg: number;
  }[];
  fixedPriorityAllocations: {
    deviceId: string;
    model: string;
    assignedAgent: string;
    path: string;
    netValue: number;
    turnaroundDays: number;
    carbonSavedKg: number;
    overloadFlag: boolean;
  }[];
  traceLogs: MultiAgentLogisticsTrace[];
  summaryMetrics: {
    negotiatedTotalValue: number;
    baselineTotalValue: number;
    valueImprovementPercent: number;
    negotiatedCarbonSavedKg: number;
    baselineCarbonSavedKg: number;
    depotBottleneckReductionPercent: number;
    eWasteDivertedKg: number;
  };
}

export function runReturnNetworkSimulation(): SimulationResult {
  const sampleSimDevices = [
    { id: 'SIM-01', model: 'iPhone 13 Pro', damage: 'Cracked Screen + Degraded Battery', ageMonths: 22 },
    { id: 'SIM-02', model: 'MacBook Pro 14"', damage: 'Shattered Display Matrix', ageMonths: 36 },
    { id: 'SIM-03', model: 'Samsung Galaxy S22', damage: 'Liquid Ingress Motherboard Short', ageMonths: 30 },
    { id: 'SIM-04', model: 'iPad Air 5th Gen', damage: 'Bent Chassis & Port Fault', ageMonths: 18 },
    { id: 'SIM-05', model: 'Dell XPS 15 9520', damage: 'Battery Swelling Only', ageMonths: 14 }
  ];

  const traceLogs: MultiAgentLogisticsTrace[] = [
    {
      stepNumber: 1,
      timestamp: '10:00:15',
      agentName: 'Customer Return Point (MUJ Campus Hub)',
      agentRole: 'Customer',
      action: 'Broadcast 5 Returned Electronics to Network',
      decisionReason: 'Batch aggregated from campus returns with automated diagnostics and photo logs.',
      costImpact: 0,
      capacityImpact: '5 Units Pending Routing',
      carbonSavedKg: 0
    },
    {
      stepNumber: 2,
      timestamp: '10:00:18',
      agentName: 'Carrier Agent (Jaipur Express EV Logistics)',
      agentRole: 'Carrier',
      action: 'Calculated Dynamic Transit Costs & Distance Matrices',
      decisionReason: 'Grouped SIM-01 and SIM-05 for same-day delivery to Apex Depot to minimize transport emissions.',
      costImpact: -1500,
      capacityImpact: '2 Routes Optimized',
      carbonSavedKg: 4.2
    },
    {
      stepNumber: 3,
      timestamp: '10:00:22',
      agentName: 'Apex Precision Depot Agent',
      agentRole: 'Repair Depot',
      action: 'Accepted SIM-01 & SIM-05; Rejected SIM-03',
      decisionReason: 'High OEM parts in inventory for SIM-01/05. Rejected SIM-03 (motherboard liquid damage) to prevent technician bench bottleneck.',
      costImpact: 24800,
      capacityImpact: 'Bench Utilization: 82% (Nominal)',
      carbonSavedKg: 52.8
    },
    {
      stepNumber: 4,
      timestamp: '10:00:27',
      agentName: 'EcoRefurb Direct Hub Agent',
      agentRole: 'Refurbisher',
      action: 'Counter-Offered Buyout for SIM-02 & SIM-04',
      decisionReason: 'Has secondary market channels for refurbished M1 MacBooks and iPads with 28% target margin.',
      costImpact: 38400,
      capacityImpact: 'Refurb Line Capacity: 65%',
      carbonSavedKg: 78.5
    },
    {
      stepNumber: 5,
      timestamp: '10:00:33',
      agentName: 'Silicon Salvage Exchange Agent',
      agentRole: 'Parts Supplier',
      action: 'Acquired SIM-03 for Component Harvesting',
      decisionReason: 'Harvested uncorrupted OLED panel and camera modules to supply back to Apex Depot.',
      costImpact: 11200,
      capacityImpact: 'Parts Warehouse +2 Modules',
      carbonSavedKg: 31.0
    },
    {
      stepNumber: 6,
      timestamp: '10:00:40',
      agentName: 'GreenMatrix Recycling Agent',
      agentRole: 'Recycler',
      action: 'Received Spent Battery Hazardous Waste',
      decisionReason: 'Safely extracted nickel-manganese-cobalt under hydrometallurgical closed loop in Bagru.',
      costImpact: 2000,
      capacityImpact: 'Eco-Destruction Verified',
      carbonSavedKg: 14.5
    }
  ];

  const negotiatedAllocations = [
    { deviceId: 'SIM-01', model: 'iPhone 13 Pro', assignedAgent: 'Apex Precision Care (MUJ)', path: 'Fix & Return', netValue: 21600, turnaroundDays: 2, carbonSavedKg: 54 },
    { deviceId: 'SIM-02', model: 'MacBook Pro 14"', assignedAgent: 'EcoRefurb Direct (Dehmi Kalan)', path: 'Buy & Refurbish', netValue: 36800, turnaroundDays: 3, carbonSavedKg: 85 },
    { deviceId: 'SIM-03', model: 'Galaxy S22', assignedAgent: 'Silicon Salvage (Bagru)', path: 'Sell for Parts', netValue: 11600, turnaroundDays: 1, carbonSavedKg: 32 },
    { deviceId: 'SIM-04', model: 'iPad Air 5th Gen', assignedAgent: 'EcoRefurb Direct (Dehmi Kalan)', path: 'Buy & Refurbish', netValue: 23200, turnaroundDays: 2, carbonSavedKg: 48 },
    { deviceId: 'SIM-05', model: 'Dell XPS 15', assignedAgent: 'Apex Precision Care (MUJ)', path: 'Fix & Return', netValue: 30400, turnaroundDays: 1, carbonSavedKg: 62 }
  ];

  // Fixed-priority baseline (Always attempts repair depot first, causing severe overload and scrap)
  const fixedPriorityAllocations = [
    { deviceId: 'SIM-01', model: 'iPhone 13 Pro', assignedAgent: 'Apex Depot (Default)', path: 'Fix & Return', netValue: 17600, turnaroundDays: 6, carbonSavedKg: 54, overloadFlag: true },
    { deviceId: 'SIM-02', model: 'MacBook Pro 14"', assignedAgent: 'Apex Depot (Default)', path: 'Fix & Return', netValue: 24800, turnaroundDays: 9, carbonSavedKg: 60, overloadFlag: true },
    { deviceId: 'SIM-03', model: 'Galaxy S22', assignedAgent: 'Unsorted Scrap', path: 'Scrapped to Waste', netValue: -1600, turnaroundDays: 12, carbonSavedKg: 0, overloadFlag: true },
    { deviceId: 'SIM-04', model: 'iPad Air 5th Gen', assignedAgent: 'Apex Depot (Default)', path: 'Fix & Return', netValue: 14400, turnaroundDays: 8, carbonSavedKg: 40, overloadFlag: true },
    { deviceId: 'SIM-05', model: 'Dell XPS 15', assignedAgent: 'Apex Depot (Default)', path: 'Fix & Return', netValue: 23200, turnaroundDays: 5, carbonSavedKg: 55, overloadFlag: true }
  ];

  return {
    negotiatedAllocations,
    fixedPriorityAllocations,
    traceLogs,
    summaryMetrics: {
      negotiatedTotalValue: 123600,
      baselineTotalValue: 78400,
      valueImprovementPercent: 57.6,
      negotiatedCarbonSavedKg: 281,
      baselineCarbonSavedKg: 209,
      depotBottleneckReductionPercent: 68.0,
      eWasteDivertedKg: 14.8
    }
  };
}
