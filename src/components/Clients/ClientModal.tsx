import React, { useState, useEffect } from 'react';
import { Modal } from '../UI/Modal';
import type { Client } from '../../types';

interface ClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { name: string; internalCode: string }) => Promise<void>;
  initialData?: Client | null;
}

export const ClientModal: React.FC<ClientModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [name, setName] = useState('');
  const [internalCode, setInternalCode] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setName(initialData?.name || '');
      setInternalCode(initialData?.internalCode || '');
    }
  }, [isOpen, initialData]);

  const handleSubmit = async () => {
    if (!name || !internalCode) return alert("Preencha todos os campos.");
    setLoading(true);
    try {
      await onSave({ name, internalCode });
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? "Editar Cliente" : "Novo Cliente"}>
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-slate-700">Nome da Empresa</label>
          <input 
            className="w-full p-2.5 border border-slate-300 rounded-lg outline-none focus:border-indigo-500"
            placeholder="Ex: Tech Solutions Ltda"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">Código Interno</label>
          <input 
            className="w-full p-2.5 border border-slate-300 rounded-lg outline-none focus:border-indigo-500 uppercase"
            placeholder="Ex: CLI_001"
            value={internalCode}
            onChange={e => setInternalCode(e.target.value)}
          />
          <p className="text-xs text-slate-400 mt-1">Usado para referência interna nos projetos.</p>
        </div>
        <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
          <button onClick={onClose} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium">Cancelar</button>
          <button 
            onClick={handleSubmit} 
            disabled={loading} 
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-bold disabled:opacity-50"
          >
            {loading ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </div>
    </Modal>
  );
};