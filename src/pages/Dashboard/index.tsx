import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import type { Project } from '../../types';
import { Users, Server, Box, Activity, Layout, PieChart as PieIcon, BarChart as BarIcon } from 'lucide-react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid 
} from 'recharts';

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getProjects().then(data => {
        setProjects(data);
        setLoading(false);
    });
  }, []);

  if (loading) return <div className="p-8 text-slate-400 flex items-center justify-center h-full">Carregando métricas...</div>;

  // --- DADOS PARA GRÁFICOS ---

  // 1. Distribuição por Status (Pie Chart)
  const statusCount = projects.reduce((acc, curr) => {
      acc[curr.status] = (acc[curr.status] || 0) + 1;
      return acc;
  }, {} as Record<string, number>);

  const pieData = Object.keys(statusCount).map(status => ({
      name: status,
      value: statusCount[status]
  }));

  const COLORS = {
      'Em Andamento': '#3B82F6', // Blue
      'Planejamento': '#94A3B8', // Slate
      'Produção': '#8B5CF6',     // Violet
      'Concluído': '#10B981',    // Emerald
      'Manutenção': '#F59E0B'    // Amber
  };

  // 2. Projetos por Cliente (Bar Chart)
  const clientCount = projects.reduce((acc, curr) => {
      const clientName = curr.client || 'Desconhecido';
      acc[clientName] = (acc[clientName] || 0) + 1;
      return acc;
  }, {} as Record<string, number>);

  const barData = Object.keys(clientCount).map(client => ({
      name: client,
      projetos: clientCount[client]
  })).sort((a, b) => b.projetos - a.projetos).slice(0, 5); // Top 5 Clientes

  // --- TOTAIS ---
  const totalProjects = projects.length;
  const totalModules = projects.reduce((acc, p) => acc + (p.modules?.length || 0), 0);
  const uniqueClients = new Set(projects.map(p => p.client)).size;
  const automations = projects.reduce((acc, p) => acc + (p.modules?.filter(m => m.type === 'Automação').length || 0), 0);

  return (
    <div className="flex flex-col h-full bg-slate-50">
       <header className="h-16 bg-white border-b border-slate-200 flex items-center px-8 sticky top-0 z-10">
          <h2 className="text-xl font-bold text-slate-800">Dashboard Executivo</h2>
       </header>
       
       <div className="flex-1 overflow-y-auto p-8">
          
          {/* KPI CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between hover:shadow-md transition-shadow">
                    <div><p className="text-slate-500 text-sm font-medium mb-1">Total Clientes</p><p className="text-3xl font-bold text-slate-800">{uniqueClients}</p></div>
                    <div className="p-3 bg-indigo-50 rounded-full text-indigo-600"><Users size={24} /></div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between hover:shadow-md transition-shadow">
                    <div><p className="text-slate-500 text-sm font-medium mb-1">Total Projetos</p><p className="text-3xl font-bold text-indigo-600">{totalProjects}</p></div>
                    <div className="p-3 bg-blue-50 rounded-full text-blue-600"><Server size={24} /></div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between hover:shadow-md transition-shadow">
                    <div><p className="text-slate-500 text-sm font-medium mb-1">Módulos Ativos</p><p className="text-3xl font-bold text-emerald-600">{totalModules}</p></div>
                    <div className="p-3 bg-emerald-50 rounded-full text-emerald-600"><Box size={24} /></div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between hover:shadow-md transition-shadow">
                    <div><p className="text-slate-500 text-sm font-medium mb-1">Automações</p><p className="text-3xl font-bold text-purple-600">{automations}</p></div>
                    <div className="p-3 bg-purple-50 rounded-full text-purple-600"><Activity size={24} /></div>
                </div>
          </div>

          {/* GRÁFICOS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* PIE CHART: Status */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                  <h3 className="text-sm font-bold text-slate-500 uppercase mb-6 flex items-center gap-2">
                      <PieIcon size={16}/> Distribuição por Status
                  </h3>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS] || '#CBD5E1'} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend verticalAlign="bottom" height={36}/>
                        </PieChart>
                    </ResponsiveContainer>
                  </div>
              </div>

              {/* BAR CHART: Clientes */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                  <h3 className="text-sm font-bold text-slate-500 uppercase mb-6 flex items-center gap-2">
                      <BarIcon size={16}/> Top 5 Clientes (Volume)
                  </h3>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={barData} layout="vertical" margin={{ left: 10, right: 10, top: 10, bottom: 10 }}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                            <XAxis type="number" hide />
                            <YAxis dataKey="name" type="category" width={100} style={{ fontSize: '12px', fontWeight: 500 }} />
                            <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                            <Bar dataKey="projetos" fill="#4F46E5" radius={[0, 4, 4, 0]} barSize={20} />
                        </BarChart>
                    </ResponsiveContainer>
                  </div>
              </div>
          </div>
       </div>
    </div>
  );
}