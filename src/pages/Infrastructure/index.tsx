import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Server, Search, Edit2, Trash2, ChevronRight, LayoutGrid, List, Shield } from 'lucide-react';
import { api } from '../../services/api';
import type { Server as ServerType } from '../../types';
import toast from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';
import { ServerModal } from '../../components/Infrastructure/ServerModal';

export default function InfrastructurePage() {
  const navigate = useNavigate();
  const { canAccessInfra } = useAuth();
  
  const [servers, setServers] = useState<ServerType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Estado para controlar o modo de visualização (Grade ou Lista)
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid'); 
  
  // Estados de Modais
  const [isServerModalOpen, setIsServerModalOpen] = useState(false);
  const [editingServer, setEditingServer] = useState<ServerType | null>(null);

  useEffect(() => { loadServers(); }, []);

  const loadServers = async () => {
    try {
      setLoading(true);
      const data = await api.getServers();
      setServers(data);
    } catch (error) { 
      toast.error("Erro ao carregar servidores."); 
    } finally { 
      setLoading(false); 
    }
  };

  const handleSaveServer = async (data: any) => {
      try {
          if (editingServer) {
            await api.updateServer(editingServer.id, data);
            toast.success("Servidor atualizado!");
          } else {
            await api.createServer(data);
            toast.success("Servidor criado!");
          }
          loadServers();
          setIsServerModalOpen(false);
      } catch { toast.error("Erro ao salvar servidor."); }
  };

  const handleDeleteServer = async (id: string) => {
      if (confirm("Apagar servidor? Isso removerá também todos os ambientes associados.")) {
          try {
              await api.deleteServer(id);
              setServers(prev => prev.filter(s => s.id !== id));
              toast.success("Servidor excluído.");
          } catch { toast.error("Erro ao excluir."); }
      }
  };

  // Bloqueio de segurança visual
  if (!canAccessInfra) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-400">
        <Shield size={48} className="mb-4 opacity-20"/>
        <h2 className="text-xl font-bold text-slate-600">Acesso Restrito</h2>
        <p>Você não tem permissão para visualizar a infraestrutura.</p>
      </div>
    );
  }

  const filteredServers = servers.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.ipAddress.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-slate-50">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
            <h2 className="text-xl font-bold text-slate-800">Infraestrutura</h2>
            
            <div className="flex items-center gap-4">
                {/* Controles de Visualização */}
                <div className="flex bg-slate-100 p-1 rounded-lg">
                    <button 
                      onClick={() => setViewMode('grid')} 
                      className={`p-1.5 rounded transition-all ${viewMode === 'grid' ? 'bg-white shadow text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                      title="Visualização em Grade"
                    >
                      <LayoutGrid size={18}/>
                    </button>
                    <button 
                      onClick={() => setViewMode('list')} 
                      className={`p-1.5 rounded transition-all ${viewMode === 'list' ? 'bg-white shadow text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                      title="Visualização em Lista"
                    >
                      <List size={18}/>
                    </button>
                </div>

                <div className="h-6 w-px bg-slate-200 mx-2"></div>

                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="text" 
                      placeholder="Buscar servidor..." 
                      className="pl-10 pr-4 py-2 bg-slate-100 border-none rounded-full text-sm outline-none w-64 transition-all focus:w-80" 
                      value={searchTerm} 
                      onChange={e => setSearchTerm(e.target.value)} 
                    />
                </div>
                
                <button 
                  onClick={() => { setEditingServer(null); setIsServerModalOpen(true); }} 
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium shadow-sm transition-colors"
                >
                  <Plus size={18} /> Novo Servidor
                </button>
            </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
            {loading ? <div className="text-center text-slate-400 mt-10">Carregando infraestrutura...</div> : (
                <>
                {viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                        {filteredServers.map(server => (
                            <div 
                              key={server.id} 
                              className="bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col" 
                              onClick={() => navigate(`/infrastructure/${server.id}`)}
                            >
                                <div className="p-6 flex-1">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="bg-indigo-50 p-3 rounded-xl text-indigo-600 transition-colors group-hover:bg-indigo-100">
                                          <Server size={24}/>
                                        </div>
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button 
                                              onClick={(e) => { e.stopPropagation(); setEditingServer(server); setIsServerModalOpen(true); }} 
                                              className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-indigo-600 transition-colors"
                                              title="Editar"
                                            >
                                              <Edit2 size={16}/>
                                            </button>
                                            <button 
                                              onClick={(e) => { e.stopPropagation(); handleDeleteServer(server.id); }} 
                                              className="p-2 hover:bg-red-50 rounded-full text-slate-400 hover:text-red-600 transition-colors"
                                              title="Excluir"
                                            >
                                              <Trash2 size={16}/>
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <h3 className="font-bold text-lg text-slate-800 mb-1 truncate" title={server.name}>{server.name}</h3>
                                    
                                    <div className="flex flex-wrap items-center gap-2 mb-2">
                                         <span className="text-xs text-indigo-700 font-mono bg-indigo-50 px-2 py-1 rounded border border-indigo-100">
                                           {server.ipAddress}
                                         </span>
                                    </div>
                                    
                                    <div className="text-xs text-slate-500 flex items-center gap-1 mt-2">
                                       <Shield size={12}/> 
                                       <span className="truncate max-w-[150px]">{server.username}</span>
                                    </div>
                                </div>
                                
                                <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center text-xs text-slate-500 rounded-b-xl group-hover:bg-slate-50 transition-colors">
                                    <span className="font-medium">{server.environments?.length || 0} Ambientes</span>
                                    <ChevronRight size={16} className="text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all"/>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm animate-fade-in">
                        {/* Cabeçalho da Lista */}
                        <div className="grid grid-cols-12 gap-4 p-4 border-b border-slate-200 bg-slate-50 text-xs font-bold text-slate-500 uppercase tracking-wider">
                            <div className="col-span-4">Nome</div>
                            <div className="col-span-3">IP / Host</div>
                            <div className="col-span-3">Usuário</div>
                            <div className="col-span-2 text-right">Ambientes</div>
                        </div>

                        {filteredServers.map(server => (
                            <div 
                              key={server.id} 
                              className="grid grid-cols-12 gap-4 p-4 border-b border-slate-100 items-center hover:bg-slate-50 cursor-pointer transition-colors group text-sm" 
                              onClick={() => navigate(`/infrastructure/${server.id}`)}
                            >
                                <div className="col-span-4 font-medium text-slate-800 flex items-center gap-3">
                                    <div className="bg-slate-100 p-1.5 rounded text-slate-500"><Server size={16}/></div>
                                    <span className="truncate">{server.name}</span>
                                </div>
                                <div className="col-span-3 font-mono text-xs text-indigo-600 bg-indigo-50 w-fit px-2 py-0.5 rounded">
                                  {server.ipAddress}
                                </div>
                                <div className="col-span-3 text-slate-600 truncate">{server.username}</div>
                                <div className="col-span-2 flex items-center justify-end gap-3">
                                    <span className="text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-600 border border-slate-200">
                                      {server.environments?.length || 0} VMs
                                    </span>
                                    
                                    {/* Ações na Lista (só aparecem no hover) */}
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button 
                                          onClick={(e) => { e.stopPropagation(); setEditingServer(server); setIsServerModalOpen(true); }} 
                                          className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded"
                                        >
                                          <Edit2 size={14}/>
                                        </button>
                                        <button 
                                          onClick={(e) => { e.stopPropagation(); handleDeleteServer(server.id); }} 
                                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"
                                        >
                                          <Trash2 size={14}/>
                                        </button>
                                    </div>
                                    
                                    <ChevronRight size={16} className="text-slate-300"/>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {filteredServers.length === 0 && (
                    <div className="text-center py-20 border-2 border-dashed border-slate-200 rounded-xl">
                        <Server size={48} className="mx-auto mb-4 text-slate-300"/>
                        <h3 className="text-slate-600 font-semibold text-lg">Nenhum servidor encontrado</h3>
                        <p className="text-slate-400">Adicione um novo servidor para começar a gerenciar sua infraestrutura.</p>
                        <button 
                          onClick={() => { setEditingServer(null); setIsServerModalOpen(true); }} 
                          className="mt-6 text-indigo-600 font-medium hover:underline"
                        >
                          Criar primeiro servidor
                        </button>
                    </div>
                )}
                </>
            )}
        </div>

        <ServerModal 
          isOpen={isServerModalOpen} 
          onClose={() => setIsServerModalOpen(false)} 
          onSave={handleSaveServer} 
          initialData={editingServer} 
        />
    </div>
  );
}