import React from 'react';

interface SettingsTabProps {
  onDelete: () => void;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({ onDelete }) => {
  return (
    <div className="max-w-2xl">
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h3 className="font-bold text-slate-800">Zona de Perigo</h3>
          <p className="text-sm text-slate-500 mt-1">Ações irreversíveis para este projeto.</p>
        </div>
        <div className="p-6 bg-red-50 flex items-center justify-between">
          <div>
            <div className="font-bold text-red-800">Excluir Projeto</div>
            <div className="text-xs text-red-600">Isso irá apagar todos os módulos e dados associados.</div>
          </div>
          <button 
            onClick={onDelete}
            className="px-4 py-2 bg-white border border-red-200 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 hover:border-red-300 transition-colors"
          >
            Excluir Definitivamente
          </button>
        </div>
      </div>
    </div>
  );
};