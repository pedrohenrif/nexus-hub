import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Server as ServerIcon, Edit2, Trash2 } from 'lucide-react';
import type { Server } from '../../../types';

interface ServerHeaderProps {
  server: Server;
  onEdit: () => void;
  onDelete: () => void;
}

export const ServerHeader: React.FC<ServerHeaderProps> = ({ server, onEdit, onDelete }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white border-b border-slate-200 p-6">
      <button 
        onClick={() => navigate('/infrastructure')} 
        className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 mb-4 text-sm font-medium transition-colors"
      >
        <ArrowLeft size={16} /> Voltar para lista
      </button>
      
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-4">
            <div className="bg-indigo-50 p-3 rounded-xl text-indigo-600">
                <ServerIcon size={32} />
            </div>
            <div>
                <h1 className="text-2xl font-bold text-slate-800">{server.name}</h1>
                <p className="text-slate-500 font-mono text-sm">{server.ipAddress}</p>
            </div>
        </div>
        
        <div className="flex gap-2">
            <button 
                onClick={onEdit}
                className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
            >
                <Edit2 size={16} /> Editar
            </button>
            <button 
                onClick={onDelete}
                className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 hover:text-red-600 hover:bg-red-50 transition-all"
            >
                <Trash2 size={16} /> Excluir
            </button>
        </div>
      </div>
    </div>
  );
};