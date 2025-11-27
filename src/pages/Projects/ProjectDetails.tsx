import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import type { Project, Module, TimelinePhase } from '../../types';
import toast from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';

// Componentes Modulares
import { ProjectHeader } from '../../components/Projects/Details/ProjectHeader';
import { OverviewTab } from '../../components/Projects/Details/OverviewTab';
import { InfraTab } from '../../components/Projects/Details/InfraTab';
import { DocsTab } from '../../components/Projects/Details/DocsTab';
import { TimelineTab } from '../../components/Projects/Details/TimelineTab'; 
import { SettingsTab } from '../../components/Projects/Details/SettingsTab';
import { ClientCard } from '../../components/Projects/Details/ClientCard';

// Modais
import { AddModuleModal } from '../../components/Projects/Details/AddModuleModal'; 
import { AddInfraModal } from '../../components/Projects/Details/AddInfraModal'; 
import { EditProjectModal } from '../../components/Projects/EditProjectModal';
import { AddPhaseModal } from '../../components/Projects/Details/AddPhaseModal'; 

export default function ProjectDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Permissões
  const { canEdit, canDelete } = useAuth(); 
  
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'timeline' | 'docs' | 'infra' | 'settings'>('overview');
  
  // Estados de Modais
  const [isAddModuleOpen, setIsAddModuleOpen] = useState(false); 
  const [isAddInfraOpen, setIsAddInfraOpen] = useState(false); 
  const [isEditProjectOpen, setIsEditProjectOpen] = useState(false);
  const [isAddPhaseOpen, setIsAddPhaseOpen] = useState(false); // <--- Novo
  
  // Estados de Edição
  const [moduleToEdit, setModuleToEdit] = useState<Module | null>(null);
  const [phaseToEdit, setPhaseToEdit] = useState<TimelinePhase | null>(null); // <--- Novo

  const refreshProject = () => {
      if (!id) return;
      api.getProjectById(id).then(setProject).catch(console.error);
  };

  useEffect(() => {
    if (id) {
        api.getProjectById(id)
           .then(setProject)
           .catch((err) => {
               console.error(err);
               toast.error('Erro ao carregar projeto.');
               navigate('/projects');
           })
           .finally(() => setLoading(false));
    }
  }, [id, navigate]);

  // --- HANDLERS (DOCS & INFRA) ---

  const handleSaveDocs = async (newDocs: string) => {
      if (!project || !canEdit) return;
      await toast.promise(
          api.updateProject(project.id, { documentation: newDocs }),
          { loading: 'Salvando...', success: 'Documentação salva!', error: 'Erro ao salvar.' }
      );
      refreshProject();
  };

  const handleSaveInfra = async (newInfraDetails: string) => {
      if (!project || !canEdit) return;
      await toast.promise(
          api.updateProject(project.id, { infraDetails: newInfraDetails }),
          { loading: 'Salvando...', success: 'Infraestrutura salva!', error: 'Erro ao salvar.' }
      );
      refreshProject(); 
  };

  // --- HANDLERS (MÓDULOS) ---

  const handleSaveModule = async (moduleData: Partial<Module>) => {
      if (!project || !canEdit) return;
      
      const promise = moduleToEdit 
        ? api.updateModule(moduleToEdit.id, moduleData)
        : api.addModule({ ...moduleData, projectId: project.id });

      await toast.promise(promise, {
          loading: 'Salvando módulo...',
          success: moduleToEdit ? 'Módulo atualizado!' : 'Módulo criado!',
          error: 'Erro ao salvar módulo.'
      });
      refreshProject(); 
  };

  const handleOpenEditModule = (module: Module) => {
      if (!canEdit) return;
      setModuleToEdit(module);
      setIsAddModuleOpen(true);
  };

  const handleOpenAddModule = () => {
      if (!canEdit) return;
      setModuleToEdit(null); 
      setIsAddModuleOpen(true);
  };

  const handleDeleteModule = async (moduleId: string) => {
      if (!canEdit) return; 
      if (confirm('Tem certeza que deseja remover este módulo?')) {
          try {
              await api.deleteModule(moduleId);
              toast.success('Módulo removido.');
              refreshProject();
          } catch { toast.error('Erro ao remover módulo.'); }
      }
  };

  // --- HANDLERS (TIMELINE / CRONOGRAMA) ---

  const handleSavePhase = async (phaseData: Partial<TimelinePhase>) => {
      if (!project || !canEdit) return;
      
      const promise = phaseToEdit
        ? api.updateTimelinePhase(phaseToEdit.id, phaseData)
        : api.addTimelinePhase({ ...phaseData, projectId: project.id });

      await toast.promise(promise, {
          loading: 'Salvando fase...',
          success: phaseToEdit ? 'Fase atualizada!' : 'Fase criada!',
          error: 'Erro ao salvar fase.'
      });
      refreshProject();
  };

  const handleDeletePhase = async (phaseId: string) => {
      if (!canEdit) return;
      if (confirm('Remover esta fase do cronograma?')) {
          try {
              await api.deleteTimelinePhase(phaseId);
              toast.success('Fase removida.');
              refreshProject();
          } catch { toast.error('Erro ao remover fase.'); }
      }
  };

  const handleOpenEditPhase = (phase: TimelinePhase) => {
      if (!canEdit) return;
      setPhaseToEdit(phase);
      setIsAddPhaseOpen(true);
  };

  const handleOpenAddPhase = () => {
      if (!canEdit) return;
      setPhaseToEdit(null);
      setIsAddPhaseOpen(true);
  };

  // --- HANDLERS (INFRA CARDS) ---

  const handleAddInfraItem = async (data: any) => {
      if (!project || !canEdit) return;
      await toast.promise(
          api.addInfraItem({ ...data, projectId: project.id }),
          { loading: 'Adicionando...', success: 'Item adicionado!', error: 'Erro ao adicionar.' }
      );
      refreshProject();
  };

  const handleDeleteInfraItem = async (itemId: string) => {
      if (!canEdit) return;
      if (confirm('Remover este item de infra?')) {
          try {
            await api.deleteInfraItem(itemId);
            toast.success('Item removido.');
            refreshProject();
          } catch { toast.error('Erro ao remover.'); }
      }
  };

  const handleDeleteProject = async () => {
      if (!canDelete) return;
      if (project && window.confirm('Tem certeza que deseja excluir este projeto COMPLETAMENTE?')) {
          try {
              await api.deleteProject(project.id);
              toast.success('Projeto excluído com sucesso.');
              navigate('/projects');
          } catch { toast.error('Erro ao excluir projeto.'); }
      }
  };

  const handleOpenClientDetails = () => {
      toast(`Cliente: ${project?.client}`, { icon: '🏢', duration: 2000 });
  };

  if (loading) return <div className="flex items-center justify-center h-full text-slate-400">Carregando detalhes...</div>;
  if (!project) return <div className="p-8 text-red-400">Projeto não encontrado.</div>;

  return (
    <div className="flex flex-col h-full bg-slate-50">
      
      {/* HEADER */}
      <ProjectHeader 
        project={project} 
        onEdit={() => setIsEditProjectOpen(true)} 
        canEdit={canEdit}
      />

      {/* NAV */}
      <div className="bg-white border-b border-slate-200 px-6">
         <div className="flex gap-8">
             {[
                 { id: 'overview', label: 'Visão Geral' },
                 { id: 'timeline', label: 'Cronograma' }, // <--- Aba Restaurada
                 { id: 'infra', label: 'Infraestrutura' },
                 { id: 'docs', label: 'Documentação' }, 
                 { id: 'settings', label: 'Configurações' }
             ].map(tab => {
                 if (tab.id === 'settings' && !canDelete) return null;
                 return (
                     <button 
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`py-4 text-sm font-medium transition-colors border-b-2 ${
                            activeTab === tab.id ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'
                        }`}
                     >
                        {tab.label}
                     </button>
                 )
             })}
         </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
              <div className="lg:col-span-2 flex flex-col">
                  
                  {activeTab === 'overview' && (
                      <OverviewTab 
                        project={project} 
                        onAddModule={canEdit ? handleOpenAddModule : () => {}} 
                        onEditModule={canEdit ? handleOpenEditModule : () => {}}
                        onDeleteModule={canEdit ? handleDeleteModule : () => {}}
                      />
                  )}

                  {activeTab === 'timeline' && (
                      <TimelineTab 
                        project={project}
                        onAddPhase={canEdit ? handleOpenAddPhase : () => {}}
                        onEditPhase={canEdit ? handleOpenEditPhase : () => {}}
                        onDeletePhase={canEdit ? handleDeletePhase : () => {}}
                        canEdit={canEdit}
                      />
                  )}

                  {activeTab === 'infra' && (
                      <InfraTab 
                        project={project} 
                        onSaveDetails={canEdit ? handleSaveInfra : async () => {}} 
                        onAddItem={canEdit ? () => setIsAddInfraOpen(true) : () => {}} 
                        onDeleteItem={canEdit ? handleDeleteInfraItem : () => {}}
                        canEdit={canEdit}
                      />
                  )}

                  {activeTab === 'docs' && (
                      <DocsTab 
                        project={project} 
                        onSaveDocs={canEdit ? handleSaveDocs : async () => {}}
                        canEdit={canEdit}
                      />
                  )}

                  {activeTab === 'settings' && canDelete && (
                      <SettingsTab onDelete={handleDeleteProject} />
                  )}
              </div>
              <div className="space-y-6 h-fit">
                  <ClientCard project={project} onOpenDetails={handleOpenClientDetails} />
              </div>
          </div>
      </div>

      {/* MODAIS (Renderizados condicionalmente para performance) */}
      {canEdit && (
          <>
            <AddModuleModal isOpen={isAddModuleOpen} onClose={() => setIsAddModuleOpen(false)} onSave={handleSaveModule} initialData={moduleToEdit} />
            <AddInfraModal isOpen={isAddInfraOpen} onClose={() => setIsAddInfraOpen(false)} onSave={handleAddInfraItem} />
            <EditProjectModal isOpen={isEditProjectOpen} onClose={() => setIsEditProjectOpen(false)} project={project} onUpdate={refreshProject} />
            <AddPhaseModal isOpen={isAddPhaseOpen} onClose={() => setIsAddPhaseOpen(false)} onSave={handleSavePhase} initialData={phaseToEdit} />
          </>
      )}
    </div>
  );
}