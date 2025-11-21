export interface InfrastructureItem {
  id: string;
  category: 'Server' | 'Database' | 'Security' | 'Network' | 'Other';
  name: string;
  value: string;
}

export interface Module {
  id: string;
  type: 'API' | 'Automação' | 'Bot' | 'Site' | 'Script';
  name: string;
  description: string;
  repoUrl?: string;
  techStack?: string;
  installCmd?: string;
  infraDetails?: string;
}

export interface Client {
  id: string;
  name: string;
  internalCode: string;
}

export interface Project {
  id: string;
  client: string;     
  clientId?: string; 
  title: string;
  status: 'Em Andamento' | 'Planejamento' | 'Concluído' | 'Manutenção' | 'Produção';
  modules: Module[];
  infrastructure?: InfrastructureItem[]; 
  infraDetails?: string;            
  documentation?: string;     
         
  createdAt?: any;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'USER';
  status: 'ACTIVE' | 'PENDING' | 'BLOCKED';
  createdAt: string;
  _count?: {
      projects: number;
  };
}