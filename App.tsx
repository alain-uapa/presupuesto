
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
    attachments: [{ name: 'cotizacion1.pdf', size: '1.2MB', type: 'application/pdf' }]
  },
  {
    id: '2',
    userId: 'user1',
    userName: 'Juan Pérez',
    name: 'Remodelación Laboratorio B',
    requestDate: '2023-11-20',
    description: 'Actualización de mobiliario ergonómico.',
    status: BudgetStatus.APPROVED,
    attachments: []
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
    attachments: [{ name: 'vuelos.pdf', size: '450KB', type: 'application/pdf' }]
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
    const mockUser: User = {
      id: role === Role.COLABORADOR ? 'user1' : 'admin1',
      name: role === Role.COLABORADOR ? 'Colaborador UAPA' : 'Admin UAPA',
      email: role === Role.COLABORADOR ? 'colaborador@uapa.edu.do' : 'admin@uapa.edu.do',
      role: role,
      photoUrl: `https://picsum.photos/seed/${role}/100/100`
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
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
        <Login onLogin={handleLogin} />
        <ToastContainer toasts={toasts} onRemove={removeToast} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar user={user} onLogout={handleLogout} />
      
      <main className="flex-grow container mx-auto px-4 py-8 max-w-6xl">
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

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
};

export default App;
