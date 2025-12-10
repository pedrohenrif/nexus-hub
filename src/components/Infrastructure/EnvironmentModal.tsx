import React, { useState, useEffect } from 'react';
import { Modal } from '../UI/Modal';
import type { ServerEnvironment, Project } from '../../types';
import { Cpu, Check } from 'lucide-react';
import { api } from '../../services/api';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
  initialData?: ServerEnvironment | null;
}

export const EnvironmentModal: React.FC<Props> = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState({ 
      name: '', accessType: 'Anydesk', accessId: '', accessPassword: '', hasFixedIp: false, notes: '',
      isActive: true, isOnPremise: false, vCPU: '', ram: '', storage: '', os: '',
      projectIds: [] as string[] // Lista de IDs selecionados para vínculo
  });
  const [availableProjects, setAvailableProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
        // 1. Carrega a lista de todos os projetos para o usuário poder selecionar
        api.getProjects().then(setAvailableProjects).catch(console.error);

        // 2. Preenche o formulário
        if (initialData) {
            setFormData({
                ...initialData,
                accessPassword: initialData.accessPassword || '',
                vCPU: initialData.vCPU || '',
                ram: initialData.ram || '',
                storage: initialData.storage || '',
                os: initialData.os || '',
                // Mapeia os projetos que já estão vinculados a esta VM para pré-selecionar
                projectIds: initialData.projects ? initialData.projects.map(p => p.id) : []
            });
        } else {
            // Reset para novo cadastro
            setFormData({ 
                name: '', accessType: 'Anydesk', accessId: '', accessPassword: '', hasFixedIp: false, notes: '',
                isActive: true, isOnPremise: false, vCPU: '', ram: '', storage: '', os: '', projectIds: []
            });
        }
    }
  }, [isOpen, initialData]);

  // Função para selecionar/deselecionar projetos
  const toggleProject = (id: string) => {
      setFormData(prev => {
          const exists = prev.projectIds.includes(id);
          return {
              ...prev,
              projectIds: exists 
                ? prev.projectIds.filter(pid => pid !== id) // Remove se já existe
                : [...prev.projectIds, id] // Adiciona se não existe
          };
      });
  };

  const handleSubmit = async () => {
      if(!formData.name || !formData.accessId) return alert("Nome e ID de acesso são obrigatórios");
      setLoading(true);
      await onSave(formData);
      setLoading(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? "Editar Ambiente" : "Novo Ambiente"}>
        <div className="space-y-5">
            
            {/* Status e Identificação */}
            <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-100">
                 <div className="flex gap-4">
                     <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input type="checkbox" checked={formData.isActive} onChange={e => setFormData({...formData, isActive: e.target.checked})} className="accent-indigo-600 w-4 h-4"/>
                        <span className={`text-sm font-medium ${formData.isActive ? 'text-green-600' : 'text-slate-400'}`}>{formData.isActive ? 'Ativo' : 'Inativo'}</span>
                     </label>
                     <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input type="checkbox" checked={formData.isOnPremise} onChange={e => setFormData({...formData, isOnPremise: e.target.checked})} className="accent-indigo-600 w-4 h-4"/>
                        <span className="text-sm font-medium text-slate-700">On-Premises</span>
                     </label>
                     <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input type="checkbox" checked={formData.hasFixedIp} onChange={e => setFormData({...formData, hasFixedIp: e.target.checked})} className="accent-indigo-600 w-4 h-4"/>
                        <span className="text-sm font-medium text-slate-700">IP Fixo</span>
                     </label>
                 </div>
            </div>

            {/* Dados Básicos */}
            <div className="flex gap-4">
                <select className="p-2 border rounded w-1/3 bg-white outline-none" value={formData.accessType} onChange={e => setFormData({...formData, accessType: e.target.value})}>
                    <option>Anydesk</option><option>TeamViewer</option><option>SSH</option><option>VPN</option><option>RDP</option><option>Web</option>
                </select>
                <input className="p-2 border rounded flex-1 outline-none" placeholder="Nome (Ex: Homologação)" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>

            {/* Acesso */}
            <div className="grid grid-cols-2 gap-4">
                <input className="p-2 border rounded w-full outline-none" placeholder="ID de Acesso / IP" value={formData.accessId} onChange={e => setFormData({...formData, accessId: e.target.value})} />
                <input className="p-2 border rounded w-full outline-none" type="text" placeholder="Senha" value={formData.accessPassword} onChange={e => setFormData({...formData, accessPassword: e.target.value})} />
            </div>
            
            {/* SEÇÃO DE VINCULAR PROJETOS */}
            <div>
                <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Vincular a Projetos</label>
                <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-3 border border-slate-200 rounded-lg bg-slate-50">
                    {availableProjects.map(proj => {
                        const isSelected = formData.projectIds.includes(proj.id);
                        return (
                            <button 
                                key={proj.id}
                                onClick={() => toggleProject(proj.id)}
                                className={`text-xs px-3 py-1.5 rounded-full border transition-all flex items-center gap-1.5 ${
                                    isSelected 
                                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm' // ESTILO QUANDO SELECIONADO
                                    : 'bg-white text-slate-600 border-slate-300 hover:border-indigo-300' // ESTILO PADRÃO
                                }`}
                                title={isSelected ? "Clique para remover vínculo" : "Clique para vincular"}
                            >
                                {isSelected ? <Check size={12} className="text-white" /> : <span className="w-3 h-3 rounded-full border border-slate-300 block"></span>}
                                
                                {/* Exibe: Cliente - Projeto (Usando o formato do getProjects que retorna client string) */}
                                <span className="font-medium">
                                    {proj.client ? `${proj.client} - ` : ''}{proj.title}
                                </span>
                            </button>
                        );
                    })}
                    {availableProjects.length === 0 && <span className="text-xs text-slate-400 italic">Nenhum projeto cadastrado.</span>}
                </div>
                <p className="text-[10px] text-slate-400 mt-1 ml-1">Selecione os projetos que utilizam esta máquina.</p>
            </div>

            {/* Recursos da VM */}
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <h4 className="text-xs font-bold text-slate-500 uppercase mb-3 flex items-center gap-1"><Cpu size={14}/> Recursos da VM</h4>
                <div className="grid grid-cols-2 gap-3 mb-3">
                    <input className="p-2 text-sm border rounded outline-none" placeholder="vCPU" value={formData.vCPU} onChange={e => setFormData({...formData, vCPU: e.target.value})} />
                    <input className="p-2 text-sm border rounded outline-none" placeholder="RAM" value={formData.ram} onChange={e => setFormData({...formData, ram: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <input className="p-2 text-sm border rounded outline-none" placeholder="Storage" value={formData.storage} onChange={e => setFormData({...formData, storage: e.target.value})} />
                    <input className="p-2 text-sm border rounded outline-none" placeholder="OS" value={formData.os} onChange={e => setFormData({...formData, os: e.target.value})} />
                </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
                <button onClick={onClose} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded">Cancelar</button>
                <button onClick={handleSubmit} disabled={loading} className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">{loading ? 'Salvando...' : 'Salvar'}</button>
            </div>
        </div>
    </Modal>
  );
};