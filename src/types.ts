export interface Truck {
  id: string;
  plaque: string;
  model: string;
  brand: string;
  year: number;
  type: string;
  capacity: string;
  status: 'Active' | 'Maintenance' | 'Inactive';
  revenue?: number;
  expenses?: number;
  profit?: number;
  km?: number;
  tripsCount?: number;
}

export interface Driver {
  id: string;
  name: string;
  license: string;
  category: string;
  status: 'Active' | 'Inactive';
}

export interface Trip {
  id: string;
  tripNumber: string;
  truckId: string;
  driverId: string;
  origin: string;
  destination: string;
  dateOut: string;
  dateIn: string;
  kmInitial: number;
  kmFinal: number;
  freightValue: number;
  status: 'Planned' | 'In Transit' | 'Completed';
}

export interface Expense {
  id: string;
  truckId: string;
  tripId?: string;
  category: string;
  date: string;
  value: number;
  description?: string;
}

export interface DashboardStats {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  margin: number;
  activeTrucks: number;
  profitHistory: { month: string; revenue: number; expenses: number }[];
}
