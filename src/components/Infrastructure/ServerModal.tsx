import React, { useState, useEffect } from 'react';
import { Modal } from '../UI/Modal';
import type { Server } from '../../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
  initialData?: Server | null;
}

export const ServerModal: React.FC<Props> = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState({ name: '', ipAddress: '', username: '', password: '', notes: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
        setFormData(initialData ? { ...initialData, password: initialData.password || '' } : { name: '', ipAddress: '', username: '', password: '', notes: '' });
    }
  }, [isOpen, initialData]);

  const handleSubmit = async () => {
      if(!formData.name || !formData.ipAddress) return alert("Nome e IP obrigatórios");
      setLoading(true);
      await onSave(formData);
      setLoading(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? "Editar Servidor" : "Novo Servidor"}>
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <input className="p-2 border rounded w-full outline-none" placeholder="Nome (Ex: SRV-01)" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                <input className="p-2 border rounded w-full outline-none" placeholder="IP / Link" value={formData.ipAddress} onChange={e => setFormData({...formData, ipAddress: e.target.value})} />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <input className="p-2 border rounded w-full outline-none" placeholder="Usuário" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} />
                <input className="p-2 border rounded w-full outline-none" type="text" placeholder="Senha" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
            </div>
            <textarea className="p-2 border rounded w-full h-20 outline-none resize-none" placeholder="Observações..." value={formData.notes || ''} onChange={e => setFormData({...formData, notes: e.target.value})} />
            <div className="flex justify-end gap-2 pt-4">
                <button onClick={onClose} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded">Cancelar</button>
                <button onClick={handleSubmit} disabled={loading} className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">{loading ? 'Salvando...' : 'Salvar'}</button>
            </div>
        </div>
    </Modal>
  );
};