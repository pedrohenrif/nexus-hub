import React, { useEffect, useState } from 'react';
import { Plus, Search, Users, Edit2, Trash2, Briefcase } from 'lucide-react';
import { api } from '../../services/api';
import type { Client } from '../../types';
import { ClientModal } from '../../components/Clients/ClientModal';
import toast from 'react-hot-toast';

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clientToEdit, setClientToEdit] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);

  const loadClients = async () => {
    setLoading(true);
    try {
      const data = await api.getClients();
      setClients(data);
    } catch (error) {
      toast.error('Erro ao carregar clientes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadClients(); }, []);

  const handleSave = async (data: { name: string, internalCode: string }) => {
    const promise = clientToEdit 
        ? api.updateClient(clientToEdit.id, data)
        : api.createClient(data.name, data.internalCode);
    
    await toast.promise(promise, {
        loading: 'Salvando...',
        success: clientToEdit ? 'Cliente atualizado!' : 'Cliente criado!',
        error: 'Erro ao salvar.'
    });
    loadClients();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza? Isso pode falhar se o cliente tiver projetos.')) {
        try {
            await api.deleteClient(id);
            toast.success('Cliente excluído.');
            setClients(prev => prev.filter(c => c.id !== id));
        } catch (error) {
            toast.error('Não foi possível excluir. Verifique se há projetos vinculados.');
        }
    }
  };

  const openEdit = (client: Client) => {
      setClientToEdit(client);
      setIsModalOpen(true);
  };

  const openCreate = () => {
      setClientToEdit(null);
      setIsModalOpen(true);
  };

  const filteredClients = clients.filter(c => 
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      c.internalCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-slate-50">
       <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <h2 className="text-xl font-bold text-slate-800">Gestão de Clientes</h2>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input type="text" placeholder="Buscar cliente..." className="pl-10 pr-4 py-2 bg-slate-100 border-none rounded-full text-sm outline-none w-64" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <button onClick={openCreate} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium shadow-sm"><Plus size={18} />Novo Cliente</button>
          </div>
       </header>

       <div className="flex-1 overflow-y-auto p-8">
          {loading ? <div className="text-center text-slate-400 mt-10">Carregando...</div> : (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredClients.map(client => (
                    <div key={client.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-xl">
                                {client.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => openEdit(client)} className="p-2 text-slate-400 hover:text-indigo-600 rounded-full hover:bg-indigo-50"><Edit2 size={16}/></button>
                                <button onClick={() => handleDelete(client.id)} className="p-2 text-slate-400 hover:text-red-600 rounded-full hover:bg-red-50"><Trash2 size={16}/></button>
                            </div>
                        </div>
                        <h3 className="text-lg font-bold text-slate-800 mb-1">{client.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-slate-500 font-mono bg-slate-50 w-fit px-2 py-1 rounded mb-4">
                            #{client.internalCode}
                        </div>
                        
                        {/* Placeholder para contagem de projetos (se o backend enviar) */}
                        <div className="flex items-center gap-2 text-xs text-slate-400 border-t border-slate-100 pt-4">
                            <Briefcase size={14} />
                            <span>Cliente Ativo</span>
                        </div>
                    </div>
                ))}
                {filteredClients.length === 0 && (
                    <div className="col-span-3 text-center py-20 text-slate-400">
                        <Users size={48} className="mx-auto mb-4 opacity-20"/>
                        <p>Nenhum cliente encontrado.</p>
                    </div>
                )}
             </div>
          )}
       </div>

       <ClientModal 
         isOpen={isModalOpen} 
         onClose={() => setIsModalOpen(false)} 
         onSave={handleSave} 
         initialData={clientToEdit}
       />
    </div>
  );
}