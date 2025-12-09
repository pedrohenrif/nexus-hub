import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Layout Base
import { MainLayout } from './components/Layout/MainLayout';

// Páginas
import ProjectsPage from './pages/Projects';
import DashboardPage from './pages/Dashboard';
import ProjectDetails from './pages/Projects/ProjectDetails';
import LoginPage from './pages/Login';
import ClientsPage from './pages/Clients'; 
import TeamPage from './pages/Team'; 
import TimelinePage from './pages/Timeline';
import InfrastructurePage from './pages/Infrastructure'; // <--- Importação Nova

// Componente de Guarda de Rotas
const PrivateRoute = () => {
    const isAuthenticated = !!localStorage.getItem('nexus_token'); 
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

function App() {
  return (
    <BrowserRouter>
      {/* Configuração Global das Notificações (Toast) */}
      <Toaster 
        position="top-right" 
        toastOptions={{
          style: { background: '#333', color: '#fff', borderRadius: '8px', fontSize: '14px' },
          success: { style: { background: '#10B981' } }, 
          error: { style: { background: '#EF4444' } },   
        }} 
      />

      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<PrivateRoute />}>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Navigate to="/projects" replace />} />
              
              <Route path="projects" element={<ProjectsPage />} />
              <Route path="projects/:id" element={<ProjectDetails />} />
              
              <Route path="clients" element={<ClientsPage />} />

              <Route path="team" element={<TeamPage />} />

              <Route path="timeline" element={<TimelinePage />} />

              {/* Rota Protegida de Infraestrutura */}
              <Route path="infrastructure" element={<InfrastructurePage />} />
              
              <Route path="dashboard" element={<DashboardPage />} />
            </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;