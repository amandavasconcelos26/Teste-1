import { DashboardStats, Truck, Driver, Trip, Expense } from '../types';

const INITIAL_DATA = {
  users: [
    { id: "1", username: "Amanda", password: "comando88", role: "admin" }
  ],
  trucks: [
    { id: "1", plaque: "ABC-1234", model: "Scania R450", brand: "Scania", year: 2022, type: "Heavy", capacity: "40T", status: "Active" },
    { id: "2", plaque: "XYZ-5678", model: "Volvo FH 540", brand: "Volvo", year: 2021, type: "Heavy", capacity: "45T", status: "Active" },
    { id: "3", plaque: "DEF-9012", model: "Mercedes Actros", brand: "Mercedes", year: 2023, type: "Heavy", capacity: "42T", status: "Maintenance" },
    { id: "4", plaque: "GHI-3456", model: "Atego 2426", brand: "Mercedes", year: 2024, type: "Medium", capacity: "15T", status: "Active" },
  ],
  drivers: [
    { id: "1", name: "João Silva", license: "123456789", category: "E", status: "Active" },
    { id: "2", name: "Maria Oliveira", license: "987654321", category: "E", status: "Active" },
  ],
  trips: [
    { id: "101", tripNumber: "V001", truckId: "1", driverId: "1", origin: "Palmeira dos Índios", destination: "Quebrangulo", dateOut: "2024-03-01", dateIn: "2024-03-03", kmInitial: 10000, kmFinal: 10050, freightValue: 5500, status: "Completed" },
    { id: "102", tripNumber: "V002", truckId: "2", driverId: "2", origin: "Viçosa", destination: "Mar Vermelho", dateOut: "2024-03-05", dateIn: "2024-03-08", kmInitial: 15000, kmFinal: 15040, freightValue: 3200, status: "Completed" },
  ],
  expenses: [
    { id: "e1", truckId: "1", tripId: "101", category: "Fuel", date: "2024-03-01", value: 1200 },
    { id: "e2", truckId: "1", tripId: "101", category: "Toll", date: "2024-03-01", value: 350 },
    { id: "e3", truckId: "2", tripId: "102", category: "Fuel", date: "2024-03-05", value: 1800 },
    { id: "e4", truckId: "2", tripId: "102", category: "Maintenance", date: "2024-03-10", value: 4500 },
  ]
};

function getData() {
  const stored = localStorage.getItem('frota_insight_db');
  if (stored) return JSON.parse(stored);
  localStorage.setItem('frota_insight_db', JSON.stringify(INITIAL_DATA));
  return INITIAL_DATA;
}

function saveData(data: any) {
  localStorage.setItem('frota_insight_db', JSON.stringify(data));
}

// Simulated network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  async getDashboard(): Promise<DashboardStats> {
    await delay(600);
    const data = getData();
    const totalRevenue = data.trips.reduce((acc: number, t: any) => acc + t.freightValue, 0);
    const totalExpenses = data.expenses.reduce((acc: number, e: any) => acc + e.value, 0);
    const netProfit = totalRevenue - totalExpenses;
    
    return {
      totalRevenue,
      totalExpenses,
      netProfit,
      margin: totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0,
      activeTrucks: data.trucks.filter((t: any) => t.status === "Active").length,
      profitHistory: [
        { month: "Jan", revenue: 45000, expenses: 32000 },
        { month: "Feb", revenue: 52000, expenses: 35000 },
        { month: "Mar", revenue: totalRevenue, expenses: totalExpenses },
      ]
    };
  },

  async getTrucks(): Promise<Truck[]> {
    await delay(400);
    const data = getData();
    return data.trucks.map((truck: any) => {
      const truckTrips = data.trips.filter((t: any) => t.truckId === truck.id);
      const truckExpenses = data.expenses.filter((e: any) => e.truckId === truck.id);
      
      const revenue = truckTrips.reduce((acc: number, t: any) => acc + t.freightValue, 0);
      const expenses = truckExpenses.reduce((acc: number, e: any) => acc + e.value, 0);
      const km = truckTrips.reduce((acc: number, t: any) => acc + (t.kmFinal - t.kmInitial), 0);
      
      return {
        ...truck,
        revenue,
        expenses,
        profit: revenue - expenses,
        km,
        tripsCount: truckTrips.length
      };
    });
  },

  async addTruck(truck: Partial<Truck>): Promise<Truck> {
    await delay(800);
    const data = getData();
    const newTruck = {
      ...truck,
      id: Math.random().toString(36).substring(2, 9),
      status: truck.status || "Active"
    } as Truck;
    data.trucks.push(newTruck);
    saveData(data);
    return newTruck;
  },

  async getDrivers(): Promise<Driver[]> {
    await delay(400);
    return getData().drivers;
  },

  async addDriver(driver: Partial<Driver>): Promise<Driver> {
    await delay(800);
    const data = getData();
    const newDriver = {
      ...driver,
      id: Math.random().toString(36).substring(2, 9),
      status: driver.status || "Active"
    } as Driver;
    data.drivers.push(newDriver);
    saveData(data);
    return newDriver;
  },

  async deleteTruck(id: string): Promise<void> {
    await delay(400);
    const data = getData();
    data.trucks = data.trucks.filter((t: any) => t.id !== id);
    // Also cleanup related trips and expenses if this were a full DB, 
    // but for now we just remove the truck
    saveData(data);
  },

  async getUsers() {
    await delay(400);
    return getData().users || [];
  },

  async addUser(user: any) {
    await delay(600);
    const data = getData();
    const newUser = {
      ...user,
      id: Math.random().toString(36).substring(2, 9),
      role: user.role || 'user'
    };
    if (!data.users) data.users = [];
    data.users.push(newUser);
    saveData(data);
    return newUser;
  },

  async updateUser(id: string, updates: any) {
    await delay(600);
    const data = getData();
    if (!data.users) data.users = [];
    data.users = data.users.map((u: any) => u.id === id ? { ...u, ...updates } : u);
    saveData(data);
  },

  async deleteUser(id: string) {
    await delay(400);
    const data = getData();
    if (!data.users) data.users = [];
    data.users = data.users.filter((u: any) => u.id !== id);
    saveData(data);
  },

  async verifyLogin(username: string, password: string):Promise<any> {
    await delay(800);
    const data = getData();
    if (!data.users) data.users = [{ id: "1", username: "Amanda", password: "comando88", role: "admin" }];
    saveData(data);
    
    const user = data.users.find((u: any) => u.username.toLowerCase() === username.toLowerCase() && u.password === password);
    if (!user) {
      throw new Error("CREDENCIAIS_INVÁLIDAS");
    }
    return user;
  }
};
