import React, { useState } from 'react';
import { Modal } from '../../UI/Modal';
import { Server, Database, Lock, Globe } from 'lucide-react';

interface AddInfraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { category: string; name: string; value: string }) => Promise<void>;
}

export const AddInfraModal: React.FC<AddInfraModalProps> = ({ isOpen, onClose, onSave }) => {
  const [category, setCategory] = useState('Server');
  const [name, setName] = useState('');
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name || !value) return alert("Preencha todos os campos.");
    setLoading(true);
    try {
        await onSave({ category, name, value });
        setName(''); setValue('');
        onClose();
    } catch (error) {
        console.error(error);
    } finally {
        setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Novo Item de Infraestrutura">
      <div className="space-y-4">
        <div>
          <label className="text-xs font-medium text-slate-500 mb-1 block">Categoria</label>
          <div className="grid grid-cols-4 gap-2">
             {['Server', 'Database', 'Security', 'Network'].map(cat => (
                 <button 
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`p-2 border rounded-lg text-xs flex flex-col items-center gap-1 transition-all ${category === cat ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                 >
                    {cat === 'Server' && <Server size={16}/>}
                    {cat === 'Database' && <Database size={16}/>}
                    {cat === 'Security' && <Lock size={16}/>}
                    {cat === 'Network' && <Globe size={16}/>}
                    {cat}
                 </button>
             ))}
          </div>
        </div>

        <div className="space-y-3">
            <div>
                <label className="text-xs font-medium text-slate-500 block mb-1">Título (Ex: Servidor Prod)</label>
                <input 
                  className="w-full p-2 text-sm border border-slate-300 rounded outline-none focus:border-indigo-500" 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                />
            </div>
            <div>
                <label className="text-xs font-medium text-slate-500 block mb-1">Valor/Link (Ex: 192.168.0.1)</label>
                <input 
                  className="w-full p-2 text-sm border border-slate-300 rounded outline-none focus:border-indigo-500" 
                  value={value} 
                  onChange={e => setValue(e.target.value)} 
                />
            </div>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
          <button 
            onClick={onClose} 
            className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-medium transition-colors"
          >
            Cancelar
          </button>
          <button 
            onClick={handleSubmit} 
            disabled={loading} 
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-bold disabled:opacity-50 transition-colors shadow-sm"
          >
            {loading ? 'Salvando...' : 'Adicionar'}
          </button>
        </div>
      </div>
    </Modal>
  );
};