import React from 'react';
import type { Project } from '../../../types';

interface ClientCardProps {
  project: Project;
  onOpenDetails: () => void; // Callback para abrir modal de detalhes
}

export const ClientCard: React.FC<ClientCardProps> = ({ project, onOpenDetails }) => {
  // Gera iniciais do cliente
  const initial = project.client.charAt(0).toUpperCase();
  
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
      <h4 className="text-sm font-bold text-slate-400 uppercase mb-4">Ficha do Cliente</h4>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-lg">
          {initial}
        </div>
        <div>
          <div className="font-bold text-slate-800">{project.client}</div>
          <div className="text-xs text-slate-400">
            ID: {project.clientId?.substring(0, 8)}...
          </div>
        </div>
      </div>
      <button 
        onClick={onOpenDetails}
        className="w-full py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
      >
        Ver Dados Completos
      </button>
    </div>
  );
};