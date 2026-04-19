import React from 'react';
import { Users, Plus, X, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { Driver } from '../types';

import { api } from '../lib/api';

export default function CrewManagement() {
  const [drivers, setDrivers] = React.useState<Driver[]>([]);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  
  const [formData, setFormData] = React.useState({
    name: '',
    license: '',
    category: 'E'
  });

  React.useEffect(() => {
    api.getDrivers()
      .then(setDrivers)
      .catch(err => console.error(err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.addDriver(formData);
      setIsModalOpen(false);
      setFormData({ name: '', license: '', category: 'E' });
      api.getDrivers().then(setDrivers);
    } catch (error) {
      console.error("FALHA_AO_CADASTRAR_EQUIPE:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-700">
      <div className="flex justify-between items-end border-b border-white/5 pb-8">
        <div>
          <h1 className="text-[10px] font-black tracking-[0.4em] text-emerald-500 uppercase mb-2">GERENCIAMENTO ESTRATÉGICO</h1>
          <h2 className="text-4xl font-black text-white tracking-tighter">EQUIPE :: LISTA DE MOTORES</h2>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="group relative px-6 py-3 bg-white text-black font-black text-xs tracking-widest uppercase hover:bg-emerald-600 hover:text-white transition-all duration-300"
        >
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500" />
          <span className="flex items-center gap-3">
            <Plus size={14} strokeWidth={3} />
            ADICIONAR MOTORISTA
          </span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5 border border-white/5 shadow-2xl">
        {drivers.map((driver) => (
          <div key={driver.id} className="bg-[#050505] p-6 hover:bg-white/[0.02] transition-colors relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity">
              <span className="text-4xl font-black text-white/5 font-mono">{driver.id}</span>
            </div>
            
            <div className="flex flex-col gap-6 relative z-10">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-900 border border-white/10 flex items-center justify-center">
                    <Users size={16} className="text-emerald-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white tracking-tight uppercase truncate">{driver.name}</h3>
                    <div className={cn(
                      "text-[8px] font-black tracking-[0.2em] px-2 py-0.5 uppercase mt-1 inline-block",
                      driver.status === 'Active' ? "text-emerald-500 bg-emerald-500/10" : "text-slate-500 bg-slate-800"
                    )}>
                      {driver.status === 'Active' ? 'ATIVO' : 'DESLIGADO'}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-4">
                 <div>
                   <p className="text-[10px] font-black text-slate-600 tracking-widest uppercase">CNH</p>
                   <p className="text-sm font-mono text-slate-300 mt-1">{driver.license}</p>
                 </div>
                 <div>
                   <p className="text-[10px] font-black text-slate-600 tracking-widest uppercase">CATEGORIA</p>
                   <p className="text-sm font-black text-white mt-1 border border-white/10 px-2 py-0.5 inline-block bg-white/5">{driver.category}</p>
                 </div>
              </div>
            </div>
          </div>
        ))}
      </div>

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
              className="relative w-full max-w-xl bg-[#0a0a0a] border border-white/10 p-12 overflow-hidden shadow-2xl"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
              <div className="flex flex-col gap-12 relative z-10">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xs font-black tracking-[0.5em] text-emerald-500 uppercase mb-2">NOVOS_REGISTROS</h2>
                    <h3 className="text-3xl font-black text-white tracking-tighter uppercase">INCLUIR_MOTORISTA</h3>
                  </div>
                  <button onClick={() => setIsModalOpen(false)} className="text-slate-600 hover:text-white transition-colors">
                    <X size={24} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black tracking-widest text-slate-600 uppercase">NOME_COMPLETO</label>
                    <input 
                      required
                      autoFocus
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value.toUpperCase()})}
                      className="w-full bg-white/5 border border-white/5 px-4 py-3 text-sm font-sans font-bold text-white focus:outline-none focus:border-emerald-500 transition-colors"
                      placeholder="EX: AYRTON SENNA"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black tracking-widest text-slate-600 uppercase">DOC_HABILITAÇÃO_(CNH)</label>
                      <input 
                        required
                        value={formData.license}
                        onChange={e => setFormData({...formData, license: e.target.value})}
                        className="w-full bg-white/5 border border-white/5 px-4 py-3 text-sm font-mono text-white focus:outline-none focus:border-emerald-500 transition-colors"
                        placeholder="00000000000"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black tracking-widest text-slate-600 uppercase">CATEGORIA</label>
                      <select 
                        value={formData.category}
                        onChange={e => setFormData({...formData, category: e.target.value})}
                        className="w-full bg-white/5 border border-white/5 px-4 py-3 text-sm font-bold text-white focus:outline-none focus:border-emerald-500 transition-colors uppercase appearance-none"
                      >
                        <option value="D" className="bg-[#0a0a0a]">Categoria D</option>
                        <option value="E" className="bg-[#0a0a0a]">Categoria E</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-8 flex gap-4">
                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 py-4 bg-emerald-600 text-white font-black text-xs tracking-[0.3em] uppercase hover:bg-emerald-700 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                      {isSubmitting ? "REGISTRANDO..." : <><Zap size={16} fill="currentColor" /> APROVAR_INCLUSÃO</>}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
