
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Role, User, BudgetRequest, BudgetStatus, ToastType } from './types';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import BudgetDetails from './components/BudgetDetails';
import BudgetForm from './components/BudgetForm';
import ToastContainer from './components/Toast';
import Navbar from './components/Navbar';
import { budgetService } from './services/budget.service';
import { CatalogProvider, useCatalogs } from './context/CatalogContext';

const AppContent: React.FC<{ 
  user: User | null; 
  setUser: (u: User | null) => void; 
  requests: BudgetRequest[];
  setRequests: React.Dispatch<React.SetStateAction<BudgetRequest[]>>;
  loading: boolean;
  setLoading: (l: boolean) => void;
  toasts: ToastType[];
  addToast: (m: string, t?: ToastType['type']) => void;
  removeToast: (id: string) => void;
  handleLogout: () => void;
  fetchAllRequests: () => void;
  handleApiError: (e: any, m?: string) => boolean;
}> = ({ 
  user, setUser, requests, setRequests, loading, setLoading, 
  toasts, addToast, removeToast, handleLogout, fetchAllRequests, handleApiError 
}) => {
  const { fetchCatalogs, loadingCatalogs } = useCatalogs();
  const [view, setView] = useState<'dashboard' | 'details' | 'create' | 'edit'>('dashboard');
  const [selectedRequestId, setSelectedRequestId] = useState<string | number | null>(null);

  useEffect(() => {
    if (user) {
      fetchAllRequests();
      fetchCatalogs(); // Cargar catálogos al iniciar sesión
    }
  }, [user, fetchAllRequests, fetchCatalogs]);

  const handleLogin = (role: Role) => {
    const id = role === Role.COLABORADOR ? 2 : 1; 
    const name = role === Role.COLABORADOR ? 'Colaborador UAPA' : 'Admin UAPA';
    const seed = role === Role.COLABORADOR ? 'colaborador' : 'admin';
    const photoUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}&backgroundColor=b6e3f4,c0aede,d1d4f9&mood=happy`;
    
    const mockUser: User = {
      id: id,
      name: name,
      email: role === Role.COLABORADOR ? 'colaborador@uapa.edu.do' : 'admin@uapa.edu.do',
      role: role,
      photoUrl: photoUrl
    };
    setUser(mockUser);
  };

  const handleCreateRequest = async (formData: any) => {
    if (!user) return;
    setLoading(true);
    try {
      const payload = {
        titulo: formData.name,
        descripcion: formData.description,
        tipo_solicitud: formData.requestType,
        rubro_presupuestal: formData.budgetRubro,
        monto_a_ejecutar: formData.executionAmount,
        presupuesto_pre_aprobado: formData.preApprovedBudget,
        fecha_solicitud: new Date().toLocaleDateString('es-DO') + ' ' + new Date().toLocaleTimeString('es-DO', {hour: '2-digit', minute:'2-digit'}),
        // Enviamos IDs en lugar de nombres si el backend lo espera
        ubicacion_id: formData.locationId,
        cuenta_analitica_id: formData.analyticalAccountId
      };
      
      try {
        await budgetService.create(payload as any);
        addToast('Solicitud enviada correctamente', 'success');
        fetchAllRequests(); 
      } catch (e: any) {
        if (e.status === 401) {
          handleApiError(e);
          return;
        }
        
        console.warn('POST no disponible, simulando localmente');
        const localRequest: BudgetRequest = {
          id: Math.floor(Math.random() * 1000),
          titulo: payload.titulo,
          descripcion: payload.descripcion,
          tipo_solicitud: payload.tipo_solicitud,
          rubro_presupuestal: payload.rubro_presupuestal,
          monto_a_ejecutar: payload.monto_a_ejecutar,
          presupuesto_pre_aprobado: payload.presupuesto_pre_aprobado,
          fecha_solicitud: payload.fecha_solicitud,
          estado: BudgetStatus.PENDING,
          observaciones_supervisor: "",
          colaborador: {
             id: Number(user.id),
             username: user.email.split('@')[0],
             first_name: user.name.split(' ')[0],
             last_name: user.name.split(' ')[1] || 'Usuario',
             email: user.email
          },
          ubicacion: { id: formData.locationId, nombre: formData.locationName },
          cuenta_analitica: { id: formData.analyticalAccountId, codigo: "CA-001", nombre: formData.analyticalAccountName }
        };
        setRequests(prev => [localRequest, ...prev]);
        addToast('Solicitud guardada localmente (Modo Demo)', 'info');
      }
      
      setView('dashboard');
    } catch (error: any) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditRequest = async (formData: any) => {
    if (!user || !selectedRequestId) return;
    setLoading(true);
    try {
      const payload = {
        titulo: formData.name,
        descripcion: formData.description,
        tipo_solicitud: formData.requestType,
        rubro_presupuestal: formData.budgetRubro,
        monto_a_ejecutar: formData.executionAmount,
        presupuesto_pre_aprobado: formData.preApprovedBudget,
        ubicacion_id: formData.locationId,
        cuenta_analitica_id: formData.analyticalAccountId
      };

      try {
        await budgetService.update(selectedRequestId, payload as any);
        addToast('Solicitud actualizada correctamente', 'success');
        fetchAllRequests();
      } catch (e: any) {
        if (e.status === 401) {
          handleApiError(e);
          return;
        }
        console.warn('PATCH no disponible, simulando actualización local');
        setRequests(prev => prev.map(r => 
          r.id.toString() === selectedRequestId.toString() 
          ? { 
              ...r, 
              ...payload, 
              ubicacion: { ...r.ubicacion, id: formData.locationId, nombre: formData.locationName },
              cuenta_analitica: { ...r.cuenta_analitica, id: formData.analyticalAccountId, nombre: formData.analyticalAccountName } 
            } 
          : r
        ));
        addToast('Cambios guardados localmente (Modo Demo)', 'info');
      }

      setView('dashboard');
      setSelectedRequestId(null);
    } catch (error: any) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: BudgetStatus, comments?: string) => {
    setLoading(true);
    try {
      try {
        await budgetService.updateStatus(id, status, comments);
      } catch (e: any) {
        if (e.status === 401) {
          handleApiError(e);
          return;
        }
        console.warn('Modo demo: actualización local');
      }
      
      setRequests(prev => prev.map(r => 
        r.id.toString() === id ? { ...r, estado: status, observaciones_supervisor: comments || "" } : r
      ));
      addToast(`Solicitud ${status.toLowerCase()} con éxito`, 'success');
    } catch (error: any) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  const selectedRequest = useMemo(() => 
    requests.find(r => r.id.toString() === selectedRequestId?.toString()), 
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
      
      {(loading || loadingCatalogs) && (
        <div className="fixed top-0 left-0 w-full h-1 z-[60]">
          <div className="h-full bg-[#ff8300] animate-pulse"></div>
        </div>
      )}

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
            onCancel={() => {
              setView('dashboard');
              setSelectedRequestId(null);
            }}
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

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [requests, setRequests] = useState<BudgetRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastType[]>([]);

  const addToast = useCallback((message: string, type: ToastType['type'] = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type, duration: 4000 }]);
  }, []);

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const handleLogout = useCallback(() => {
    setUser(null);
    setRequests([]);
  }, []);

  const handleApiError = useCallback((error: any, customMessage?: string) => {
    console.error("API Error context:", error);
    if (error.status === 401) {
      handleLogout();
      addToast('Tu sesión ha expirado o no tienes autorización. Por favor inicia sesión nuevamente.', 'error');
      return true;
    }
    addToast(customMessage || `Error: ${error.message}`, 'error');
    return false;
  }, [addToast, handleLogout]);

  const fetchAllRequests = useCallback(async () => {
    setLoading(true);
    try {
      const data = await budgetService.getAll();
      setRequests(data);
    } catch (error: any) {
      handleApiError(error, 'No se pudieron cargar las solicitudes.');
    } finally {
      setLoading(false);
    }
  }, [handleApiError]);

  return (
    <CatalogProvider>
      <AppContent 
        user={user} 
        setUser={setUser}
        requests={requests}
        setRequests={setRequests}
        loading={loading}
        setLoading={setLoading}
        toasts={toasts}
        addToast={addToast}
        removeToast={removeToast}
        handleLogout={handleLogout}
        fetchAllRequests={fetchAllRequests}
        handleApiError={handleApiError}
      />
    </CatalogProvider>
  );
};

export default App;
