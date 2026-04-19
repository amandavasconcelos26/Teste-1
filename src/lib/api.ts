import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';
import { DashboardStats, Truck, Driver, Trip, Expense } from '../types';

export const api = {
  async bootstrapIfEmpty() {
    const trucksSnap = await getDocs(collection(db, 'trucks'));
    if (trucksSnap.docs.length === 0) {
      const trucks = [
        { plaque: "ABC-1234", model: "Scania R450", brand: "Scania", year: 2022, type: "Heavy", capacity: "40T", status: "Active" },
        { plaque: "XYZ-5678", model: "Volvo FH 540", brand: "Volvo", year: 2021, type: "Heavy", capacity: "45T", status: "Active" },
        { plaque: "DEF-9012", model: "Mercedes Actros", brand: "Mercedes", year: 2023, type: "Heavy", capacity: "42T", status: "Maintenance" }
      ];
      for (const t of trucks) {
        await addDoc(collection(db, 'trucks'), t);
      }
      const drivers = [
        { name: "João Silva", license: "123456789", category: "E", status: "Active" }
      ];
      for (const d of drivers) {
        await addDoc(collection(db, 'drivers'), d);
      }
    }
  },

  async getDashboard(): Promise<DashboardStats> {
    await this.bootstrapIfEmpty();
    const trucksSnap = await getDocs(collection(db, 'trucks'));
    const tripsSnap = await getDocs(collection(db, 'trips'));
    const expensesSnap = await getDocs(collection(db, 'expenses'));

    const trucks = trucksSnap.docs.map(d => d.data());
    const trips = tripsSnap.docs.map(d => d.data());
    const expenses = expensesSnap.docs.map(d => d.data());

    const totalRevenue = trips.reduce((acc: number, t: any) => acc + (t.freightValue || 0), 0);
    const totalExpenses = expenses.reduce((acc: number, e: any) => acc + (e.value || 0), 0);
    const netProfit = totalRevenue - totalExpenses;
    
    return {
      totalRevenue,
      totalExpenses,
      netProfit,
      margin: totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0,
      activeTrucks: trucks.filter((t: any) => t.status === "Active").length,
      profitHistory: [
        { month: "Jan", revenue: 45000, expenses: 32000 },
        { month: "Feb", revenue: 52000, expenses: 35000 },
        { month: "Mar", revenue: totalRevenue, expenses: totalExpenses },
      ]
    };
  },

  async getTrucks(): Promise<Truck[]> {
    const trucksSnap = await getDocs(collection(db, 'trucks'));
    const tripsSnap = await getDocs(collection(db, 'trips'));
    const expensesSnap = await getDocs(collection(db, 'expenses'));
    
    const trips = tripsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
    const expenses = expensesSnap.docs.map(d => ({ id: d.id, ...d.data() }));

    return trucksSnap.docs.map(d => {
      const truck = { id: d.id, ...d.data() } as any;
      const truckTrips = trips.filter((t: any) => t.truckId === truck.id);
      const truckExpenses = expenses.filter((e: any) => e.truckId === truck.id);
      
      const revenue = truckTrips.reduce((acc: number, t: any) => acc + (t.freightValue || 0), 0);
      const exps = truckExpenses.reduce((acc: number, e: any) => acc + (e.value || 0), 0);
      const km = truckTrips.reduce((acc: number, t: any) => acc + (t.kmFinal - t.kmInitial), 0);
      
      return {
        ...truck,
        revenue,
        expenses: exps,
        profit: revenue - exps,
        km,
        tripsCount: truckTrips.length
      } as Truck;
    });
  },

  async addTruck(truck: Partial<Truck>): Promise<Truck> {
    const newTruck = {
      ...truck,
      status: truck.status || "Active"
    };
    const docRef = await addDoc(collection(db, 'trucks'), newTruck);
    return { id: docRef.id, ...newTruck } as Truck;
  },

  async getDrivers(): Promise<Driver[]> {
    const snap = await getDocs(collection(db, 'drivers'));
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as Driver));
  },

  async addDriver(driver: Partial<Driver>): Promise<Driver> {
    const newDriver = {
      ...driver,
      status: driver.status || "Active"
    };
    const docRef = await addDoc(collection(db, 'drivers'), newDriver);
    return { id: docRef.id, ...newDriver } as Driver;
  },

  async deleteTruck(id: string): Promise<void> {
    await deleteDoc(doc(db, 'trucks', id));
  },

  async getUsers() {
    const snap = await getDocs(collection(db, 'users'));
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  },

  async addUser(user: any) {
    const newUser = {
      ...user,
      role: user.role || 'user',
      status: user.status || 'active'
    };
    const docRef = await addDoc(collection(db, 'users'), newUser);
    return { id: docRef.id, ...newUser };
  },

  async updateUser(id: string, updates: any) {
    await updateDoc(doc(db, 'users', id), updates);
  },

  async deleteUser(id: string) {
    await deleteDoc(doc(db, 'users', id));
  },

  async verifyLogin(username: string, password: string):Promise<any> {
    const usersSnap = await getDocs(collection(db, 'users'));
    let users = usersSnap.docs.map(d => ({ id: d.id, ...d.data() }));
    
    // Auto-bootstrap Admin if DB is empty
    if (users.length === 0) {
      const initialAdmin = { username: "Amanda", password: "comando88", role: "admin", status: "ative" };
      const docRef = await addDoc(collection(db, 'users'), initialAdmin);
      users = [{ id: docRef.id, ...initialAdmin }];
    }
    
    const user: any = users.find((u: any) => u.username.toLowerCase() === username.toLowerCase() && u.password === password);
    if (!user) {
      throw new Error("CREDENCIAIS_INVÁLIDAS");
    }
    if (user.status === "blocked") {
      throw new Error("ACESSO_BLOQUEADO");
    }
    return user;
  }
};
