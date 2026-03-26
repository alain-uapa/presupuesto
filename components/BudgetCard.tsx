import React from 'react';
import { BudgetRequest, BudgetStatus, Role } from '../types';
import { useCatalogs } from '../context/CatalogContext';
import Avatar from './Avatar';
import { UnisexAvatar } from './BudgetDetails';
import { dnsDateFormat, formatCurrency } from '../utils/dateUtils';

interface BudgetCardProps {
  request: BudgetRequest;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
  userRole: Role;
  picture: string;
}

const BudgetCard: React.FC<BudgetCardProps> = ({ request, onView, onEdit, onDelete, userRole, picture }) => {
  const isCollaborator = userRole === Role.COLABORADOR;
  const isSupervisor = userRole === Role.SUPERVISOR;
  const canEdit = (isCollaborator || isSupervisor) && (request.estado === BudgetStatus.PENDING || request.estado === BudgetStatus.POR_REVISION);
  const canDelete = isCollaborator && request.estado === BudgetStatus.PENDING;
  const { ESTADO_CHOICES, getLabel } = useCatalogs();

    const getBorderCardColor = (status: BudgetStatus) => {
      return status === BudgetStatus.REJECTED ? 'border-red-100' : status === BudgetStatus.PENDING ? 'border-amber-100' : status === BudgetStatus.POR_REVISION ? 'border-blue-100' : 'border-emerald-100';
    }
    const getBgCardColor = (status: BudgetStatus) => {
      return status === BudgetStatus.REJECTED ? 'bg-red-50' : status === BudgetStatus.PENDING ? 'bg-amber-50' : status === BudgetStatus.POR_REVISION ? 'bg-blue-50' : 'bg-green-50';
    }
  const getStatusStyle = (status: BudgetStatus) => {
    switch (status) {
      case BudgetStatus.APPROVED:
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case BudgetStatus.REJECTED:
        return 'bg-rose-100 text-rose-700 border-rose-200';
      case BudgetStatus.POR_REVISION:
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-amber-100 text-amber-700 border-amber-200';
    }
  };

  const requesterId = request.colaborador?.id || 'unknown';
  const fullName = request.colaborador 
    ? `${request.colaborador.first_name} ${request.colaborador.last_name}` 
    : 'Colaborador';

  return (
    <div 
      className={`relative border ${getBorderCardColor(request.estado)} bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow group flex flex-col justify-between`}
    >
      <div>
        <div className="flex justify-between items-start mb-4">
          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusStyle(request.estado)}`}>
            {getLabel(ESTADO_CHOICES, request.estado)}
          </span>
          <span className="text-xs text-slate-400 font-medium">{dnsDateFormat(request.fecha_solicitud)}</span>
        </div>

        <h3 className="font-bold text-[#333333] line-clamp-2 mb-2 group-hover:text-[#003B71] transition-colors">
          {request.titulo}
        </h3>
        <p className="text-sm text-slate-500 line-clamp-2 mb-4">
          {request.descripcion}
        </p>

        <div className="grid grid-cols-2 bg-slate-50 gap-3 mb-4 p-3 rounded-lg border border-slate-200">
          <div>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">Presupuesto</p>
            <p className="text-xs font-bold text-[#333333]">{formatCurrency(request.presupuesto_pre_aprobado)}</p>
          </div>
          <div>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">A Ejecutar</p>
            <p className="text-xs font-bold text-[#ff8300]">{formatCurrency(request.monto_a_ejecutar)}</p>
          </div>
        </div>
        {!isCollaborator && (
          /* Vista para Supervisor: Muestra solicitante y ubicación */
          <div className="flex items-center gap-2 mb-4">
            <UnisexAvatar />
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-600 font-bold leading-none mb-0.5">
                {fullName}
              </span>
              <span className="text-[9px] text-slate-400 font-medium">
                {request.ubicacion?.nombre || 'Sede'}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 pt-4 border-t border-slate-50">
        <button 
          onClick={onView}
          className="flex-grow bg-white hover:bg-slate-50 border border-slate-200 text-[#333333] py-2 rounded-lg text-sm font-semibold transition-colors"
        >
          Ver Detalles
        </button>
        {canEdit && (
          <button 
            onClick={onEdit}
            className="p-2 text-slate-400 hover:text-[#003B71] hover:bg-blue-50 rounded-lg transition-colors"
            title="Editar solicitud"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
        )}
        {canDelete && (
          <button 
            onClick={() => { if (window.confirm('¿Estás seguro de eliminar esta solicitud?')) onDelete(); }}
            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Eliminar solicitud"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}
      </div>
      {request.confirmado && (
        <div className="group absolute -top-2.5 -right-2.5 w-[34px] h-[34px] bg-emerald-500 rounded-full flex items-center justify-center border-2 border-white shadow-[0_0_12px_rgba(16,185,129,0.5)]">
        <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        <span className="absolute bottom-full mb-2 hidden group-hover:flex items-center justify-center bg-gray-800 text-white text-xs font-medium px-2 py-1 rounded shadow-lg whitespace-nowrap after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-8 after:border-transparent after:border-t-gray-800">
          Confirmado por Compra
        </span>
      </div>
      )}
    </div>
  );
};
export default BudgetCard;
