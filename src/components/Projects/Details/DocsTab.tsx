import React, { useState, useEffect } from 'react';
import { Save, FileText, Edit3 } from 'lucide-react';
import type { Project } from '../../../types';
import ReactMarkdown from 'react-markdown';

interface DocsTabProps {
  project: Project;
  onSaveDocs: (newDocs: string) => Promise<void>;
}

export const DocsTab: React.FC<DocsTabProps> = ({ project, onSaveDocs }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [docsContent, setDocsContent] = useState(project.documentation || '');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setDocsContent(project.documentation || '');
  }, [project.documentation]);

  const handleSave = async () => {
    setSaving(true);
    await onSaveDocs(docsContent);
    setIsEditing(false);
    setSaving(false);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
           <div className="bg-indigo-50 p-2 rounded-lg text-indigo-600">
             <FileText size={20} />
           </div>
           <div>
             <h3 className="text-sm font-bold text-slate-800">Documentação do Projeto</h3>
             <p className="text-xs text-slate-500">Suporta formato Markdown (# Titulo, **negrito**, - listas)</p>
           </div>
        </div>
        <div className="flex gap-2">
           {isEditing ? (
             <>
               <button 
                 onClick={() => setIsEditing(false)} 
                 className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
               >
                 Cancelar
               </button>
               <button 
                 onClick={handleSave} 
                 disabled={saving}
                 className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 flex items-center gap-2"
               >
                 <Save size={16} /> {saving ? 'Salvando...' : 'Salvar Alterações'}
               </button>
             </>
           ) : (
             <button 
               onClick={() => setIsEditing(true)} 
               className="px-4 py-2 bg-white border border-slate-300 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 flex items-center gap-2 shadow-sm"
             >
               <Edit3 size={16} /> Editar
             </button>
           )}
        </div>
      </div>

      <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        {isEditing ? (
          <textarea 
            className="flex-1 w-full p-6 font-mono text-sm text-slate-800 outline-none resize-none focus:bg-slate-50 transition-colors"
            placeholder="# Título do Projeto\n\nDescreva como rodar, arquitetura e endpoints aqui..."
            value={docsContent}
            onChange={(e) => setDocsContent(e.target.value)}
          />
        ) : (
          <div className="flex-1 p-8 overflow-y-auto prose prose-slate max-w-none">
            {docsContent ? (
                <ReactMarkdown>{docsContent}</ReactMarkdown>
            ) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-4">
                    <FileText size={48} className="opacity-20" />
                    <p>Nenhuma documentação criada ainda.</p>
                    <button onClick={() => setIsEditing(true)} className="text-indigo-600 hover:underline text-sm">Começar a escrever</button>
                </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};