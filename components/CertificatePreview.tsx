import React from 'react';
import { useNavigate } from 'react-router-dom';
import CertificateTemplate from './CertificateTemplate';

const CertificatePreview: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-200 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-4 flex items-center justify-between">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Volver
          </button>
          <span className="text-sm text-slate-500">Vista previa del template (datos de ejemplo)</span>
        </div>

        <div className="bg-white shadow-2xl mx-auto overflow-auto" style={{ maxWidth: '100%' }}>
          <div className="flex justify-center">
            <CertificateTemplate />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificatePreview;
