import React from 'react';
import { motion } from 'motion/react';
import { Lock, ShieldAlert, Cpu, TerminalSquare } from 'lucide-react';
import { cn } from '../lib/utils';

interface LoginProps {
  onLogin: () => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulated verification delay
    await new Promise(resolve => setTimeout(resolve, 1200));

    // Hardcoded Admin Credentials
    if (username.toLowerCase() === 'amanda' && password === 'comando88') {
      localStorage.setItem('frota_auth_token', 'AUTH_LEVEL_01_APPROVED');
      onLogin();
    } else {
      setError('ERRO: CREDENCIAIS_INVÁLIDAS OU ACESSO_NEGADO');
      setPassword('');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      <div className="absolute inset-0 industrial-grid opacity-20 pointer-events-none" />
      
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-rose-600/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-[#0a0a0a] border border-white/10 p-8 shadow-2xl relative">
          {/* Decorative Corner Lines */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-rose-600/50" />
          <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-rose-600/50" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-rose-600/50" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-rose-600/50" />

          {/* Header */}
          <div className="flex flex-col items-center mb-10">
            <div className="w-16 h-16 bg-white/5 border border-white/10 flex items-center justify-center mb-6">
              <TerminalSquare size={28} className="text-rose-500" />
            </div>
            <h1 className="text-3xl font-black text-white tracking-tighter uppercase text-center mb-2">
              TERMINAL_LOGS
            </h1>
            <p className="text-[10px] font-mono text-slate-500 tracking-[0.3em] uppercase">
              Acesso Restrito ao Comando
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-rose-500/10 border border-rose-500/30 p-4 flex items-start gap-3"
              >
                <ShieldAlert size={16} className="text-rose-500 mt-0.5 flex-shrink-0" />
                <p className="text-xs font-mono text-rose-500 uppercase">{error}</p>
              </motion.div>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black tracking-widest text-slate-500 uppercase">IDENTIFICAÇÃO_USUÁRIO</label>
                <input 
                  type="text"
                  required
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 px-4 py-3 text-sm font-mono text-white focus:outline-none focus:border-rose-500 transition-colors placeholder:text-slate-700"
                  placeholder="EX: AMANDA"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black tracking-widest text-slate-500 uppercase">CHAVE_CRIPTOGRÁFICA</label>
                <div className="relative">
                  <input 
                    type="password"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 px-4 py-3 text-sm font-mono text-white focus:outline-none focus:border-rose-500 transition-colors placeholder:text-slate-700"
                    placeholder="••••••••"
                  />
                  <Lock size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600" />
                </div>
              </div>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full py-4 mt-8 bg-white text-black font-black text-xs tracking-[0.3em] uppercase hover:bg-rose-600 hover:text-white transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 relative group overflow-hidden"
            >
              <div className="absolute inset-0 w-full h-full bg-rose-500 -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out" />
              <span className="relative z-10 flex items-center gap-3">
                {isLoading ? (
                  <>
                    <Cpu size={16} className="animate-spin" />
                    AUTENTICANDO...
                  </>
                ) : (
                  'INICIAR_SESSÃO'
                )}
              </span>
            </button>
          </form>

          {/* System Footer */}
          <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-between text-[8px] font-mono text-slate-600 uppercase tracking-widest">
            <span>SYS_VERSION: 1.0.4</span>
            <div className="flex items-center gap-2">
              <span>NODE_STATUS:</span>
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
