import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import type { Server, ServerEnvironment } from '../../types';
import toast from 'react-hot-toast';

import { ServerHeader } from '../../components/Infrastructure/Details/ServerHeader';
import { ServerInfoTab } from '../../components/Infrastructure/Details/ServerInfoTab';
import { VMsTab } from '../../components/Infrastructure/Details/VMsTab';

import { ServerModal } from '../../components/Infrastructure/ServerModal';
import { EnvironmentModal } from '../../components/Infrastructure/EnvironmentModal';

export default function ServerDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [server, setServer] = useState<Server | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'info' | 'vms'>('info');

  // Modais
  const [isServerModalOpen, setIsServerModalOpen] = useState(false);
  const [isEnvModalOpen, setIsEnvModalOpen] = useState(false);
  const [envToEdit, setEnvToEdit] = useState<ServerEnvironment | null>(null);

  // --- CORREÇÃO DA FUNÇÃO LOAD ---
  const loadServer = async () => {
      // Se não tiver ID, nem tenta buscar e já para o loading
      if (!id) {
          setLoading(false);
          return;
      }

      setLoading(true); 
      
      try {
          console.log(`Buscando servidor com ID: ${id}...`); // Log para debug
          const data = await api.getServerById(id);
          setServer(data);
      } catch (error: any) {
          console.error("Erro ao carregar detalhes do servidor:", error);
          // Mostra a mensagem real do erro vinda da API (Ex: "404 Not Found" ou "Network Error")
          toast.error(error.message || 'Erro ao carregar servidor.');
          
          // Comentei o redirect para você poder ver o erro na tela/console sem sair da página
          // navigate('/infrastructure'); 
      } finally {
          setLoading(false); 
      }
  };

  useEffect(() => { loadServer(); }, [id]);

  // Handlers
  const handleUpdateServer = async (data: any) => {
      if (!server) return;
      try {
          await api.updateServer(server.id, data);
          toast.success("Servidor atualizado!");
          loadServer();
          setIsServerModalOpen(false);
      } catch { toast.error("Erro ao atualizar."); }
  };

  const handleDeleteServer = async () => {
      if (!server) return;
      if (confirm("Tem certeza? Isso apagará todos os dados deste servidor.")) {
          try {
              await api.deleteServer(server.id);
              toast.success("Servidor excluído.");
              navigate('/infrastructure');
          } catch { toast.error("Erro ao excluir."); }
      }
  };

  const handleSaveEnv = async (data: any) => {
      if (!server) return;
      try {
          if (envToEdit) {
              await api.updateEnvironment(envToEdit.id, data);
              toast.success("Ambiente atualizado!");
          } else {
              await api.createEnvironment({ ...data, serverId: server.id });
              toast.success("Ambiente criado!");
          }
          loadServer();
          setIsEnvModalOpen(false);
      } catch { toast.error("Erro ao salvar ambiente."); }
  };

  const handleDeleteEnv = async (envId: string) => {
      if (confirm("Remover este ambiente?")) {
          try {
              await api.deleteEnvironment(envId);
              toast.success("Ambiente removido.");
              loadServer();
          } catch { toast.error("Erro ao remover."); }
      }
  };

  const openAddEnv = () => { setEnvToEdit(null); setIsEnvModalOpen(true); };
  const openEditEnv = (env: ServerEnvironment) => { setEnvToEdit(env); setIsEnvModalOpen(true); };

  if (loading) return <div className="flex items-center justify-center h-full text-slate-400">Carregando detalhes...</div>;
  
  if (!server) return (
    <div className="p-10 flex flex-col items-center justify-center h-full text-center">
        <h2 className="text-xl font-bold text-red-500 mb-2">Servidor não encontrado</h2>
        <p className="text-slate-500 mb-4">Verifique se o backend está rodando e se a rota está correta.</p>
        <button onClick={() => navigate('/infrastructure')} className="text-indigo-600 hover:underline">Voltar para lista</button>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-slate-50">
        <ServerHeader server={server} onEdit={() => setIsServerModalOpen(true)} onDelete={handleDeleteServer} />

        {/* TABS */}
        <div className="bg-white border-b border-slate-200 px-6">
            <div className="flex gap-8">
                <button onClick={() => setActiveTab('info')} className={`py-4 text-sm font-medium transition-colors border-b-2 ${activeTab === 'info' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
                    Informações Gerais
                </button>
                <button onClick={() => setActiveTab('vms')} className={`py-4 text-sm font-medium transition-colors border-b-2 ${activeTab === 'vms' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
                    Ambientes & VMs <span className="bg-slate-100 text-slate-600 text-[10px] px-2 py-0.5 rounded-full ml-1">{server.environments?.length || 0}</span>
                </button>
            </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8">
            {/* Removido max-w-6xl e mx-auto para ocupar a largura total */}
            <div className="w-full">
                {activeTab === 'info' && <ServerInfoTab server={server} />}
                {activeTab === 'vms' && <VMsTab environments={server.environments || []} onAdd={openAddEnv} onEdit={openEditEnv} onDelete={handleDeleteEnv} />}
            </div>
        </div>

        {/* MODAIS */}
        <ServerModal isOpen={isServerModalOpen} onClose={() => setIsServerModalOpen(false)} onSave={handleUpdateServer} initialData={server} />
        <EnvironmentModal isOpen={isEnvModalOpen} onClose={() => setIsEnvModalOpen(false)} onSave={handleSaveEnv} initialData={envToEdit} />
    </div>
  );
}