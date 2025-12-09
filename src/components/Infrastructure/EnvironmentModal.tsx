import React, { useState, useEffect } from 'react';
import { Modal } from '../UI/Modal';
import type { ServerEnvironment } from '../../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
  initialData?: ServerEnvironment | null;
}

export const EnvironmentModal: React.FC<Props> = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState({ name: '', accessType: 'Anydesk', accessId: '', accessPassword: '', hasFixedIp: false, notes: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
        setFormData(initialData ? { ...initialData, accessPassword: initialData.accessPassword || '' } : { name: '', accessType: 'Anydesk', accessId: '', accessPassword: '', hasFixedIp: false, notes: '' });
    }
  }, [isOpen, initialData]);

  const handleSubmit = async () => {
      if(!formData.name || !formData.accessId) return alert("Nome e ID de acesso obrigatórios");
      setLoading(true);
      await onSave(formData);
      setLoading(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? "Editar Ambiente" : "Novo Ambiente"}>
        <div className="space-y-4">
            <div className="flex gap-4">
                <select className="p-2 border rounded w-1/3 bg-white outline-none" value={formData.accessType} onChange={e => setFormData({...formData, accessType: e.target.value})}>
                    <option>Anydesk</option><option>TeamViewer</option><option>SSH</option><option>VPN</option><option>RDP</option><option>Web</option>
                </select>
                <input className="p-2 border rounded flex-1 outline-none" placeholder="Nome (Ex: Homologação)" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <input className="p-2 border rounded w-full outline-none" placeholder="ID de Acesso / IP" value={formData.accessId} onChange={e => setFormData({...formData, accessId: e.target.value})} />
                <input className="p-2 border rounded w-full outline-none" type="text" placeholder="Senha de Acesso" value={formData.accessPassword} onChange={e => setFormData({...formData, accessPassword: e.target.value})} />
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={formData.hasFixedIp} onChange={e => setFormData({...formData, hasFixedIp: e.target.checked})} />
                <span className="text-sm text-slate-700">Este ambiente possui IP Fixo?</span>
            </label>
            <textarea className="p-2 border rounded w-full h-20 outline-none resize-none" placeholder="Observações..." value={formData.notes || ''} onChange={e => setFormData({...formData, notes: e.target.value})} />
            <div className="flex justify-end gap-2 pt-4">
                <button onClick={onClose} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded">Cancelar</button>
                <button onClick={handleSubmit} disabled={loading} className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">{loading ? 'Salvando...' : 'Salvar'}</button>
            </div>
        </div>
    </Modal>
  );
};