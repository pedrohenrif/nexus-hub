import React, { useState, useEffect } from 'react';
import { Modal } from '../UI/Modal';
import { api } from '../../services/api';
import type { Project, Client, User } from '../../types';
import toast from 'react-hot-toast';

interface EditProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
  onUpdate: () => void;
}

export const EditProjectModal: React.FC<EditProjectModalProps> = ({ isOpen, onClose, project, onUpdate }) => {
  const [title, setTitle] = useState(project.title);
  const [status, setStatus] = useState(project.status);
  const [type, setType] = useState<'Projeto' | 'Suporte'>(project.type as any || 'Projeto');
  const [clientId, setClientId] = useState(project.clientId || '');
  const [ownerId, setOwnerId] = useState(project.ownerId || project.createdBy?.id || ''); // <--- Carrega dono
  
  const [clients, setClients] = useState<Client[]>([]);
  const [users, setUsers] = useState<User[]>([]); // Lista de usuários para trocar dono
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTitle(project.title);
      setStatus(project.status);
      setType(project.type as any || 'Projeto');
      setClientId(project.clientId || '');
      setOwnerId(project.ownerId || project.createdBy?.id || ''); // Prioriza ownerId
      
      // Carrega clientes e usuários
      Promise.all([api.getClients(), api.getUsers()])
        .then(([c, u]) => { setClients(c); setUsers(u); })
        .catch(console.error);
    }
  }, [isOpen, project]);

  const handleSubmit = async () => {
    if (!title || !clientId) return toast.error("Título e Cliente são obrigatórios.");
    
    try {
      setLoading(true);
      // Envia o novo ownerId na atualização
      await api.updateProject(project.id, { title, status, clientId, type, ownerId });
      toast.success("Projeto atualizado!");
      onUpdate();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao atualizar projeto.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Editar Projeto">
      <div className="space-y-4">
        <div>
            <label className="text-sm font-medium text-slate-700">Nome do Projeto</label>
            <input 
                className="w-full p-2.5 border border-slate-300 rounded-lg outline-none focus:border-indigo-500" 
                value={title} 
                onChange={e => setTitle(e.target.value)} 
            />
        </div>

        <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="text-sm font-medium text-slate-700">Cliente</label>
                <select 
                    className="w-full p-2.5 border border-slate-300 rounded-lg bg-white outline-none focus:border-indigo-500"
                    value={clientId}
                    onChange={e => setClientId(e.target.value)}
                >
                    <option value="" disabled>Selecione...</option>
                    {clients.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                </select>
            </div>
            
            {/* SELETOR DE RESPONSÁVEL (NOVO) */}
            <div>
                <label className="text-sm font-medium text-slate-700">Responsável</label>
                <select 
                    className="w-full p-2.5 border border-slate-300 rounded-lg bg-white outline-none focus:border-indigo-500"
                    value={ownerId}
                    onChange={e => setOwnerId(e.target.value)}
                >
                    <option value="">Selecione...</option>
                    {users.map(u => (
                        <option key={u.id} value={u.id}>{u.name}</option>
                    ))}
                </select>
            </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="text-sm font-medium text-slate-700">Tipo de Demanda</label>
                <select 
                    className="w-full p-2.5 border border-slate-300 rounded-lg bg-white outline-none focus:border-indigo-500"
                    value={type}
                    onChange={e => setType(e.target.value as any)}
                >
                    <option>Projeto</option>
                    <option>Suporte</option>
                </select>
            </div>
            
            <div>
                <label className="text-sm font-medium text-slate-700">Status</label>
                <select 
                    className="w-full p-2.5 border border-slate-300 rounded-lg bg-white outline-none focus:border-indigo-500"
                    value={status}
                    onChange={e => setStatus(e.target.value as any)}
                >
                    <option>Em Andamento</option>
                    <option>Planejamento</option>
                    <option>Produção</option>
                    <option>Concluído</option>
                    <option>Manutenção</option>
                </select>
            </div>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
          <button onClick={onClose} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium">Cancelar</button>
          <button 
            onClick={handleSubmit} 
            disabled={loading} 
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-bold disabled:opacity-50"
          >
            {loading ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </div>
      </div>
    </Modal>
  );
};