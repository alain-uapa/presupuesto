
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Routes, Route, useNavigate, useLocation, useParams } from 'react-router-dom';
import { Role, User, BudgetRequest, BudgetStatus, ToastType } from './types';
import './styles/loader.css';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import BudgetDetails from './components/BudgetDetails';
import BudgetForm from './components/BudgetForm';
import ToastContainer from './components/Toast';
import Navbar from './components/Navbar';
import CertificatePreview from './components/CertificatePreview';
import { budgetService } from './services/budget.service';
import { authService } from './services/auth.service';
import { CatalogProvider, useCatalogs } from './context/CatalogContext';

interface DashboardViewProps {
  user: User;
  requests: BudgetRequest[];
  onViewDetails: (id: number | string) => void;
  onEdit: (id: number | string) => void;
  onDelete: (id: number | string) => void;
}

const DashboardView: React.FC<DashboardViewProps> = ({ user, requests, onViewDetails, onEdit, onDelete }) => {
  const navigate = useNavigate();
  return (
    <Dashboard 
      user={user} 
      requests={requests} 
      onViewDetails={onViewDetails}
      onEdit={onEdit}
      onCreate={() => navigate('/create')}
      onDelete={onDelete}        
    />
  );
};

interface BudgetDetailsViewProps {
  user: User;
  requests: BudgetRequest[];
  loading: boolean;
  onUpdateStatus: (id: string, status: BudgetStatus, comments?: string) => void;
  onDeleteAttachment?: (id: number | string, requestId?: string) => void;
  onCertificateCreated: () => void;
}

const BudgetDetailsView: React.FC<BudgetDetailsViewProps> = ({ user, requests, loading, onUpdateStatus, onDeleteAttachment, onCertificateCreated }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const request = useMemo(() => 
    requests.find(r => String(r.id) === id), 
    [requests, id]
  );

  // Si está cargando, no mostrar nada (el loader global se encarga)
  if (loading) {
    return null;
  }

  if (!request) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <svg className="w-16 h-16 text-slate-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-slate-500 text-lg">Solicitud no encontrada</p>
        <button 
          onClick={() => navigate('/')}
          className="mt-4 px-4 py-2 bg-[#003B71] text-white rounded-lg hover:bg-[#002a52] transition-colors"
        >
          Volver al Dashboard
        </button>
      </div>
    );
  }

  const handleDeleteAttachment = (attachmentId: number | string) => {
    if (onDeleteAttachment) {
      onDeleteAttachment(attachmentId, id);
    }
  };

  return (
    <BudgetDetails 
      user={user}
      request={request} 
      onBack={() => navigate('/')}
      onUpdateStatus={onUpdateStatus}
      onDeleteAttachment={handleDeleteAttachment}
      onCertificateCreated={onCertificateCreated}
    />
  );
};

interface BudgetFormViewProps {
  requests: BudgetRequest[];
  onSubmit: (formValues: any, id?: string) => Promise<void>;
  onCancel: () => void;
}

