import React, { useState, useMemo, useEffect } from 'react';
import { User, Role, BudgetRequest, BudgetStatus } from '../types';
import BudgetCard from './BudgetCard';

interface DashboardProps {
  user: User;
  requests: BudgetRequest[];
  filters: {
    selectedYear: number;
    selectedMonth: number;
    statusFilter: BudgetStatus | 'TODOS';
  };
  onViewDetails: (id: string) => void;
  onEdit: (id: string) => void;
  onCreate: () => void;
  onDelete: (id: number | string) => void;
  onFiltersChange: (filters: { selectedYear?: number; selectedMonth?: number; statusFilter?: BudgetStatus | 'TODOS' }) => void;
  lastUpdated?: string | null;
}

const Dashboard: React.FC<DashboardProps> = ({ user, requests, filters, onViewDetails, onEdit, onCreate, onDelete, onFiltersChange, lastUpdated }) => {
  const isCollaborator = user.role === Role.COLABORADOR;
  const isSupervisor = user.role === Role.SUPERVISOR;

  const { selectedYear, selectedMonth, statusFilter } = filters;
  const setSelectedYear = (year: number) => onFiltersChange({ selectedYear: year });
  const setStatusFilter = (status: BudgetStatus | 'TODOS') => onFiltersChange({ statusFilter: status });
  const setSelectedMonth = (month: number) => onFiltersChange({ selectedMonth: month });
  const [searchQuery, setSearchQuery] = useState<string>('');

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

    // Filtro por año y mes basado en ISO 8601 "YYYY-MM-DDTHH:MM:SS..."
    list = list.filter(r => {
      if (!r.fecha_solicitud) return true;
      try {
        const [year, month] = r.fecha_solicitud.split('T')[0].split('-');
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

    // Filtro por búsqueda de texto (mínimo 3 caracteres)
    if (searchQuery.trim().length >= 3) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter(r => {
        const titulo = (r.titulo || '').toLowerCase();
        const descripcion = (r.descripcion || '').toLowerCase();
        const solicitante = r.colaborador
          ? `${r.colaborador.first_name} ${r.colaborador.last_name} ${r.colaborador.username}`.toLowerCase()
          : '';
        const ubicacion = (r.ubicacion?.nombre || '').toLowerCase();
        return titulo.includes(q) || descripcion.includes(q) || solicitante.includes(q) || ubicacion.includes(q);
      });
    }

    return list;
  }, [requests, user, selectedYear, selectedMonth, statusFilter, searchQuery]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#333333]">
            {isSupervisor ? 'Todas las Solicitudes' : 'Mis Solicitudes'}
          </h2>
          <p className="text-slate-500">Mostrando registros para el periodo {selectedYear}</p>
          {lastUpdated && (
            <p className="text-xs text-slate-400 mt-1">
              Actualizado: {new Date(lastUpdated).toLocaleString()}
            </p>
          )}
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

          {isSupervisor && (
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

      {/* Search row */}
      <div className="flex justify-end">
        <div className="relative">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 105 11a6 6 0 0012 0z" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por título, solicitante, descripción o ubicación..."
            className="bg-white border border-slate-200 rounded-lg pl-9 pr-8 py-2 text-sm text-[#333333] outline-none focus:ring-2 focus:ring-[#003B71] shadow-sm w-80"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          {searchQuery.length > 0 && searchQuery.length < 3 && (
            <p className="absolute left-0 top-full mt-1 text-xs text-slate-400">Escribe al menos 3 caracteres para buscar</p>
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
              picture={user.picture}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
