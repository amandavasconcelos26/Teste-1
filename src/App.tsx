/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import FleetList from './components/FleetList';
import CrewManagement from './components/CrewManagement';
import Operations from './components/Operations';
import Finance from './components/Finance';
import UserManagement from './components/UserManagement';
import Login from './components/Login';
import { Search, Bell, User, KeyRound, X } from 'lucide-react';
import { cn } from './lib/utils';
import { api } from './lib/api';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(
    localStorage.getItem('frota_auth_token') === 'AUTH_LEVEL_01_APPROVED'
  );
  const [activeTab, setActiveTab] = React.useState('dashboard');
  
  // Profile Modal State
  const [isProfileModalOpen, setIsProfileModalOpen] = React.useState(false);
  const [newPassword, setNewPassword] = React.useState('');
  const [isLoadingPassword, setIsLoadingPassword] = React.useState(false);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const userId = localStorage.getItem('frota_current_userid');
    if (!userId || !newPassword) return;
    
    setIsLoadingPassword(true);
    try {
      await api.updateUser(userId, { password: newPassword });
      setIsProfileModalOpen(false);
      setNewPassword('');
      alert("SENHA ALTERADA COM SUCESSO");
    } catch (err) {
      console.error(err);
      alert("FALHA AO ALTERAR SENHA");
    } finally {
      setIsLoadingPassword(false);
    }
  };

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'fleet':
        return <FleetList />;
      case 'drivers':
        return <CrewManagement />;
      case 'trips':
        return <Operations />;
      case 'expenses':
        return <Finance />;
      case 'users':
        return <UserManagement />;
      case 'analysis':
        return (
          <div className="flex flex-col items-center justify-center h-[60vh] text-slate-500 font-mono tracking-tighter uppercase gap-4 text-sm animate-pulse">
            <span>[ CONSTRUINDO MÓDULO ANÁLISE ESTRATÉGICA ]</span>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  const username = localStorage.getItem('frota_current_username') || 'USUÁRIO';
  const role = localStorage.getItem('frota_current_role') || 'user';

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
              TERMINAL NODE ACTIVE
            </div>
            <div className="h-4 w-px bg-white/10 hidden md:block"></div>
            <div className="flex items-center gap-2 text-[10px] font-mono text-slate-600 uppercase tracking-tighter">
              LOC::SAO_PAULO_ZONE_1
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setIsProfileModalOpen(true)}>
              <div className="text-right hidden sm:block">
                <p className="text-[10px] font-black text-white tracking-widest uppercase group-hover:text-amber-500 transition-colors">{username}</p>
                <p className={cn(
                  "text-[9px] font-mono tracking-tighter uppercase opacity-70 group-hover:opacity-100 transition-opacity",
                  role === 'admin' ? "text-rose-500" : "text-emerald-500"
                )}>
                  {role === 'admin' ? 'ADMINISTRADOR' : 'OPERACIONAL'}
                </p>
              </div>
              <div className="w-8 h-8 rounded-sm bg-rose-600 overflow-hidden ring-1 ring-rose-500/50 group-hover:ring-amber-500 transition-colors flex items-center justify-center">
                <User size={16} className="text-white" />
              </div>
            </div>
          </div>
        </header>

        <main className="p-8 pb-20 max-w-7xl mx-auto">
          {renderContent()}
        </main>
      </div>

      {/* Change My Password Modal */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#050505] border border-amber-500/30 p-8 w-full max-w-md relative shadow-[0_0_50px_rgba(245,158,11,0.1)]">
            <button 
              onClick={() => setIsProfileModalOpen(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
            >
              <X size={16} />
            </button>
            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
              <KeyRound size={80} className="text-amber-500" />
            </div>
            
            <h3 className="text-xl font-black text-white tracking-tighter mb-6">MEU PERFIL :: SEGURANÇA</h3>
            <p className="text-[10px] text-slate-400 font-mono tracking-widest uppercase mb-6">ATUALIZE A SUA CHAVE MESTRA DE ACESSO</p>
            
            <form onSubmit={handleUpdatePassword} className="space-y-4 relative z-10">
              <div>
                <label className="text-[10px] font-black tracking-widest text-amber-500 uppercase block mb-2">NOVA SENHA DE ACESSO</label>
                <input 
                  type="password" 
                  required
                  autoFocus
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  className="w-full bg-white/5 border border-amber-500/50 px-4 py-3 text-white focus:outline-none focus:border-amber-400 transition-colors font-mono tracking-widest"
                  placeholder="********"
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button 
                  type="submit"
                  disabled={isLoadingPassword || !newPassword}
                  className="w-full py-4 bg-amber-600 hover:bg-amber-500 text-black font-black text-[10px] tracking-widest uppercase transition-colors disabled:opacity-50"
                >
                  {isLoadingPassword ? 'PROCESSANDO...' : 'REGISTRAR NOVA SENHA'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

