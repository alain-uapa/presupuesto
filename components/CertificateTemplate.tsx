import React, { useEffect, useState } from 'react';
import { budgetService } from '../services/budget.service';

interface CertificateTemplateProps {
  onCancel?: () => void;
  addToast?: (message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
}

const CertificateTemplate: React.FC<CertificateTemplateProps> = ({ onCancel, addToast }) => {
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCertificate = async () => {
      try {
        setIsLoading(true);
        const html = await budgetService.getCertificateTemplate();
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        animate-spin rounded-full<div className=" h-12 w-12 border-b-2 border-[#003B71]"></div>
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
      <div className="max-w-4xl mx-auto p-3 sm:p-6">
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
          <div 
            id="certificate-template-preview"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        </div>
      </div>
    </div>
  );
};

export default CertificateTemplate;