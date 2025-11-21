import React from 'react';
import { Layers, Server, Activity, Users, Briefcase } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => {
    if (path === '/projects' && currentPath === '/') return true;
    return currentPath.startsWith(path);
  };

  return (
    <aside className="w-64 bg-indigo-900 text-white flex flex-col shadow-xl h-screen sticky top-0 z-20">
      
      {/* SEÇÃO DO LOGO */}
      <div className="p-6 border-b border-indigo-800 flex items-center gap-3">
        <div className="bg-indigo-600 p-2 rounded-lg">
          <Layers size={20} className="text-white" />
        </div>
        <span className="font-bold text-lg tracking-tight text-white">Nexus Hub</span>
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

        {/* EQUIPE (NOVO LINK) */}
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

      {/* SEÇÃO INFERIOR */}
      <div className="p-4 border-t border-indigo-800">
        <div className="flex items-center gap-3 px-4 py-3 text-indigo-300">
          <Users size={18} />
          <span className="text-sm">Admin</span>
        </div>
      </div>
    </aside>
  );
};