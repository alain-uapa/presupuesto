import React, { useEffect, useState, useRef } from 'react';
import { budgetService } from '../services/budget.service';
import EmailSelector from './EmailSelector';

interface AttachmentFile {
  id?: number | string;
  nombre?: string;
  name?: string;
}

interface CertificateTemplateProps {
  solicitudId: number | string;
  selectedAttachmentIds?: number[];
  selectedAttachments?: AttachmentFile[];
  cuentaContable?: string;
  onCancel?: () => void;
  onSuccess?: () => void;
  addToast?: (message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
}

const CertificateTemplate: React.FC<CertificateTemplateProps> = ({ solicitudId, selectedAttachments, cuentaContable, onCancel, onSuccess, addToast }) => {
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchCertificate = async () => {
      try {
        setIsLoading(true);
        const html = await budgetService.getCertificateTemplate(solicitudId, cuentaContable);
        setHtmlContent(html);
      } catch (err: any) {
        console.error('Error al obtener el certificado:', err);
        setError(err.message || 'Error al cargar el certificado');
        if (addToast) {
          addToast('Error al cargar el certificado', 'error');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchCertificate();
  }, [addToast]);

  const handleSave = async () => {
    const form = containerRef.current?.querySelector('form');
    if (form) {
      setIsSaving(true);
      try {
        const formData = new FormData(form);
        
        const selectedIds = selectedAttachments?.map(a => a.id) || [];
        if (selectedIds.length > 0) {
          formData.append('attachment_ids', JSON.stringify(selectedIds));
        }
        
        const response = await budgetService.createCertificateFromTemplate(solicitudId, formData);
        window.open(response.url_view, '_blank');
        if (onSuccess) {
          onSuccess();
        }
      } catch (err: any) {
        const errorMessage = err.error || 'Error al generar el certificado';
        setError(errorMessage);
        if (addToast) {
          addToast(errorMessage, 'error');
        }
      } finally {
        setIsSaving(false);
      }
    } else {
      if (addToast) {
        addToast('No se encontró el formulario del certificado', 'error');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#003B71]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-500">{error}</p>
        {onCancel && (
          <button
            onClick={onCancel}
            className="mt-4 px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300"
          >
            Volver
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto p-3 sm:p-6">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {onCancel && (
                <button 
                  onClick={onCancel}
                  className="p-2 hover:bg-white rounded-full transition-colors text-slate-500 shadow-sm border border-transparent hover:border-slate-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                </button>
              )}
              <div>                
                <h2 className="text-2xl font-bold text-[#333333]">Certificado de Disponibilidad Presupuestal</h2>
                <p className="text-slate-500">Vista previa del certificado</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
          <div className="p-6 md:p-8 gap-8">
          {/*  <EmailSelector /> */}
          </div>
          <div 
            id="certificate-template-preview"
            className="p-6 md:p-8 gap-8"
            ref={containerRef}
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
          
          {selectedAttachments && selectedAttachments.length > 0 && (
            <div className="p-4 bg-gray-50 border-t border-gray-200">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Cotizaciones incluidas:</p>
              <ul className="text-sm text-gray-700 space-y-1">
                {selectedAttachments.map((attachment, index) => (
                  <li key={attachment.id || index} className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-[#003B71]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {attachment.nombre || attachment.name || 'Archivo'}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-4 sm:p-6 bg-slate-50 border-t border-slate-100">
            <button 
              type="button" 
              onClick={onCancel}
              disabled={isSaving}
              className="w-full sm:flex-grow bg-[#F8F9FA] hover:bg-slate-200 text-slate-600 font-bold py-3 px-4 rounded-xl transition-all border border-slate-200 text-sm disabled:opacity-50"
            >
              Cancelar
            </button>
            <button 
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="w-full sm:flex-grow-[2] bg-[#003B71] hover:bg-[#002d56] text-white font-bold py-3 px-4 rounded-xl transition-all shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
            >
              {isSaving ? (
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

export default CertificateTemplate;