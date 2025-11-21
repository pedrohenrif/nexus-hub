import React, { useState, useEffect } from 'react';
import { Modal } from '../../UI/Modal';
import type { Module } from '../../../types';

interface AddModuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (moduleData: Partial<Module>) => Promise<void>;
  initialData?: Module | null; // Nova prop para edição
}

const defaultModule: Partial<Module> = {
  type: 'API',
  name: '',
  description: '',
  techStack: '',
  repoUrl: '',
  installCmd: '',
  infraDetails: ''
};

export const AddModuleModal: React.FC<AddModuleModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [moduleData, setModuleData] = useState(defaultModule);
  const [loading, setLoading] = useState(false);

  // Efeito para carregar os dados se for edição ou resetar se for novo
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setModuleData(initialData);
      } else {
        setModuleData(defaultModule);
      }
    }
  }, [isOpen, initialData]);

  const handleSubmit = async () => {
    if (!moduleData.name) return alert("O nome do módulo é obrigatório.");
    
    try {
      setLoading(true);
      await onSave(moduleData);
      onClose();
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar módulo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? "Editar Módulo" : "Adicionar Novo Módulo"}>
      <div className="space-y-4">
        <div className="flex gap-3">
          <div className="w-1/3">
            <label className="text-xs font-medium text-slate-500 mb-1 block">Tipo</label>
            <select 
              className="w-full p-2 text-sm border border-slate-300 rounded bg-white outline-none focus:border-indigo-500 transition-colors"
              value={moduleData.type}
              onChange={e => setModuleData({...moduleData, type: e.target.value as any})}
            >
              <option>API</option><option>Automação</option><option>Bot</option><option>Site</option><option>Script</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="text-xs font-medium text-slate-500 mb-1 block">Nome</label>
            <input 
              className="w-full p-2 text-sm border border-slate-300 rounded outline-none focus:border-indigo-500 transition-colors"
              placeholder="Ex: API de Pagamentos"
              value={moduleData.name}
              onChange={e => setModuleData({...moduleData, name: e.target.value})}
            />
          </div>
        </div>

        <div className="space-y-3">
            <input 
              className="w-full p-2 text-sm border border-slate-300 rounded outline-none focus:border-indigo-500 transition-colors"
              placeholder="Stack (Ex: Node.js, React)"
              value={moduleData.techStack || ''}
              onChange={e => setModuleData({...moduleData, techStack: e.target.value})}
            />
            <input 
              className="w-full p-2 text-sm border border-slate-300 rounded outline-none focus:border-indigo-500 transition-colors"
              placeholder="Repositório Git"
              value={moduleData.repoUrl || ''}
              onChange={e => setModuleData({...moduleData, repoUrl: e.target.value})}
            />
             <textarea 
              className="w-full p-2 text-sm border border-slate-300 rounded outline-none h-20 resize-none focus:border-indigo-500 transition-colors"
              placeholder="Descrição breve..."
              value={moduleData.description || ''}
              onChange={e => setModuleData({...moduleData, description: e.target.value})}
            />
             <div className="grid grid-cols-2 gap-3">
                <textarea 
                  className="w-full p-2 text-xs font-mono border border-slate-300 rounded outline-none h-20 bg-slate-50 focus:border-indigo-500 transition-colors"
                  placeholder="Cmd Instalação..."
                  value={moduleData.installCmd || ''}
                  onChange={e => setModuleData({...moduleData, installCmd: e.target.value})}
                />
                <textarea 
                  className="w-full p-2 text-xs font-mono border border-slate-300 rounded outline-none h-20 bg-slate-50 focus:border-indigo-500 transition-colors"
                  placeholder="Detalhes de Infra..."
                  value={moduleData.infraDetails || ''}
                  onChange={e => setModuleData({...moduleData, infraDetails: e.target.value})}
                />
             </div>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
          <button onClick={onClose} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-medium transition-colors">Cancelar</button>
          <button 
            onClick={handleSubmit} 
            disabled={loading || !moduleData.name}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-bold disabled:opacity-50 transition-colors shadow-sm"
          >
            {loading ? 'Salvando...' : (initialData ? 'Salvar Alterações' : 'Adicionar Módulo')}
          </button>
        </div>
      </div>
    </Modal>
  );
};