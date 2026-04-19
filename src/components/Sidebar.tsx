import React from 'react';
import { 
  LayoutDashboard, 
  Truck, 
  Users, 
  MapPin, 
  Receipt, 
  TrendingUp, 
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { cn } from '../lib/utils';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const isAdmin = localStorage.getItem('frota_current_role') === 'admin';

  const menuItems = [
    { id: 'dashboard', label: 'ANÁLISE', icon: LayoutDashboard },
    { id: 'fleet', label: 'FROTA', icon: Truck },
    { id: 'trips', label: 'OPERAÇÕES', icon: MapPin },
    { id: 'drivers', label: 'EQUIPE', icon: Users },
    { id: 'expenses', label: 'FINANCEIRO', icon: Receipt },
    { id: 'users', label: 'SISTEMA', icon: ShieldAlert },
  ];

  return (
    <>
      <div 
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
        className={cn(
          "fixed inset-y-0 left-0 z-50 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] border-r border-white/5 bg-black/80 backdrop-blur-xl group hidden lg:block",
          isExpanded ? "w-64" : "w-16"
        )}
      >
      <div className="h-full flex flex-col">
        {/* Brand */}
        <div className="h-16 flex items-center px-4 border-b border-white/5">
          <div className="w-8 h-8 flex-shrink-0 bg-rose-600 rounded-sm flex items-center justify-center text-white font-black text-xs ring-4 ring-rose-600/20">
            F.I
          </div>
          <span className={cn(
            "ml-4 font-black tracking-[0.2em] text-white transition-opacity duration-300",
            !isExpanded && "opacity-0"
          )}>
            FROTA_INSIGHT
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-8 space-y-2 overflow-hidden">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "w-full flex items-center h-12 transition-all duration-300 group/btn relative",
                  isActive ? "bg-rose-600/10 text-white" : "text-slate-500 hover:text-white"
                )}
              >
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-rose-600 shadow-[0_0_15px_rgba(244,63,94,0.5)]" />
                )}
                
                <div className="w-16 flex-shrink-0 flex items-center justify-center text-rose-500">
                  <Icon size={18} className={cn(
                    "transition-transform group-hover/btn:scale-110",
                    isActive ? "text-rose-500" : "text-slate-500 group-hover:text-slate-300"
                  )} />
                </div>

                <div className={cn(
                  "flex-1 flex items-center transition-all duration-500",
                  !isExpanded ? "opacity-0 -translate-x-4" : "opacity-100 translate-x-0"
                )}>
                  <span className="text-[10px] font-bold tracking-[0.3em] uppercase">
                    {item.label}
                  </span>
                  {isActive && <div className="ml-auto mr-6 w-1 h-1 rounded-full bg-rose-500 animate-pulse" />}
                </div>
              </button>
            );
          })}
        </nav>

        {/* System Status Rail (When Collapsed) */}
        {!isExpanded && (
          <div className="py-4 flex flex-col items-center gap-2 border-t border-white/5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            <span className="text-[8px] font-mono font-bold text-slate-700 tracking-tighter uppercase [writing-mode:vertical-rl] transform rotate-180">
              SIS::ESTÁVEL
            </span>
          </div>
        )}

        {/* Footer */}
        <div className={cn(
          "p-4 border-t border-white/5 transition-opacity duration-300",
          !isExpanded ? "opacity-0" : "opacity-100"
        )}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-900 border border-white/10 overflow-hidden">
                <img src="https://picsum.photos/seed/amandav/100/100" alt="Commander" referrerPolicy="no-referrer" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-white uppercase tracking-wider">COMANDANTE</span>
                <span className="text-[8px] font-mono text-slate-500 tracking-tighter">AMANDA</span>
              </div>
            </div>
            
            <button 
              onClick={() => {
                localStorage.removeItem('frota_auth_token');
                window.location.reload();
              }}
              className="text-[8px] font-black tracking-widest uppercase text-rose-500 hover:text-rose-400 p-2 bg-rose-500/10 rounded"
            >
              SAIR
            </button>
          </div>
        </div>
      </div>
    </div>

    {/* Mobile Bottom Navigation */}
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#050505]/90 backdrop-blur-xl border-t border-white/10 pb-safe">
      <div className="flex items-center justify-around p-2">
        {menuItems.slice(0, 4).map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "flex flex-col items-center justify-center p-2 rounded-lg min-w-[64px]",
                isActive ? "text-rose-500" : "text-slate-500"
              )}
            >
              <Icon size={20} className="mb-1" />
              <span className="text-[8px] font-black tracking-widest">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  </>
  );
}
