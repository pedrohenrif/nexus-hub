import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Layers, Calendar, Edit2 } from 'lucide-react';
import { Badge } from '../../UI/Badge';
import type { Project } from '../../../types';

interface ProjectHeaderProps {
  project: Project;
  onEdit?: () => void; 
  canEdit?: boolean;   
}

export const ProjectHeader: React.FC<ProjectHeaderProps> = ({ project, onEdit, canEdit }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white border-b border-slate-200 p-6">
      <div className="flex justify-between items-start mb-4">
          <button 
            onClick={() => navigate('/projects')} 
            className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 text-sm font-medium transition-colors"
          >
            <ArrowLeft size={16} /> Voltar para lista
          </button>

          {canEdit && onEdit && (
              <button 
                onClick={onEdit}
                className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 rounded-lg text-sm text-slate-600 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50 transition-all"
              >
                  <Edit2 size={14} /> Editar Projeto
              </button>
          )}
      </div>
      
      <div className="flex justify-between items-end">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-slate-800">{project.title}</h1>
            <Badge color={
                 project.status === 'Concluído' ? 'green' : 
                 project.status === 'Produção' ? 'purple' : 
                 project.status === 'Manutenção' ? 'yellow' : 
                 'blue'
            }>
                {project.status}
            </Badge>
          </div>
          <div className="flex items-center gap-4 text-sm text-slate-500">
            <span className="flex items-center gap-1">
              <Layers size={14}/> {project.client}
            </span>
            {project.createdAt && (
              <span className="flex items-center gap-1">
                <Calendar size={14}/> Criado em {new Date(project.createdAt).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};