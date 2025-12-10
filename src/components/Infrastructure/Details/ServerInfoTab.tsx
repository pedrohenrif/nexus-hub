import React, { useState } from 'react';
import { Server, User, Key, Eye, EyeOff, Copy, FileText } from 'lucide-react';
import type { Server as ServerType } from '../../../types';
import toast from 'react-hot-toast';

interface Props {
  server: ServerType;
}

export const ServerInfoTab: React.FC<Props> = ({ server }) => {
  const [showPassword, setShowPassword] = useState(false);

  const copyToClipboard = (text: string) => {
      navigator.clipboard.writeText(text);
      toast.success("Copiado!", { duration: 1000, icon: '📋' });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* CARTÃO DE ACESSO */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-fit">
            <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Key size={18} className="text-indigo-600"/> Credenciais de Acesso (Root/Admin)
            </h3>
            
            <div className="space-y-4">
                <div>
                    <label className="text-xs text-slate-400 font-bold uppercase">Endereço IP / Host</label>
                    <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-100 mt-1 font-mono text-sm text-slate-700">
                        <span>{server.ipAddress}</span>
                        <button onClick={() => copyToClipboard(server.ipAddress)} className="text-slate-400 hover:text-indigo-600"><Copy size={14}/></button>
                    </div>
                </div>

                <div>
                    <label className="text-xs text-slate-400 font-bold uppercase">Usuário</label>
                    <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-100 mt-1 font-mono text-sm text-slate-700">
                        <span>{server.username}</span>
                        <button onClick={() => copyToClipboard(server.username)} className="text-slate-400 hover:text-indigo-600"><Copy size={14}/></button>
                    </div>
                </div>

                <div>
                    <label className="text-xs text-slate-400 font-bold uppercase">Senha</label>
                    <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-100 mt-1 font-mono text-sm text-slate-700">
                        <span>{showPassword ? server.password : '••••••••••••'}</span>
                        <div className="flex gap-2">
                            <button onClick={() => setShowPassword(!showPassword)} className="text-slate-400 hover:text-indigo-600">
                                {showPassword ? <EyeOff size={14}/> : <Eye size={14}/>}
                            </button>
                            <button onClick={() => copyToClipboard(server.password || '')} className="text-slate-400 hover:text-indigo-600"><Copy size={14}/></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* ANOTAÇÕES */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                <FileText size={18} className="text-indigo-600"/> Observações Técnicas
            </h3>
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 min-h-[200px] text-sm text-slate-600 whitespace-pre-wrap font-mono">
                {server.notes || <span className="text-slate-400 italic">Sem observações adicionais.</span>}
            </div>
        </div>
    </div>
  );
};