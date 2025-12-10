import React from 'react';
import { Database, Plus, Edit2, Trash2, Copy, Shield, Monitor } from 'lucide-react';
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
        <button onClick={onAdd} className="flex items-center gap-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 px-3 py-2 rounded-lg border border-indigo-100 transition-colors">
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
                 <div key={env.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-indigo-300 transition-all group">
                    <div className="flex justify-between items-start mb-3">
                        <span className="font-bold text-slate-800 text-lg">{env.name}</span>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => onEdit(env)} className="p-1.5 text-slate-400 hover:text-indigo-600 rounded hover:bg-slate-50"><Edit2 size={16}/></button>
                            <button onClick={() => onDelete(env.id)} className="p-1.5 text-slate-400 hover:text-red-600 rounded hover:bg-slate-50"><Trash2 size={16}/></button>
                        </div>
                    </div>
                    
                    <div className="space-y-3 text-sm">
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-indigo-600 bg-indigo-50 px-2 py-1 rounded border border-indigo-100 font-medium">{env.accessType}</span>
                            {env.hasFixedIp && <span className="text-[10px] text-green-700 bg-green-50 px-2 py-1 rounded border border-green-100 flex items-center gap-1"><Shield size={10}/> IP Fixo</span>}
                        </div>
                        
                        <div onClick={() => copyToClipboard(env.accessId)} className="font-mono text-xs bg-slate-50 p-2.5 rounded border border-slate-100 break-all cursor-pointer hover:bg-slate-100 transition-colors">
                            <span className="text-slate-400 select-none mr-2">ID:</span>{env.accessId}
                        </div>
                        
                        {env.accessPassword && (
                            <div onClick={() => copyToClipboard(env.accessPassword || '')} className="font-mono text-xs bg-slate-50 p-2.5 rounded border border-slate-100 break-all cursor-pointer hover:bg-slate-100 transition-colors flex justify-between group/pass">
                                <span><span className="text-slate-400 select-none mr-2">PW:</span>••••••••</span>
                                <Copy size={12} className="text-slate-300 group-hover/pass:text-indigo-400"/>
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