const BudgetFormView: React.FC<BudgetFormViewProps> = ({ requests, onSubmit, onCancel }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const initialData = useMemo(() => 
    id ? requests.find(r => String(r.id) === id) : undefined,
    [requests, id]
  );

  const handleSubmit = (formValues: any) => {
    onSubmit(formValues, id);
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <BudgetForm 
      initialData={initialData}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
    />
  );
};

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
  const navigate = useNavigate();
  const location = useLocation();
  const { fetchCatalogs, loadingCatalogs } = useCatalogs();

  useEffect(() => {
    if (user) {
      fetchAllRequests();
      fetchCatalogs();
    }
  }, [user, fetchAllRequests, fetchCatalogs]);

  // Guard: si no hay usuario, redirigir a /login con la URL actual
  useEffect(() => {
    if (!user && location.pathname !== '/login') {
      navigate('/login', { state: { from: location.pathname } });
    }
  }, [user, location.pathname, navigate]);

  // Si está en /login y ya tiene usuario, redirigir a la ruta original o al dashboard
  useEffect(() => {
    if (user && location.pathname === '/login') {
      const redirectTo = location.state?.from || '/';
      navigate(redirectTo, { replace: true });
    }
  }, [user, location.pathname, location.state?.from, navigate]);

  const handleCreateRequest = async (formValues: any) => {
    if (!user) return;
    setLoading(true);
        
    try {
      const formData = new FormData();

      formData.append('titulo', formValues.name);
      formData.append('descripcion', formValues.description);
      formData.append('tipo_solicitud', formValues.requestType);
      formData.append('rubro_presupuestal', formValues.budgetRubro);
      formData.append('monto_a_ejecutar', formValues.executionAmount);
      formData.append('presupuesto_pre_aprobado', formValues.preApprovedBudget);
      formData.append('ubicacion_id', formValues.locationId);
      formData.append('cuenta_analitica_id', formValues.analyticalAccountId);
      
      formValues.attachments.forEach((attachment) => {
        formData.append('files', attachment.file);
      });

      await budgetService.create(formData);
      
      await fetchAllRequests();      
      navigate('/');
      addToast('Solicitud enviada correctamente', 'success');
    } catch (error: any) {
      handleApiError(error, 'No se pudo crear la solicitud. Verifique los datos e intente de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditRequest = async (formValues: any, id?: string) => {
    if (!user || !id) return;
    setLoading(true);
    try {
      const formData = new FormData();

      formData.append('titulo', formValues.name);
      formData.append('descripcion', formValues.description);
      formData.append('tipo_solicitud', formValues.requestType);
      formData.append('rubro_presupuestal', formValues.budgetRubro);
      formData.append('monto_a_ejecutar', formValues.executionAmount);
      formData.append('presupuesto_pre_aprobado', formValues.preApprovedBudget);
      formData.append('ubicacion_id', formValues.locationId);
      formData.append('cuenta_analitica_id', formValues.analyticalAccountId);
      
      formValues.attachments.forEach((attachment) => {
        formData.append('files', attachment.file);
      });

      await budgetService.update(id, formData as any);
      
      await fetchAllRequests();
      navigate('/');
      addToast('Solicitud actualizada correctamente', 'success');
    } catch (error: any) {
      handleApiError(error, 'Error al actualizar la solicitud. Por favor reintente.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: BudgetStatus, comments?: string) => {
    setLoading(true);
    try {
      await budgetService.updateStatus(id, status, comments);
      
      setRequests(prev => prev.map(r => 
        String(r.id) === String(id) ? { ...r, estado: status, observaciones_supervisor: comments || "" } : r
      ));
      addToast(`Solicitud ${status.toLowerCase()} con éxito`, 'success');
    } catch (error: any) {
      handleApiError(error, 'Error al cambiar el estado de la solicitud.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBudget = async (id: string) => {
    setLoading(true);
    try {
      await budgetService.delete(id);
      
      setRequests(prev => prev.filter(r => 
        String(r.id) !== String(id)
      ));
      addToast(`Solicitud eliminada con éxito`, 'success');
    } catch (error: any) {
      handleApiError(error, 'Error al eliminar la solicitud.');
    } finally {
      setLoading(false);
    }
  };

  const handleEliminarAdjunto = async (id: number, requestId?: string) => {
    if (window.confirm('¿Estás seguro de eliminar el documento adjunto?')) { 
      try {             
        setLoading(true);
        await budgetService.deleteAttachment(id);
        setRequests(prev => prev.map(r => {
          if (String(r.id) === String(requestId)) {
            return {
              ...r,
              files: r.files ? r.files.filter(a => String(a.id) !== String(id)) : []
            };
          }
          return r;
        }));
        addToast(`Documento adjunto eliminado con éxito`, 'success');
      } catch (error: any) {
        handleApiError(error, 'Error al eliminar el documento adjunto.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCertificateCreated = async () => {
    await fetchAllRequests();
    navigate('/');
    addToast('Certificado generado correctamente', 'success');
  };

  // Si no hay usuario, mostrar solo el Login (las rutas protegidas redirigirán a /login)
  if (!user) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex flex-col justify-center items-center p-4">
        <Routes>
          <Route path="/login" element={
            <Login 
              onLoginSuccess={(u) => setUser(u)} 
              onLoginError={(err) => addToast(err, 'error')} 
              returnTo={location.state?.from}
            />
          } />
          <Route path="*" element={null} />
        </Routes>
        <ToastContainer toasts={toasts} onRemove={removeToast} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col">
      <Navbar user={user} onLogout={handleLogout} />
      
      {(loading || loadingCatalogs) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center">
          <div className="loader"></div>
        </div>
      )}

      <main className="flex-grow container mx-auto px-4 py-8 max-w-6xl text-[#333333]">
        <Routes>
          <Route path="/login" element={
            <Login 
              onLoginSuccess={(u) => setUser(u)} 
              onLoginError={(err) => addToast(err, 'error')} 
              returnTo={location.state?.from}
            />
          } />
          <Route path="/" element={
            <DashboardView 
              user={user} 
              requests={requests}
              onViewDetails={(id) => navigate(`/request/${id}`)}
              onEdit={(id) => navigate(`/request/${id}/edit`)}
              onDelete={handleDeleteBudget}
            />
          } />
          <Route path="/create" element={
            <BudgetFormView 
              requests={requests}
              onSubmit={handleCreateRequest}
              onCancel={() => navigate('/')}
            />
          } />
          <Route path="/request/:id" element={
            <BudgetDetailsView 
              user={user}
              requests={requests}
              loading={loading}
              onUpdateStatus={handleUpdateStatus}
              onDeleteAttachment={handleEliminarAdjunto}
              onCertificateCreated={handleCertificateCreated}
            />
          } />
          <Route path="/request/:id/edit" element={
            <BudgetFormView 
              requests={requests}
              onSubmit={handleEditRequest}
              onCancel={() => navigate('/')}
            />
          } />
          <Route path="/certificado-preview" element={
            <CertificatePreview />
          } />
        </Routes>
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
  const [user, setUser] = useState<User | null>(() => authService.getSavedUser());
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
    authService.logout();
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
