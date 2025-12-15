import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom'; 
import { Search, Plus, Layers, ChevronRight, Trash2, Box, Filter, X, User as UserIcon, Tag } from 'lucide-react';
import { api } from '../../services/api';
import type { Project, Client, User } from '../../types';
import { Badge } from '../../components/UI/Badge';
import { CreateProjectModal } from '../../components/Projects/CreateProjectModal';
import { useAuth } from '../../hooks/useAuth';

export default function ProjectsPage() {
  const navigate = useNavigate(); 
  const { canEdit, canDelete } = useAuth();
  
  // Hooks para persistir filtros na URL
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [clients, setClients] = useState<Client[]>([]); 
  const [users, setUsers] = useState<User[]>([]); 
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- PERSISTÊNCIA INTELIGENTE ---
  
  // 1. Ao iniciar: Se a URL estiver vazia, tenta restaurar os filtros da última sessão
  useEffect(() => {
    if ([...searchParams].length === 0) {
      const savedFilters = sessionStorage.getItem('projectFilters');
      if (savedFilters) {
        setSearchParams(new URLSearchParams(savedFilters));
      }
    }
  }, []);

  // 2. Ao mudar filtros: Salva no sessionStorage automaticamente
  useEffect(() => {
    const paramsString = searchParams.toString();
    if (paramsString) {
      sessionStorage.setItem('projectFilters', paramsString);
    }
  }, [searchParams]);

  // Lê filtros da URL (ou define padrão)
  const searchTerm = searchParams.get('q') || '';
  const statusFilter = searchParams.get('status') || 'Todos';
  const clientFilter = searchParams.get('client') || 'Todos';
  const typeFilter = searchParams.get('type') || 'Todos'; 
  const ownerFilter = searchParams.get('owner') || 'Todos'; 

  // Função para atualizar um filtro específico
  const updateFilter = (key: string, value: string) => {
      const newParams = new URLSearchParams(searchParams);
      if (value && value !== 'Todos') {
          newParams.set(key, value);
      } else {
          newParams.delete(key);
      }
      setSearchParams(newParams);
  };

  // Função para limpar TUDO (URL e Memória)
  const handleClearFilters = () => {
      setSearchParams({});
      sessionStorage.removeItem('projectFilters');
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const [projectsData, clientsData, usersData] = await Promise.all([
        api.getProjects(),
        api.getClients(),
        api.getUsers()
      ]);
      setProjects(projectsData);
      setClients(clientsData);
      setUsers(usersData);
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

  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
        const matchesSearch = (p.client?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || 
                              (p.title?.toLowerCase() || '').includes(searchTerm.toLowerCase());
        
        const matchesStatus = statusFilter === 'Todos' || p.status === statusFilter;
        const matchesClient = clientFilter === 'Todos' || p.clientId === clientFilter || p.client === clientFilter;
        
        const matchesType = typeFilter === 'Todos' || (p.type || 'Projeto') === typeFilter;
        const matchesOwner = ownerFilter === 'Todos' || p.owner?.id === ownerFilter || p.ownerId === ownerFilter;

        return matchesSearch && matchesStatus && matchesClient && matchesType && matchesOwner;
    });
  }, [projects, searchTerm, statusFilter, clientFilter, typeFilter, ownerFilter]);

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
            {canEdit && (
                <button onClick={() => setIsModalOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium shadow-sm transition-colors">
                    <Plus size={18} /> Novo Projeto
                </button>
            )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
            {/* Busca */}
            <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                    type="text" placeholder="Buscar..." 
                    className="w-full pl-10 pr-4 py-2 bg-slate-100 border border-transparent focus:bg-white focus:border-indigo-500 rounded-lg text-sm outline-none transition-all" 
                    value={searchTerm} 
                    onChange={e => updateFilter('q', e.target.value)} 
                />
            </div>

            {/* Filtro Status */}
            <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-lg border border-slate-200">
                <Filter size={16} className="text-slate-400 ml-2" />
                <select className="bg-transparent text-sm text-slate-700 font-medium outline-none p-1 cursor-pointer" value={statusFilter} onChange={(e) => updateFilter('status', e.target.value)}>
                    <option value="Todos">Status: Todos</option><option value="Produção">Produção</option><option value="Em Andamento">Em Andamento</option><option value="Planejamento">Planejamento</option><option value="Manutenção">Manutenção</option><option value="Concluído">Concluído</option>
                </select>
            </div>

            {/* Filtro Tipo */}
            <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-lg border border-slate-200">
                <Tag size={16} className="text-slate-400 ml-2" />
                <select className="bg-transparent text-sm text-slate-700 font-medium outline-none p-1 cursor-pointer" value={typeFilter} onChange={(e) => updateFilter('type', e.target.value)}>
                    <option value="Todos">Tipo: Todos</option>
                    <option value="Projeto">Projeto</option>
                    <option value="Suporte">Suporte</option>
                </select>
            </div>

            {/* Filtro Cliente */}
            <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-lg border border-slate-200">
                <Layers size={16} className="text-slate-400 ml-2" />
                <select className="bg-transparent text-sm text-slate-700 font-medium outline-none p-1 cursor-pointer max-w-[150px]" value={clientFilter} onChange={(e) => updateFilter('client', e.target.value)}>
                    <option value="Todos">Clientes: Todos</option>
                    {clients.map(client => (<option key={client.id} value={client.id}>{client.name}</option>))}
                </select>
            </div>

            {/* Filtro Responsável */}
            <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-lg border border-slate-200">
                <UserIcon size={16} className="text-slate-400 ml-2" />
                <select className="bg-transparent text-sm text-slate-700 font-medium outline-none p-1 cursor-pointer max-w-[150px]" value={ownerFilter} onChange={(e) => updateFilter('owner', e.target.value)}>
                    <option value="Todos">Resp: Todos</option>
                    {users.map(u => (<option key={u.id} value={u.id}>{u.name}</option>))}
                </select>
            </div>

            {/* Limpar (Limpa URL e SessionStorage) */}
            {(statusFilter !== 'Todos' || clientFilter !== 'Todos' || typeFilter !== 'Todos' || ownerFilter !== 'Todos' || searchTerm) && (
                <button onClick={handleClearFilters} className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 font-medium px-2 py-1 ml-auto transition-colors"><X size={14} /> Limpar</button>
            )}
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-8">
         {loading ? <div className="text-center text-slate-400 mt-10">Carregando projetos...</div> : (
            <div className="space-y-10">
              {Object.keys(projectsByClient).length === 0 ? (
                 <div className="text-center py-20 border border-dashed border-slate-300 rounded-xl bg-slate-50/50">
                    <Layers size={40} className="mx-auto text-slate-300 mb-4"/><h3 className="text-slate-600 font-semibold">Nenhum projeto encontrado</h3>
                 </div>
              ) : (
                 Object.entries(projectsByClient).map(([clientName, list]) => (
                    <div key={clientName} className="animate-fade-in">
                       <div className="flex items-center gap-3 mb-4">
                           <div className="h-px flex-1 bg-slate-200"></div><h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">{clientName} <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full text-[10px] border border-slate-200">{list.length}</span></h3><div className="h-px flex-1 bg-slate-200"></div>
                       </div>
                       <div className="grid grid-cols-1 gap-4">
                          {list.map(project => (
                             <div key={project.id} className="bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-all overflow-hidden cursor-pointer hover:border-indigo-300 group" onClick={() => navigate(`/projects/${project.id}`)}>
                                <div className="p-5 flex justify-between items-center">
                                   <div className="flex items-center gap-4">
                                      <div className="transition-transform duration-200 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1"><ChevronRight size={24}/></div>
                                      <div>
                                          <div className="flex items-center gap-2">
                                              <h4 className="text-xl font-bold text-slate-800 group-hover:text-indigo-700 transition-colors">{project.title}</h4>
                                              <span className={`text-[10px] px-2 py-0.5 rounded border font-medium ${project.type === 'Suporte' ? 'bg-orange-50 text-orange-700 border-orange-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>
                                                  {project.type || 'Projeto'}
                                              </span>
                                          </div>
                                          
                                          <div className="flex items-center gap-4 mt-1 text-xs text-slate-400">
                                              <span className="flex items-center gap-1"><Box size={12}/> {project.modules?.length || 0} Módulos</span>
                                              
                                              {/* Exibindo o Responsável */}
                                              {project.owner ? (
                                                  <span className="flex items-center gap-1 text-indigo-500 font-medium" title={`Responsável: ${project.owner.name}`}>
                                                      <UserIcon size={12}/> {project.owner.name}
                                                  </span>
                                              ) : (
                                                  project.createdBy && (
                                                      <span className="flex items-center gap-1 opacity-50" title={`Criado por ${project.createdBy.name}`}>
                                                          <UserIcon size={12}/> {project.createdBy.name}
                                                      </span>
                                                  )
                                              )}
                                          </div>
                                      </div>
                                   </div>
                                   <div className="flex gap-3 items-center">
                                       <Badge color={project.status === 'Concluído' ? 'green' : project.status === 'Produção' ? 'purple' : project.status === 'Manutenção' ? 'yellow' : 'blue'}>{project.status}</Badge>
                                       {canDelete && (<button onClick={(e) => { e.stopPropagation(); handleDelete(project.id); }} className="text-slate-300 hover:text-red-500 p-2 hover:bg-red-50 rounded-full transition-colors"><Trash2 size={18}/></button>)}
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
      {canEdit && <CreateProjectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={loadData} />}
    </>
  );
}