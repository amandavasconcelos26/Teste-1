import React from 'react';
import { Truck as TruckIcon, Save, X, Plus, Zap, Settings, Activity, Trash2, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { formatCurrency, formatNumber, cn } from '../lib/utils';
import { Truck } from '../types';
import { api } from '../lib/api';

export default function FleetList() {
  const [trucks, setTrucks] = React.useState<Truck[]>([]);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [deletingId, setDeletingId] = React.useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = React.useState<string | null>(null);
  
  const [viewingTruckId, setViewingTruckId] = React.useState<string | null>(null);

  const [formData, setFormData] = React.useState({
    plaque: '',
    model: '',
    brand: '',
    year: new Date().getFullYear(),
    type: 'Heavy',
    capacity: ''
  });

  const fetchTrucks = React.useCallback(() => {
    api.getTrucks()
      .then(setTrucks)
      .catch(err => console.error("FALHA AO CARREGAR FROTA:", err));
  }, []);

  React.useEffect(() => {
    fetchTrucks();
  }, [fetchTrucks]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.addTruck(formData);
      setIsModalOpen(false);
      setFormData({ plaque: '', model: '', brand: '', year: new Date().getFullYear(), type: 'Heavy', capacity: '' });
      fetchTrucks();
    } catch (error) {
      console.error("FALHA AO REGISTRAR ATIVO:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const executeDelete = async (id: string) => {
    setDeletingId(id);
    setConfirmDeleteId(null);
    try {
      await api.deleteTruck(id);
      fetchTrucks();
    } catch (error) {
      console.error("FALHA AO DELETAR ATIVO:", error);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-700">
      <div className="flex justify-between items-end border-b border-white/5 pb-8">
        <div>
          <h1 className="text-[10px] font-black tracking-[0.4em] text-rose-500 uppercase mb-2">SISTEMA DE INVENTÁRIO DE ATIVOS</h1>
          <h2 className="text-4xl font-black text-white tracking-tighter">FROTA :: UNIDADES ATIVAS</h2>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="group relative px-6 py-3 bg-white text-black font-black text-xs tracking-widest uppercase hover:bg-rose-600 hover:text-white transition-all duration-300"
        >
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-rose-500" />
          <span className="flex items-center gap-3">
            <Plus size={14} strokeWidth={3} />
            IMPLANTAR_NOVO_ATIVO
          </span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5 border border-white/5 shadow-2xl">
        {trucks.map((truck) => (
          <div key={truck.id} className="bg-[#050505] group relative overflow-hidden p-8 transition-colors hover:bg-white/[0.02]">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity pointer-events-none">
              <span className="text-[40px] font-black text-white/5 font-mono">{truck.plaque.split('-')[1] || '000'}</span>
            </div>
            
            <div className="flex flex-col gap-8 h-full relative z-10">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-rose-500/50 transition-colors">
                    <TruckIcon size={20} className="text-slate-400 group-hover:text-rose-500 transition-colors" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white tracking-tighter uppercase">{truck.plaque}</h3>
                    <p className="text-[10px] font-mono text-slate-500 tracking-widest">{truck.brand} // {truck.model}</p>
                  </div>
                </div>
                <div className={cn(
                  "text-[8px] font-black tracking-[0.2em] px-2 py-1 uppercase border",
                  truck.status === 'Active' ? "border-emerald-500/50 text-emerald-500 bg-emerald-500/5" : "border-amber-500/50 text-amber-500 bg-amber-500/5"
                )}>
                  {truck.status === 'Active' ? 'OPERACIONAL' : 'EM MANUTENÇÃO'}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-px bg-white/5 border border-white/5">
                <div className="bg-[#050505] p-4 flex flex-col gap-1">
                  <span className="text-[8px] font-bold text-slate-600 uppercase tracking-widest leading-none">RECEITA GERADA</span>
                  <span className="text-lg font-black text-white leading-none">{formatCurrency(truck.revenue || 0)}</span>
                </div>
                <div className="bg-[#050505] p-4 flex flex-col gap-1">
                  <span className="text-[8px] font-bold text-slate-600 uppercase tracking-widest leading-none">CARGA DE CUSTOS</span>
                  <span className="text-lg font-black text-rose-500 leading-none">{formatCurrency(truck.expenses || 0)}</span>
                </div>
              </div>

              <div className="flex justify-between items-end mt-auto">
                <div className="flex flex-col gap-1">
                  <span className="text-[8px] font-mono text-slate-700 tracking-widest">DELTA DO RESULTADO LÍQUIDO</span>
                  <div className={cn(
                    "text-3xl font-black tracking-tighter",
                    (truck.profit || 0) >= 0 ? "text-emerald-500" : "text-rose-600"
                  )}>
                    {formatCurrency(truck.profit || 0)}
                  </div>
                </div>
                <div className="flex gap-2 relative">
                  {confirmDeleteId === truck.id && (
                    <div className="absolute bottom-full right-0 mb-2 whitespace-nowrap bg-rose-600 text-white text-[10px] font-black tracking-widest px-3 py-2 animate-in slide-in-from-bottom-2">
                      CONFIRMAR EXCLUSÃO?
                    </div>
                  )}
                  <button 
                    onClick={() => setViewingTruckId(truck.id)}
                    className="w-8 h-8 flex items-center justify-center bg-white/5 hover:bg-rose-600 transition-colors group/btn"
                    title="Analisar Ativo"
                  >
                    <Activity size={14} className="text-slate-600 group-hover/btn:text-white" />
                  </button>
                  <button 
                    onClick={() => {
                      if (confirmDeleteId === truck.id) {
                        executeDelete(truck.id!);
                      } else {
                        setConfirmDeleteId(truck.id!);
                        setTimeout(() => setConfirmDeleteId(null), 3000);
                      }
                    }}
                    disabled={deletingId === truck.id}
                    className={cn(
                      "w-8 h-8 flex items-center justify-center transition-colors group/btn disabled:opacity-50",
                      confirmDeleteId === truck.id ? "bg-rose-600 text-white" : "bg-white/5 hover:bg-rose-600"
                    )}
                    title="Descomissionar Ativo"
                  >
                    {deletingId === truck.id ? (
                      <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : (
                      confirmDeleteId === truck.id ? <AlertTriangle size={14} /> : <Trash2 size={14} className={cn("text-slate-600 group-hover/btn:text-white")} />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Futuristic Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-xl"
            />
            <motion.div 
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.95 }}
              className="relative w-full max-w-xl bg-[#0a0a0a] border border-white/10 p-12 overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-rose-600" />
              <div className="flex flex-col gap-12 relative z-10">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xs font-black tracking-[0.5em] text-rose-500 uppercase mb-2">INICIAR_IMPLANTAÇÃO</h2>
                    <h3 className="text-3xl font-black text-white tracking-tighter uppercase">ENTRADA_NOVO_ATIVO</h3>
                  </div>
                  <button onClick={() => setIsModalOpen(false)} className="text-slate-600 hover:text-white transition-colors">
                    <X size={24} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black tracking-widest text-slate-600 uppercase">PLACA_IDENTIFICADORA</label>
                      <input 
                        required
                        autoFocus
                        value={formData.plaque}
                        onChange={e => setFormData({...formData, plaque: e.target.value.toUpperCase()})}
                        className="w-full bg-white/5 border border-white/5 px-4 py-3 text-sm font-mono text-white focus:outline-none focus:border-rose-500 transition-colors"
                        placeholder="000-0000"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black tracking-widest text-slate-600 uppercase">ANO_FABRICAÇÃO</label>
                      <input 
                        required
                        type="number"
                        value={formData.year}
                        onChange={e => setFormData({...formData, year: parseInt(e.target.value)})}
                        className="w-full bg-white/5 border border-white/5 px-4 py-3 text-sm font-mono text-white focus:outline-none focus:border-rose-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black tracking-widest text-slate-600 uppercase">FABRICANTE</label>
                      <input 
                        required
                        value={formData.brand}
                        onChange={e => setFormData({...formData, brand: e.target.value})}
                        className="w-full bg-white/5 border border-white/5 px-4 py-3 text-sm text-white focus:outline-none focus:border-rose-500 transition-colors uppercase"
                        placeholder="SCANIA"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black tracking-widest text-slate-600 uppercase">DESIGNAÇÃO_MODELO</label>
                      <input 
                        required
                        value={formData.model}
                        onChange={e => setFormData({...formData, model: e.target.value})}
                        className="w-full bg-white/5 border border-white/5 px-4 py-3 text-sm text-white focus:outline-none focus:border-rose-500 transition-colors uppercase"
                        placeholder="R450"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black tracking-widest text-slate-600 uppercase">CLASSIFICAÇÃO_VEÍCULO</label>
                      <select 
                        value={formData.type}
                        onChange={e => setFormData({...formData, type: e.target.value as 'Heavy' | 'Truck' | 'Medium' | 'Light'})}
                        className="w-full bg-white/5 border border-white/5 px-4 py-3 text-sm text-white focus:outline-none focus:border-rose-500 transition-colors uppercase appearance-none"
                      >
                        <option value="Heavy" className="bg-[#0a0a0a]">Pesado (Bitrem)</option>
                        <option value="Truck" className="bg-[#0a0a0a]">Médio (Truck)</option>
                        <option value="Medium" className="bg-[#0a0a0a]">Médio (Toco)</option>
                        <option value="Light" className="bg-[#0a0a0a]">Leve (VUC)</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black tracking-widest text-slate-600 uppercase">CAPACIDADE_CARGA</label>
                      <input 
                        required
                        value={formData.capacity}
                        onChange={e => setFormData({...formData, capacity: e.target.value})}
                        className="w-full bg-white/5 border border-white/5 px-4 py-3 text-sm text-white focus:outline-none focus:border-rose-500 transition-colors uppercase"
                        placeholder="EX: 45T"
                      />
                    </div>
                  </div>

                  <div className="pt-8">
                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 bg-rose-600 text-white font-black text-xs tracking-[0.3em] uppercase hover:bg-rose-700 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                      {isSubmitting ? "PROCESSANDO_FLUXO..." : <><Zap size={16} fill="currentColor" /> FINALIZAR_IMPLANTAÇÃO_ATIVO</>}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}

        {/* View Modal */}
        {viewingTruckId && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setViewingTruckId(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-xl"
            />
            <motion.div 
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.95 }}
              className="relative w-full max-w-2xl bg-[#0a0a0a] border border-white/10 p-12 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-1 h-full bg-emerald-500" />
              {(() => {
                const truck = trucks.find(t => t.id === viewingTruckId);
                if (!truck) return null;
                const profit = truck.profit || 0;
                
                return (
                  <div className="flex flex-col gap-12 relative z-10">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-xs font-black tracking-[0.5em] text-emerald-500 uppercase mb-2">ANÁLISE_PROFUNDA</h2>
                        <h3 className="text-3xl font-black text-white tracking-tighter uppercase">{truck.plaque}</h3>
                      </div>
                      <button onClick={() => setViewingTruckId(null)} className="text-slate-600 hover:text-white transition-colors">
                        <X size={24} />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-white/5 border border-white/10 p-4">
                        <span className="text-[8px] font-black tracking-widest text-slate-500 uppercase block mb-1">MODELO</span>
                        <span className="text-sm font-mono text-white">{truck.model}</span>
                      </div>
                      <div className="bg-white/5 border border-white/10 p-4">
                        <span className="text-[8px] font-black tracking-widest text-slate-500 uppercase block mb-1">MARCA</span>
                        <span className="text-sm font-mono text-white">{truck.brand}</span>
                      </div>
                      <div className="bg-white/5 border border-white/10 p-4">
                        <span className="text-[8px] font-black tracking-widest text-slate-500 uppercase block mb-1">TIPO</span>
                        <span className="text-sm font-mono text-white">{truck.type}</span>
                      </div>
                      <div className="bg-white/5 border border-white/10 p-4">
                        <span className="text-[8px] font-black tracking-widest text-slate-500 uppercase block mb-1">KILOMETRAGEM_LÍQUIDA</span>
                        <span className="text-sm font-mono text-white">{truck.km || 0} KM</span>
                      </div>
                    </div>

                    <div className="bg-[#050505] p-8 border border-white/5">
                      <span className="text-[10px] font-black tracking-widest text-slate-500 uppercase block mb-6">MÉTRICAS_FINANCEIRAS_DO_ATIVO</span>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div>
                          <span className="text-[8px] font-bold text-slate-600 uppercase tracking-widest block mb-2">RECEITA_ACUMULADA</span>
                          <span className="text-2xl font-black text-white block">{formatCurrency(truck.revenue || 0)}</span>
                        </div>
                        <div>
                          <span className="text-[8px] font-bold text-slate-600 uppercase tracking-widest block mb-2">CUSTO_TOTAIS</span>
                          <span className="text-2xl font-black text-rose-500 block">{formatCurrency(truck.expenses || 0)}</span>
                        </div>
                        <div className={cn(
                          "p-4 border",
                          profit >= 0 ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-500" : "border-rose-500/20 bg-rose-500/5 text-rose-500"
                        )}>
                          <span className="text-[8px] font-bold uppercase tracking-widest block mb-2 opacity-70">LUCRO_LÍQUIDO_FINAL</span>
                          <span className="text-3xl font-black block leading-none">{formatCurrency(profit)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

