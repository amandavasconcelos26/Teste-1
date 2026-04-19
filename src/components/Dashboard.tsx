import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { 
  Activity, 
  Cpu, 
  ShieldCheck, 
  Zap, 
  ArrowUpRight, 
  TrendingUp, 
  TrendingDown,
  Terminal,
  Box
} from 'lucide-react';
import { formatCurrency, cn } from '../lib/utils';
import { DashboardStats } from '../types';

export default function Dashboard() {
  const [stats, setStats] = React.useState<DashboardStats | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    fetch('/api/dashboard')
      .then(res => {
        if (!res.ok) throw new Error('API não acessível');
        return res.json();
      })
      .then(setStats)
      .catch(err => {
        console.error(err);
        setError("FALHA_NA_CONEXÃO_COM_NÚCLEO");
      });
  }, []);

  if (error) return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-rose-500 font-mono tracking-tighter uppercase gap-4">
      <Zap size={32} className="text-rose-600 animate-pulse" />
      <span>{error}</span>
      <span className="text-[10px] text-slate-500">VERIFIQUE_STATUS_SERVIDOR</span>
    </div>
  );

  if (!stats) return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-rose-500 font-mono tracking-tighter uppercase gap-4">
      <div className="w-12 h-12 border-2 border-rose-500/20 border-t-rose-500 rounded-full animate-spin" />
      <span>INICIANDO_FLUXO_DE_DADOS...</span>
    </div>
  );

  return (
    <div className="space-y-4 animate-in fade-in zoom-in-95 duration-700">
      {/* Header Info */}
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-rose-600/10 border border-rose-500/20 rounded-sm">
          <Terminal size={20} className="text-rose-500" />
        </div>
        <div>
          <h1 className="text-sm font-black tracking-[0.4em] text-white uppercase flex items-center gap-3">
            NÚCLEO_ANALÍTICO_LOGÍSTICO
            <span className="text-[10px] text-emerald-500 px-2 py-0.5 border border-emerald-500/20 rounded-full bg-emerald-500/5 animate-pulse">
              AO_VIVO::SINCRONIZADO
            </span>
          </h1>
          <p className="text-[10px] font-mono text-slate-500 tracking-wider">MARCAÇÃO: {new Date().toISOString()}</p>
        </div>
      </div>

      {/* Main Bento Grid */}
      <div className="grid grid-cols-12 gap-px bg-white/[0.05] border border-white/[0.05] shadow-2xl">
        
        {/* Primary Metric: Revenue */}
        <div className="col-span-12 lg:col-span-5 bg-[#050505] p-10 group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-rose-600/5 blur-[80px]" />
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div className="flex items-center gap-2 mb-12">
              <span className="text-[10px] font-black tracking-widest text-slate-500 uppercase">01 // RECEITA::GLOBAL</span>
              <div className="flex-1 h-px bg-white/5" />
            </div>
            <div>
              <p className="text-sm font-mono text-emerald-500 mb-2">+12.4% NO_PERÍODO</p>
              <h2 className="text-7xl font-black text-white tracking-tighter glow-text-rose leading-none mb-4">
                {formatCurrency(stats.totalRevenue).replace('R$', '')}
                <span className="text-xl text-slate-600 ml-2">BRL</span>
              </h2>
            </div>
          </div>
        </div>

        {/* Secondary Metrics Column */}
        <div className="col-span-12 lg:col-span-3 grid grid-rows-2 gap-px bg-white/[0.05]">
          <div className="bg-[#050505] p-8 flex flex-col justify-between">
            <span className="text-[10px] font-black tracking-widest text-slate-500 uppercase">02 // DESPESAS</span>
            <div>
              <p className="text-xs font-mono text-rose-500 mb-1">DESVIO_ESTÁVEL</p>
              <p className="text-3xl font-black text-white tracking-tight">{formatCurrency(stats.totalExpenses)}</p>
            </div>
          </div>
          <div className="bg-[#050505] p-8 flex flex-col justify-between">
            <span className="text-[10px] font-black tracking-widest text-slate-500 uppercase">03 // MARGEM</span>
            <div>
              <p className="text-xs font-mono text-emerald-400 mb-1">ZONA_IDEAL</p>
              <p className="text-5xl font-black text-emerald-500 tracking-tighter">{stats.margin.toFixed(1)}%</p>
            </div>
          </div>
        </div>

        {/* Operational Status Box */}
        <div className="col-span-12 lg:col-span-4 bg-[#050505] p-8 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-0 industrial-grid opacity-30" />
          <div className="relative z-10">
            <span className="text-[10px] font-black tracking-widest text-slate-500 uppercase">04 // OPS::ESTADO</span>
            <div className="mt-8 space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400">FROTA_ATIVA</span>
                <span className="text-xl font-black text-white">{stats.activeTrucks} / 4</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400">ID_MANUTENÇÃO</span>
                <span className="text-xl font-black text-amber-500">PROT-99X</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400">TEMPO_ATIVO_SIS</span>
                <span className="text-xs font-mono text-emerald-500 tracking-widest">99.98%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Big Chart Area */}
        <div className="col-span-12 lg:col-span-8 bg-[#050505] p-10 border-t border-white/5">
          <div className="flex justify-between items-center mb-12">
            <div className="flex items-center gap-3">
              <TrendingUp size={16} className="text-rose-500" />
              <span className="text-xs font-black tracking-[0.2em] text-white uppercase font-sans">VOLUMETRIA_PERFORMANCE_MOTOR</span>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase"><span className="w-1 h-1 bg-rose-500 rounded-full" /> REC_IN</div>
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase"><span className="w-1 h-1 bg-slate-700 rounded-full" /> DESP_OUT</div>
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.profitHistory}>
                <defs>
                  <linearGradient id="cyberRose" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: 'rgba(255,255,255,0.2)', fontSize: 10, fontWeight: 'bold'}} 
                  dy={10}
                />
                <YAxis 
                  hide
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#000', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0', fontSize: '10px', color: '#fff' }}
                  itemStyle={{ color: '#f43f5e', fontWeight: 'bold' }}
                />
                <Area 
                  type="stepAfter" 
                  dataKey="revenue" 
                  stroke="#f43f5e" 
                  strokeWidth={2} 
                  fillOpacity={1} 
                  fill="url(#cyberRose)" 
                  animationDuration={1500}
                />
                <Area 
                  type="stepAfter" 
                  dataKey="expenses" 
                  stroke="rgba(255,255,255,0.1)" 
                  strokeWidth={2} 
                  fill="transparent" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Cost Matrix Area */}
        <div className="col-span-12 lg:col-span-4 bg-[#050505] p-10 border-t border-white/5 border-l border-white/5">
          <span className="text-[10px] font-black tracking-widest text-slate-500 uppercase mb-8 block">05 // MATRIZ_DE_CUSTOS</span>
          <div className="space-y-4">
            {[
              { label: 'CUSTO_COMBÚSTIVEL', value: 45, color: 'bg-rose-600' },
              { label: 'FOLHA_EQUIPE', value: 35, color: 'bg-rose-900' },
              { label: 'MANUTENÇÃO_PREV', value: 20, color: 'bg-white/10' },
            ].map((c, i) => (
              <div key={i} className="group cursor-pointer">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-[10px] font-bold text-slate-400 group-hover:text-white transition-colors">{c.label}</span>
                  <span className="text-sm font-mono text-rose-500 font-bold">{c.value}%</span>
                </div>
                <div className="h-1 bg-white/5 relative overflow-hidden">
                  <div className={cn("h-full transition-all duration-1000", c.color)} style={{ width: `${c.value}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-12 pt-8 border-t border-white/5 bg-rose-600/5 p-4 rounded-sm border-l-2 border-l-rose-600">
            <div className="flex items-center gap-2 mb-2">
              <Zap size={14} className="text-rose-500" />
              <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest">RELATÓRIO_AÇÃO_SISTEMA</span>
            </div>
            <p className="text-[10px] leading-relaxed text-slate-400">
              Custos de combustível reduzidos em <span className="text-white font-bold">2.4%</span> após implantação do módulo de rotas otimizadas.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
