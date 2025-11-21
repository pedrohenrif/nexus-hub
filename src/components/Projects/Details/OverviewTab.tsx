import React from 'react';
import { Box, GitBranch, Code, Terminal, Cpu, Plus, Trash2, Edit2 } from 'lucide-react';
import { TypeBadge } from '../../UI/Badge';
import type { Project, Module } from '../../../types';

interface OverviewTabProps {
  project: Project;
  onAddModule: () => void;
  onEditModule: (module: Module) => void;
  onDeleteModule: (moduleId: string) => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ project, onAddModule, onEditModule, onDeleteModule }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <Box size={20} className="text-indigo-600"/> Módulos Integrados
        </h3>
        <button 
          onClick={onAddModule}
          className="flex items-center gap-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 px-3 py-2 rounded-lg transition-colors border border-indigo-100"
        >
          <Plus size={16} /> Adicionar Módulo
        </button>
      </div>
      
      {project.modules.length === 0 && (
        <div className="bg-white p-8 rounded-xl border border-dashed border-slate-300 text-slate-400 text-center flex flex-col items-center justify-center gap-3">
          <Box size={32} className="opacity-20"/>
          <p>Nenhum módulo cadastrado neste projeto.</p>
          <button onClick={onAddModule} className="text-indigo-600 hover:underline text-sm">Adicionar o primeiro</button>
        </div>
      )}

      {project.modules.map(mod => (
        <div key={mod.id} className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden group">
          <div className="p-5 border-b border-slate-100 flex justify-between items-start bg-slate-50/50">
            <div>
              <div className="flex items-center gap-3">
                <TypeBadge type={mod.type} />
                <h4 className="font-bold text-slate-800 text-lg">{mod.name}</h4>
              </div>
              {mod.techStack && (
                <div className="mt-2 flex items-center gap-2 text-xs text-slate-500 font-mono bg-white border border-slate-200 w-fit px-2 py-1 rounded shadow-sm">
                  <Code size={12}/> {mod.techStack}
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
               {/* Botão de Editar - AGORA VISÍVEL SEMPRE */}
               <button 
                 onClick={() => onEditModule(mod)} 
                 className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all" 
                 title="Editar Módulo"
               >
                 <Edit2 size={16} />
               </button>

               {mod.repoUrl && (
                <a href={mod.repoUrl} target="_blank" rel="noreferrer" className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all">
                  <GitBranch size={18} />
                </a>
               )}

               {/* Botão de Excluir - AGORA VISÍVEL SEMPRE */}
               <button 
                 onClick={() => onDeleteModule(mod.id)}
                 className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all" 
                 title="Excluir Módulo"
               >
                 <Trash2 size={18} />
               </button>
            </div>
          </div>
          <div className="p-5 space-y-4">
            <p className="text-slate-600 text-sm leading-relaxed">{mod.description || "Sem descrição."}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {mod.installCmd && (
                <div className="bg-slate-900 rounded-lg p-3 border border-slate-800">
                  <div className="text-[10px] uppercase text-slate-500 font-bold mb-1 flex items-center gap-1">
                    <Terminal size={10}/> Instalação
                  </div>
                  <code className="text-green-400 font-mono text-xs block whitespace-pre-wrap overflow-x-auto">
                    {mod.installCmd}
                  </code>
                </div>
              )}
              {mod.infraDetails && (
                <div className="bg-white rounded-lg p-3 border border-slate-200">
                  <div className="text-[10px] uppercase text-slate-500 font-bold mb-1 flex items-center gap-1">
                    <Cpu size={10}/> Infra do Módulo
                  </div>
                  <code className="text-slate-600 font-mono text-xs block whitespace-pre-wrap">
                    {mod.infraDetails}
                  </code>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};