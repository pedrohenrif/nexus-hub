import React, { useState, useEffect } from 'react';
import { Modal } from '../UI/Modal';
import { api } from '../../services/api';
import type { Project, Client } from '../../types';
import toast from 'react-hot-toast';

interface EditProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
  onUpdate: () => void; // Callback para recarregar a página
}

export const EditProjectModal: React.FC<EditProjectModalProps> = ({ isOpen, onClose, project, onUpdate }) => {
  const [title, setTitle] = useState(project.title);
  const [status, setStatus] = useState(project.status);
  const [clientId, setClientId] = useState(project.clientId || '');
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);

  // Carrega clientes e dados iniciais quando abre
  useEffect(() => {
    if (isOpen) {
      setTitle(project.title);
      setStatus(project.status);
      setClientId(project.clientId || '');
      
      api.getClients().then(setClients).catch(console.error);
    }
  }, [isOpen, project]);

  const handleSubmit = async () => {
    if (!title || !clientId) return toast.error("Título e Cliente são obrigatórios.");
    
    try {
      setLoading(true);
      await api.updateProject(project.id, { title, status, clientId });
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

        <div className="space-y-4">
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