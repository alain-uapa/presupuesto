import React, { useState } from 'react';
import { BudgetRequest, BudgetStatus, User, Role } from '../types';
import { useCatalogs } from '../context/CatalogContext';

interface BudgetDetailsProps {
  user: User;
  request: BudgetRequest;
  onBack: () => void;
  onUpdateStatus: (id: string, status: BudgetStatus, comments?: string) => void;
}

const BudgetDetails: React.FC<BudgetDetailsProps> = ({ user, request, onBack, onUpdateStatus }) => {
  const { ESTADO_CHOICES, TIPO_CHOICES, RUBRO_CHOICES, getLabel } = useCatalogs();
  const [rejectionComments, setRejectionComments] = useState(request.observaciones_supervisor || '');
  
  const getStatusBadge = (status: BudgetStatus) => {
    const label = getLabel(ESTADO_CHOICES, status);
    switch (status) {
      case BudgetStatus.APPROVED:
        return <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-sm font-bold rounded-full">{label}</span>;
      case BudgetStatus.REJECTED:
        return <span className="px-3 py-1 bg-rose-100 text-rose-700 text-sm font-bold rounded-full">{label}</span>;
      default:
        return <span className="px-3 py-1 bg-amber-100 text-amber-700 text-sm font-bold rounded-full">{label}</span>;
    }
  };

  const handleStatusChange = (newStatus: BudgetStatus) => {
    if (newStatus === BudgetStatus.REJECTED && !rejectionComments.trim()) {
      alert('Por favor especifique el motivo del rechazo.');
      return;
    }
    onUpdateStatus(String(request.id), newStatus, newStatus === BudgetStatus.REJECTED ? rejectionComments : undefined);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-DO', { style: 'currency', currency: 'DOP' }).format(amount || 0);
  };

  const DetailItem = ({ label, value }: { label: string, value: string | number }) => (
    <div className="bg-[#F8F9FA] p-4 rounded-xl border border-slate-100">
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-sm font-semibold text-[#333333]">{value || 'N/A'}</p>
    </div>
  );

  const requesterId = request.colaborador?.id || 'unknown';
  const fullName = request.colaborador 
    ? `${request.colaborador.first_name} ${request.colaborador.last_name}` 
    : 'Colaborador';

  const UnisexAvatar = () => (
    <div className="w-12 h-12 bg-[#003B71] rounded-full flex items-center justify-center shadow-md">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-100">
      {/* Header */}
      <div className="p-6 md:p-8 bg-[#F8F9FA] border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-white rounded-full transition-colors text-slate-500 shadow-sm border border-transparent hover:border-slate-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <div>
            <h2 className="text-xl font-bold text-[#333333]">{request.titulo}</h2>
            <p className="text-sm text-slate-500">Solicitado el {request.fecha_solicitud}</p>
          </div>
        </div>
        <div>
          {getStatusBadge(request.estado)}
        </div>
      </div>

      {/* Body */}
      <div className="p-6 md:p-8 grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          
          <section className="grid grid-cols-2 gap-4">
             <DetailItem label="Ubicación" value={request.ubicacion?.nombre} />
             <DetailItem label="Tipo de Solicitud" value={getLabel(TIPO_CHOICES, request.tipo_solicitud)} />
             <DetailItem label="Rubro Presupuestal" value={getLabel(RUBRO_CHOICES, request.rubro_presupuestal)} />
             <DetailItem label="Cuenta Analítica" value={request.cuenta_analitica?.nombre} />
             <DetailItem label="Presupuesto Pre-aprobado" value={formatCurrency(request.presupuesto_pre_aprobado)} />
             <DetailItem label="Monto a Ejecutar" value={formatCurrency(request.monto_a_ejecutar)} />
          </section>

          <section>
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3 border-b border-slate-100 pb-2">Descripción de la Actividad</h3>
            <p className="text-[#333333] leading-relaxed whitespace-pre-wrap">
              {request.descripcion}
            </p>
          </section>

          <section>
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3 border-b border-slate-100 pb-2">Documentación Adjunta</h3>
            <p className="text-sm text-slate-400 italic">No se adjuntaron archivos adicionales en esta versión.</p>
          </section>

          {request.estado === BudgetStatus.REJECTED && (
            <section className="bg-rose-50 border border-rose-100 p-6 rounded-2xl">
              <h3 className="text-sm font-bold text-rose-900 uppercase tracking-widest mb-2">Observaciones del Supervisor</h3>
              <p className="text-rose-800 text-sm">
                {request.observaciones_supervisor || 'No se proporcionaron comentarios adicionales.'}
              </p>
            </section>
          )}
        </div>

        {/* Action Sidebar */}
        <div className="space-y-6">
          <div className="bg-[#F8F9FA] p-6 rounded-2xl border border-slate-200">
             <h3 className="text-sm font-bold text-[#333333] mb-4 uppercase tracking-wider">Solicitante</h3>
             <div className="flex items-center gap-3">
                <UnisexAvatar />
                <div>
                   <p className="text-sm font-bold text-[#333333]">{fullName}</p>
                   <p className="text-xs text-slate-500">{request.colaborador?.username ? `@${request.colaborador.username}` : ''}</p>
                </div>
             </div>
          </div>

          {user.role === Role.SUPERVISOR && request.estado === BudgetStatus.PENDING && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-[#333333] uppercase tracking-wider">Gestión</h3>
              
              <div className="space-y-3">
                <button 
                  onClick={() => handleStatusChange(BudgetStatus.APPROVED)}
                  className="w-full bg-[#ff8300] hover:bg-[#e67600] text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-orange-100 flex items-center justify-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Aprobar Solicitud
                </button>

                <div className="space-y-2">
                   <label className="text-xs font-bold text-slate-500">Motivo de Rechazo</label>
                   <textarea 
                    value={rejectionComments}
                    onChange={(e) => setRejectionComments(e.target.value)}
                    placeholder="Escriba el motivo si decide rechazar..."
                    className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-rose-500 outline-none h-24 shadow-inner"
                   />
                   <button 
                    onClick={() => handleStatusChange(BudgetStatus.REJECTED)}
                    className="w-full bg-white hover:bg-rose-50 border-2 border-rose-200 text-rose-600 font-bold py-3 rounded-xl transition-all"
                   >
                    Rechazar Solicitud
                   </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BudgetDetails;
