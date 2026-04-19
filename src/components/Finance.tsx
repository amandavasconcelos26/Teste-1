import React from 'react';
import { Truck, Receipt, Plus, Search, Activity } from 'lucide-react';
import { Expense } from '../types';
import { formatCurrency, cn } from '../lib/utils';

export default function Finance() {
  const [expenses, setExpenses] = React.useState<Expense[]>([]);

  React.useEffect(() => {
    const stored = localStorage.getItem('frota_insight_db');
    if (stored) {
      setExpenses(JSON.parse(stored).expenses);
    }
  }, []);

  const totalCusto = expenses.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="flex justify-between items-end border-b border-white/5 pb-8 mb-8">
        <div>
          <h1 className="text-[10px] font-black tracking-[0.4em] text-rose-500 uppercase mb-2">CONTROLE DE CAIXA E DESPESAS</h1>
          <h2 className="text-4xl font-black text-white tracking-tighter">FINANCEIRO :: DESPESAS</h2>
        </div>
        <button 
          className="group relative px-6 py-3 bg-white text-black font-black text-xs tracking-widest uppercase hover:bg-rose-600 hover:text-white transition-all duration-300"
        >
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-rose-500" />
          <span className="flex items-center gap-3">
            <Plus size={14} strokeWidth={3} />
            NOVO LANÇAMENTO
          </span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/5 border border-white/5 mb-8">
        <div className="bg-[#050505] p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity">
            <Activity size={40} className="text-white/20" />
          </div>
          <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest leading-none block mb-4">DESPESA TOTAL REGISTRADA</span>
          <span className="text-3xl font-black text-rose-500 leading-none">{formatCurrency(totalCusto)}</span>
        </div>
      </div>

      <div className="bg-white/5 border border-white/5 p-px">
        <div className="bg-[#050505]">
           <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 text-[10px] font-black tracking-widest text-slate-500 uppercase">
                <th className="py-4 px-6">ID LANÇAMENTO</th>
                <th className="py-4 px-6">CATEGORIA</th>
                <th className="py-4 px-6">DATA</th>
                <th className="py-4 px-6 text-right">VALOR</th>
              </tr>
            </thead>
            <tbody className="text-sm font-mono text-slate-300">
              {expenses.map((exp: Expense) => (
                <tr key={exp.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 px-6 flex items-center gap-3">
                    <Receipt size={14} className="text-rose-500" />
                    <span>L-{exp.id}</span>
                  </td>
                  <td className="py-4 px-6 text-white font-bold">{exp.category.toUpperCase()}</td>
                  <td className="py-4 px-6">{exp.date}</td>
                  <td className="py-4 px-6 text-right text-rose-500 font-bold">{formatCurrency(exp.value)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
