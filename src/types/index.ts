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

export interface TimelinePhase {
  id: string;
  name: string;
  status: 'Pendente' | 'Em Andamento' | 'Concluído' | 'Atrasado';
  startDate?: string; 
  endDate?: string;
  estimatedHours?: number; 
}

export interface Project {
  id: string;
  client: string;
  clientId?: string;
  title: string;
  status: 'Em Andamento' | 'Planejamento' | 'Concluído' | 'Manutenção' | 'Produção' | 'Parado' | 'Cancelado';
  
  modules: Module[];
  
  infrastructure?: InfrastructureItem[]; 
  
  serverEnvironments?: ServerEnvironment[]; 
  
  timeline?: TimelinePhase[];
  members?: User[]; 
  
  infraDetails?: string;
  documentation?: string;
  createdAt?: any;
}

export type UserRole = 'DIRETOR' | 'DESENVOLVEDOR' | 'INFRA' | 'COORDENADOR' | 'COMERCIAL' | 'ADMIN' | 'USER';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'USER';
  status: 'ACTIVE' | 'PENDING' | 'BLOCKED';
  tempPassword?: string;
  createdAt: string;
  _count?: {
      projects: number;
  };
}

export interface ServerEnvironment {
  id: string;
  name: string;
  accessType: string;
  accessId: string;
  accessPassword?: string; 
  hasFixedIp: boolean;
  notes?: string;
  serverId: string;
  isActive: boolean;
  isOnPremise: boolean;
  vCPU?: string;
  ram?: string;
  storage?: string;
  os?: string;

  server?: { name: string; ipAddress: string; };
  projects?: { 
    id: string; 
    title: string; 
    client?: { name: string } 
  }[];
}

export interface Server {
  id: string;
  name: string;
  ipAddress: string;
  username: string;
  password?: string; 
  notes?: string;
  environments: ServerEnvironment[];
}