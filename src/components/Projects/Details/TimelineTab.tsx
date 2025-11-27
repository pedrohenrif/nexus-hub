import React from 'react';
import { Calendar, CheckCircle, Clock, AlertCircle, Plus, Edit2, Trash2, ArrowRight, Hourglass } from 'lucide-react';
import type { Project, TimelinePhase } from '../../../types';

interface TimelineTabProps {
  project: Project;
  onAddPhase: () => void;
  onEditPhase: (phase: TimelinePhase) => void;
  onDeletePhase: (id: string) => void;
  canEdit: boolean;
}

export const TimelineTab: React.FC<TimelineTabProps> = ({ project, onAddPhase, onEditPhase, onDeletePhase, canEdit }) => {
  
  const getStatusColor = (status: string) => {
      switch(status) {
          case 'Concluído': return 'text-green-700 bg-green-50 border-green-200';
          case 'Em Andamento': return 'text-blue-700 bg-blue-50 border-blue-200';
          case 'Atrasado': return 'text-red-700 bg-red-50 border-red-200';
          default: return 'text-slate-500 bg-slate-100 border-slate-200';
      }
  };

  const formatDate = (dateStr?: string) => {
      if (!dateStr) return '---';
      return new Date(dateStr).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  };

  // Cálculos de Resumo
  // Soma as horas estimadas de todas as fases (garantindo que seja número)
  const totalHours = project.timeline?.reduce((acc, curr) => acc + (curr.estimatedHours || 0), 0) || 0;
  
  const totalPhases = project.timeline?.length || 0;
  const completedPhases = project.timeline?.filter(p => p.status === 'Concluído').length || 0;
  
  // Calcula porcentagem de progresso baseado em fases concluídas
  const progress = totalPhases > 0 ? Math.round((completedPhases / totalPhases) * 100) : 0;

  return (
    <div className="space-y-8">
      
      {/* HEADER COM BOTÃO DE ADICIONAR */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <Calendar size={20} className="text-indigo-600"/> Cronograma
        </h3>
        {canEdit && (
            <button 
                onClick={onAddPhase} 
                className="flex items-center gap-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 px-3 py-2 rounded-lg border border-indigo-100 transition-colors"
            >
                <Plus size={16} /> Adicionar Fase
            </button>
        )}
      </div>

      {/* CARD DE RESUMO DE CARGA HORÁRIA E PROGRESSO */}
      {totalPhases > 0 && (
          <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl p-6 text-white shadow-md flex justify-between items-center">
              <div className="flex gap-8">
                  {/* Total de Horas */}
                  <div>
                      <p className="text-slate-400 text-xs uppercase font-bold tracking-wider mb-1">Total Estimado</p>
                      <div className="flex items-baseline gap-1">
                          <span className="text-3xl font-bold">{totalHours}</span>
                          <span className="text-sm text-slate-400">horas</span>
                      </div>
                  </div>
                  
                  <div className="w-px bg-slate-700"></div>
                  
                  {/* Progresso Geral */}
                  <div>
                      <p className="text-slate-400 text-xs uppercase font-bold tracking-wider mb-1">Progresso</p>
                      <div className="flex items-baseline gap-1">
                          <span className="text-3xl font-bold text-indigo-400">{progress}%</span>
                          <span className="text-sm text-slate-400">concluído</span>
                      </div>
                  </div>
              </div>
              
              <div className="hidden sm:block">
                  <div className="bg-white/10 p-3 rounded-full">
                      <Hourglass size={24} className="text-indigo-300"/>
                  </div>
              </div>
          </div>
      )}

      {/* LISTA DE FASES (TIMELINE VISUAL) */}
      {(!project.timeline || project.timeline.length === 0) ? (
         <div className="bg-white p-10 rounded-xl border border-dashed border-slate-300 text-center text-slate-400">
            <Calendar size={32} className="mx-auto mb-3 opacity-20"/>
            <p>Nenhuma fase definida. Adicione fases e horas para gerar o cronograma.</p>
         </div>
      ) : (
         <div className="relative space-y-4 pl-4">
             {/* Linha Vertical Conectora */}
             <div className="absolute left-[29px] top-4 bottom-4 w-0.5 bg-slate-200 -z-10"></div>

             {project.timeline.map((phase) => (
                 <div key={phase.id} className="flex items-start gap-4 group">
                     {/* Ícone de Status (Bolinha colorida na linha do tempo) */}
                     <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 shrink-0 bg-white z-10 ${
                         phase.status === 'Concluído' ? 'border-green-500 text-green-500' :
                         phase.status === 'Em Andamento' ? 'border-blue-500 text-blue-500' :
                         phase.status === 'Atrasado' ? 'border-red-500 text-red-500' :
                         'border-slate-300 text-slate-300'
                     }`}>
                         {phase.status === 'Concluído' ? <CheckCircle size={14} strokeWidth={3} /> : 
                          phase.status === 'Atrasado' ? <AlertCircle size={14} strokeWidth={3} /> :
                          <div className={`w-2 h-2 rounded-full ${phase.status === 'Em Andamento' ? 'bg-blue-500 animate-pulse' : 'bg-slate-300'}`} />}
                     </div>

                     {/* Card da Fase */}
                     <div className="flex-1 bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-indigo-200 transition-colors flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                         <div>
                             <div className="flex items-center gap-3 mb-1">
                                 <h4 className="font-bold text-slate-800">{phase.name}</h4>
                                 <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusColor(phase.status)}`}>
                                     {phase.status}
                                 </span>
                             </div>
                             <div className="flex items-center gap-3 text-xs text-slate-500 font-mono">
                                 <div className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded">
                                    <Clock size={12}/> {formatDate(phase.startDate)} <ArrowRight size={10} className="mx-1"/> {formatDate(phase.endDate)}
                                 </div>
                             </div>
                         </div>

                         <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                             {/* Badge de Horas */}
                             <div className="flex items-center gap-1.5 text-sm font-medium text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                                 <Hourglass size={14} className="text-indigo-500"/>
                                 {phase.estimatedHours || 0}h
                             </div>

                             {/* Botões de Ação (Editar/Excluir) */}
                             {canEdit && (
                                 <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                     <button 
                                        onClick={() => onEditPhase(phase)} 
                                        className="p-2 text-slate-400 hover:text-indigo-600 rounded-full hover:bg-slate-50 transition-colors"
                                        title="Editar Fase"
                                     >
                                        <Edit2 size={16}/>
                                     </button>
                                     <button 
                                        onClick={() => onDeletePhase(phase.id)} 
                                        className="p-2 text-slate-400 hover:text-red-600 rounded-full hover:bg-slate-50 transition-colors"
                                        title="Excluir Fase"
                                     >
                                        <Trash2 size={16}/>
                                     </button>
                                 </div>
                             )}
                         </div>
                     </div>
                 </div>
             ))}
         </div>
      )}
    </div>
  );
};