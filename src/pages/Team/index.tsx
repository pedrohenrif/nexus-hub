import React, { useEffect, useState } from 'react';
import { Users, CheckCircle, Trash2, Shield, Clock, Search, KeyRound, AlertCircle } from 'lucide-react';
import { api } from '../../services/api';
import type { User, UserRole } from '../../types';
import toast from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth'; // <--- Importação do Hook de Permissão

// Lista de cargos disponíveis para seleção
const ROLES: UserRole[] = ['DIRETOR', 'DESENVOLVEDOR', 'INFRA', 'COORDENADOR', 'COMERCIAL', 'ADMIN', 'USER'];

export default function TeamPage() {
  const { isAdmin } = useAuth(); // <--- Verifica se é Admin, Diretor ou Dev
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await api.getUsers();
      setUsers(data);
    } catch (error) {
      toast.error('Erro ao carregar equipe.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadUsers(); }, []);

  // Aprovar Usuário (Ativar Conta)
  const handleApproveUser = async (user: User) => {
      if (!isAdmin) return; // Proteção extra
      await toast.promise(
          api.updateUserStatus(user.id, 'ACTIVATE_USER'),
          { loading: 'Ativando...', success: 'Conta ativada!', error: 'Erro ao ativar.' }
      );
      loadUsers();
  };

  // Aprovar Troca de Senha
  const handleApprovePassword = async (user: User) => {
      if (!isAdmin) return;
      if (confirm(`Aprovar nova senha para ${user.name}?`)) {
          await toast.promise(
              api.updateUserStatus(user.id, 'APPROVE_PASSWORD'),
              { loading: 'Atualizando...', success: 'Senha atualizada!', error: 'Erro.' }
          );
          loadUsers();
      }
  };

  const handleDelete = async (id: string) => {
      if (!isAdmin) return;
      if (confirm('Tem certeza que deseja remover este usuário?')) {
          try {
            await api.deleteUser(id);
            toast.success('Usuário removido.');
            setUsers(prev => prev.filter(u => u.id !== id));
          } catch {
            toast.error('Erro ao remover.');
          }
      }
  };

  // Função para mudar o cargo
  const handleChangeRole = async (user: User, newRole: string) => {
      if (!isAdmin) {
          toast.error("Você não tem permissão para alterar cargos.");
          return;
      }
      try {
          await api.updateUser(user.id, { role: newRole as UserRole });
          toast.success(`Cargo de ${user.name} alterado para ${newRole}`);
          loadUsers(); 
      } catch {
          toast.error('Erro ao alterar cargo.');
      }
  };

  const filteredUsers = users.filter(u => 
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-slate-50">
       <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <h2 className="text-xl font-bold text-slate-800">Gestão da Equipe</h2>
          <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input type="text" placeholder="Buscar membro..." className="pl-10 pr-4 py-2 bg-slate-100 border-none rounded-full text-sm outline-none w-64" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
       </header>

       <div className="flex-1 overflow-y-auto p-8">
          {loading ? <div className="text-center text-slate-400 mt-10">Carregando...</div> : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredUsers.map(user => (
                    <div key={user.id} className={`bg-white p-6 rounded-xl border shadow-sm transition-all ${user.status === 'PENDING' ? 'border-orange-200 ring-2 ring-orange-100' : 'border-slate-200'}`}>
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold text-white ${user.status === 'PENDING' ? 'bg-orange-400' : 'bg-indigo-600'}`}>
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800">{user.name}</h3>
                                    <p className="text-xs text-slate-500">{user.email}</p>
                                </div>
                            </div>
                            
                            {/* AÇÕES: Só aparecem se for ADMIN/DIRETOR/DEV */}
                            {isAdmin && (
                                <div className="flex gap-1">
                                    {user.status === 'PENDING' && (
                                        <button onClick={() => handleApproveUser(user)} className="p-2 text-green-600 hover:bg-green-50 rounded-full" title="Aprovar"><CheckCircle size={20} /></button>
                                    )}
                                    {user.tempPassword && (
                                        <button onClick={() => handleApprovePassword(user)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-full animate-pulse" title="Aprovar Senha"><KeyRound size={20} /></button>
                                    )}
                                    <button onClick={() => handleDelete(user.id)} className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full"><Trash2 size={18} /></button>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col gap-3 mt-2">
                            <div className="flex items-center gap-2">
                                {user.status === 'PENDING' ? (
                                    <span className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-full flex items-center gap-1 font-medium"><Clock size={12}/> Pendente</span>
                                ) : (
                                    <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full flex items-center gap-1 font-medium"><CheckCircle size={12}/> Ativo</span>
                                )}
                                {user.tempPassword && <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full flex items-center gap-1 font-medium"><AlertCircle size={12}/> Senha?</span>}
                            </div>

                            {/* SELETOR DE CARGO: Desabilitado se não for Admin */}
                            <div className={`flex items-center gap-2 bg-slate-50 p-2 rounded border ${isAdmin ? 'border-slate-100' : 'border-transparent bg-transparent pl-0'}`}>
                                <Shield size={14} className="text-slate-400"/>
                                <select 
                                    className={`bg-transparent text-xs font-medium text-slate-700 outline-none w-full ${isAdmin ? 'cursor-pointer' : 'cursor-not-allowed appearance-none'}`}
                                    value={user.role}
                                    onChange={(e) => handleChangeRole(user, e.target.value)}
                                    disabled={!isAdmin} // Bloqueia o select
                                >
                                    {ROLES.map(role => (
                                        <option key={role} value={role}>{role}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
          )}
       </div>
    </div>
  );
}