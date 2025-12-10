import { useState, useEffect } from 'react';
import type { User, UserRole } from '../types';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Carrega usuário do localStorage ao iniciar
    const storedUser = localStorage.getItem('nexus_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const role = user?.role || '';

  // --- PERMISSÕES DE AÇÃO (O que podem fazer) ---

  // Quem pode Criar/Editar (Botões de ação)
  // Coord e Comercial são apenas visualizadores (não estão na lista)
  const canEdit = ['DIRETOR', 'DESENVOLVEDOR', 'INFRA', 'ADMIN'].includes(role);
  
  // Quem pode Deletar (Ação destrutiva)
  // Restrito a níveis mais altos
  const canDelete = ['DIRETOR', 'ADMIN'].includes(role);
  
  // Quem é Admin do Sistema (Pode aprovar usuários)
  const isAdmin = ['DIRETOR', 'ADMIN'].includes(role);


  // --- PERMISSÕES DE NAVEGAÇÃO (O que podem ver) ---

  // Todos acessam
  const canAccessProjects = true;
  const canAccessDashboard = true;

  // Cronograma: Todos MENOS Infra
  const canAccessTimeline = ['DIRETOR', 'ADMIN', 'DESENVOLVEDOR', 'COORDENADOR', 'COMERCIAL'].includes(role);

  // Clientes: Diretor, Admin, Dev
  const canAccessClients = ['DIRETOR', 'ADMIN', 'DESENVOLVEDOR'].includes(role);

  // Equipe: Diretor, Admin
  const canAccessTeam = ['DIRETOR', 'ADMIN'].includes(role);

  // Infraestrutura: Diretor, Infra (Admin NÃO acessa, conforme solicitado)
  const canAccessInfra = ['DIRETOR', 'INFRA'].includes(role);

  return {
    user,
    role,
    // Ações
    canEdit,
    canDelete,
    isAdmin,
    // Navegação
    canAccessProjects,
    canAccessDashboard,
    canAccessTimeline,
    canAccessClients,
    canAccessTeam,
    canAccessInfra
  };
};