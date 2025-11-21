import React, { useEffect, useState } from 'react';
import { Users, CheckCircle, XCircle, Trash2, Shield, Clock, Search } from 'lucide-react';
import { api } from '../../services/api';
import type { User } from '../../types';
import toast from 'react-hot-toast';

export default function TeamPage() {
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

  const handleApprove = async (user: User) => {
      await toast.promise(
          api.updateUserStatus(user.id, 'ACTIVATE_USER'),
          { loading: 'Aprovando...', success: 'Acesso liberado!', error: 'Erro ao aprovar.' }
      );
      loadUsers();
  };

  const handleDelete = async (id: string) => {
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
                            <div className="flex gap-1">
                                {user.status === 'PENDING' && (
                                    <button onClick={() => handleApprove(user)} className="p-2 text-green-600 hover:bg-green-50 rounded-full" title="Aprovar Acesso">
                                        <CheckCircle size={20} />
                                    </button>
                                )}
                                <button onClick={() => handleDelete(user.id)} className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 mb-4">
                            {user.status === 'PENDING' ? (
                                <span className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-full flex items-center gap-1 font-medium"><Clock size={12}/> Aguardando Aprovação</span>
                            ) : (
                                <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full flex items-center gap-1 font-medium"><CheckCircle size={12}/> Ativo</span>
                            )}
                            <span className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded-full flex items-center gap-1"><Shield size={12}/> {user.role}</span>
                        </div>

                        <div className="text-xs text-slate-400 border-t border-slate-100 pt-3 flex justify-between">
                            <span>Criado em {new Date(user.createdAt).toLocaleDateString()}</span>
                            <span>{user._count?.projects || 0} Projetos</span>
                        </div>
                    </div>
                ))}
            </div>
          )}
       </div>
    </div>
  );
}