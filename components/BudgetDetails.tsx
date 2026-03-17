import React, { useState } from 'react';
import Select from "react-select";
import { BudgetRequest, BudgetStatus, User, Role, ReviewNote } from '../types';
import { useCatalogs } from '../context/CatalogContext';
import AttachmentList from './AttachmentList';
import CertificateTemplate from './CertificateTemplate';
import StatusChangeModal from './StatusChangeModal';
import { formatForDisplay } from '../utils/dateUtils';

interface BudgetDetailsProps {
  user: User;
  request: BudgetRequest;
  onBack: () => void;
  onUpdateStatus: (id: string, status: BudgetStatus, comments?: string) => void;
  onDeleteAttachment?: (id: number | string) => void;
  onCertificateCreated?: () => void;
  addToast?: (message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
}
const UnisexAvatar = () => (
  <div className="w-12 h-12 bg-[#003B71] rounded-full flex items-center justify-center shadow-md">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  </div>
);

const BudgetDetails: React.FC<BudgetDetailsProps> = ({ user, request, onBack, onUpdateStatus, onDeleteAttachment, onCertificateCreated, addToast }) => {
  const { cuentasContables } = useCatalogs();
  const isCollaborator = user.role === Role.COLABORADOR;
  const isSupervisor = user.role === Role.SUPERVISOR;

  const { ESTADO_CHOICES, TIPO_CHOICES, RUBRO_CHOICES, getLabel } = useCatalogs();
  const [rejectionComments, setRejectionComments] = useState(request.observaciones_supervisor || '');
  const [showCertificateForm, setShowCertificateForm] = useState(false);
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [showRevisionModal, setShowRevisionModal] = useState(false);
  const [isRequestingRevision, setIsRequestingRevision] = useState(false);
  const [selectedAttachmentIds, setSelectedAttachmentIds] = useState<number[]>([]);
  const [cuentaContable, setCuentaContable] = useState('');

  const certificadoFile = request.files?.find(f => f.es_certificado);
  const certificadoUrl = certificadoFile?.url_view;
  const regularFiles = (request.files?.filter(f => !f.es_certificado) || []).sort((a, b) => {
    const aApproved = certificadoUrl ? a.aprobado === true : selectedAttachmentIds.includes(a.id as number);
    const bApproved = certificadoUrl ? b.aprobado === true : selectedAttachmentIds.includes(b.id as number);
    return (aApproved === bApproved) ? 0 : aApproved ? -1 : 1;
  });

  const toggleAttachment = (fileId: number) => {
    setSelectedAttachmentIds(prev => 
      prev.includes(fileId)
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    );
  };

  const handleCreateCertificate = () => {
    if (!cuentaContable.trim()) {
      if (addToast) {
        addToast('Debe introducir la cuenta contable', 'error');
      }
      return;
    }
    setShowCertificateForm(true);
  };

  const handleSuccess = async () => {
    setShowCertificateForm(false);
    if (onCertificateCreated) {
      await onCertificateCreated();
    }
  };
  const getBorderFormColor = () => {
    return request.estado === BudgetStatus.REJECTED ? 'border-red-100' : request.estado === BudgetStatus.PENDING ? 'border-amber-100' : 'border-emerald-100';
  }
  const getBgHeaderColor = () => {
    return request.estado === BudgetStatus.REJECTED ? 'bg-red-50' : request.estado === BudgetStatus.PENDING ? 'bg-amber-50' : 'bg-emerald-50';
  }
  const getStatusBadge = (status: BudgetStatus) => {
    const label = getLabel(ESTADO_CHOICES, status);
    switch (status) {
      case BudgetStatus.APPROVED:
        return (
          <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-100 px-5 py-2.5 shadow-sm">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4.5 w-4.5 text-emerald-50" aria-hidden="true">
                <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path>
                <path d="m9 12 2 2 4-4"></path>
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-medium uppercase tracking-wider text-emerald-600">Estado</span>
              <span className="text-sm font-bold text-emerald-700">{label}</span>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1 h-4 w-4 text-emerald-400" aria-hidden="true">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="m9 12 2 2 4-4"></path>
            </svg>
          </div>
        );
      case BudgetStatus.REJECTED:
        return (
          <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-100 px-5 py-2.5 shadow-sm">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4.5 w-4.5 text-white" aria-hidden="true">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="m15 9-6 6"></path>
                <path d="m9 9 6 6"></path>
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-medium uppercase tracking-wider text-red-400">Estado</span>
              <span className="text-sm font-bold text-red-700">{label}</span>
            </div>
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-100 px-5 py-2.5 shadow-sm">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4.5 w-4.5 text-white" aria-hidden="true">
                <path d="M12 6v6l4 2"></path>
                <circle cx="12" cy="12" r="10"></circle>
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-medium uppercase tracking-wider text-amber-500">Estado</span>
              <span className="text-sm font-bold text-amber-700">{label}</span>
            </div>
          </div>
        );
    }
  };

  const handleStatusChange = (newStatus: BudgetStatus) => {
    if (newStatus === BudgetStatus.REJECTED) {
      setShowRejectionModal(true);
      return;
    }
    onUpdateStatus(String(request.id), newStatus, undefined);
  };

  const handleRejectConfirm = async (comments: string) => {
    setIsRejecting(true);
    try {
      onUpdateStatus(String(request.id), BudgetStatus.REJECTED, comments);
      setShowRejectionModal(false);
    } finally {
      setIsRejecting(false);
    }
  };

  const handleRevisionConfirm = async (comments: string) => {
    setIsRequestingRevision(true);
    try {
      onUpdateStatus(String(request.id), BudgetStatus.POR_REVISION, comments);
      setShowRevisionModal(false);
    } finally {
      setIsRequestingRevision(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-DO', { style: 'currency', currency: 'DOP' }).format(amount || 0);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-DO', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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

  if (showCertificateForm) {
    const selectedFiles = regularFiles.filter(f => selectedAttachmentIds.includes(f.id as number));
    return (
      <CertificateTemplate 
        solicitudId={request.id}
        selectedAttachments={selectedFiles}
        cuentaContable={cuentaContable}
        onCancel={() => {
          setShowCertificateForm(false);
          setSelectedAttachmentIds([]);
          setCuentaContable('');
        }}
        onSuccess={handleSuccess}
        addToast={addToast}
      />
    );
  }
  return (
    <div className={`max-w-5xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden border ${getBorderFormColor()}`}>
      {/* Header */}
      <div className={`p-6 md:p-8 ${getBgHeaderColor()} border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4`}>
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
            <p className="text-sm text-slate-500">Solicitado el {formatForDisplay(request.fecha_solicitud)}</p>
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

          {request.estado !== BudgetStatus.APPROVED && (
            <section>
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3 border-b border-slate-100 pb-2">Documentación Adjunta</h3>
              <AttachmentList 
                files={request.files} 
              />
            </section>
          )}

        </div>

        {/* Action Sidebar */}
        <div className="space-y-6">
          <div className="bg-[#F8F9FA] p-4 rounded-2xl border border-slate-200">
             <h3 className="text-sm font-bold text-[#333333] mb-4 uppercase tracking-wider">Solicitante</h3>
             <div className="flex items-center gap-3">
                <UnisexAvatar />
                <div>
                   <p className="text-sm font-bold text-[#333333]">{fullName}</p>
                   <p className="text-xs text-slate-500">{request.colaborador?.username ? `${request.colaborador.username}` : ''}</p>
                </div>
             </div>
          </div>

          {request.estado === BudgetStatus.REJECTED && (
            <section className="bg-rose-50 border border-rose-100 p-4 rounded-2xl">
              <h3 className="text-sm font-bold text-rose-900 uppercase tracking-widest mb-2">Observaciones</h3>
              <p className="text-rose-800 text-sm">
                {request.observaciones_supervisor || 'No se proporcionaron comentarios adicionales.'}
              </p>
            </section>
          )}

          {(request.estado === BudgetStatus.POR_REVISION || request.estado === BudgetStatus.PENDING) && request.review_notes && request.review_notes.length > 0 && (
            <section className="bg-blue-50 border border-blue-100 p-4 rounded-2xl">
              <h3 className="text-sm font-bold text-blue-900 uppercase tracking-widest mb-3">
                Notas de Revisión ({request.review_notes.length})
              </h3>
              <div className="space-y-3">
                {request.review_notes.map((note) => (
                  <div key={note.id} className="bg-white border border-blue-200 p-3 rounded-xl">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-xs font-bold text-blue-700">{note.supervisor}</span>
                      <span className="text-xs text-blue-400">{formatDate(note.fecha_creacion)}</span>
                    </div>
                    <p className="text-sm text-blue-800">{note.contenido}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {user.role === Role.SUPERVISOR && request.estado === BudgetStatus.PENDING && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-[#333333] uppercase tracking-wider">Gestión</h3>
              
              <div className="space-y-3">
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleStatusChange(BudgetStatus.APPROVED)}
                    className="flex-1 bg-[#ff8300] hover:bg-[#e67600] text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-orange-100 flex items-center justify-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Aprobar
                  </button>
                  <button 
                    onClick={() => setShowRevisionModal(true)}
                    className="flex-1 bg-[#003B71] hover:bg-[#002d56] text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-blue-100 flex items-center justify-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    Revisión
                  </button>
                </div>

                <button 
                  onClick={() => handleStatusChange(BudgetStatus.REJECTED)}
                  className="w-full bg-white hover:bg-rose-50 border-2 border-rose-200 text-rose-600 font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  Rechazar Solicitud
                </button>
              </div>
            </div>
          )}

          {request.estado === BudgetStatus.APPROVED && (
            <div className="space-y-4">
              {/* Confirmation message */}
              {request.confirmado && (
                <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm font-semibold text-emerald-500">Confirmada por Compra.</p>
                </div>
              )}
              {certificadoUrl && (
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-[#003B71] uppercase tracking-wider">Certificado Generado</h3>
                  <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                    <div className="flex items-center space-x-3 overflow-hidden">
                      <div className="flex-shrink-0 p-2 bg-emerald-100 rounded-lg text-emerald-600">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-sm font-semibold text-emerald-700 truncate">Certificado de Aprobación</p>
                        <p className="text-xs text-emerald-500">PDF generado</p>
                      </div>
                    </div>
                    <a 
                      href={certificadoUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="ml-4 p-2 text-emerald-400 hover:text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                </div>
              )}
              {isSupervisor && (
                <h3 className={`text-sm font-bold uppercase tracking-wider ${certificadoUrl ? 'text-slate-500' : 'text-[#333333]'}`}>
                  {certificadoUrl ? 'Cotizaciones' : 'Certificado'}
                </h3>
              )}
              <div className="space-y-3">
                {!certificadoUrl && isSupervisor && (
                  <>
                  <p className="text-ms text-slate-500 mb-2">Cuenta Contable</p>
                  <Select 
                    onChange={(newValue) => {
                      setCuentaContable(String(newValue.value));
                    }}
                    options={cuentasContables.map(c=>({value: c.id, label: `${c.codigo} - ${c.nombre}`}))} placeholder="Seleccione la cuenta..." />
                  </>
                )}
                {!certificadoUrl && isSupervisor && regularFiles.length > 0 && (
                  <p className="text-ms text-slate-500 mb-2">Seleccione las cotizaciones</p>
                )}
                {regularFiles.map((file) => {
                  const fileId = file.id as number;
                  const isApproved = file.aprobado === true;
                  const isSelected = certificadoUrl ? isApproved : selectedAttachmentIds.includes(fileId);
                  
                  return (
                    <div 
                      key={fileId} 
                      className={`flex items-center justify-between p-2 border rounded-lg transition-colors ${
                        certificadoUrl 
                          ? isApproved 
                            ? 'bg-emerald-50 border-emerald-200' 
                            : 'bg-gray-50 border-gray-200 opacity-60'
                          : 'bg-gray-50 border-gray-200 hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-2 flex-grow">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={certificadoUrl ? undefined : () => toggleAttachment(fileId)}
                          disabled={certificadoUrl}
                          className="w-4 h-4 text-[#003B71] border-gray-300 rounded focus:ring-[#003B71] disabled:cursor-not-allowed"
                        />
                        <span className={`text-xs font-medium truncate ${
                          certificadoUrl 
                            ? isApproved ? 'text-emerald-700' : 'text-gray-500'
                            : 'text-gray-700'
                        }`}>
                          {(file.nombre || file.name || '').length > 35 
                            ? `${(file.nombre || file.name || '').slice(0, 35)}...` 
                            : file.nombre || file.name}
                        </span>
                      </div>
                      {file.url_view && (
                        <a 
                          href={file.url_view} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="p-1 text-gray-400 hover:text-[#003B71] hover:bg-blue-50 rounded transition-colors"
                          title="Ver archivo"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      )}
                    </div>
                  );
                })}
              </div>

              {!certificadoUrl && isSupervisor  && (
                <button 
                  onClick={handleCreateCertificate}
                  className="w-full bg-[#003B71] hover:bg-[#002d56] text-white font-bold py-3 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                  </svg>
                  Crear Certificado
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <StatusChangeModal
        isOpen={showRejectionModal}
        onClose={() => setShowRejectionModal(false)}
        onConfirm={handleRejectConfirm}
        isLoading={isRejecting}
        title="Rechazar Solicitud"
        description="Por favor indique el motivo del rechazo"
        confirmText="Confirmar Rechazo"
        buttonColor="rose"
        label="Motivo del Rechazo"
        placeholder="Explique el motivo por el cual está rechazando esta solicitud..."
      />

      <StatusChangeModal
        isOpen={showRevisionModal}
        onClose={() => setShowRevisionModal(false)}
        onConfirm={handleRevisionConfirm}
        isLoading={isRequestingRevision}
        title="Solicitar Revisión"
        description="Indique los cambios o información requerida"
        confirmText="Confirmar"
        buttonColor="blue"
        label="Comentarios"
        placeholder="Indique qué cambios o información adicional se requiere..."
      />
    </div>
  );
};
export {UnisexAvatar};
export default BudgetDetails;
