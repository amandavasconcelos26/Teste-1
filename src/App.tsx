/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import FleetList from './components/FleetList';
import CrewManagement from './components/CrewManagement';
import { Search, Bell, User } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = React.useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'fleet':
        return <FleetList />;
      case 'drivers':
        return <CrewManagement />;
      case 'trips':
      case 'expenses':
      case 'analysis':
        return (
          <div className="flex flex-col items-center justify-center h-[60vh] text-slate-500 font-mono tracking-tighter uppercase gap-4 text-sm animate-pulse">
            <span>[ CONSTRUINDO_MÓDULO : {activeTab} ]</span>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] font-sans text-slate-300 selection:bg-rose-500 selection:text-white relative">
      <div className="absolute inset-0 industrial-grid opacity-20 pointer-events-none" />
      
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="lg:pl-16 min-h-screen relative z-10">
        {/* Top bar (Futuristic Variant) */}
        <header className="h-16 border-b border-white/5 sticky top-0 z-30 px-8 flex items-center justify-between bg-[#050505]/80 backdrop-blur-md">
          <div className="flex items-center gap-6 flex-1">
            <div className="hidden md:flex items-center gap-2 text-[10px] font-bold text-slate-500 tracking-[0.2em] uppercase">
              <div className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse shadow-[0_0_8px_rgba(244,63,94,0.5)]" />
              TERMINAL_NODE_ACTIVE
            </div>
            <div className="h-4 w-px bg-white/10 hidden md:block"></div>
            <div className="flex items-center gap-2 text-[10px] font-mono text-slate-600 uppercase tracking-tighter">
              LOC::SAO_PAULO_ZONE_1
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-[10px] font-black text-white tracking-widest uppercase">COMMANDER_AV</p>
                <p className="text-[9px] font-mono text-rose-500 tracking-tighter uppercase opacity-70">AUTH_LEVEL_01</p>
              </div>
              <div className="w-8 h-8 rounded-sm bg-rose-600 overflow-hidden ring-1 ring-rose-500/50">
                <img src="https://picsum.photos/seed/amandav/100/100" alt="Avatar" referrerPolicy="no-referrer" />
              </div>
            </div>
          </div>
        </header>

        <main className="p-8 pb-20 max-w-7xl mx-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

