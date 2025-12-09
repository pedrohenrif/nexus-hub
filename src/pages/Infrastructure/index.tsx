import React, { useState, useEffect } from 'react';
import { Plus, Server, Database, Search, Edit2, Trash2, ChevronRight, ChevronDown, Copy, Shield, Monitor, Key } from 'lucide-react';
import { api } from '../../services/api';
import type { Server as ServerType, ServerEnvironment } from '../../types';
import toast from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';

// Modais (vou criar no próximo passo)
import { ServerModal } from '../../components/Infrastructure/ServerModal';
import { EnvironmentModal } from '../../components/Infrastructure/EnvironmentModal';

export default function InfrastructurePage() {
  const { canAccessInfra } = useAuth();
  const [servers, setServers] = useState<ServerType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Estados para expansão (acordeão)
  const [expandedServers, setExpandedServers] = useState<Record<string, boolean>>({});

  // Estados de Modais
  const [isServerModalOpen, setIsServerModalOpen] = useState(false);
  const [isEnvModalOpen, setIsEnvModalOpen] = useState(false);
  const [editingServer, setEditingServer] = useState<ServerType | null>(null);
  const [editingEnv, setEditingEnv] = useState<{ env: ServerEnvironment, serverId: string } | null>(null);
  const [targetServerIdForEnv, setTargetServerIdForEnv] = useState<string | null>(null);

  useEffect(() => {
    loadServers();
  }, []);

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

  const toggleServer = (id: string) => {
    setExpandedServers(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // --- AÇÕES DE SERVIDOR ---
  const handleSaveServer = async (data: Partial<ServerType>) => {
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
      if (confirm("Tem certeza? Isso apagará todos os ambientes associados.")) {
          try {
              await api.deleteServer(id);
              toast.success("Servidor excluído.");
              setServers(prev => prev.filter(s => s.id !== id));
          } catch { toast.error("Erro ao excluir."); }
      }
  };

  // --- AÇÕES DE AMBIENTE ---
  const handleOpenAddEnv = (serverId: string) => {
      setTargetServerIdForEnv(serverId);
      setEditingEnv(null);
      setIsEnvModalOpen(true);
  };

  const handleOpenEditEnv = (env: ServerEnvironment, serverId: string) => {
      setEditingEnv({ env, serverId });
      setIsEnvModalOpen(true);
  };

  const handleSaveEnv = async (data: Partial<ServerEnvironment>) => {
      try {
          if (editingEnv) {
              await api.updateEnvironment(editingEnv.env.id, data);
              toast.success("Ambiente atualizado!");
          } else if (targetServerIdForEnv) {
              await api.createEnvironment({ ...data, serverId: targetServerIdForEnv });
              toast.success("Ambiente criado!");
          }
          loadServers();
          setIsEnvModalOpen(false);
      } catch { toast.error("Erro ao salvar ambiente."); }
  };

  const handleDeleteEnv = async (id: string) => {
      if (confirm("Remover este ambiente?")) {
          try {
              await api.deleteEnvironment(id);
              toast.success("Ambiente removido.");
              loadServers();
          } catch { toast.error("Erro ao remover."); }
      }
  };

  const copyToClipboard = (text: string) => {
      navigator.clipboard.writeText(text);
      toast.success("Copiado!", { duration: 1000, icon: '📋' });
  };

  if (!canAccessInfra) return <div className="p-10 text-center text-red-500">Acesso Negado</div>;

  const filteredServers = servers.filter(s => 
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      s.ipAddress.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-slate-50">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
            <h2 className="text-xl font-bold text-slate-800">Infraestrutura</h2>
            <div className="flex items-center gap-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input type="text" placeholder="Buscar servidor..." className="pl-10 pr-4 py-2 bg-slate-100 border-none rounded-full text-sm outline-none w-64" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                </div>
                <button onClick={() => { setEditingServer(null); setIsServerModalOpen(true); }} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium shadow-sm"><Plus size={18} />Novo Servidor</button>
            </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
            {loading ? <div className="text-center text-slate-400">Carregando...</div> : (
                <div className="space-y-6">
                    {filteredServers.map(server => (
                        <div key={server.id} className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                            {/* CABEÇALHO DO SERVIDOR */}
                            <div className="p-5 flex items-center justify-between bg-white hover:bg-slate-50 cursor-pointer transition-colors" onClick={() => toggleServer(server.id)}>
                                <div className="flex items-center gap-4">
                                    <div className={`p-1 text-slate-400 transition-transform duration-200 ${expandedServers[server.id] ? 'rotate-90 text-indigo-600' : ''}`}><ChevronRight size={24}/></div>
                                    <div className="bg-slate-100 p-2 rounded-lg text-slate-600"><Server size={24}/></div>
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-800">{server.name}</h3>
                                        <div className="flex items-center gap-3 text-sm text-slate-500 font-mono mt-0.5">
                                            <span className="flex items-center gap-1"><Shield size={12}/> {server.username}</span>
                                            <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                            <span className="text-indigo-600">{server.ipAddress}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button onClick={(e) => { e.stopPropagation(); setEditingServer(server); setIsServerModalOpen(true); }} className="p-2 text-slate-400 hover:text-indigo-600 rounded-full hover:bg-slate-100"><Edit2 size={18}/></button>
                                    <button onClick={(e) => { e.stopPropagation(); handleDeleteServer(server.id); }} className="p-2 text-slate-400 hover:text-red-600 rounded-full hover:bg-slate-100"><Trash2 size={18}/></button>
                                </div>
                            </div>

                            {/* DETALHES E AMBIENTES (EXPANDIDO) */}
                            {expandedServers[server.id] && (
                                <div className="border-t border-slate-100 bg-slate-50 p-6 animate-fade-in">
                                    
                                    {/* DADOS SENSÍVEIS DO SERVIDOR */}
                                    <div className="mb-6 bg-white p-4 rounded-lg border border-slate-200 flex items-start justify-between">
                                        <div className="space-y-1">
                                            <p className="text-xs font-bold text-slate-400 uppercase">Acesso Root / Admin</p>
                                            <div className="flex items-center gap-4 text-sm">
                                                <span className="font-mono bg-slate-100 px-2 py-1 rounded text-slate-700">User: {server.username}</span>
                                                <div className="flex items-center gap-2 font-mono bg-slate-100 px-2 py-1 rounded text-slate-700 group cursor-pointer" onClick={() => copyToClipboard(server.password || '')}>
                                                    <Key size={12} className="text-slate-400"/>
                                                    <span>{server.password ? '••••••••' : 'Sem senha'}</span>
                                                    <Copy size={12} className="opacity-0 group-hover:opacity-100 text-indigo-500"/>
                                                </div>
                                            </div>
                                            {server.notes && <p className="text-sm text-slate-600 mt-2 italic border-l-2 border-indigo-200 pl-2">{server.notes}</p>}
                                        </div>
                                    </div>

                                    {/* LISTA DE AMBIENTES */}
                                    <div className="flex items-center justify-between mb-4">
                                        <h4 className="text-sm font-bold text-slate-600 uppercase flex items-center gap-2"><Database size={16}/> Ambientes Vinculados</h4>
                                        <button onClick={() => handleOpenAddEnv(server.id)} className="text-xs bg-white border border-indigo-200 text-indigo-600 px-3 py-1.5 rounded-lg hover:bg-indigo-50 font-medium flex items-center gap-1"><Plus size={14}/> Novo Ambiente</button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {server.environments?.map(env => (
                                            <div key={env.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-indigo-300 transition-all group">
                                                <div className="flex justify-between items-start mb-2">
                                                    <span className="font-bold text-slate-800">{env.name}</span>
                                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button onClick={() => handleOpenEditEnv(env, server.id)} className="p-1 text-slate-400 hover:text-indigo-600"><Edit2 size={14}/></button>
                                                        <button onClick={() => handleDeleteEnv(env.id)} className="p-1 text-slate-400 hover:text-red-600"><Trash2 size={14}/></button>
                                                    </div>
                                                </div>
                                                
                                                <div className="space-y-2 text-sm">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">{env.accessType}</span>
                                                        {env.hasFixedIp && <span className="text-[10px] text-green-600 bg-green-50 px-1.5 py-0.5 rounded border border-green-100">IP Fixo</span>}
                                                    </div>
                                                    
                                                    <div className="font-mono text-xs bg-slate-50 p-2 rounded border border-slate-100 break-all cursor-pointer hover:bg-slate-100" onClick={() => copyToClipboard(env.accessId)} title="Copiar ID">
                                                        ID: {env.accessId}
                                                    </div>
                                                    
                                                    {env.accessPassword && (
                                                        <div className="font-mono text-xs bg-slate-50 p-2 rounded border border-slate-100 break-all flex justify-between cursor-pointer hover:bg-slate-100" onClick={() => copyToClipboard(env.accessPassword || '')} title="Copiar Senha">
                                                            <span>PW: ••••••••</span>
                                                            <Copy size={12} className="text-slate-400"/>
                                                        </div>
                                                    )}
                                                    
                                                    {env.notes && <p className="text-xs text-slate-500 mt-2">{env.notes}</p>}
                                                </div>
                                            </div>
                                        ))}
                                        {(!server.environments || server.environments.length === 0) && (
                                            <div className="col-span-3 text-center py-6 text-slate-400 text-sm italic">Nenhum ambiente configurado.</div>
                                        )}
                                    </div>

                                </div>
                            )}
                        </div>
                    ))}
                    {filteredServers.length === 0 && <div className="text-center text-slate-400 mt-10">Nenhum servidor encontrado.</div>}
                </div>
            )}
        </div>

        {/* MODAIS */}
        <ServerModal isOpen={isServerModalOpen} onClose={() => setIsServerModalOpen(false)} onSave={handleSaveServer} initialData={editingServer} />
        <EnvironmentModal isOpen={isEnvModalOpen} onClose={() => setIsEnvModalOpen(false)} onSave={handleSaveEnv} initialData={editingEnv?.env} />
    </div>
  );
}