import React, { useState, useEffect } from 'react';
import { Modal } from '../../UI/Modal';
import type { TimelinePhase } from '../../../types/index';
import { Clock } from 'lucide-react';

interface AddPhaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<TimelinePhase>) => Promise<void>;
  initialData?: TimelinePhase | null;
}

export const AddPhaseModal: React.FC<AddPhaseModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [name, setName] = useState('');
  const [status, setStatus] = useState('Pendente');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [estimatedHours, setEstimatedHours] = useState<number>(0); // Novo estado para horas
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setName(initialData.name);
        setStatus(initialData.status);
        // Formata para o input date (YYYY-MM-DD)
        setStartDate(initialData.startDate ? new Date(initialData.startDate).toISOString().split('T')[0] : '');
        setEndDate(initialData.endDate ? new Date(initialData.endDate).toISOString().split('T')[0] : '');
        setEstimatedHours(initialData.estimatedHours || 0);
      } else {
        setName(''); setStatus('Pendente'); setStartDate(''); setEndDate(''); setEstimatedHours(0);
      }
    }
  }, [isOpen, initialData]);

  const handleSubmit = async () => {
    if (!name) return alert("O nome da fase é obrigatório.");
    setLoading(true);
    try {
      await onSave({ name, status: status as any, startDate, endDate, estimatedHours });
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? "Editar Fase" : "Nova Fase do Cronograma"}>
      <div className="space-y-4">
        <div>
            <label className="text-xs font-medium text-slate-500 block mb-1">Nome da Fase</label>
            <input 
                className="w-full p-2 text-sm border border-slate-300 rounded outline-none focus:border-indigo-500 transition-colors" 
                placeholder="Ex: Homologação com Cliente" 
                value={name} 
                onChange={e => setName(e.target.value)} 
            />
        </div>
        
        <div className="flex gap-3">
            <div className="w-1/2">
                <label className="text-xs font-medium text-slate-500 block mb-1">Status Atual</label>
                <select 
                    className="w-full p-2 text-sm border border-slate-300 rounded bg-white outline-none focus:border-indigo-500 transition-colors" 
                    value={status} 
                    onChange={e => setStatus(e.target.value)}
                >
                    <option>Pendente</option>
                    <option>Em Andamento</option>
                    <option>Concluído</option>
                    <option>Atrasado</option>
                </select>
            </div>
            <div className="w-1/2 relative">
                <label className="text-xs font-medium text-slate-500 block mb-1">Horas Estimadas</label>
                <div className="relative">
                    <Clock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
                    <input 
                        type="number" 
                        min="0"
                        className="w-full pl-8 pr-2 py-2 text-sm border border-slate-300 rounded outline-none focus:border-indigo-500 transition-colors" 
                        value={estimatedHours} 
                        onChange={e => setEstimatedHours(Number(e.target.value))} 
                    />
                </div>
            </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
            <div>
                <label className="text-xs font-medium text-slate-500 block mb-1">Data Início</label>
                <input 
                    type="date" 
                    className="w-full p-2 text-sm border border-slate-300 rounded outline-none focus:border-indigo-500 transition-colors" 
                    value={startDate} 
                    onChange={e => setStartDate(e.target.value)} 
                />
            </div>
            <div>
                <label className="text-xs font-medium text-slate-500 block mb-1">Data Fim (Previsão)</label>
                <input 
                    type="date" 
                    className="w-full p-2 text-sm border border-slate-300 rounded outline-none focus:border-indigo-500 transition-colors" 
                    value={endDate} 
                    onChange={e => setEndDate(e.target.value)} 
                />
            </div>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
          <button onClick={onClose} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-medium transition-colors">Cancelar</button>
          <button 
            onClick={handleSubmit} 
            disabled={loading} 
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-bold disabled:opacity-50 transition-colors shadow-sm"
          >
            {loading ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </div>
    </Modal>
  );
};