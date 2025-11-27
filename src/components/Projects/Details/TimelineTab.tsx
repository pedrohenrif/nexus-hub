import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, CheckCircle, Clock, AlertCircle, 
  Plus, Edit2, Trash2, ArrowRight, Hourglass, List, ChevronLeft, ChevronRight 
} from 'lucide-react';
import type { Project, TimelinePhase } from '../../../types';

interface TimelineTabProps {
  project: Project;
  onAddPhase: () => void;
  onEditPhase: (phase: TimelinePhase) => void;
  onDeletePhase: (id: string) => void;
  canEdit: boolean;
}

export const TimelineTab: React.FC<TimelineTabProps> = ({ project, onAddPhase, onEditPhase, onDeletePhase, canEdit }) => {
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('calendar');
  const [currentDate, setCurrentDate] = useState(new Date());

  // Cores por status
  const getStatusColor = (status: string, type: 'border' | 'bg') => {
      switch(status) {
          case 'Concluído': return type === 'border' ? 'border-green-200 text-green-700' : 'bg-green-500';
          case 'Em Andamento': return type === 'border' ? 'border-blue-200 text-blue-700' : 'bg-blue-500';
          case 'Atrasado': return type === 'border' ? 'border-red-200 text-red-700' : 'bg-red-500';
          default: return type === 'border' ? 'border-slate-200 text-slate-500' : 'bg-slate-300';
      }
  };

  const formatDate = (dateStr?: string) => {
      if (!dateStr) return '---';
      return new Date(dateStr).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  };

  // --- CÁLCULOS DE RESUMO ---
  const totalHours = project.timeline?.reduce((acc, curr) => acc + (curr.estimatedHours || 0), 0) || 0;
  const totalPhases = project.timeline?.length || 0;
  const completedPhases = project.timeline?.filter(p => p.status === 'Concluído').length || 0;
  const progress = totalPhases > 0 ? Math.round((completedPhases / totalPhases) * 100) : 0;

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

  return (
    <div className="space-y-8">
      
      {/* HEADER: Título + Controles */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <CalendarIcon size={20} className="text-indigo-600"/> Cronograma
        </h3>
        
        <div className="flex items-center gap-3 bg-slate-100 p-1 rounded-lg">
            <button 
                onClick={() => setViewMode('list')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md flex items-center gap-2 transition-all ${viewMode === 'list' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
                <List size={14} /> Lista
            </button>
            <button 
                onClick={() => setViewMode('calendar')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md flex items-center gap-2 transition-all ${viewMode === 'calendar' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
                <CalendarIcon size={14} /> Calendário
            </button>
        </div>

        {canEdit && (
            <button onClick={onAddPhase} className="flex items-center gap-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 px-3 py-2 rounded-lg border border-indigo-100 transition-colors">
                <Plus size={16} /> Adicionar Fase
            </button>
        )}
      </div>

      {/* RESUMO (Cards de topo) */}
      {totalPhases > 0 && (
          <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl p-6 text-white shadow-md flex justify-between items-center">
              <div className="flex gap-8">
                  <div>
                      <p className="text-slate-400 text-xs uppercase font-bold tracking-wider mb-1">Total Estimado</p>
                      <div className="flex items-baseline gap-1"><span className="text-3xl font-bold">{totalHours}</span><span className="text-sm text-slate-400">horas</span></div>
                  </div>
                  <div className="w-px bg-slate-700"></div>
                  <div>
                      <p className="text-slate-400 text-xs uppercase font-bold tracking-wider mb-1">Progresso</p>
                      <div className="flex items-baseline gap-1"><span className="text-3xl font-bold text-indigo-400">{progress}%</span><span className="text-sm text-slate-400">concluído</span></div>
                  </div>
              </div>
              <div className="hidden sm:block"><div className="bg-white/10 p-3 rounded-full"><Hourglass size={24} className="text-indigo-300"/></div></div>
          </div>
      )}

      {/* VIEW: LISTA (Vertical) */}
      {viewMode === 'list' && (
         (!project.timeline || project.timeline.length === 0) ? (
             <div className="bg-white p-10 rounded-xl border border-dashed border-slate-300 text-center text-slate-400">
                <CalendarIcon size={32} className="mx-auto mb-3 opacity-20"/>
                <p>Nenhuma fase definida. Adicione fases para ver a lista.</p>
             </div>
         ) : (
             <div className="relative space-y-4 pl-4">
                 <div className="absolute left-[29px] top-4 bottom-4 w-0.5 bg-slate-200 -z-10"></div>
                 {project.timeline.map((phase) => (
                     <div key={phase.id} className="flex items-start gap-4 group">
                         <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 shrink-0 bg-white z-10 ${
                             phase.status === 'Concluído' ? 'border-green-500 text-green-500' :
                             phase.status === 'Em Andamento' ? 'border-blue-500 text-blue-500' :
                             phase.status === 'Atrasado' ? 'border-red-500 text-red-500' : 'border-slate-300 text-slate-300'
                         }`}>
                             {phase.status === 'Concluído' ? <CheckCircle size={14} strokeWidth={3} /> : 
                              phase.status === 'Atrasado' ? <AlertCircle size={14} strokeWidth={3} /> :
                              <div className={`w-2 h-2 rounded-full ${phase.status === 'Em Andamento' ? 'bg-blue-500 animate-pulse' : 'bg-slate-300'}`} />}
                         </div>
                         <div className="flex-1 bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-indigo-200 transition-colors flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                             <div>
                                 <div className="flex items-center gap-3 mb-1">
                                     <h4 className="font-bold text-slate-800">{phase.name}</h4>
                                     <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusColor(phase.status, 'border')}`}>{phase.status}</span>
                                 </div>
                                 <div className="flex items-center gap-3 text-xs text-slate-500 font-mono">
                                     <div className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded"><Clock size={12}/> {formatDate(phase.startDate)} <ArrowRight size={10} className="mx-1"/> {formatDate(phase.endDate)}</div>
                                 </div>
                             </div>
                             <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                                 <div className="flex items-center gap-1.5 text-sm font-medium text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100"><Hourglass size={14} className="text-indigo-500"/>{phase.estimatedHours || 0}h</div>
                                 {canEdit && (
                                     <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                         <button onClick={() => onEditPhase(phase)} className="p-2 text-slate-400 hover:text-indigo-600 rounded-full hover:bg-slate-50 transition-colors"><Edit2 size={16}/></button>
                                         <button onClick={() => onDeletePhase(phase.id)} className="p-2 text-slate-400 hover:text-red-600 rounded-full hover:bg-slate-50 transition-colors"><Trash2 size={16}/></button>
                                     </div>
                                 )}
                             </div>
                         </div>
                     </div>
                 ))}
             </div>
         )
      )}

      {/* VIEW: CALENDÁRIO (GANTT VISUAL) */}
      {viewMode === 'calendar' && (
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
              {/* Controles do Mês */}
              <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50">
                  <button onClick={handlePrevMonth} className="p-1 hover:bg-white rounded border border-transparent hover:border-slate-200 transition-all"><ChevronLeft size={20} className="text-slate-500"/></button>
                  <span className="font-bold text-slate-700 capitalize">{monthName}</span>
                  <button onClick={handleNextMonth} className="p-1 hover:bg-white rounded border border-transparent hover:border-slate-200 transition-all"><ChevronRight size={20} className="text-slate-500"/></button>
              </div>

              <div className="overflow-x-auto pb-2">
                  <div className="min-w-[800px]">
                      {/* Cabeçalho dos Dias */}
                      <div className="grid grid-cols-[200px_1fr] border-b border-slate-100">
                          <div className="p-3 text-xs font-bold text-slate-400 uppercase tracking-wider border-r border-slate-100">Fase</div>
                          <div className="grid" style={{ gridTemplateColumns: `repeat(${daysInMonth}, 1fr)` }}>
                              {daysArray.map(day => {
                                  const isToday = isSameDay(new Date(), new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
                                  return (
                                    <div key={day} className={`text-center text-[10px] py-2 border-r border-slate-50 ${isToday ? 'bg-indigo-50 text-indigo-600 font-bold' : 'text-slate-400'}`}>
                                        {day}
                                    </div>
                                  );
                              })}
                          </div>
                      </div>

                      {/* Linhas das Fases */}
                      {(!project.timeline || project.timeline.length === 0) ? (
                           <div className="p-8 text-center text-slate-400 text-sm italic">Nenhuma fase cadastrada.</div>
                      ) : (
                           project.timeline.map(phase => (
                               <div key={phase.id} className="grid grid-cols-[200px_1fr] border-b border-slate-50 hover:bg-slate-50/50 transition-colors group">
                                   <div className="p-3 border-r border-slate-100 flex justify-between items-center">
                                       <span className="text-sm font-medium text-slate-700 truncate pr-2" title={phase.name}>{phase.name}</span>
                                       {canEdit && (
                                            <button onClick={() => onEditPhase(phase)} className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-indigo-600"><Edit2 size={12}/></button>
                                       )}
                                   </div>
                                   <div className="grid relative" style={{ gridTemplateColumns: `repeat(${daysInMonth}, 1fr)` }}>
                                        {/* Grade de Fundo */}
                                        {daysArray.map(day => {
                                            const isToday = isSameDay(new Date(), new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
                                            return <div key={day} className={`border-r border-slate-50 h-10 ${isToday ? 'bg-indigo-50/30' : ''}`}></div>;
                                        })}
                                        
                                        {/* Barra da Fase */}
                                        {(() => {
                                            if (!phase.startDate || !phase.endDate) return null;
                                            const start = new Date(phase.startDate);
                                            const end = new Date(phase.endDate);
                                            
                                            const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
                                            const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

                                            // Se a fase não intersecta este mês, não renderiza
                                            if (end < monthStart || start > monthEnd) return null;

                                            // Ajuste visual (clamp) para o mês atual
                                            const barStart = start < monthStart ? monthStart : start;
                                            const barEnd = end > monthEnd ? monthEnd : end;

                                            const startDay = barStart.getDate();
                                            const endDay = barEnd.getDate();
                                            const duration = endDay - startDay + 1;

                                            return (
                                                <div 
                                                    className={`absolute top-2 bottom-2 rounded-full opacity-80 shadow-sm ${getStatusColor(phase.status, 'bg')}`}
                                                    style={{
                                                        left: `${((startDay - 1) / daysInMonth) * 100}%`,
                                                        width: `${(duration / daysInMonth) * 100}%`,
                                                        minWidth: '6px' // Mínimo visível
                                                    }}
                                                    title={`${phase.name}: ${phase.status}`}
                                                ></div>
                                            );
                                        })()}
                                   </div>
                               </div>
                           ))
                      )}
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};