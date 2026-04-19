import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // In-memory data store for the MVP
  const data = {
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
      { id: "101", tripNumber: "V001", truckId: "1", driverId: "1", origin: "São Paulo", destination: "Curitiba", dateOut: "2024-03-01", dateIn: "2024-03-03", kmInitial: 10000, kmFinal: 10450, freightValue: 5500, status: "Completed" },
      { id: "102", tripNumber: "V002", truckId: "2", driverId: "2", origin: "Santos", destination: "Belo Horizonte", dateOut: "2024-03-05", dateIn: "2024-03-08", kmInitial: 15000, kmFinal: 15600, freightValue: 7200, status: "Completed" },
    ],
    expenses: [
      { id: "e1", truckId: "1", tripId: "101", category: "Fuel", date: "2024-03-01", value: 1200 },
      { id: "e2", truckId: "1", tripId: "101", category: "Toll", date: "2024-03-01", value: 350 },
      { id: "e3", truckId: "2", tripId: "102", category: "Fuel", date: "2024-03-05", value: 1800 },
      { id: "e4", truckId: "2", tripId: "102", category: "Maintenance", date: "2024-03-10", value: 4500 }, // High cost maintenance causing loss
    ]
  };

  // API Routes
  app.get("/api/dashboard", (req, res) => {
    // Calculate global stats
    const totalRevenue = data.trips.reduce((acc, t) => acc + t.freightValue, 0);
    const totalExpenses = data.expenses.reduce((acc, e) => acc + e.value, 0);
    const netProfit = totalRevenue - totalExpenses;
    
    res.json({
      totalRevenue,
      totalExpenses,
      netProfit,
      margin: totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0,
      activeTrucks: data.trucks.filter(t => t.status === "Active").length,
      profitHistory: [
        { month: "Jan", revenue: 45000, expenses: 32000 },
        { month: "Feb", revenue: 52000, expenses: 35000 },
        { month: "Mar", revenue: totalRevenue, expenses: totalExpenses },
      ]
    });
  });

  app.get("/api/trucks", (req, res) => {
    const trucksWithStats = data.trucks.map(truck => {
      const truckTrips = data.trips.filter(t => t.truckId === truck.id);
      const truckExpenses = data.expenses.filter(e => e.truckId === truck.id);
      
      const revenue = truckTrips.reduce((acc, t) => acc + t.freightValue, 0);
      const expenses = truckExpenses.reduce((acc, e) => acc + e.value, 0);
      const km = truckTrips.reduce((acc, t) => acc + (t.kmFinal - t.kmInitial), 0);
      
      return {
        ...truck,
        revenue,
        expenses,
        profit: revenue - expenses,
        km,
        tripsCount: truckTrips.length
      };
    });
    res.json(trucksWithStats);
  });

  app.post("/api/trucks", (req, res) => {
    const newTruck = {
      ...req.body,
      id: Math.random().toString(36).substring(2, 9),
      status: req.body.status || "Active"
    };
    data.trucks.push(newTruck);
    res.status(201).json(newTruck);
  });

  app.get("/api/trips", (req, res) => res.json(data.trips));
  app.get("/api/drivers", (req, res) => res.json(data.drivers));

  // Vite middleware
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Frota Insight Server running on http://localhost:${PORT}`);
  });
}

startServer();
