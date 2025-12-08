import type { Project, Module, Client, User, TimelinePhase } from '../types';

const API_URL = '/api'; 

// Helper para pegar o token e montar o header
const authHeader = () => {
    const token = localStorage.getItem('nexus_token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const api = {
  // --- AUTENTICAÇÃO ---
  login: async (email: string, password: string) => {
    const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erro ao fazer login');
    return data;
  },

  register: async (name: string, email: string, password: string) => {
    const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, email, password })
    });
    if (!res.ok) { const data = await res.json(); throw new Error(data.error || 'Erro ao solicitar acesso'); }
    return res.json();
  },

  resetPassword: async (email: string, newPassword: string) => {
    const res = await fetch(`${API_URL}/auth/reset-password`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, newPassword })
    });
    if (!res.ok) { const data = await res.json(); throw new Error(data.error || 'Erro ao solicitar troca'); }
    return res.json();
  },

  // --- USUÁRIOS (EQUIPE) ---
  getUsers: async (): Promise<User[]> => {
    const res = await fetch(`${API_URL}/users`, { headers: authHeader() });
    if (!res.ok) throw new Error('Erro ao buscar equipe');
    return res.json();
  },

  // Aprovar senha ou ativar usuário
  updateUserStatus: async (id: string, action: 'ACTIVATE_USER' | 'BLOCK_USER' | 'APPROVE_PASSWORD'): Promise<void> => {
    const res = await fetch(`${API_URL}/auth/approve/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...authHeader() },
        body: JSON.stringify({ action })
    });
    if (!res.ok) throw new Error('Erro ao atualizar status do usuário');
  },

  // Alterar cargo ou dados do usuário
  updateUser: async (id: string, data: Partial<User>): Promise<User> => {
    const res = await fetch(`${API_URL}/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...authHeader() },
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Erro ao atualizar usuário');
    return res.json();
  },

  deleteUser: async (id: string): Promise<void> => {
    const res = await fetch(`${API_URL}/users/${id}`, { method: 'DELETE', headers: authHeader() });
    if (!res.ok) throw new Error('Erro ao excluir usuário');
  },

  // --- PROJETOS ---
  getProjects: async (): Promise<Project[]> => {
    const res = await fetch(`${API_URL}/projects`, { headers: authHeader() });
    if (!res.ok) throw new Error('Erro ao buscar projetos');
    const data = await res.json();
    return data.map((item: any) => ({ ...item, client: item.client?.name || 'N/A', clientId: item.clientId }));
  },

  getProjectById: async (id: string): Promise<Project> => {
    const res = await fetch(`${API_URL}/projects/${id}`, { headers: authHeader() });
    if (!res.ok) throw new Error('Erro ao buscar projeto');
    const data = await res.json();
    return { ...data, client: data.client?.name || 'N/A', clientId: data.clientId };
  },

  createProject: async (data: Partial<Project>): Promise<Project> => {
    const { client, ...payload } = data; 
    const res = await fetch(`${API_URL}/projects`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', ...authHeader() }, body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Erro ao criar projeto');
    return res.json();
  },

  updateProject: async (id: string, data: Partial<Project>): Promise<Project> => {
    const res = await fetch(`${API_URL}/projects/${id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json', ...authHeader() }, body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Erro ao atualizar projeto');
    return res.json();
  },

  deleteProject: async (id: string): Promise<void> => {
    const res = await fetch(`${API_URL}/projects/${id}`, { method: 'DELETE', headers: authHeader() });
    if (!res.ok) throw new Error('Erro ao excluir projeto');
  },

  // --- MEMBROS DO PROJETO ---
  addProjectMember: async (projectId: string, userId: string): Promise<void> => {
    const res = await fetch(`${API_URL}/projects/${projectId}/members`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', ...authHeader() }, body: JSON.stringify({ userId })
    });
    if (!res.ok) throw new Error('Erro ao adicionar membro');
  },

  removeProjectMember: async (projectId: string, userId: string): Promise<void> => {
    const res = await fetch(`${API_URL}/projects/${projectId}/members/${userId}`, { method: 'DELETE', headers: authHeader() });
    if (!res.ok) throw new Error('Erro ao remover membro');
  },

  // --- MÓDULOS ---
  addModule: async (moduleData: Partial<Module>): Promise<Module> => {
    const res = await fetch(`${API_URL}/modules`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', ...authHeader() }, body: JSON.stringify(moduleData)
    });
    if (!res.ok) throw new Error('Erro ao adicionar módulo');
    return res.json();
  },

  updateModule: async (id: string, moduleData: Partial<Module>): Promise<Module> => {
    const res = await fetch(`${API_URL}/modules/${id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json', ...authHeader() }, body: JSON.stringify(moduleData)
    });
    if (!res.ok) throw new Error('Erro ao atualizar módulo');
    return res.json();
  },

  deleteModule: async (id: string): Promise<void> => {
    const res = await fetch(`${API_URL}/modules/${id}`, { method: 'DELETE', headers: authHeader() });
    if (!res.ok) throw new Error('Erro ao remover módulo');
  },

  // --- INFRAESTRUTURA ---
  addInfraItem: async (itemData: any): Promise<any> => {
    const res = await fetch(`${API_URL}/infra`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', ...authHeader() }, body: JSON.stringify(itemData)
    });
    if (!res.ok) throw new Error('Erro ao adicionar item');
    return res.json();
  },

  deleteInfraItem: async (id: string): Promise<void> => {
    const res = await fetch(`${API_URL}/infra/${id}`, { method: 'DELETE', headers: authHeader() });
    if (!res.ok) throw new Error('Erro ao remover item');
  },

  // --- CRONOGRAMA (TIMELINE) ---
  getGlobalTimeline: async (): Promise<Project[]> => {
    const res = await fetch(`${API_URL}/timeline/global`, { headers: authHeader() });
    if (!res.ok) throw new Error('Erro ao buscar cronograma global');
    const data = await res.json();
    
    return data.map((item: any) => ({
        ...item,
        client: item.client?.name || 'N/A'
    }));
  },

  addTimelinePhase: async (phaseData: Partial<TimelinePhase>): Promise<any> => {
    const res = await fetch(`${API_URL}/timeline`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', ...authHeader() }, body: JSON.stringify(phaseData)
    });
    if (!res.ok) throw new Error('Erro ao adicionar fase');
    return res.json();
  },

  updateTimelinePhase: async (id: string, phaseData: Partial<TimelinePhase>): Promise<any> => {
    const res = await fetch(`${API_URL}/timeline/${id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json', ...authHeader() }, body: JSON.stringify(phaseData)
    });
    if (!res.ok) throw new Error('Erro ao atualizar fase');
    return res.json();
  },

  deleteTimelinePhase: async (id: string): Promise<void> => {
    const res = await fetch(`${API_URL}/timeline/${id}`, { method: 'DELETE', headers: authHeader() });
    if (!res.ok) throw new Error('Erro ao remover fase');
  },

  // --- CLIENTES ---
  getClients: async (): Promise<Client[]> => {
    try {
        const res = await fetch(`${API_URL}/clients`, { headers: authHeader() });
        return res.ok ? res.json() : [];
    } catch { return []; }
  },
  
  createClient: async (name: string, internalCode: string): Promise<Client> => {
    const res = await fetch(`${API_URL}/clients`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', ...authHeader() }, body: JSON.stringify({ name, internalCode })
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