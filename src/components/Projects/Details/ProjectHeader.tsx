import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Layers, Calendar } from 'lucide-react';
import { Badge } from '../../UI/Badge';
import type { Project } from '../../../types';

interface ProjectHeaderProps {
  project: Project;
}

export const ProjectHeader: React.FC<ProjectHeaderProps> = ({ project }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white border-b border-slate-200 p-6">
      <button 
        onClick={() => navigate('/projects')} 
        className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 mb-4 text-sm font-medium transition-colors"
      >
        <ArrowLeft size={16} /> Voltar para lista
      </button>
      
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-slate-800">{project.title}</h1>
            <Badge color={project.status === 'Concluído' ? 'green' : 'blue'}>{project.status}</Badge>
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
        
        {/* Botões de Ação Global (Editar Projeto) poderiam ficar aqui */}
      </div>
    </div>
  );
};