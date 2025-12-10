import React, { useState, useEffect } from 'react';
import { Cloud, Server, Database, Lock, Save, Plus, Trash2, Globe, Box, Cpu, Copy, Shield, Monitor, HardDrive } from 'lucide-react';
import type { Project, InfrastructureItem, ServerEnvironment } from '../../../types';
import toast from 'react-hot-toast';

interface InfraTabProps {
  project: Project;
  onSaveDetails: (newInfraDetails: string) => Promise<void>;
  onAddItem: () => void;
  onDeleteItem: (id: string) => void;
  canEdit: boolean; // <--- Permissão para controlar visibilidade de senhas e botões
}

export const InfraTab: React.FC<InfraTabProps> = ({ project, onSaveDetails, onAddItem, onDeleteItem, canEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [infraNotes, setInfraNotes] = useState(project.infraDetails || '');
  const [saving, setSaving] = useState(false);

  useEffect(() => { setInfraNotes(project.infraDetails || ''); }, [project.infraDetails]);

  const handleSave = async () => {
    setSaving(true);
    await onSaveDetails(infraNotes);
    setIsEditing(false);
    setSaving(false);
  };

  const copyToClipboard = (text: string) => {
      navigator.clipboard.writeText(text);
      toast.success("Copiado!", { duration: 1000, icon: '📋' });
  };

  const getIcon = (cat: string) => { switch(cat) { case 'Server': return <Server size={20} className="text-orange-600"/>; case 'Database': return <Database size={20} className="text-blue-600"/>; case 'Security': return <Lock size={20} className="text-green-600"/>; case 'Network': return <Globe size={20} className="text-purple-600"/>; default: return <Box size={20} className="text-slate-600"/>; } };
  const getBgColor = (cat: string) => { switch(cat) { case 'Server': return 'bg-orange-50 group-hover:bg-orange-100'; case 'Database': return 'bg-blue-50 group-hover:bg-blue-100'; case 'Security': return 'bg-green-50 group-hover:bg-green-100'; case 'Network': return 'bg-purple-50 group-hover:bg-purple-100'; default: return 'bg-slate-50 group-hover:bg-slate-100'; } };

  return (
    <div className="space-y-8 max-w-5xl">
      
      {/* 1. SEÇÃO DE VMS VINCULADAS (Automáticas via relacionamento) */}
      {project.serverEnvironments && project.serverEnvironments.length > 0 && (
          <div>
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <Server size={20} className="text-indigo-600"/> Servidores & VMs Vinculadas
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {project.serverEnvironments.map((env: ServerEnvironment) => (
                      <div key={env.id} className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm hover:border-indigo-300 transition-all">
                          <div className="flex justify-between items-start mb-2">
                              <div>
                                  <h4 className="font-bold text-slate-800">{env.name}</h4>
                                  {/* Mostra o Servidor Pai se disponível */}
                                  <p className="text-xs text-slate-500">
                                      Servidor Pai: {env.server?.name ? `${env.server.name} (${env.server.ipAddress})` : 'Desconhecido'}
                                  </p>
                              </div>
                              <div className="flex flex-col items-end gap-1">
                                  <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded border border-indigo-100 font-medium">{env.accessType}</span>
                                  {env.hasFixedIp && <span className="text-[10px] text-green-700 bg-green-50 px-2 py-0.5 rounded border border-green-100 flex items-center gap-1"><Shield size={10}/> IP Fixo</span>}
                              </div>
                          </div>

                          <div className="space-y-2 mt-3">
                              {/* ID de Acesso */}
                              <div onClick={() => copyToClipboard(env.accessId)} className="flex justify-between items-center text-xs font-mono bg-slate-50 p-2 rounded cursor-pointer hover:bg-slate-100">
                                  <span className="text-slate-500">ID:</span>
                                  <span className="text-slate-800">{env.accessId}</span>
                                  <Copy size={12} className="text-slate-400"/>
                              </div>
                              
                              {/* SENHA PROTEGIDA */}
                              <div className="flex justify-between items-center text-xs font-mono bg-slate-50 p-2 rounded border border-slate-100">
                                  <span className="text-slate-500">Senha:</span>
                                  {canEdit ? (
                                      // Se pode editar (Admin/Infra), mostra opção de copiar
                                      <div onClick={() => copyToClipboard(env.accessPassword || '')} className="flex items-center gap-2 cursor-pointer hover:text-indigo-600">
                                          <span className="text-slate-800">••••••••</span>
                                          <Copy size={12} className="text-slate-400"/>
                                      </div>
                                  ) : (
                                      // Se não pode editar (Comercial), mostra bloqueado
                                      <span className="text-red-400 italic flex items-center gap-1"><Lock size={10}/> Restrito</span>
                                  )}
                              </div>
                              
                              {/* Recursos da VM */}
                              {(env.vCPU || env.ram || env.storage) && (
                                  <div className="flex flex-wrap gap-3 text-xs text-slate-400 pt-2 border-t border-slate-100 mt-2">
                                      {env.vCPU && <span className="flex items-center gap-1"><Cpu size={12}/> {env.vCPU}</span>}
                                      {env.ram && <span className="flex items-center gap-1"><Monitor size={12}/> {env.ram}</span>}
                                      {env.storage && <span className="flex items-center gap-1"><HardDrive size={12}/> {env.storage}</span>}
                                  </div>
                              )}
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      )}

      {/* 2. ÁREA DE TEXTO LIVRE (Notas Gerais) */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex justify-between items-center mb-4">
           <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
             <Cloud size={20} className="text-indigo-600"/> Anotações Gerais
           </h3>
           {canEdit && (
               <button 
                 onClick={() => isEditing ? handleSave() : setIsEditing(true)} 
                 className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isEditing ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
               >
                 {isEditing ? (saving ? 'Salvando...' : 'Salvar') : 'Editar'}
               </button>
           )}
        </div>
        {isEditing ? (
          <textarea 
            className="w-full h-48 p-4 border border-slate-300 rounded-lg font-mono text-sm text-slate-700 outline-none focus:border-indigo-500" 
            value={infraNotes} 
            onChange={(e) => setInfraNotes(e.target.value)} 
            placeholder="Descreva a arquitetura geral, links importantes, etc..." 
          />
        ) : (
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 min-h-[100px] whitespace-pre-wrap font-mono text-sm text-slate-700">
            {infraNotes || <span className="text-slate-400 italic">Sem anotações de infraestrutura.</span>}
          </div>
        )}
      </div>

      {/* 3. CARDS MANUAIS (Recursos Adicionais soltos) */}
      <div>
          <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-800">Recursos Adicionais</h3>
              {canEdit && (
                  <button 
                    onClick={onAddItem} 
                    className="flex items-center gap-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 px-3 py-2 rounded-lg border border-indigo-100 transition-colors"
                  >
                    <Plus size={16}/> Novo Item
                  </button>
              )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             {project.infrastructure?.map((item: InfrastructureItem) => (
                 <div key={item.id} className="bg-white p-4 rounded-xl border border-slate-200 hover:border-indigo-300 transition-colors group relative">
                    {canEdit && (
                        <button 
                          onClick={() => onDeleteItem(item.id)} 
                          className="absolute top-2 right-2 p-1.5 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <Trash2 size={14}/>
                        </button>
                    )}
                    <div className={`${getBgColor(item.category)} w-10 h-10 rounded-lg flex items-center justify-center mb-3 transition-colors`}>
                        {getIcon(item.category)}
                    </div>
                    <h4 className="font-bold text-slate-700 truncate" title={item.name}>{item.name}</h4>
                    <p className="text-xs text-slate-500 mt-1 font-mono bg-slate-50 p-1 rounded break-all">{item.value}</p>
                 </div>
             ))}
             {(!project.infrastructure || project.infrastructure.length === 0) && (
                 <div className="col-span-3 text-center py-8 border border-dashed border-slate-300 rounded-xl text-slate-400 text-sm">
                   {canEdit ? 'Nenhum recurso manual. Clique em "Novo Item".' : 'Nenhum recurso cadastrado.'}
                 </div>
             )}
          </div>
      </div>
    </div>
  );
};