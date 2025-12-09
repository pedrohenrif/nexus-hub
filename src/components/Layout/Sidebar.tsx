import React from 'react';
import { Layers, Server, Activity, Users, Briefcase, LogOut, Calendar, Database } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  
  const { user, canAccessInfra } = useAuth(); 

  const isActive = (path: string) => {
    if (path === '/projects' && currentPath === '/') return true;
    return currentPath.startsWith(path);
  };

  const handleLogout = () => {
      localStorage.removeItem('nexus_token');
      localStorage.removeItem('nexus_user');
      navigate('/login');
  };

  // Garante strings para exibição
  const displayName = typeof user?.name === 'string' ? user.name : 'Usuário';
  const displayRole = typeof user?.role === 'string' ? user.role : 'GUEST';
  const displayInitial = displayName.charAt(0).toUpperCase();

  return (
    <aside className="w-64 bg-indigo-900 text-white flex flex-col shadow-xl h-screen sticky top-0 z-20">
      
      {/* SEÇÃO DO LOGO */}
      <div className="p-6 border-b border-indigo-800 flex items-center gap-3">
        <div className="bg-indigo-600 p-2 rounded-lg">
          <Layers size={20} className="text-white" />
        </div>
        <span className="font-bold text-lg tracking-tight text-white">Nexus Hub GHR</span>
      </div>

      {/* SEÇÃO DE NAVEGAÇÃO */}
      <nav className="flex-1 p-4 space-y-2">
        <Link to="/projects">
          <div className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all cursor-pointer ${isActive('/projects') ? 'bg-indigo-600 text-white shadow-lg' : 'text-indigo-200 hover:bg-indigo-800'}`}>
            <Server size={18} /> <span>Projetos</span>
          </div>
        </Link>

        <Link to="/timeline">
          <div className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all cursor-pointer ${isActive('/timeline') ? 'bg-indigo-600 text-white shadow-lg' : 'text-indigo-200 hover:bg-indigo-800'}`}>
            <Calendar size={18} /> <span>Cronograma</span>
          </div>
        </Link>

        {canAccessInfra && (
          <Link to="/infrastructure">
            <div className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all cursor-pointer ${isActive('/infrastructure') ? 'bg-indigo-600 text-white shadow-lg' : 'text-indigo-200 hover:bg-indigo-800'}`}>
              <Database size={18} /> <span>Infraestrutura</span>
            </div>
          </Link>
        )}

        <Link to="/clients">
          <div className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all cursor-pointer ${isActive('/clients') ? 'bg-indigo-600 text-white shadow-lg' : 'text-indigo-200 hover:bg-indigo-800'}`}>
            <Briefcase size={18} /> <span>Clientes</span>
          </div>
        </Link>

        <Link to="/team">
          <div className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all cursor-pointer ${isActive('/team') ? 'bg-indigo-600 text-white shadow-lg' : 'text-indigo-200 hover:bg-indigo-800'}`}>
            <Users size={18} /> <span>Equipe</span>
          </div>
        </Link>

        <Link to="/dashboard">
          <div className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all cursor-pointer ${isActive('/dashboard') ? 'bg-indigo-600 text-white shadow-lg' : 'text-indigo-200 hover:bg-indigo-800'}`}>
            <Activity size={18} /> <span>Dashboard</span>
          </div>
        </Link>
      </nav>

      {/* RODAPÉ DO USUÁRIO (DINÂMICO) */}
      <div className="p-4 border-t border-indigo-800">
        <div className="flex items-center justify-between gap-2 px-2">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center font-bold text-sm border-2 border-indigo-400">
                    {displayInitial}
                </div>
                <div className="flex flex-col">
                    <span className="text-sm font-medium text-white truncate max-w-[90px]" title={displayName}>
                        {displayName}
                    </span>
                    <span className="text-[10px] text-indigo-300 uppercase font-bold">
                        {displayRole === 'ADMIN' ? 'Admin' : displayRole}
                    </span>
                </div>
            </div>
            <button onClick={handleLogout} className="text-indigo-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-indigo-800" title="Sair">
                <LogOut size={18} />
            </button>
        </div>
      </div>
    </aside>
  );
};