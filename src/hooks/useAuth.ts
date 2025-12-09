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

  const isAdmin = ['DIRETOR', 'DESENVOLVEDOR', 'ADMIN'].includes(role);
  const canEdit = ['DIRETOR', 'DESENVOLVEDOR', 'INFRA', 'ADMIN'].includes(role);
  const canDelete = ['DIRETOR', 'DESENVOLVEDOR', 'ADMIN'].includes(role);
  const canAccessInfra = ['DIRETOR', 'INFRA', 'ADMIN'].includes(role);

  const isViewer = !canEdit;

  return {
    user,
    isAdmin,
    canEdit,
    canDelete,
    canAccessInfra, 
    isViewer,
  };
};