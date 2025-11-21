import React, { useState, useEffect } from 'react';
import { Cloud, Server, Database, Lock, Save, Plus, Trash2, Globe, Box } from 'lucide-react';
import type { Project, InfrastructureItem } from '../../../types';

interface InfraTabProps {
  project: Project;
  onSaveDetails: (newInfraDetails: string) => Promise<void>;
  onAddItem: () => void; // Callback para abrir o modal
  onDeleteItem: (id: string) => void; // Callback para deletar item
  canEdit: boolean; // <--- NOVA PROP DE PERMISSÃO
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

  const getIcon = (cat: string) => {
      switch(cat) {
          case 'Server': return <Server size={20} className="text-orange-600"/>;
          case 'Database': return <Database size={20} className="text-blue-600"/>;
          case 'Security': return <Lock size={20} className="text-green-600"/>;
          case 'Network': return <Globe size={20} className="text-purple-600"/>;
          default: return <Box size={20} className="text-slate-600"/>;
      }
  };

  const getBgColor = (cat: string) => {
    switch(cat) {
        case 'Server': return 'bg-orange-50 group-hover:bg-orange-100';
        case 'Database': return 'bg-blue-50 group-hover:bg-blue-100';
        case 'Security': return 'bg-green-50 group-hover:bg-green-100';
        case 'Network': return 'bg-purple-50 group-hover:bg-purple-100';
        default: return 'bg-slate-50 group-hover:bg-slate-100';
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* ÁREA DE TEXTO LIVRE (ANOTAÇÕES GERAIS) */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex justify-between items-center mb-4">
           <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
             <Cloud size={20} className="text-indigo-600"/> Anotações Gerais
           </h3>
           
           {/* PROTEÇÃO: Botão Editar só aparece se tiver permissão */}
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
            className="w-full h-48 p-4 border border-slate-300 rounded-lg font-mono text-sm text-slate-700 outline-none focus:border-indigo-500 transition-all" 
            value={infraNotes} 
            onChange={(e) => setInfraNotes(e.target.value)} 
            placeholder="Descreva a arquitetura geral, variáveis de ambiente ou notas importantes..." 
          />
        ) : (
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 min-h-[100px] whitespace-pre-wrap font-mono text-sm text-slate-700">
            {infraNotes || <span className="text-slate-400 italic">Sem anotações de infraestrutura.</span>}
          </div>
        )}
      </div>

      {/* CARDS DE INFRAESTRUTURA */}
      <div>
          <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-800">Recursos & Acessos</h3>
              
              {/* PROTEÇÃO: Botão Novo Item */}
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
                    
                    {/* PROTEÇÃO: Botão Deletar */}
                    {canEdit && (
                        <button 
                          onClick={() => onDeleteItem(item.id)} 
                          className="absolute top-2 right-2 p-1.5 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                          title="Remover item"
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
                   {canEdit ? 'Nenhum recurso adicionado. Clique em "Novo Item" para começar.' : 'Nenhum recurso cadastrado.'}
                 </div>
             )}
          </div>
      </div>
    </div>
  );
};