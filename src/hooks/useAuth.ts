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

  const isAdmin = () => {
    if (!user) return false;
    return ['DIRETOR', 'DESENVOLVEDOR', 'ADMIN'].includes(user.role);
  };

  const canEdit = () => {
    if (!user) return false;
    return ['DIRETOR', 'DESENVOLVEDOR', 'INFRA', 'ADMIN'].includes(user.role);
  };

  const canDelete = () => {
    if (!user) return false;
    return ['DIRETOR', 'DESENVOLVEDOR', 'ADMIN'].includes(user.role);
  };

  const isViewer = () => {
      if (!user) return true;
      return ['COMERCIAL', 'COORDENADOR'].includes(user.role);
  };

  return {
    user,
    isAdmin: isAdmin(),
    canEdit: canEdit(),
    canDelete: canDelete(),
    isViewer: isViewer(),
  };
};