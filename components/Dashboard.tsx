
import React, { useState, useMemo } from 'react';
import { User, Role, BudgetRequest, BudgetStatus } from '../types';
import BudgetCard from './BudgetCard';

interface DashboardProps {
  user: User;
  requests: BudgetRequest[];
  onViewDetails: (id: string) => void;
  onEdit: (id: string) => void;
  onCreate: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, requests, onViewDetails, onEdit, onCreate }) => {
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [statusFilter, setStatusFilter] = useState<BudgetStatus | 'TODOS'>('TODOS');
  
  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 5 }, (_, i) => currentYear - i);
  }, []);

  const filteredRequests = useMemo(() => {
    let list = requests;

    // Colaborador only sees their own
    if (user.role === Role.COLABORADOR) {
      list = list.filter(r => r.userId === user.id);
    }

    // Filter by year
    list = list.filter(r => new Date(r.requestDate).getFullYear() === selectedYear);

    // Filter by status (Admin feature or general)
    if (statusFilter !== 'TODOS') {
      list = list.filter(r => r.status === statusFilter);
    }

    // Sort by date descending
    return list.sort((a, b) => new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime());
  }, [requests, user, selectedYear, statusFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            {user.role === Role.ADMINISTRADOR ? 'Todas las Solicitudes' : 'Mis Solicitudes'}
          </h2>
          <p className="text-slate-500">Mostrando registros para el periodo {selectedYear}</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex bg-white border border-slate-200 rounded-lg p-1 shadow-sm">
            {years.map(year => (
              <button
                key={year}
                onClick={() => setSelectedYear(year)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                  selectedYear === year ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {year}
              </button>
            ))}
          </div>

          {user.role === Role.ADMINISTRADOR && (
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="bg-white border border-slate-200 rounded-lg px-4 py-2 text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            >
              <option value="TODOS">Todos los Estados</option>
              <option value={BudgetStatus.PENDING}>Pendientes</option>
              <option value={BudgetStatus.APPROVED}>Aprobadas</option>
              <option value={BudgetStatus.REJECTED}>Rechazadas</option>
            </select>
          )}

          {user.role === Role.COLABORADOR && (
            <button 
              onClick={onCreate}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-md shadow-blue-100 flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Nueva Solicitud
            </button>
          )}
        </div>
      </div>

      {filteredRequests.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-slate-200 rounded-2xl p-20 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-slate-500 font-medium">No se encontraron solicitudes para este periodo.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRequests.map(req => (
            <BudgetCard 
              key={req.id} 
              request={req} 
              onView={() => onViewDetails(req.id)}
              onEdit={() => onEdit(req.id)}
              isCollaborator={user.role === Role.COLABORADOR}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
