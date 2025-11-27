import React from 'react';
import { Layers, Server, Activity, Users, Briefcase, LogOut, Calendar } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  // Recupera o usuário de forma segura
  let user: any = {};
  try {
    const storedUser = localStorage.getItem('nexus_user');
    if (storedUser) {
      user = JSON.parse(storedUser);
    }
  } catch (e) {
    console.error("Erro ao ler usuário do cache", e);
  }

  // Garante que userName seja sempre uma string
  const userName = (typeof user?.name === 'string') ? user.name : 'Usuário';
  const userRole = (typeof user?.role === 'string') ? user.role : 'GUEST';

  const isActive = (path: string) => {
    if (path === '/projects' && currentPath === '/') return true;
    return currentPath.startsWith(path);
  };

  const handleLogout = () => {
      localStorage.removeItem('nexus_token');
      localStorage.removeItem('nexus_user');
      navigate('/login');
  };

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
        
        {/* PROJETOS */}
        <Link to="/projects">
          <div className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all cursor-pointer ${
            isActive('/projects') 
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20' 
              : 'text-indigo-200 hover:bg-indigo-800 hover:text-white'
          }`}>
            <Server size={18} />
            <span>Projetos</span>
          </div>
        </Link>

        {/* CRONOGRAMA */}
        <Link to="/timeline">
          <div className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all cursor-pointer ${
            isActive('/timeline') 
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20' 
              : 'text-indigo-200 hover:bg-indigo-800 hover:text-white'
          }`}>
            <Calendar size={18} />
            <span>Cronograma</span>
          </div>
        </Link>

        {/* CLIENTES */}
        <Link to="/clients">
          <div className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all cursor-pointer ${
            isActive('/clients') 
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20' 
              : 'text-indigo-200 hover:bg-indigo-800 hover:text-white'
          }`}>
            <Briefcase size={18} />
            <span>Clientes</span>
          </div>
        </Link>

        {/* EQUIPE */}
        <Link to="/team">
          <div className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all cursor-pointer ${
            isActive('/team') 
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20' 
              : 'text-indigo-200 hover:bg-indigo-800 hover:text-white'
          }`}>
            <Users size={18} />
            <span>Equipe</span>
          </div>
        </Link>

        {/* DASHBOARD */}
        <Link to="/dashboard">
          <div className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all cursor-pointer ${
            isActive('/dashboard') 
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20' 
              : 'text-indigo-200 hover:bg-indigo-800 hover:text-white'
          }`}>
            <Activity size={18} />
            <span>Dashboard</span>
          </div>
        </Link>
      </nav>

      {/* SEÇÃO INFERIOR (USUÁRIO) */}
      <div className="p-4 border-t border-indigo-800">
        <div className="flex items-center justify-between gap-2 px-2">
            <div className="flex items-center gap-3">
                {/* Avatar com inicial */}
                <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center font-bold text-sm border-2 border-indigo-400">
                    {userName.charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col">
                    <span className="text-sm font-medium text-white truncate max-w-[90px]" title={userName}>
                        {userName}
                    </span>
                    <span className="text-[10px] text-indigo-300 uppercase font-bold">
                        {userRole === 'ADMIN' ? 'Administrador' : 'Colaborador'}
                    </span>
                </div>
            </div>
            <button 
                onClick={handleLogout} 
                className="text-indigo-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-indigo-800"
                title="Sair do Sistema"
            >
                <LogOut size={18} />
            </button>
        </div>
      </div>
    </aside>
  );
};