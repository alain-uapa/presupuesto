import React, { useState } from 'react';
import html2pdf from 'html2pdf.js';
import { BudgetRequest } from '../types';
import { budgetService } from '../services/budget.service';
import CertificateTemplate from './CertificateTemplate';

interface CertificateFormProps {
  request: BudgetRequest;
  onCancel: () => void;
  onCertificateCreated: () => void;
  addToast?: (message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
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

const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .substring(0, 20);
};

const CertificateForm: React.FC<CertificateFormProps> = ({ request, onCancel, onCertificateCreated, addToast }) => {
  const fullName = request.colaborador 
    ? `${request.colaborador.first_name} ${request.colaborador.last_name}` 
    : 'Colaborador';

  const [formData, setFormData] = useState<CertificateFormData>({
    titulo: request.titulo || '',
    solicitante: fullName,
    fechaSolicitud: request.fecha_solicitud || '',
    rubroPresupuestal: request.rubro_presupuestal || 'Actividades',
    centroCosto: '',
    montoAprobado: String(request.monto_a_ejecutar || 0),
    cuentaUtilizar: '',
    fechaAprobacion: new Date().toLocaleDateString('es-DO'),
    concepto: request.titulo || '',
    folio: String(request.id).padStart(4, '0'),
  });

  const [isGenerating, setIsGenerating] = useState(false);

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

  const handleSave = async () => {
    if (!formData.centroCosto.trim() || !formData.cuentaUtilizar.trim()) {
      if (addToast) {
        addToast('Complete los campos editables del certificado', 'error');
      }
      return;
    }
    setIsGenerating(true);

    try {
      const element = document.getElementById('certificate-template-preview');
      if (!element) {
        throw new Error('No se encontró el template del certificado');
      }

      const pdfFileName = `${slugify(formData.titulo || 'certificado')}-cert.pdf`;

      const pdfBlob = await html2pdf()
        .set({
          margin: 0,
          filename: pdfFileName,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        })
        .from(element)
        .outputPdf('blob');

      const url = URL.createObjectURL(pdfBlob);
      window.open(url, '_blank');

      const formDataToSend = new FormData();
      formDataToSend.append('files', pdfBlob, pdfFileName);
      formDataToSend.append('solicitud_id', String(request.id));

      await budgetService.createCertificate(request.id, formDataToSend);

      if (addToast) {
        addToast('Certificado generado exitosamente', 'success');
      }
      onCertificateCreated();
    } catch (err: any) {
      console.error('Error al generar certificado:', err);
      if (addToast) {
        addToast('Error al generar el certificado', 'error');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCentroCostoChange = (value: string) => {
    setFormData(prev => ({ ...prev, centroCosto: value }));
  };

  const handleCuentaUtilizarChange = (value: string) => {
    setFormData(prev => ({ ...prev, cuentaUtilizar: value }));
  };

  const customRequest = buildRequestWithFormData();

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto p-3 sm:p-6 overflow-x-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between">
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
                <h2 className="text-2xl font-bold text-[#333333]">Certificado de Disponibilidad Presupuestal</h2>
                <p className="text-slate-500">Edite los campos requeridos y guarde el certificado.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
          <CertificateTemplate 
            request={customRequest} 
            folio={formData.folio}
            centroCosto={formData.centroCosto}
            cuentaUtilizar={formData.cuentaUtilizar}
            onCentroCostoChange={handleCentroCostoChange}
            onCuentaUtilizarChange={handleCuentaUtilizarChange}
          />
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-4 sm:p-6 bg-slate-50 border-t border-slate-100">
            <button 
              type="button" 
              onClick={onCancel} 
              className="w-full sm:flex-grow bg-[#F8F9FA] hover:bg-slate-200 text-slate-600 font-bold py-3 px-4 rounded-xl transition-all border border-slate-200 text-sm"
            >
              Cancelar
            </button>
            <button 
              type="button"
              onClick={handleSave}
              disabled={isGenerating} 
              className="w-full sm:flex-grow-[2] bg-[#003B71] hover:bg-[#002d56] text-white font-bold py-3 px-4 rounded-xl transition-all shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
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
                  Guardar Certificado
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateForm;
