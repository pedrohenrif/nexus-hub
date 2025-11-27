import React, { useState, useEffect, useMemo } from 'react';
import { Calendar, Filter, Search, User } from 'lucide-react';
import { api } from '../../services/api';
import type { Project, User as UserType } from '../../types';
import toast from 'react-hot-toast';

export default function GlobalTimelinePage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);

  // Filtros
  const [userFilter, setUserFilter] = useState('Todos');
  const [statusFilter, setStatusFilter] = useState('Todos');

  useEffect(() => {
    const load = async () => {
        try {
            const [projData, userData] = await Promise.all([
                api.getGlobalTimeline(),
                api.getUsers()
            ]);
            setProjects(projData);
            setUsers(userData);
        } catch (err) {
            toast.error("Erro ao carregar cronogramas.");
        } finally {
            setLoading(false);
        }
    };
    load();
  }, []);

  // Filtragem
  const filteredProjects = useMemo(() => {
      return projects.filter(p => {
          const matchesStatus = statusFilter === 'Todos' || p.status === statusFilter;
          
          // Verifica se o usuário selecionado é membro do projeto
          const matchesUser = userFilter === 'Todos' || p.members?.some(m => m.id === userFilter);

          return matchesStatus && matchesUser;
      });
  }, [projects, userFilter, statusFilter]);

  if (loading) return <div className="p-8 text-center text-slate-400">Carregando cronograma...</div>;

  return (
    <div className="flex flex-col h-full bg-slate-50">
       <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <h2 className="text-xl font-bold text-slate-800">Cronograma Geral</h2>
          
          <div className="flex gap-3">
              <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-lg border border-slate-200">
                <User size={16} className="text-slate-400 ml-2" />
                <select 
                    className="bg-transparent text-sm text-slate-700 font-medium outline-none p-1 cursor-pointer min-w-[150px]"
                    value={userFilter}
                    onChange={(e) => setUserFilter(e.target.value)}
                >
                    <option value="Todos">Todos Responsáveis</option>
                    {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                </select>
            </div>

            <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-lg border border-slate-200">
                <Filter size={16} className="text-slate-400 ml-2" />
                <select 
                    className="bg-transparent text-sm text-slate-700 font-medium outline-none p-1 cursor-pointer min-w-[130px]"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="Todos">Todos Status</option>
                    <option value="Em Andamento">Em Andamento</option>
                    <option value="Produção">Produção</option>
                    <option value="Planejamento">Planejamento</option>
                </select>
            </div>
          </div>
       </header>

       <div className="flex-1 overflow-y-auto p-8 space-y-8">
          {filteredProjects.map(proj => (
              <div key={proj.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                  {/* Cabeçalho do Projeto */}
                  <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                      <div>
                          <div className="flex items-center gap-2">
                              <h3 className="font-bold text-slate-800">{proj.title}</h3>
                              <span className="text-xs text-slate-500 bg-white border px-2 py-0.5 rounded">{proj.client}</span>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                              {proj.members && proj.members.length > 0 ? (
                                  <div className="flex -space-x-2">
                                      {proj.members.map(m => (
                                          <div key={m.id} className="w-6 h-6 rounded-full bg-indigo-500 border-2 border-white flex items-center justify-center text-[10px] text-white font-bold" title={m.name}>
                                              {m.name.charAt(0)}
                                          </div>
                                      ))}
                                  </div>
                              ) : <span className="text-xs text-slate-400 italic">Sem responsáveis</span>}
                          </div>
                      </div>
                      <div className="text-xs font-bold px-3 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-100">
                          {proj.status}
                      </div>
                  </div>

                  {/* Linha do Tempo */}
                  <div className="p-6 overflow-x-auto">
                      {(!proj.timeline || proj.timeline.length === 0) ? (
                          <div className="text-center text-slate-400 text-sm py-4 italic">Sem cronograma definido.</div>
                      ) : (
                          <div className="flex gap-4 min-w-max">
                              {proj.timeline.map((phase, idx) => (
                                  <div key={phase.id} className="relative flex flex-col items-center min-w-[140px]">
                                      {/* Linha conectora (exceto no último) */}
                                      {idx < (proj.timeline?.length || 0) - 1 && (
                                          <div className="absolute top-3 left-[50%] w-full h-0.5 bg-slate-200 -z-10"></div>
                                      )}
                                      
                                      <div className={`w-6 h-6 rounded-full border-2 bg-white z-10 mb-2 ${
                                          phase.status === 'Concluído' ? 'border-green-500' :
                                          phase.status === 'Em Andamento' ? 'border-blue-500 animate-pulse' :
                                          'border-slate-300'
                                      }`}></div>
                                      
                                      <div className="text-center">
                                          <p className="font-bold text-sm text-slate-700 truncate max-w-[140px]" title={phase.name}>{phase.name}</p>
                                          <p className="text-[10px] text-slate-400 font-mono">
                                              {phase.startDate ? new Date(phase.startDate).toLocaleDateString() : '?'}
                                          </p>
                                      </div>
                                  </div>
                              ))}
                          </div>
                      )}
                  </div>
              </div>
          ))}
          
          {filteredProjects.length === 0 && (
              <div className="text-center text-slate-400 mt-10">Nenhum projeto encontrado com esses filtros.</div>
          )}
       </div>
    </div>
  );
}