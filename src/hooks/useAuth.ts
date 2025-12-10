import { useState, useEffect } from 'react';
import type { User, UserRole } from '../types';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('nexus_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const role = user?.role || '';

  // --- PERMISSÕES DE AÇÃO (O que podem fazer) ---

  const canEdit = ['DIRETOR', 'DESENVOLVEDOR', 'INFRA', 'ADMIN'].includes(role);
  const canDelete = ['DIRETOR', 'ADMIN'].includes(role);
  const isAdmin = ['DIRETOR', 'ADMIN'].includes(role);

  // --- PERMISSÕES DE NAVEGAÇÃO (O que podem ver) ---
  const canAccessProjects = true;
  const canAccessDashboard = true;

  const canAccessTimeline = ['DIRETOR', 'ADMIN', 'DESENVOLVEDOR', 'COORDENADOR', 'COMERCIAL'].includes(role);
  const canAccessClients = ['DIRETOR', 'ADMIN', 'DESENVOLVEDOR'].includes(role);
  const canAccessTeam = ['DIRETOR', 'ADMIN'].includes(role);
  const canAccessInfra = ['DIRETOR', 'INFRA', 'ADMIN'].includes(role);

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