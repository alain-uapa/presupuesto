import React, { useState } from 'react';
import { BudgetRequest } from '../types';

interface CertificateFormProps {
  request: BudgetRequest;
  onCancel: () => void;
  onGenerate: (data: CertificateData) => void;
}

export interface CertificateData {
  titulo: string;
  solicitante: string;
  fecha: string;
}

const CertificateForm: React.FC<CertificateFormProps> = ({ request, onCancel, onGenerate }) => {
  const fullName = request.colaborador 
    ? `${request.colaborador.first_name} ${request.colaborador.last_name}` 
    : 'Colaborador';

  const [formData, setFormData] = useState<CertificateData>({
    titulo: request.titulo || '',
    solicitante: fullName,
    fecha: request.fecha_solicitud || new Date().toLocaleDateString('es-DO'),
  });

  const [isGenerating, setIsGenerating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    onGenerate(formData);
    setIsGenerating(false);
  };

  const inputClass = "w-full bg-[#F8F9FA] border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#003B71] transition-all disabled:opacity-50";

  return (
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
            <p className="text-slate-500">Complete la información para generar el certificado de aprobación.</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8 space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-bold text-[#333333]">Título de la Solicitud</label>
          <input 
            type="text"
            value={formData.titulo}
            readOnly
            className={inputClass}
          />
          <p className="text-[10px] text-slate-400 italic">Este campo no es editable.</p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-[#333333]">Solicitante</label>
          <input 
            type="text"
            value={formData.solicitante}
            readOnly
            className={inputClass}
          />
          <p className="text-[10px] text-slate-400 italic">Este campo no es editable.</p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-[#333333]">Fecha de Solicitud</label>
          <input 
            type="text"
            value={formData.fecha}
            readOnly
            className={inputClass}
          />
          <p className="text-[10px] text-slate-400 italic">Este campo no es editable.</p>
        </div>

        <div className="flex items-center gap-3 pt-6 border-t border-slate-100">
          <button 
            type="button" 
            onClick={onCancel} 
            className="flex-grow bg-[#F8F9FA] hover:bg-slate-100 text-slate-600 font-bold py-3 rounded-xl transition-all"
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            disabled={isGenerating} 
            className="flex-grow-[2] bg-[#003B71] hover:bg-[#002d56] text-white font-bold py-3 rounded-xl transition-all shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generando...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                </svg>
                Generar Certificado
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CertificateForm;
