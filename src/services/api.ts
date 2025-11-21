import type { Project, Module, Client } from '../types';

const API_URL = 'http://localhost:4000/api';

export const api = {

    login: async (email: string, password: string) => {
    const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    
    if (!res.ok) {
        throw new Error(data.error || 'Erro ao fazer login');
    }
    
    return data; 
  },

  register: async (name: string, email: string, password: string) => {
    const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
    });

    if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Erro ao solicitar acesso');
    }
    
    return res.json();
  },

  resetPassword: async (email: string, newPassword: string) => {
    const res = await fetch(`${API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, newPassword })
    });

    if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Erro ao solicitar troca de senha');
    }
    
    return res.json();
  },


  // --- PROJETOS ---
  getProjects: async (): Promise<Project[]> => {
    const res = await fetch(`${API_URL}/projects`);
    if (!res.ok) throw new Error('Erro ao buscar projetos');
    const data = await res.json();
    return data.map((item: any) => ({ 
      ...item, 
      client: item.client?.name || 'N/A', 
      clientId: item.clientId 
    }));
  },

  getProjectById: async (id: string): Promise<Project> => {
    const res = await fetch(`${API_URL}/projects/${id}`);
    if (!res.ok) throw new Error('Erro ao buscar projeto');
    const data = await res.json();
    return { 
      ...data, 
      client: data.client?.name || 'N/A', 
      clientId: data.clientId 
    };
  },

  createProject: async (data: Partial<Project>): Promise<Project> => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { client, ...payload } = data; 
    const res = await fetch(`${API_URL}/projects`, {
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Erro ao criar projeto');
    return res.json();
  },

  // Atualizar Projeto (Usado para salvar a aba de Infraestrutura - Texto Geral)
  updateProject: async (id: string, data: Partial<Project>): Promise<Project> => {
    const res = await fetch(`${API_URL}/projects/${id}`, {
      method: 'PUT', 
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Erro ao atualizar projeto');
    return res.json();
  },

  deleteProject: async (id: string): Promise<void> => {
    const res = await fetch(`${API_URL}/projects/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Erro ao excluir projeto');
  },

  // --- MÓDULOS ---
  
  // Adiciona um módulo a um projeto já existente
  addModule: async (moduleData: Partial<Module>): Promise<Module> => {
    const res = await fetch(`${API_URL}/modules`, {
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify(moduleData)
    });
    if (!res.ok) throw new Error('Erro ao adicionar módulo');
    return res.json();
  },

  updateModule: async (id: string, moduleData: Partial<Module>): Promise<Module> => {
    const res = await fetch(`${API_URL}/modules/${id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(moduleData)
    });
    if (!res.ok) throw new Error('Erro ao atualizar módulo');
    return res.json();
  },

  // Remove um módulo específico
  deleteModule: async (id: string): Promise<void> => {
    const res = await fetch(`${API_URL}/modules/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Erro ao remover módulo');
  },

  // --- INFRAESTRUTURA (CARDS) ---

  addInfraItem: async (itemData: any): Promise<any> => {
    const res = await fetch(`${API_URL}/infra`, {
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify(itemData)
    });
    if (!res.ok) throw new Error('Erro ao adicionar item de infra');
    return res.json();
  },

  deleteInfraItem: async (id: string): Promise<void> => {
    const res = await fetch(`${API_URL}/infra/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Erro ao remover item de infra');
  },

  // --- CLIENTES ---
  
  getClients: async (): Promise<Client[]> => {
    try {
        const res = await fetch(`${API_URL}/clients`);
        return res.ok ? res.json() : [];
    } catch { return []; }
  },
  
  createClient: async (name: string, internalCode: string): Promise<Client> => {
    const res = await fetch(`${API_URL}/clients`, {
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify({ name, internalCode })
    });
    if (!res.ok) throw new Error('Erro ao criar cliente');
    return res.json();
  },
  
  updateClient: async (id: string, data: { name: string, internalCode: string }): Promise<Client> => {
    const res = await fetch(`${API_URL}/clients/${id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json', ...authHeader() }, body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Erro ao atualizar cliente');
    return res.json();
  },
  
  deleteClient: async (id: string): Promise<void> => {
    const res = await fetch(`${API_URL}/clients/${id}`, { method: 'DELETE', headers: authHeader() });
    if (!res.ok) throw new Error('Erro ao excluir cliente');
  },
};

