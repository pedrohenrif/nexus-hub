import React, { useState, useEffect } from 'react';
import { UserPlus, ArrowLeft } from 'lucide-react'; 
import { Modal } from '../UI/Modal';
import { api } from '../../services/api';
import type { Project, Module, Client, User } from '../../types';
import toast from 'react-hot-toast'; 
import { useAuth } from '../../hooks/useAuth';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const initialFormData = { 
    clientId: '', 
    ownerId: '', // <--- NOVO: Campo de dono
    title: '', 
    type: 'Projeto' as 'Projeto' | 'Suporte', 
    status: 'Em Andamento' as Project['status'], 
    modules: [] as Module[] 
};

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState(initialFormData);
  const [clients, setClients] = useState<Client[]>([]);
  const [users, setUsers] = useState<User[]>([]); // Lista de usuários para seleção
  const [loading, setLoading] = useState(false);
  
  const [isCreatingClient, setIsCreatingClient] = useState(false);
  const [newClientName, setNewClientName] = useState('');
  const [newClientCode, setNewClientCode] = useState('');

  useEffect(() => {
    if (isOpen) {
      // Carrega clientes e usuários simultaneamente
      Promise.all([api.getClients(), api.getUsers()])
        .then(([clientsData, usersData]) => {
            setClients(clientsData);
            setUsers(usersData);
        })
        .catch(console.error);

      // Reseta o form e define o usuário logado como dono padrão
      setFormData({
          ...initialFormData,
          ownerId: user?.id || ''
      });
      setIsCreatingClient(false);
    }
  }, [isOpen, user]);

  const handleCreateClient = async () => {
      if(!newClientName || !newClientCode) return;
      try {
          const newClient = await toast.promise(
              api.createClient(newClientName, newClientCode),
              {
                  loading: 'Criando cliente...',
                  success: 'Cliente criado com sucesso!',
                  error: 'Erro ao criar cliente. Código duplicado?',
              }
          );
          
          setClients(prev => [...prev, newClient]);
          setFormData(prev => ({ ...prev, clientId: newClient.id })); 
          setIsCreatingClient(false);
          setNewClientName('');
          setNewClientCode('');
      } catch (error) {
          console.error(error);
      }
  };

  const handleSubmit = async () => {
    if (!formData.clientId || !formData.title) {
        toast.error("Preencha o cliente e o título."); 
        return;
    }
    try {
      setLoading(true);
      await api.createProject(formData);
      toast.success("Projeto criado com sucesso!"); 
      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao salvar projeto.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Cadastrar Novo Projeto">
        <div className="space-y-6">
          
          {/* SELEÇÃO DE CLIENTE */}
          <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
              <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-bold text-indigo-900">Cliente</label>
                  {!isCreatingClient ? (
                      <button onClick={() => setIsCreatingClient(true)} className="text-xs flex items-center gap-1 text-indigo-600 hover:underline font-medium"><UserPlus size={14} /> Novo Cliente</button>
                  ) : (
                      <button onClick={() => setIsCreatingClient(false)} className="text-xs flex items-center gap-1 text-indigo-600 hover:underline font-medium"><ArrowLeft size={14} /> Voltar</button>
                  )}
              </div>
              {!isCreatingClient ? (
                  <select 
                    className="w-full p-2.5 border border-indigo-200 rounded-lg bg-white outline-none focus:border-indigo-500" 
                    value={formData.clientId} 
                    onChange={e => setFormData({...formData, clientId: e.target.value})}
                  >
                      <option value="">Selecione um cliente...</option>
                      {clients.map(c => <option key={c.id} value={c.id}>{c.name} ({c.internalCode})</option>)}
                  </select>
              ) : (
                  <div className="flex gap-2">
                      <input type="text" placeholder="Nome (Ex: Coca Cola)" className="flex-1 p-2 border border-indigo-200 rounded outline-none text-sm bg-white" value={newClientName} onChange={e => setNewClientName(e.target.value)} />
                      <input type="text" placeholder="Cód. (Ex: CC_01)" className="w-24 p-2 border border-indigo-200 rounded outline-none text-sm uppercase bg-white" value={newClientCode} onChange={e => setNewClientCode(e.target.value)} />
                      <button onClick={handleCreateClient} disabled={!newClientName} className="bg-indigo-600 text-white px-3 rounded text-sm font-bold hover:bg-indigo-700 disabled:opacity-50">OK</button>
                  </div>
              )}
          </div>

          {/* DADOS BÁSICOS */}
          <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="text-sm font-medium text-slate-700">Projeto</label>
                <input className="w-full p-2.5 border border-slate-300 rounded-lg outline-none focus:border-indigo-500" placeholder="Nome do Projeto" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
            </div>
            
            {/* SELETOR DE RESPONSÁVEL (NOVO) */}
            <div>
                <label className="text-sm font-medium text-slate-700">Responsável</label>
                <select 
                    className="w-full p-2.5 border border-slate-300 rounded-lg bg-white outline-none focus:border-indigo-500" 
                    value={formData.ownerId} 
                    onChange={e => setFormData({...formData, ownerId: e.target.value})}
                >
                    {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                </select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="text-sm font-medium text-slate-700">Tipo de Demanda</label>
                <select 
                    className="w-full p-2.5 border border-slate-300 rounded-lg bg-white outline-none focus:border-indigo-500" 
                    value={formData.type} 
                    onChange={e => setFormData({...formData, type: e.target.value as any})}
                >
                    <option>Projeto</option>
                    <option>Suporte</option>
                </select>
            </div>
             <div>
                <label className="text-sm font-medium text-slate-700">Status</label>
                <select 
                  className="w-full p-2.5 border border-slate-300 rounded-lg bg-white outline-none focus:border-indigo-500" 
                  value={formData.status} 
                  onChange={e => setFormData({...formData, status: e.target.value as any})}
                >
                    <option>Em Andamento</option>
                    <option>Planejamento</option>
                    <option>Produção</option>
                    <option>Concluído</option>
                    <option>Manutenção</option>
                </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <button onClick={onClose} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium">Cancelar</button>
            <button onClick={handleSubmit} disabled={loading} className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-lg disabled:opacity-50 font-medium">
                {loading ? 'Criando...' : 'Criar Projeto'}
            </button>
          </div>
        </div>
    </Modal>
  );
};