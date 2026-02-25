import React, { useState, useMemo, useEffect } from 'react';
import { User, Role, BudgetRequest, BudgetStatus } from '../types';
import BudgetCard from './BudgetCard';

interface DashboardProps {
  user: User;
  requests: BudgetRequest[];
  onViewDetails: (id: string) => void;
  onEdit: (id: string) => void;
  onCreate: () => void;
  onDelete: () => void;
  onRefresh?: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, requests, onViewDetails, onEdit, onCreate, onDelete, onRefresh }) => {
  const isCollaborator = user.role === Role.COLABORADOR;
  const isSupervisor = user.role === Role.SUPERVISOR;
  const isAUDITOR = user.role === Role.AUDITOR;

  useEffect(() => {
    if (onRefresh) {
      const interval = setInterval(() => {
        onRefresh();
      }, 120000);
      return () => clearInterval(interval);
    }
  }, [onRefresh]);

  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [statusFilter, setStatusFilter] = useState<BudgetStatus | 'TODOS'>('TODOS');
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);

  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return [currentYear, currentYear - 1];
  }, []);

  const months = [
    { value: 1, label: 'Enero' },
    { value: 2, label: 'Febrero' },
    { value: 3, label: 'Marzo' },
    { value: 4, label: 'Abril' },
    { value: 5, label: 'Mayo' },
    { value: 6, label: 'Junio' },
    { value: 7, label: 'Julio' },
    { value: 8, label: 'Agosto' },
    { value: 9, label: 'Septiembre' },
    { value: 10, label: 'Octubre' },
    { value: 11, label: 'Noviembre' },
    { value: 12, label: 'Diciembre' },
  ];

  const filteredRequests = useMemo(() => {
    let list = requests || [];

    // if (isCollaborator) {
    //   list = list.filter(r => 
    //     r.colaborador && 
    //     String(r.colaborador.id) === String(user.id)
    //   );
    // }

    // Filtro por año y mes basado en "DD/MM/YYYY"
    list = list.filter(r => {
      if (!r.fecha_solicitud) return true;
      try {
        const [day, month, year] = r.fecha_solicitud.split('/');
        return (
          parseInt(year) === selectedYear &&
          parseInt(month) === selectedMonth
        );
      } catch (e) {
        console.error("Error parsing fecha_solicitud:", e);
        return true;
      }
    });

    // Filtro por estado
    if (statusFilter !== 'TODOS') {
      list = list.filter(r => r.estado === statusFilter);
    }

    return list;
  }, [requests, user, selectedYear, selectedMonth, statusFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#333333]">
            {(isSupervisor || isAUDITOR) ? 'Todas las Solicitudes' : 'Mis Solicitudes'}
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
                  selectedYear === year ? 'bg-[#003B71] text-white' : 'text-[#333333] hover:bg-slate-50'
                }`}
              >
                {year}
              </button>
            ))}
          </div>

          <select 
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            className="bg-white border border-slate-200 rounded-lg px-4 py-2 text-sm font-medium text-[#333333] outline-none focus:ring-2 focus:ring-[#003B71] shadow-sm"
          >
            {months.map(month => (
              <option key={month.value} value={month.value}>{month.label}</option>
            ))}
          </select>

          {(isSupervisor || isAUDITOR) && (
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="bg-white border border-slate-200 rounded-lg px-4 py-2 text-sm font-medium text-[#333333] outline-none focus:ring-2 focus:ring-[#003B71] shadow-sm"
            >
              <option value="TODOS">Todos los Estados</option>
              <option value={BudgetStatus.PENDING}>Pendientes</option>
              <option value={BudgetStatus.APPROVED}>Aprobadas</option>
              <option value={BudgetStatus.REJECTED}>Rechazadas</option>
            </select>
          )}

          {onRefresh && (
            <button 
              onClick={onRefresh}
              className="p-2 text-slate-500 hover:text-[#003B71] hover:bg-blue-50 rounded-lg transition-colors border border-slate-200 bg-white shadow-sm"
              title="Actualizar solicitudes"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          )}

          {isCollaborator && (
            <button 
              onClick={onCreate}
              className="bg-[#ff8300] hover:bg-[#e67600] text-white px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-md shadow-orange-100 flex items-center gap-2"
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
          <div className="w-16 h-16 bg-[#F8F9FA] rounded-full flex items-center justify-center mb-4">
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
              onView={() => onViewDetails(String(req.id))}
              onEdit={() => onEdit(String(req.id))}
              onDelete={() => onDelete(String(req.id))}              
              userRole={user.role}
              avatar={<UnisexAvatar />} // Added unisex avatar
            />
          ))}
        </div>
      )}
    </div>
  );
};

const UnisexAvatar = () => (
  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14c3.866 0 7-3.134 7-7S15.866 0 12 0 5 3.134 5 7s3.134 7 7 7zm0 2c-4.418 0-8 3.582-8 8h16c0-4.418-3.582-8-8-8z" />
    </svg>
  </div>
);

export default Dashboard;
