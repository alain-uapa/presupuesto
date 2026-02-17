
import React, { useState } from 'react';
import { BudgetRequest, Attachment } from '../types';

interface BudgetFormProps {
  initialData?: BudgetRequest;
  onCancel: () => void;
  onSubmit: (data: any) => void;
}

const BudgetForm: React.FC<BudgetFormProps> = ({ initialData, onCancel, onSubmit }) => {
  // Fix: map BudgetRequest properties (titulo, descripcion, etc.) to local form state correctly
  const [formData, setFormData] = useState({
    name: initialData?.titulo || '',
    description: initialData?.descripcion || '',
    requestDate: initialData?.fecha_solicitud 
      ? initialData.fecha_solicitud.split(' ')[0].split('/').reverse().join('-') 
      : new Date().toISOString().split('T')[0],
    location: initialData?.ubicacion?.nombre || 'Sede Santiago',
    requestType: initialData?.tipo_solicitud || 'Desembolso',
    budgetRubro: initialData?.rubro_presupuestal || 'Gastos de servicios y suministros',
    analyticalAccount: initialData?.cuenta_analitica?.nombre || 'CA-0164 RECTORIA',
    preApprovedBudget: initialData?.presupuesto_pre_aprobado || 0,
    executionAmount: initialData?.monto_a_ejecutar || 0,
  });
  const [attachments, setAttachments] = useState<Attachment[]>(initialData?.attachments || []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const newFiles: Attachment[] = Array.from(e.target.files).map((f: File) => ({
      name: f.name,
      size: `${(f.size / 1024).toFixed(1)} KB`,
      type: f.type
    }));
    setAttachments(prev => [...prev, ...newFiles]);
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.description) return;
    onSubmit({
      ...formData,
      attachments
    });
  };

  const inputClass = "w-full bg-[#F8F9FA] border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#003B71] transition-all";

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-[#333333]">
          {initialData ? 'Editar Solicitud' : 'Nueva Solicitud de Presupuesto'}
        </h2>
        <p className="text-slate-500">Complete la información detallada para que administración pueda evaluar su caso.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2 col-span-1 md:col-span-2">
            <label className="text-sm font-bold text-[#333333]">Nombre de la Actividad</label>
            <input 
              type="text"
              required
              value={formData.name}
              onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Ej. Taller de capacitación docente"
              className={inputClass}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-[#333333]">Ubicación</label>
            <select 
              value={formData.location}
              onChange={e => setFormData(prev => ({ ...prev, location: e.target.value }))}
              className={inputClass}
            >
              <option>Sede Santiago</option>
              <option>Santo Domingo</option>
              <option>Cibao Oriental, Nagua</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-[#333333]">Fecha Prevista</label>
            <input 
              type="date"
              required
              value={formData.requestDate}
              onChange={e => setFormData(prev => ({ ...prev, requestDate: e.target.value }))}
              className={inputClass}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-[#333333]">Tipo de Solicitud</label>
            <select 
              value={formData.requestType}
              onChange={e => setFormData(prev => ({ ...prev, requestType: e.target.value }))}
              className={inputClass}
            >
              <option>Desembolso</option>
              <option>Desviación</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-[#333333]">Rubro Presupuestal</label>
            <select 
              value={formData.budgetRubro}
              onChange={e => setFormData(prev => ({ ...prev, budgetRubro: e.target.value }))}
              className={inputClass}
            >
              <option>Gastos de servicios y suministros</option>
              <option>Plan de actividades</option>
              <option>Inversión</option>
            </select>
          </div>

          <div className="space-y-2 col-span-1 md:col-span-2">
            <label className="text-sm font-bold text-[#333333]">Cuenta Analítica</label>
            <select 
              value={formData.analyticalAccount}
              onChange={e => setFormData(prev => ({ ...prev, analyticalAccount: e.target.value }))}
              className={inputClass}
            >
              <option>CA-0163 JUNTA DE DIRECTORES</option>
              <option>CA-0164 RECTORIA</option>
              <option>CA-0165 CASA SAMANA</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-[#333333]">Presupuesto Pre-aprobado (RD$)</label>
            <input 
              type="number"
              required
              min="0"
              value={formData.preApprovedBudget}
              onChange={e => setFormData(prev => ({ ...prev, preApprovedBudget: Number(e.target.value) }))}
              className={inputClass}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-[#333333]">Monto a Ejecutar (RD$)</label>
            <input 
              type="number"
              required
              min="0"
              value={formData.executionAmount}
              onChange={e => setFormData(prev => ({ ...prev, executionAmount: Number(e.target.value) }))}
              className={inputClass}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-[#333333]">Descripción Detallada</label>
          <textarea 
            required
            rows={4}
            value={formData.description}
            onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Explique el propósito de este gasto..."
            className={`${inputClass} resize-none`}
          />
        </div>

        <div className="space-y-3">
          <label className="text-sm font-bold text-[#333333]">Cotizaciones (Archivos)</label>
          <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center hover:bg-[#F8F9FA] transition-colors cursor-pointer relative">
            <input 
              type="file" 
              multiple 
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-slate-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4-4m4 4v12" />
            </svg>
            <p className="text-sm text-slate-600 font-medium">Haga clic o arrastre sus cotizaciones aquí</p>
          </div>

          {attachments.length > 0 && (
            <div className="space-y-2">
              {attachments.map((file, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-blue-50 border border-blue-100 rounded-xl">
                  <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#003B71]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                    <span className="text-xs font-bold text-[#003B71]">{file.name}</span>
                  </div>
                  <button type="button" onClick={() => removeAttachment(idx)} className="text-[#003B71] hover:text-red-500 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 pt-6 border-t border-slate-100">
          <button type="button" onClick={onCancel} className="flex-grow bg-[#F8F9FA] hover:bg-slate-100 text-slate-600 font-bold py-3 rounded-xl transition-all">
            Cancelar
          </button>
          <button type="submit" className="flex-grow-[2] bg-[#ff8300] hover:bg-[#e67600] text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-orange-100">
            {initialData ? 'Guardar Cambios' : 'Enviar Solicitud'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BudgetForm;
