
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Role, User, BudgetRequest, BudgetStatus, ToastType } from './types';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import BudgetDetails from './components/BudgetDetails';
import BudgetForm from './components/BudgetForm';
import ToastContainer from './components/Toast';
import Navbar from './components/Navbar';

const MOCK_REQUESTS: BudgetRequest[] = [
  {
    id: '1',
    userId: 'user1',
    userName: 'Juan Pérez',
    name: 'Taller de Innovación Tecnológica',
    requestDate: '2024-03-15',
    description: 'Compra de kits de robótica para el taller de verano.',
    status: BudgetStatus.PENDING,
    attachments: [{ name: 'cotizacion1.pdf', size: '1.2MB', type: 'application/pdf' }],
    location: 'Sede Santiago',
    requestType: 'Desembolso',
    budgetRubro: 'Plan de actividades',
    analyticalAccount: 'CA-0164 RECTORIA',
    preApprovedBudget: 50000,
    executionAmount: 45000
  },
  {
    id: '2',
    userId: 'user1',
    userName: 'Juan Pérez',
    name: 'Remodelación Laboratorio B',
    requestDate: '2023-11-20',
    description: 'Actualización de mobiliario ergonómico.',
    status: BudgetStatus.APPROVED,
    attachments: [],
    location: 'Santo Domingo',
    requestType: 'Inversión',
    budgetRubro: 'Inversión',
    analyticalAccount: 'CA-0163 JUNTA DE DIRECTORES',
    preApprovedBudget: 150000,
    executionAmount: 148000
  },
  {
    id: '3',
    userId: 'user2',
    userName: 'Maria Garcia',
    name: 'Congreso de Psicología Educativa',
    requestDate: '2024-02-10',
    description: 'Patrocinio para 5 conferencistas internacionales.',
    status: BudgetStatus.REJECTED,
    rejectionComments: 'Fuera de presupuesto trimestral asignado.',
    attachments: [{ name: 'vuelos.pdf', size: '450KB', type: 'application/pdf' }],
    location: 'Cibao Oriental, Nagua',
    requestType: 'Desviación',
    budgetRubro: 'Gastos de servicios y suministros',
    analyticalAccount: 'CA-0165 CASA SAMANA',
    preApprovedBudget: 80000,
    executionAmount: 95000
  }
];

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [requests, setRequests] = useState<BudgetRequest[]>(MOCK_REQUESTS);
  const [toasts, setToasts] = useState<ToastType[]>([]);
  const [view, setView] = useState<'dashboard' | 'details' | 'create' | 'edit'>('dashboard');
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);

  const addToast = (message: string, type: ToastType['type'] = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type, duration: 3000 }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const handleLogin = (role: Role) => {
    const name = role === Role.COLABORADOR ? 'Colaborador UAPA' : 'Admin UAPA';
    
    // Usamos un avatar de tipo "perfil" más estilizado usando multiavatar o ui-avatars con estilo de icono
    // Para un look de "Avatar de perfil" corporativo, usamos una silueta limpia o un avatar generado por DiceBear (tipo 'avataaars' o 'pixel-art' pero más sobrio)
    // En este caso, usaremos una silueta de usuario limpia de un CDN confiable o ui-avatars con un diseño circular elegante
    const seed = role === Role.COLABORADOR ? 'colaborador' : 'admin';
    const photoUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}&backgroundColor=b6e3f4,c0aede,d1d4f9&mood=happy`;
    
    const mockUser: User = {
      id: role === Role.COLABORADOR ? 'user1' : 'admin1',
      name: name,
      email: role === Role.COLABORADOR ? 'colaborador@uapa.edu.do' : 'admin@uapa.edu.do',
      role: role,
      photoUrl: photoUrl
    };
    setUser(mockUser);
    addToast(`Sesión iniciada como ${mockUser.name}`, 'success');
  };

  const handleLogout = () => {
    setUser(null);
    setView('dashboard');
    addToast('Sesión cerrada correctamente', 'info');
  };

  const handleCreateRequest = (newRequest: Omit<BudgetRequest, 'id' | 'status' | 'userId' | 'userName'>) => {
    if (!user) return;
    const request: BudgetRequest = {
      ...newRequest,
      id: Math.random().toString(36).substring(2, 9),
      status: BudgetStatus.PENDING,
      userId: user.id,
      userName: user.name,
    };
    setRequests(prev => [request, ...prev]);
    setView('dashboard');
    addToast('Solicitud creada con éxito', 'success');
  };

  const handleUpdateStatus = (id: string, status: BudgetStatus, comments?: string) => {
    setRequests(prev => prev.map(r => 
      r.id === id ? { ...r, status, rejectionComments: comments } : r
    ));
    addToast(`Solicitud actualizada a ${status}`, 'success');
  };

  const handleEditRequest = (updatedData: Partial<BudgetRequest>) => {
    if (!selectedRequestId) return;
    setRequests(prev => prev.map(r => 
      r.id === selectedRequestId ? { ...r, ...updatedData } : r
    ));
    setView('dashboard');
    setSelectedRequestId(null);
    addToast('Solicitud editada con éxito', 'success');
  };

  const selectedRequest = useMemo(() => 
    requests.find(r => r.id === selectedRequestId), 
    [requests, selectedRequestId]
  );

  if (!user) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex flex-col justify-center items-center p-4">
        <Login onLogin={handleLogin} />
        <ToastContainer toasts={toasts} onRemove={removeToast} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col">
      <Navbar user={user} onLogout={handleLogout} />
      
      <main className="flex-grow container mx-auto px-4 py-8 max-w-6xl text-[#333333]">
        {view === 'dashboard' && (
          <Dashboard 
            user={user} 
            requests={requests} 
            onViewDetails={(id) => {
              setSelectedRequestId(id);
              setView('details');
            }}
            onEdit={(id) => {
              setSelectedRequestId(id);
              setView('edit');
            }}
            onCreate={() => setView('create')}
          />
        )}

        {view === 'details' && selectedRequest && (
          <BudgetDetails 
            user={user}
            request={selectedRequest} 
            onBack={() => {
              setView('dashboard');
              setSelectedRequestId(null);
            }}
            onUpdateStatus={handleUpdateStatus}
          />
        )}

        {view === 'create' && (
          <BudgetForm 
            onCancel={() => setView('dashboard')}
            onSubmit={handleCreateRequest}
          />
        )}

        {view === 'edit' && selectedRequest && (
          <BudgetForm 
            initialData={selectedRequest}
            onCancel={() => setView('dashboard')}
            onSubmit={handleEditRequest}
          />
        )}
      </main>

      <footer className="bg-white border-t border-slate-200 py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-slate-500 flex items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#ff8300]" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            ¿Necesitas asistencia? Llama a la sede <strong>Ext. 378</strong> o Flota: <strong>829-901-2885</strong>
          </p>
          <p className="text-[10px] text-slate-400 mt-2 uppercase tracking-widest font-bold">UAPA - Sistema de Gestión Presupuestaria</p>
        </div>
      </footer>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
};

export default App;
