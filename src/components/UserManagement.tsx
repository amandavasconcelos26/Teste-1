import React from 'react';
import { ShieldAlert, Plus, Trash2, KeyRound, User, LockKeyhole, Ban, CheckCircle } from 'lucide-react';
import { api } from '../lib/api';
import { cn } from '../lib/utils';

export default function UserManagement() {
  const [users, setUsers] = React.useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = React.useState(false);
  const [selectedUserId, setSelectedUserId] = React.useState<string | null>(null);
  const [newPassword, setNewPassword] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  const [formData, setFormData] = React.useState({
    username: '',
    password: '',
    role: 'user',
    status: 'active'
  });

  const fetchUsers = React.useCallback(async () => {
    try {
      const data = await api.getUsers();
      setUsers(data);
    } catch (e) {
      console.error("FALHA AO CARREGAR:", e);
    }
  }, []);

  React.useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.addUser(formData);
      setIsModalOpen(false);
      setFormData({ username: '', password: '', role: 'user', status: 'active' });
      fetchUsers();
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId) return;
    setIsLoading(true);
    try {
      await api.updateUser(selectedUserId, { password: newPassword });
      setIsPasswordModalOpen(false);
      setNewPassword('');
      setSelectedUserId(null);
      fetchUsers();
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleStatus = async (id: string, currentStatus: string) => {
    try {
      await api.updateUser(id, { status: currentStatus === 'active' ? 'blocked' : 'active' });
      fetchUsers();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("ATENÇÃO: Deseja realmente excluir este usuário do sistema?")) {
      try {
        await api.deleteUser(id);
        fetchUsers();
      } catch (e) {
        console.error(e);
      }
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-700">
      <div className="flex justify-between items-end border-b border-white/5 pb-8">
        <div>
          <h1 className="text-[10px] font-black tracking-[0.4em] text-emerald-500 uppercase mb-2">GERENCIAMENTO DE ACESSO</h1>
          <h2 className="text-4xl font-black text-white tracking-tighter">SISTEMA :: USUÁRIOS</h2>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="group relative px-6 py-3 bg-white text-black font-black text-xs tracking-widest uppercase hover:bg-emerald-600 hover:text-white transition-all duration-300"
        >
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500" />
          <span className="flex items-center gap-3">
            <Plus size={14} strokeWidth={3} />
            NOVO USUÁRIO
          </span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5 border border-white/5 shadow-2xl">
        {users.map(user => (
          <div key={user.id} className="bg-[#050505] p-6 hover:bg-white/[0.02] transition-colors relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity pointer-events-none">
              <ShieldAlert size={80} className="text-emerald-500" />
            </div>
            
            <div className="flex flex-col gap-6 relative z-10 w-full h-full">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 bg-slate-900 border border-white/10 flex items-center justify-center">
                    <User size={16} className={user.role === 'admin' ? "text-rose-500" : "text-slate-400"} />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white tracking-tight uppercase truncate">{user.username}</h3>
                    <div className="flex gap-2 mt-1">
                      <span className={cn(
                        "text-[8px] font-black tracking-[0.2em] px-2 py-0.5 uppercase border",
                        user.role === 'admin' ? "text-rose-500 border-rose-500/20 bg-rose-500/10" : "text-emerald-500 border-emerald-500/20 bg-emerald-500/10"
                      )}>
                        PERFIL: {user.role.toUpperCase()}
                      </span>
                      <span className={cn(
                        "text-[8px] font-black tracking-[0.2em] px-2 py-0.5 uppercase border",
                        user.status === 'blocked' ? "text-amber-500 border-amber-500/20 bg-amber-500/10" : "text-slate-400 border-white/10 bg-white/5"
                      )}>
                        {user.status === 'blocked' ? 'BLOQUEADO' : 'ATIVO'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-2 mt-auto pt-4 border-t border-white/5">
                {user.id !== "1" && ( /* Prevent blocking the main admin */
                  <button
                    onClick={() => toggleStatus(user.id, user.status)}
                    className="w-8 h-8 flex items-center justify-center bg-white/5 hover:bg-amber-600 transition-colors group/btn"
                    title={user.status === 'active' ? "Bloquear Acesso" : "Liberar Acesso"}
                  >
                    {user.status === 'active' ? (
                      <Ban size={14} className="text-slate-400 group-hover/btn:text-white" />
                    ) : (
                      <CheckCircle size={14} className="text-amber-500 group-hover/btn:text-white" />
                    )}
                  </button>
                )}
                <button
                  onClick={() => {
                    setSelectedUserId(user.id);
                    setIsPasswordModalOpen(true);
                  }}
                  className="w-8 h-8 flex items-center justify-center bg-white/5 hover:bg-emerald-600 transition-colors group/btn"
                  title="Alterar Senha"
                >
                  <KeyRound size={14} className="text-slate-400 group-hover/btn:text-white" />
                </button>
                {user.id !== "1" && ( /* Prevent deleting the main admin */
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="w-8 h-8 flex items-center justify-center bg-white/5 hover:bg-rose-600 transition-colors group/btn"
                    title="Excluir Usuário"
                  >
                    <Trash2 size={14} className="text-slate-400 group-hover/btn:text-white" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* New User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#050505] border border-white/10 p-8 w-full max-w-md relative">
            <h3 className="text-xl font-black text-white tracking-tighter mb-6">REGISTRAR NOVO ACESSO</h3>
            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label className="text-[10px] font-black tracking-widest text-slate-500 uppercase block mb-2">IDENTIFICAÇÃO (LOGIN)</label>
                <input 
                  type="text" 
                  required
                  value={formData.username}
                  onChange={e => setFormData({...formData, username: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
              <div>
                <label className="text-[10px] font-black tracking-widest text-slate-500 uppercase block mb-2">CHAVE DE ACESSO (SENHA)</label>
                <input 
                  type="password" 
                  required
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors font-mono tracking-widest"
                />
              </div>
              <div>
                <label className="text-[10px] font-black tracking-widest text-slate-500 uppercase block mb-2">NÍVEL DE PERMISSÃO</label>
                <select 
                  value={formData.role}
                  onChange={e => setFormData({...formData, role: e.target.value})}
                  className="w-full bg-[#0a0a0a] border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                >
                  <option value="user">OPERACIONAL P/ LEITURA</option>
                  <option value="admin">ADMINISTRADOR TOTAL</option>
                </select>
              </div>
              <div className="flex gap-4 pt-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-slate-300 font-black text-[10px] tracking-widest uppercase transition-colors"
                >
                  CANCELAR
                </button>
                <button 
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-[10px] tracking-widest uppercase transition-colors disabled:opacity-50"
                >
                  {isLoading ? 'PROCESSANDO...' : 'CONFIRMAR ACESSO'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#050505] border border-emerald-500/30 p-8 w-full max-w-md relative shadow-[0_0_50px_rgba(16,185,129,0.1)]">
            <div className="absolute top-0 right-0 p-4 opacity-20 pointer-events-none">
              <LockKeyhole size={80} className="text-emerald-500" />
            </div>
            
            <h3 className="text-xl font-black text-white tracking-tighter mb-6">ATUALIZAR CREDENCIAL</h3>
            <p className="text-[10px] text-slate-400 font-mono tracking-widest uppercase mb-6">INFORME A NOVA CHAVE DE ACESSO PARA ESTE USUÁRIO</p>
            
            <form onSubmit={handleChangePassword} className="space-y-4 relative z-10">
              <div>
                <label className="text-[10px] font-black tracking-widest text-emerald-500 uppercase block mb-2">NOVA SENHA DE ACESSO</label>
                <input 
                  type="password" 
                  required
                  autoFocus
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  className="w-full bg-white/5 border border-emerald-500/50 px-4 py-3 text-white focus:outline-none focus:border-emerald-400 transition-colors font-mono tracking-widest"
                  placeholder="********"
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button 
                  type="button"
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-slate-300 font-black text-[10px] tracking-widest uppercase transition-colors"
                >
                  CANCELAR
                </button>
                <button 
                  type="submit"
                  disabled={isLoading || !newPassword}
                  className="flex-1 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-[10px] tracking-widest uppercase transition-colors disabled:opacity-50"
                >
                  {isLoading ? 'SALVANDO...' : 'REGISTRAR SENHA'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
