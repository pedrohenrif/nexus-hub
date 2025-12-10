import React, { useState, useEffect, useMemo } from 'react';
import { 
    Calendar as CalendarIcon, Filter, Search, User, List, 
    ChevronLeft, ChevronRight, CheckCircle, AlertCircle, Layers
} from 'lucide-react';
import { api } from '../../services/api';
import type { Project, User as UserType, TimelinePhase } from '../../types';
import toast from 'react-hot-toast';

export default function GlobalTimelinePage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);

  // UI States
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('calendar'); 
  const [currentDate, setCurrentDate] = useState(new Date());

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
          const matchesUser = userFilter === 'Todos' || p.members?.some(m => m.id === userFilter);
          return matchesStatus && matchesUser;
      });
  }, [projects, userFilter, statusFilter]);

  // --- LÓGICA DO CALENDÁRIO ---
  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const daysInMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const monthName = currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

  const handlePrevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const isSameDay = (d1: Date, d2: Date) => 
    d1.getDate() === d2.getDate() && 
    d1.getMonth() === d2.getMonth() && 
    d1.getFullYear() === d2.getFullYear();

  const getStatusColor = (status: string) => {
      switch(status) {
          case 'Concluído': return 'bg-green-500';
          case 'Em Andamento': return 'bg-blue-500';
          case 'Atrasado': return 'bg-red-500';
          default: return 'bg-slate-300';
      }
  };

  if (loading) return <div className="p-8 text-center text-slate-400">Carregando cronograma...</div>;

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-hidden"> {/* overflow-hidden na raiz para evitar scroll duplo */}
       <header className="h-auto bg-white border-b border-slate-200 px-8 py-4 shrink-0 z-20">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
              <h2 className="text-xl font-bold text-slate-800">Cronograma Geral</h2>
              
              <div className="flex items-center gap-3 bg-slate-100 p-1 rounded-lg w-fit">
                    <button 
                        onClick={() => setViewMode('list')}
                        className={`px-3 py-1.5 text-xs font-medium rounded-md flex items-center gap-2 transition-all ${viewMode === 'list' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        <List size={14} /> Lista Detalhada
                    </button>
                    <button 
                        onClick={() => setViewMode('calendar')}
                        className={`px-3 py-1.5 text-xs font-medium rounded-md flex items-center gap-2 transition-all ${viewMode === 'calendar' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        <CalendarIcon size={14} /> Calendário Mestre
                    </button>
              </div>
          </div>
          
          <div className="flex flex-wrap gap-3">
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
                    <option value="Manutenção">Manutenção</option>
                    <option value="Parado">Parado</option>
                    <option value="Cancelado">Cancelado</option>
                </select>
            </div>
          </div>
       </header>

       {/* ÁREA DE CONTEÚDO - Ajustamos o container para flexibilizar o layout */}
       <div className="flex-1 flex flex-col min-h-0">
          
          {/* MODO CALENDÁRIO (GANTT MESTRE) */}
          {viewMode === 'calendar' && (
              <div className="flex-1 p-6 min-h-0 flex flex-col">
                  <div className="bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col h-full overflow-hidden">
                      {/* Header do Calendário (Fixo) */}
                      <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50 shrink-0">
                          <button onClick={handlePrevMonth} className="p-1 hover:bg-white rounded border border-transparent hover:border-slate-200"><ChevronLeft size={20} className="text-slate-500"/></button>
                          <span className="font-bold text-slate-700 capitalize">{monthName}</span>
                          <button onClick={handleNextMonth} className="p-1 hover:bg-white rounded border border-transparent hover:border-slate-200"><ChevronRight size={20} className="text-slate-500"/></button>
                      </div>

                      {/* Área Rolável (Corpo) */}
                      <div className="flex-1 overflow-auto"> {/* 'overflow-auto' aqui habilita scroll X e Y */}
                          <div className="min-w-[1000px]">
                              
                              {/* Cabeçalho dos Dias (STICKY TOP) */}
                              <div className="sticky top-0 z-20 grid grid-cols-[250px_1fr] border-b border-slate-200 bg-slate-50 shadow-sm">
                                  <div className="p-3 text-xs font-bold text-slate-500 uppercase tracking-wider border-r border-slate-200 bg-slate-50">
                                      Projetos & Fases
                                  </div>
                                  <div className="grid" style={{ gridTemplateColumns: `repeat(${daysInMonth}, 1fr)` }}>
                                      {daysArray.map(day => {
                                          const isToday = isSameDay(new Date(), new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
                                          return (
                                            <div key={day} className={`text-center text-[10px] py-2 border-r border-slate-100 ${isToday ? 'bg-indigo-100 text-indigo-700 font-bold' : 'text-slate-400'}`}>
                                                {day}
                                            </div>
                                          );
                                      })}
                                  </div>
                              </div>

                              {/* Corpo do Calendário */}
                              <div className="z-0">
                                {filteredProjects.map(proj => (
                                    <React.Fragment key={proj.id}>
                                        {/* Linha do Projeto */}
                                        <div className="grid grid-cols-[250px_1fr] bg-slate-50/50 border-b border-slate-200">
                                            <div className="p-2 px-4 border-r border-slate-200 font-bold text-slate-700 text-sm flex justify-between items-center bg-slate-50/50 sticky left-0 z-10"> {/* Opcional: Nome do projeto também fixo à esquerda */}
                                                <span className="truncate pr-2">{proj.title}</span>
                                                <span className="text-[10px] bg-white border px-1.5 rounded text-slate-500">{proj.client}</span>
                                            </div>
                                            <div className="grid" style={{ gridTemplateColumns: `repeat(${daysInMonth}, 1fr)` }}>
                                                {daysArray.map(day => (
                                                    <div key={day} className={`border-r border-slate-100 ${isSameDay(new Date(), new Date(currentDate.getFullYear(), currentDate.getMonth(), day)) ? 'bg-indigo-50/20' : ''}`}></div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Linhas das Fases */}
                                        {proj.timeline?.map(phase => (
                                            <div key={phase.id} className="grid grid-cols-[250px_1fr] border-b border-slate-100 hover:bg-slate-50/30 transition-colors h-10 group">
                                                <div className="p-2 px-6 border-r border-slate-200 flex items-center text-xs text-slate-600 border-l-4 border-l-indigo-100 bg-white/50">
                                                    <span className="truncate">{phase.name}</span>
                                                </div>
                                                
                                                <div className="grid relative" style={{ gridTemplateColumns: `repeat(${daysInMonth}, 1fr)` }}>
                                                    {/* Grade de Fundo */}
                                                    {daysArray.map(day => (
                                                        <div key={day} className={`border-r border-slate-50 h-full ${isSameDay(new Date(), new Date(currentDate.getFullYear(), currentDate.getMonth(), day)) ? 'bg-indigo-50/20' : ''}`}></div>
                                                    ))}
                                                    
                                                    {/* Barra da Fase */}
                                                    {(() => {
                                                        if (!phase.startDate || !phase.endDate) return null;
                                                        const start = new Date(phase.startDate);
                                                        const end = new Date(phase.endDate);
                                                        const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
                                                        const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

                                                        if (end < monthStart || start > monthEnd) return null;

                                                        const barStart = start < monthStart ? monthStart : start;
                                                        const barEnd = end > monthEnd ? monthEnd : end;
                                                        const startDay = barStart.getDate();
                                                        const endDay = barEnd.getDate();
                                                        const duration = endDay - startDay + 1;

                                                        return (
                                                            <div 
                                                                className={`absolute top-2 bottom-2 rounded-md shadow-sm ${getStatusColor(phase.status)}`}
                                                                style={{
                                                                    left: `${((startDay - 1) / daysInMonth) * 100}%`,
                                                                    width: `${(duration / daysInMonth) * 100}%`,
                                                                    minWidth: '10px',
                                                                    marginLeft: '2px',
                                                                    marginRight: '2px'
                                                                }}
                                                                title={`${phase.name} (${phase.status})\n${start.toLocaleDateString()} - ${end.toLocaleDateString()}`}
                                                            >
                                                                {duration > 2 && <span className="text-[9px] text-white font-medium px-2 truncate block">{phase.name}</span>}
                                                            </div>
                                                        );
                                                    })()}
                                                </div>
                                            </div>
                                        ))}
                                    </React.Fragment>
                                ))}
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          )}

          {/* MODO LISTA (ANTIGO) - Mantido para fallback se precisar */}
          {viewMode === 'list' && (
              <div className="overflow-y-auto p-8 space-y-8">
                  {filteredProjects.map(proj => (
                    <div key={proj.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
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

                        <div className="p-6 overflow-x-auto">
                            {/* Lista simples do projeto */}
                            {(!proj.timeline || proj.timeline.length === 0) ? (
                                <div className="text-center text-slate-400 text-sm py-4 italic">Sem cronograma definido.</div>
                            ) : (
                                <ul className="space-y-2">
                                    {proj.timeline.map(phase => (
                                        <li key={phase.id} className="flex items-center gap-2 text-sm text-slate-600">
                                            <div className={`w-2 h-2 rounded-full ${phase.status === 'Concluído' ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                                            <span className="font-bold">{phase.name}:</span>
                                            <span>{phase.status}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                  ))}
              </div>
          )}
          
          {filteredProjects.length === 0 && (
              <div className="text-center py-20 border border-dashed border-slate-300 rounded-xl bg-slate-50/50 mt-8 mx-8">
                 <Layers size={40} className="mx-auto text-slate-300 mb-4"/>
                 <h3 className="text-slate-600 font-semibold">Nenhum projeto encontrado</h3>
                 <p className="text-slate-400 text-sm mt-1">Tente ajustar os filtros para ver os cronogramas.</p>
              </div>
          )}
       </div>
    </div>
  );
}