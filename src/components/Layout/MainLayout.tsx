import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';

export const MainLayout: React.FC = () => {
  return (
    // A estrutura flex h-screen garante que o layout ocupe toda a tela
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900">
      <Sidebar />
      
      {/* O Outlet renderiza a página filha correspondente à rota atual (Projects ou Dashboard) */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <Outlet />
      </main>
    </div>
  );
};