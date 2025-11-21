import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import type { Project, Module } from '../../types';
import toast from 'react-hot-toast'; // <--- Importação das notificações

// Componentes Modulares
import { ProjectHeader } from '../../components/Projects/Details/ProjectHeader';
import { OverviewTab } from '../../components/Projects/Details/OverviewTab';
import { InfraTab } from '../../components/Projects/Details/InfraTab';
import { DocsTab } from '../../components/Projects/Details/DocsTab';
import { SettingsTab } from '../../components/Projects/Details/SettingsTab';
import { ClientCard } from '../../components/Projects/Details/ClientCard';

// Modais
import { AddModuleModal } from '../../components/Projects/Details/AddModuleModal'; 
import { AddInfraModal } from '../../components/Projects/Details/AddInfraModal'; 

export default function ProjectDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'docs' | 'infra' | 'settings'>('overview');
  
  // Estados de Visibilidade dos Modais
  const [isAddModuleOpen, setIsAddModuleOpen] = useState(false); 
  const [isAddInfraOpen, setIsAddInfraOpen] = useState(false); 
  
  // Estado para edição (null = criar novo)
  const [moduleToEdit, setModuleToEdit] = useState<Module | null>(null);

  const refreshProject = () => {
      if (!id) return;
      // Carregamento silencioso para atualizar a UI
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

  // --- HANDLERS COM NOTIFICAÇÕES TOAST ---

  const handleSaveDocs = async (newDocs: string) => {
      if (!project) return;
      await toast.promise(
          api.updateProject(project.id, { documentation: newDocs }),
          {
             loading: 'Salvando documentação...',
             success: 'Documentação atualizada!',
             error: 'Erro ao salvar documentação.'
          }
      );
      refreshProject();
  };

  const handleSaveInfra = async (newInfraDetails: string) => {
      if (!project) return;
      await toast.promise(
          api.updateProject(project.id, { infraDetails: newInfraDetails }),
          {
             loading: 'Salvando infraestrutura...',
             success: 'Infraestrutura atualizada!',
             error: 'Erro ao salvar.'
          }
      );
      refreshProject(); 
  };

  // Salvar Módulo (Cria ou Atualiza)
  const handleSaveModule = async (moduleData: Partial<Module>) => {
      if (!project) return;
      
      const promise = moduleToEdit 
        ? api.updateModule(moduleToEdit.id, moduleData)
        : api.addModule({ ...moduleData, projectId: project.id });

      await toast.promise(promise, {
          loading: moduleToEdit ? 'Atualizando módulo...' : 'Criando módulo...',
          success: moduleToEdit ? 'Módulo atualizado!' : 'Módulo adicionado com sucesso!',
          error: 'Erro ao salvar módulo.'
      });
      
      refreshProject(); 
  };

  // Abre modal em modo edição
  const handleOpenEditModule = (module: Module) => {
      setModuleToEdit(module);
      setIsAddModuleOpen(true);
  };

  // Abre modal em modo criação
  const handleOpenAddModule = () => {
      setModuleToEdit(null); 
      setIsAddModuleOpen(true);
  };

  const handleDeleteModule = async (moduleId: string) => {
      if (confirm('Tem certeza que deseja remover este módulo?')) {
          try {
              await api.deleteModule(moduleId);
              toast.success('Módulo removido.');
              refreshProject();
          } catch (error) {
              toast.error('Erro ao remover módulo.');
          }
      }
  };

  const handleAddInfraItem = async (data: any) => {
      if (!project) return;
      await toast.promise(
          api.addInfraItem({ ...data, projectId: project.id }),
          {
             loading: 'Adicionando item...',
             success: 'Item de infraestrutura adicionado!',
             error: 'Erro ao adicionar item.'
          }
      );
      refreshProject();
  };

  const handleDeleteInfraItem = async (itemId: string) => {
      if (confirm('Remover este item de infraestrutura?')) {
          try {
            await api.deleteInfraItem(itemId);
            toast.success('Item removido.');
            refreshProject();
          } catch {
            toast.error('Erro ao remover item.');
          }
      }
  };

  const handleDeleteProject = async () => {
      if (project && window.confirm('ATENÇÃO: Tem certeza que deseja excluir este projeto e todos os seus dados?')) {
          try {
              await api.deleteProject(project.id);
              toast.success('Projeto excluído com sucesso.');
              navigate('/projects');
          } catch (error) {
              toast.error('Erro ao excluir projeto.');
          }
      }
  };

  const handleOpenClientDetails = () => {
      toast(`Cliente: ${project?.client}`, { icon: '🏢', duration: 2000 });
  };

  if (loading) return <div className="flex items-center justify-center h-full text-slate-400">Carregando detalhes...</div>;
  if (!project) return <div className="p-8 text-red-400">Projeto não encontrado.</div>;

  return (
    <div className="flex flex-col h-full bg-slate-50">
      
      <ProjectHeader project={project} />

      <div className="bg-white border-b border-slate-200 px-6">
         <div className="flex gap-8">
             {[
                 { id: 'overview', label: 'Visão Geral' },
                 { id: 'infra', label: 'Infraestrutura' },
                 { id: 'docs', label: 'Documentação' }, 
                 { id: 'settings', label: 'Configurações' }
             ].map(tab => (
                 <button 
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`py-4 text-sm font-medium transition-colors border-b-2 ${
                        activeTab === tab.id 
                        ? 'border-indigo-600 text-indigo-600' 
                        : 'border-transparent text-slate-500 hover:text-slate-700'
                    }`}
                 >
                    {tab.label}
                 </button>
             ))}
         </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
              
              {/* COLUNA PRINCIPAL (ESQUERDA) */}
              <div className="lg:col-span-2 flex flex-col">
                  
                  {activeTab === 'overview' && (
                      <OverviewTab 
                        project={project} 
                        onAddModule={handleOpenAddModule} 
                        onEditModule={handleOpenEditModule} 
                        onDeleteModule={handleDeleteModule}
                      />
                  )}

                  {activeTab === 'infra' && (
                      <InfraTab 
                        project={project} 
                        onSaveDetails={handleSaveInfra} 
                        onAddItem={() => setIsAddInfraOpen(true)} 
                        onDeleteItem={handleDeleteInfraItem} 
                      />
                  )}

                  {activeTab === 'docs' && (
                      <DocsTab project={project} onSaveDocs={handleSaveDocs} />
                  )}

                  {activeTab === 'settings' && (
                      <SettingsTab onDelete={handleDeleteProject} />
                  )}
              </div>

              {/* COLUNA LATERAL (DIREITA) */}
              <div className="space-y-6 h-fit">
                  <ClientCard project={project} onOpenDetails={handleOpenClientDetails} />
              </div>

          </div>
      </div>

      {/* MODAIS */}
      <AddModuleModal 
        isOpen={isAddModuleOpen} 
        onClose={() => setIsAddModuleOpen(false)} 
        onSave={handleSaveModule} 
        initialData={moduleToEdit} // Passa dados se for edição
      />
      
      <AddInfraModal 
        isOpen={isAddInfraOpen} 
        onClose={() => setIsAddInfraOpen(false)} 
        onSave={handleAddInfraItem} 
      />

    </div>
  );
}