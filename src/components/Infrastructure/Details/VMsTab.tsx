import React from 'react';
import { Database, Plus, Edit2, Trash2, Copy, Shield, Monitor, Cpu, HardDrive, Server, Layers } from 'lucide-react';
import type { ServerEnvironment } from '../../../types';
import toast from 'react-hot-toast';

interface Props {
  environments: ServerEnvironment[];
  onAdd: () => void;
  onEdit: (env: ServerEnvironment) => void;
  onDelete: (id: string) => void;
}

export const VMsTab: React.FC<Props> = ({ environments, onAdd, onEdit, onDelete }) => {
  
  const copyToClipboard = (text: string) => {
      navigator.clipboard.writeText(text);
      toast.success("Copiado!", { duration: 1000, icon: '📋' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <Database size={20} className="text-indigo-600"/> Ambientes & VMs
        </h3>
        <button 
            onClick={onAdd} 
            className="flex items-center gap-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 px-3 py-2 rounded-lg border border-indigo-100 transition-colors"
        >
            <Plus size={16} /> Adicionar Ambiente
        </button>
      </div>

      {environments.length === 0 ? (
         <div className="bg-white p-10 rounded-xl border border-dashed border-slate-300 text-center text-slate-400">
            <Monitor size={32} className="mx-auto mb-3 opacity-20"/>
            <p>Nenhuma VM ou ambiente configurado neste servidor.</p>
         </div>
      ) : (
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
             {environments.map(env => (
                 <div 
                    key={env.id} 
                    className={`bg-white p-5 rounded-xl border shadow-sm transition-all group relative ${
                        env.isActive 
                            ? 'border-slate-200 hover:border-indigo-300' 
                            : 'border-slate-100 bg-slate-50 opacity-80'
                    }`}
                 >
                    
                    {/* Header do Card */}
                    <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2">
                            {/* Indicador de Status */}
                            <div 
                                className={`w-2.5 h-2.5 rounded-full ${env.isActive ? 'bg-green-500 shadow-sm shadow-green-200' : 'bg-slate-300'}`} 
                                title={env.isActive ? 'Ativo' : 'Inativo'}
                            />
                            <span className="font-bold text-slate-800 text-lg truncate max-w-[150px]">{env.name}</span>
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                                onClick={() => onEdit(env)} 
                                className="p-1.5 text-slate-400 hover:text-indigo-600 rounded hover:bg-slate-100"
                                title="Editar"
                            >
                                <Edit2 size={16}/>
                            </button>
                            <button 
                                onClick={() => onDelete(env.id)} 
                                className="p-1.5 text-slate-400 hover:text-red-600 rounded hover:bg-slate-100"
                                title="Excluir"
                            >
                                <Trash2 size={16}/>
                            </button>
                        </div>
                    </div>
                    
                    <div className="space-y-3 text-sm">
                        {/* Badges de Tipo */}
                        <div className="flex flex-wrap gap-2">
                            <span className="text-xs text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100 font-medium">{env.accessType}</span>
                            {env.hasFixedIp && (
                                <span className="text-[10px] text-green-700 bg-green-50 px-2 py-0.5 rounded border border-green-100 flex items-center gap-1"><Shield size={10}/> IP Fixo</span>
                            )}
                            {env.isOnPremise && (
                                <span className="text-[10px] text-orange-700 bg-orange-50 px-2 py-0.5 rounded border border-orange-100 flex items-center gap-1"><Server size={10}/> On-Prem</span>
                            )}
                        </div>
                        
                        {/* Dados de Acesso */}
                        <div 
                            onClick={() => copyToClipboard(env.accessId)} 
                            className="font-mono text-xs bg-slate-50 p-2.5 rounded border border-slate-100 break-all cursor-pointer hover:bg-slate-100 transition-colors"
                            title="Clique para copiar ID"
                        >
                            <span className="text-slate-400 select-none mr-2">ID:</span>{env.accessId}
                        </div>
                        
                        {env.accessPassword && (
                            <div 
                                onClick={() => copyToClipboard(env.accessPassword || '')} 
                                className="font-mono text-xs bg-slate-50 p-2.5 rounded border border-slate-100 break-all flex justify-between cursor-pointer hover:bg-slate-100 transition-colors group/pass"
                                title="Clique para copiar Senha"
                            >
                                <span><span className="text-slate-400 select-none mr-2">PW:</span>••••••••</span>
                                <Copy size={12} className="text-slate-300 group-hover/pass:text-indigo-400"/>
                            </div>
                        )}

                        {/* Recursos da VM */}
                        {(env.vCPU || env.ram || env.storage || env.os) && (
                            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                                {env.vCPU && (
                                    <div className="flex items-center gap-1.5 text-xs text-slate-500" title="Processador">
                                        <Cpu size={12}/> {env.vCPU}
                                    </div>
                                )}
                                {env.ram && (
                                    <div className="flex items-center gap-1.5 text-xs text-slate-500" title="Memória RAM">
                                        <Monitor size={12}/> {env.ram}
                                    </div>
                                )}
                                {env.storage && (
                                    <div className="flex items-center gap-1.5 text-xs text-slate-500" title="Armazenamento">
                                        <HardDrive size={12}/> {env.storage}
                                    </div>
                                )}
                                {env.os && (
                                    <div className="flex items-center gap-1.5 text-xs text-slate-500 col-span-2" title="Sistema Operacional">
                                        <Server size={12}/> {env.os}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* PROJETOS VINCULADOS (NOVO) */}
                        {env.projects && env.projects.length > 0 && (
                            <div className="pt-2 border-t border-slate-100">
                                <p className="text-[10px] text-slate-400 uppercase font-bold mb-1 flex items-center gap-1">
                                    <Layers size={10}/> Projetos Vinculados
                                </p>
                                <div className="flex flex-wrap gap-1">
                                    {env.projects.map(p => (
                                        <span key={p.id} className="text-[10px] bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded border border-indigo-100">
                                            {p.title}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                        
                        {env.notes && <p className="text-xs text-slate-500 mt-2 italic border-l-2 border-slate-200 pl-2">{env.notes}</p>}
                    </div>
                 </div>
             ))}
         </div>
      )}
    </div>
  );
};