import React from 'react';
import { Truck, MapPin, Search } from 'lucide-react';
import { api } from '../lib/api';
import { Trip, Driver } from '../types';
import { formatCurrency, cn } from '../lib/utils';

export default function Operations() {
  const [trips, setTrips] = React.useState<Trip[]>([]);

  React.useEffect(() => {
    // We would fetch distinct trips here, wait, api.ts doesn't have getTrips yet
    // I will simulate with localStorage getData inline
    const stored = localStorage.getItem('frota_insight_db');
    if (stored) {
      setTrips(JSON.parse(stored).trips);
    }
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="flex justify-between items-end border-b border-white/5 pb-8 mb-8">
        <div>
          <h1 className="text-[10px] font-black tracking-[0.4em] text-emerald-500 uppercase mb-2">GERENCIAMENTO ESTRATÉGICO</h1>
          <h2 className="text-4xl font-black text-white tracking-tighter">OPERAÇÕES LAPP :: ALAGOAS</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5 border border-white/5 shadow-2xl">
        {trips.map((trip) => (
          <div key={trip.id} className="bg-[#050505] p-6 hover:bg-white/[0.02] transition-colors relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity">
              <span className="text-4xl font-black text-white/5 font-mono">{trip.tripNumber}</span>
            </div>
            
            <div className="flex flex-col gap-6 relative z-10">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-900 border border-white/10 flex items-center justify-center">
                    <MapPin size={16} className="text-emerald-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white tracking-tight uppercase truncate">{trip.origin} <span className="text-rose-500">→</span> {trip.destination}</h3>
                    <div className={cn(
                      "text-[8px] font-black tracking-[0.2em] px-2 py-0.5 uppercase mt-1 inline-block",
                      trip.status === 'Completed' ? "text-emerald-500 bg-emerald-500/10" : "text-amber-500 bg-amber-500/10"
                    )}>
                      {trip.status === 'Completed' ? 'FINALIZADA' : 'EM TRÂNSITO'}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-4">
                 <div>
                   <span className="text-[8px] font-bold text-slate-600 block mb-1">FRETE LÍQUIDO</span>
                   <span className="text-sm font-mono font-bold text-emerald-500">{formatCurrency(trip.freightValue)}</span>
                 </div>
                 <div>
                   <span className="text-[8px] font-bold text-slate-600 block mb-1">DISTÂNCIA TOTAL</span>
                   <span className="text-sm font-mono font-bold text-white">{trip.kmFinal - trip.kmInitial} KM</span>
                 </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
