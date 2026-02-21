import React, { useState } from 'react';
import html2pdf from 'html2pdf.js';
import { BudgetRequest } from '../types';
import { budgetService } from '../services/budget.service';
import CertificateTemplate from './CertificateTemplate';

interface CertificateFormProps {
  request: BudgetRequest;
  onCancel: () => void;
  onCertificateCreated: () => void;
}

interface CertificateFormData {
  titulo: string;
  solicitante: string;
  fechaSolicitud: string;
  rubroPresupuestal: string;
  centroCosto: string;
  montoAprobado: string;
  cuentaUtilizar: string;
  fechaAprobacion: string;
  concepto: string;
  folio: string;
}

const CertificateForm: React.FC<CertificateFormProps> = ({ request, onCancel, onCertificateCreated }) => {
  const fullName = request.colaborador 
    ? `${request.colaborador.first_name} ${request.colaborador.last_name}` 
    : 'Colaborador';

  const [formData, setFormData] = useState<CertificateFormData>({
    titulo: request.titulo || '',
    solicitante: fullName,
    fechaSolicitud: request.fecha_solicitud || '',
    rubroPresupuestal: request.rubro_presupuestal || 'Actividades',
    centroCosto: request.ubicacion?.nombre || '',
    montoAprobado: String(request.monto_a_ejecutar || 0),
    cuentaUtilizar: request.cuenta_analitica?.nombre || '',
    fechaAprobacion: new Date().toLocaleDateString('es-DO'),
    concepto: request.titulo || '',
    folio: String(request.id).padStart(4, '0'),
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const buildRequestWithFormData = (): BudgetRequest => ({
    ...request,
    titulo: formData.titulo,
    colaborador: {
      ...request.colaborador,
      first_name: formData.solicitante.split(' ')[0] || '',
      last_name: formData.solicitante.split(' ').slice(1).join(' ') || '',
    },
    fecha_solicitud: formData.fechaSolicitud,
    rubro_presupuestal: formData.rubroPresupuestal,
    ubicacion: {
      ...request.ubicacion,
      nombre: formData.centroCosto,
    },
    monto_a_ejecutar: parseFloat(formData.montoAprobado) || 0,
    cuenta_analitica: {
      ...request.cuenta_analitica,
      nombre: formData.cuentaUtilizar,
    },
  });

  const handlePreview = async () => {
    setIsPreviewing(true);
    setError(null);

    try {
      const element = document.getElementById('certificate-template-preview');
      if (!element) {
        throw new Error('No se encontró el template del certificado');
      }

      const pdfBlob = await html2pdf()
        .set({
          margin: 0,
          filename: `certificado_preview_${request.id}.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        })
        .from(element)
        .outputPdf('blob');

      const url = URL.createObjectURL(pdfBlob);
      window.open(url, '_blank');
    } catch (err: any) {
      console.error('Error al generar vista previa:', err);
      setError(err.message || 'Error al generar la vista previa');
    } finally {
      setIsPreviewing(false);
    }
  };

  const handleSave = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      const element = document.getElementById('certificate-template-preview');
      if (!element) {
        throw new Error('No se encontró el template del certificado');
      }

      const pdfBlob = await html2pdf()
        .set({
          margin: 0,
          filename: `certificado_${request.id}.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        })
        .from(element)
        .outputPdf('blob');

      const formDataToSend = new FormData();
      formDataToSend.append('files', pdfBlob, `certificado_${request.id}.pdf`);
      formDataToSend.append('solicitud_id', String(request.id));
      formDataToSend.append('titulo', formData.titulo);
      formDataToSend.append('solicitante', formData.solicitante);
      formDataToSend.append('rubro_presupuestal', formData.rubroPresupuestal);
      formDataToSend.append('centro_costo', formData.centroCosto);
      formDataToSend.append('monto_aprobado', formData.montoAprobado);
      formDataToSend.append('cuenta_utilizar', formData.cuentaUtilizar);
      formDataToSend.append('folio', formData.folio);

      await budgetService.createCertificate(request.id, formDataToSend);

      onCertificateCreated();
    } catch (err: any) {
      console.error('Error al generar certificado:', err);
      setError(err.message || 'Error al generar el certificado');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleChange = (field: keyof CertificateFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const inputClass = "w-full bg-[#F8F9FA] border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#003B71] transition-all";
  const labelClass = "text-sm font-bold text-[#333333]";

  const customRequest = buildRequestWithFormData();

  return (
    <>
      <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
        <CertificateTemplate 
          request={customRequest} 
          folio={formData.folio} 
        />
      </div>

      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <button 
              onClick={onCancel}
              className="p-2 hover:bg-white rounded-full transition-colors text-slate-500 shadow-sm border border-transparent hover:border-slate-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <div>
              <h2 className="text-2xl font-bold text-[#333333]">Generar Certificado</h2>
              <p className="text-slate-500">Complete la información para el certificado de disponibilidad presupuestal.</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className={labelClass}>Folio</label>
              <input 
                type="text"
                value={formData.folio}
                onChange={(e) => handleChange('folio', e.target.value)}
                className={inputClass}
              />
            </div>

            <div className="space-y-2">
              <label className={labelClass}>Título</label>
              <input 
                type="text"
                value={formData.titulo}
                onChange={(e) => handleChange('titulo', e.target.value)}
                className={inputClass}
              />
            </div>

            <div className="space-y-2">
              <label className={labelClass}>Solicitante</label>
              <input 
                type="text"
                value={formData.solicitante}
                onChange={(e) => handleChange('solicitante', e.target.value)}
                className={inputClass}
              />
            </div>

            <div className="space-y-2">
              <label className={labelClass}>Rubro Presupuestal</label>
              <input 
                type="text"
                value={formData.rubroPresupuestal}
                onChange={(e) => handleChange('rubroPresupuestal', e.target.value)}
                className={inputClass}
              />
            </div>

            <div className="space-y-2">
              <label className={labelClass}>Centro de Costo</label>
              <input 
                type="text"
                value={formData.centroCosto}
                onChange={(e) => handleChange('centroCosto', e.target.value)}
                className={inputClass}
              />
            </div>

            <div className="space-y-2">
              <label className={labelClass}>Monto Aprobado (RD$)</label>
              <input 
                type="number"
                value={formData.montoAprobado}
                onChange={(e) => handleChange('montoAprobado', e.target.value)}
                className={inputClass}
              />
            </div>

            <div className="space-y-2">
              <label className={labelClass}>Cuenta a Utilizar</label>
              <input 
                type="text"
                value={formData.cuentaUtilizar}
                onChange={(e) => handleChange('cuentaUtilizar', e.target.value)}
                className={inputClass}
              />
            </div>

            <div className="space-y-2">
              <label className={labelClass}>Fecha Solicitud</label>
              <input 
                type="text"
                value={formData.fechaSolicitud}
                onChange={(e) => handleChange('fechaSolicitud', e.target.value)}
                className={inputClass}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className={labelClass}>Concepto</label>
              <input 
                type="text"
                value={formData.concepto}
                onChange={(e) => handleChange('concepto', e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          <div className="flex items-center gap-3 pt-6 border-t border-slate-100">
            <button 
              type="button" 
              onClick={onCancel} 
              className="flex-grow bg-[#F8F9FA] hover:bg-slate-100 text-slate-600 font-bold py-3 rounded-xl transition-all"
            >
              Cancelar
            </button>
            <button 
              type="button"
              onClick={handlePreview}
              disabled={isPreviewing || isGenerating} 
              className="flex-grow bg-white hover:bg-slate-50 border-2 border-[#003B71] text-[#003B71] font-bold py-3 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isPreviewing ? (
                <>
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generando...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                  </svg>
                  Vista Previa
                </>
              )}
            </button>
            <button 
              type="button"
              onClick={handleSave}
              disabled={isGenerating || isPreviewing} 
              className="flex-grow-[2] bg-[#003B71] hover:bg-[#002d56] text-white font-bold py-3 rounded-xl transition-all shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Guardando...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                  </svg>
                  Guardar
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CertificateForm;
