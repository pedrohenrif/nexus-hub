import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Layers, ChevronRight, Trash2, Box, Filter, X } from 'lucide-react';
import { api } from '../../services/api';
import type { Project, Client } from '../../types';
import { Badge } from '../../components/UI/Badge';
import { CreateProjectModal } from '../../components/Projects/CreateProjectModal';

export default function ProjectsPage() {
  const navigate = useNavigate(); 
  
  // Estados de Dados
  const [projects, setProjects] = useState<Project[]>([]);
  const [clients, setClients] = useState<Client[]>([]); 
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Estados de Filtro
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('Todos');
  const [clientFilter, setClientFilter] = useState<string>('Todos');

  // Carregamento Inicial (Projetos + Clientes para o filtro)
  const loadData = async () => {
    try {
      setLoading(true);
      const [projectsData, clientsData] = await Promise.all([
        api.getProjects(),
        api.getClients()
      ]);
      setProjects(projectsData);
      setClients(clientsData);
    } catch (error) {
      console.error("Erro:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleDelete = async (id: string) => {
    if (confirm('Excluir projeto?')) {
        await api.deleteProject(id);
        setProjects(prev => prev.filter(p => p.id !== id));
    }
  };

  // --- LÓGICA DE FILTRAGEM ---
  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
        // 1. Filtro de Texto (Nome ou Cliente)
        const matchesSearch = (p.client?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || 
                              (p.title?.toLowerCase() || '').includes(searchTerm.toLowerCase());
        
        // 2. Filtro de Status
        const matchesStatus = statusFilter === 'Todos' || p.status === statusFilter;
        
        // 3. Filtro de Cliente (Por ID ou Nome)
        const matchesClient = clientFilter === 'Todos' || p.clientId === clientFilter || p.client === clientFilter;

        return matchesSearch && matchesStatus && matchesClient;
    });
  }, [projects, searchTerm, statusFilter, clientFilter]);

  // --- AGRUPAMENTO (Por Cliente) ---
  // O agrupamento acontece APÓS a filtragem para mostrar apenas o relevante
  const projectsByClient = useMemo(() => {
    return filteredProjects.reduce((acc: Record<string, Project[]>, project) => { 
        const clientName = project.client || 'Outros';
        acc[clientName] = [...(acc[clientName] || []), project]; 
        return acc; 
    }, {});
  }, [filteredProjects]);

  return (
    <>
      <header className="h-auto bg-white border-b border-slate-200 px-8 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-800">Catálogo de Projetos</h2>
            <button 
                onClick={() => setIsModalOpen(true)} 
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium shadow-sm transition-colors"
            >
                <Plus size={18} /> Novo Projeto
            </button>
        </div>

        {/* BARRA DE FILTROS */}
        <div className="flex flex-wrap items-center gap-4">
            {/* Busca Textual */}
            <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                    type="text" 
                    placeholder="Buscar por nome ou cliente..." 
                    className="w-full pl-10 pr-4 py-2 bg-slate-100 border border-transparent focus:bg-white focus:border-indigo-500 rounded-lg text-sm outline-none transition-all" 
                    value={searchTerm} 
                    onChange={e => setSearchTerm(e.target.value)} 
                />
            </div>

            {/* Filtro de Status */}
            <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-lg border border-slate-200">
                <Filter size={16} className="text-slate-400 ml-2" />
                <select 
                    className="bg-transparent text-sm text-slate-700 font-medium outline-none p-1 cursor-pointer min-w-[130px]"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="Todos">Todos Status</option>
                    <option value="Produção">Produção</option>
                    <option value="Em Andamento">Em Andamento</option>
                    <option value="Planejamento">Planejamento</option>
                    <option value="Manutenção">Manutenção</option>
                    <option value="Concluído">Concluído</option>
                </select>
            </div>

            {/* Filtro de Cliente */}
            <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-lg border border-slate-200">
                <Layers size={16} className="text-slate-400 ml-2" />
                <select 
                    className="bg-transparent text-sm text-slate-700 font-medium outline-none p-1 cursor-pointer min-w-[150px] max-w-[200px]"
                    value={clientFilter}
                    onChange={(e) => setClientFilter(e.target.value)}
                >
                    <option value="Todos">Todos Clientes</option>
                    {clients.map(client => (
                        <option key={client.id} value={client.id}>{client.name}</option>
                    ))}
                </select>
            </div>

            {/* Botão Limpar Filtros */}
            {(statusFilter !== 'Todos' || clientFilter !== 'Todos' || searchTerm) && (
                <button 
                    onClick={() => { setStatusFilter('Todos'); setClientFilter('Todos'); setSearchTerm(''); }}
                    className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 font-medium px-2 py-1 ml-auto transition-colors"
                >
                    <X size={14} /> Limpar Filtros
                </button>
            )}
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-8">
         {loading ? <div className="text-center text-slate-400 mt-10">Carregando catálogo...</div> : (
            <div className="space-y-10">
              {Object.keys(projectsByClient).length === 0 ? (
                 <div className="text-center py-20 border border-dashed border-slate-300 rounded-xl bg-slate-50/50">
                    <Layers size={40} className="mx-auto text-slate-300 mb-4"/>
                    <h3 className="text-slate-600 font-semibold">Nenhum projeto encontrado</h3>
                    <p className="text-slate-400 text-sm mt-1">Tente ajustar os filtros ou crie um novo projeto.</p>
                 </div>
              ) : (
                 Object.entries(projectsByClient).map(([clientName, list]) => (
                    <div key={clientName} className="animate-fade-in">
                       {/* Cabeçalho do Cliente */}
                       <div className="flex items-center gap-3 mb-4">
                           <div className="h-px flex-1 bg-slate-200"></div>
                           <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                               {clientName} 
                               <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full text-[10px] border border-slate-200">
                                   {list.length}
                               </span>
                           </h3>
                           <div className="h-px flex-1 bg-slate-200"></div>
                       </div>

                       {/* Grid de Cards */}
                       <div className="grid grid-cols-1 gap-4">
                          {list.map(project => (
                             <div 
                                key={project.id} 
                                className="bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-all overflow-hidden cursor-pointer hover:border-indigo-300 group"
                                onClick={() => navigate(`/projects/${project.id}`)} 
                             >
                                <div className="p-5 flex justify-between items-center">
                                   <div className="flex items-center gap-4">
                                      <div className="transition-transform duration-200 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1">
                                        <ChevronRight size={24}/>
                                      </div>
                                      <div>
                                          <h4 className="text-xl font-bold text-slate-800 group-hover:text-indigo-700 transition-colors">{project.title}</h4>
                                          <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                                              <Box size={12}/> {project.modules?.length || 0} Módulos
                                          </p>
                                      </div>
                                   </div>
                                   <div className="flex gap-3 items-center">
                                       {/* Badge com cor específica para Produção */}
                                       <Badge color={
                                           project.status === 'Concluído' ? 'green' : 
                                           project.status === 'Produção' ? 'purple' : 
                                           project.status === 'Manutenção' ? 'yellow' : 
                                           'blue'
                                       }>
                                           {project.status}
                                       </Badge>
                                       <button 
                                         onClick={(e) => { e.stopPropagation(); handleDelete(project.id); }} 
                                         className="text-slate-300 hover:text-red-500 p-2 hover:bg-red-50 rounded-full transition-colors"
                                         title="Excluir Projeto"
                                       >
                                         <Trash2 size={18}/>
                                       </button>
                                   </div>
                                </div>
                             </div>
                          ))}
                       </div>
                    </div>
                 ))
              )}
            </div>
         )}
      </div>

      <CreateProjectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={loadData} />
    </>
  );
}