import React, { useState, useEffect } from 'react';
import Select from "react-select";
import { BudgetRequest, Attachment } from '../types';
import { useCatalogs } from '../context/CatalogContext';
import { budgetService } from '../services/budget.service';
import AttachmentList from './AttachmentList';
import { dnsDateFormat } from '../utils/dateUtils';
interface BudgetFormProps {
  initialData?: BudgetRequest;
  onCancel: () => void;
  onSubmit: (data: any) => void;
  onDeleteAttachment?: (id: number | string, budgetId?: string) => Promise<void> | void;
  addToast?: (message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
}

const getLocalDateString = () => {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60000;
  return new Date(now.getTime() - offset).toISOString().split('T')[0];
};

const parseServerDate = (serverDate: string | undefined): string => {
  if (!serverDate) return getLocalDateString();
  return serverDate.split('T')[0];
};

const customStyles = {
  control: (base) => ({
    ...base,
    borderColor: "blue",
    boxShadow: "none",
    "&:hover": { borderColor: "darkblue" },
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused ? "lightblue" : "white",
    color: state.isFocused ? "black" : "blue",
  }),
};
const BudgetForm: React.FC<BudgetFormProps> = ({ initialData, onCancel, onSubmit, onDeleteAttachment, addToast }) => {
  const { ubicaciones, cuentasAnaliticas, loadingCatalogs, TIPO_CHOICES, RUBRO_CHOICES } = useCatalogs();

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    name: initialData?.titulo || '',
    description: initialData?.descripcion || '',
    activityDate: parseServerDate(initialData?.fecha_actividad),
    locationId: initialData?.ubicacion?.id || '',
    requestType: initialData?.tipo_solicitud || '',
    budgetRubro: initialData?.rubro_presupuestal || '',
    analyticalAccountId: initialData?.cuenta_analitica?.id || '',
    preApprovedBudget: initialData?.presupuesto_pre_aprobado || '',
    executionAmount: initialData?.monto_a_ejecutar || '',
    files: initialData?.files || [],
  });
  
  const handleDeleteAttachment = async (id: number | string) => {
    if (onDeleteAttachment && initialData?.id) {
      await onDeleteAttachment(id, String(initialData.id));
      setFormData(prev => ({
        ...prev,
        files: prev.files?.filter(f => String((f as any).id ?? (f as any).name ?? '') !== String(id)) || []
      }));
    }
  };
  const [attachments, setAttachments] = useState<Attachment[]>(initialData?.attachments || []);

  useEffect(() => {
    setFormData({
      name: initialData?.titulo || '',
      description: initialData?.descripcion || '',      
      activityDate: parseServerDate(initialData?.fecha_actividad),
      locationId: initialData?.ubicacion?.id || '',
      requestType: initialData?.tipo_solicitud || '',
      budgetRubro: initialData?.rubro_presupuestal || '',
      analyticalAccountId: initialData?.cuenta_analitica?.id || '',
      preApprovedBudget: initialData?.presupuesto_pre_aprobado || '',
      executionAmount: initialData?.monto_a_ejecutar || '',
      files: initialData?.files || [],
    });
    setFormErrors({});
  }, [initialData, initialData?.files]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const MAX_FILES = 2; 
    const MAX_TOTAL_SIZE_MB = 10;
    const MAX_TOTAL_BYTES = MAX_TOTAL_SIZE_MB * 1024 * 1024; // Convertir MB a Bytes
    const selectedFiles: File[] = Array.from(e.target.files || []);

    if (selectedFiles.length === 0) return;
    if (selectedFiles.length > MAX_FILES) {      
        addToast && addToast(`Solo puedes subir un máximo de ${MAX_FILES} archivos.`, 'error');
        e.target.value = ""; 
        return;
    }
    const totalSize = selectedFiles.reduce((acc, file) => acc + file.size, 0);
    if (totalSize > MAX_TOTAL_BYTES) {
      addToast && addToast(`El tamaño total de los archivos excede el límite de ${MAX_TOTAL_SIZE_MB} MB.`, 'error');
      e.target.value = "";
      return;
    }
    const newFiles: Attachment[] = selectedFiles.map((f: File) => ({
      name: f.name,
      size: `${(f.size / 1024).toFixed(1)} KB`,
      type: f.type,
      file: f
    }));
    setAttachments(prev => [...prev, ...newFiles]);
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const errors: Record<string, string> = {};
    if (!formData.name) errors['name'] = 'Este campo es obligatorio';
    if (!formData.description) errors['description'] = 'Este campo es obligatorio';
    if (!formData.locationId) errors['locationId'] = 'Seleccione una ubicación';
    if (!formData.requestType) errors['requestType'] = 'Seleccione un tipo de solicitud';
    if (!formData.budgetRubro) errors['budgetRubro'] = 'Seleccione un rubro presupuestal';
    if (!formData.analyticalAccountId) errors['analyticalAccountId'] = 'Seleccione una cuenta analítica';
    if (formData.preApprovedBudget === '' || formData.preApprovedBudget === 0) errors['preApprovedBudget'] = 'Este campo es obligatorio';
    if (formData.executionAmount === '' || formData.executionAmount === 0) errors['executionAmount'] = 'Este campo es obligatorio';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      if (addToast) {
        addToast('Por favor complete todos los campos obligatorios', 'error');
      }
      return;
    }
    setFormErrors({});

    const loc = ubicaciones.find(u => u.id === Number(formData.locationId));
    const acc = cuentasAnaliticas.find(a => a.id === Number(formData.analyticalAccountId));

    onSubmit({
      ...formData,
      activityDate: formData.activityDate,
      preApprovedBudget: formData.preApprovedBudget === '' ? 0 : formData.preApprovedBudget,
      executionAmount: formData.executionAmount === '' ? 0 : formData.executionAmount,
      locationName: loc?.nombre || 'Sede Santiago',
      analyticalAccountName: acc?.nombre || 'Cuenta Analítica',
      attachments
    });
  };

  const getFieldError = (field: string) => formErrors[field];
  const getFieldClass = (field: string, base: string) => {
    return formErrors[field]
      ? `${base} border-red-400 focus:ring-red-400`
      : base;
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
            <h2 className="text-2xl font-bold text-[#333333]">
              {initialData ? 'Editar Solicitud' : 'Nueva Solicitud de Presupuesto'}
            </h2>
            <p className="text-slate-500">Complete la información detallada para que administración pueda evaluar su caso.</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2 col-span-1 md:col-span-2">
            <label className="text-sm font-bold text-[#333333]">Concepto *</label>
            <input 
              type="text"
              required
              value={formData.name}
              onChange={e => {
                setFormData(prev => ({ ...prev, name: e.target.value }));
                if (formErrors['name']) setFormErrors(prev => ({ ...prev, name: '' }));
              }}
              placeholder="Ej. Taller de capacitación docente"
              className={getFieldClass('name', inputClass)}
            />
            {getFieldError('name') && <p className="text-xs text-red-500 font-medium">{getFieldError('name')}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-[#333333]">Ubicación *</label>
            <select 
              value={formData.locationId}
              onChange={e => {
                setFormData(prev => ({ ...prev, locationId: e.target.value }));
                if (formErrors['locationId']) setFormErrors(prev => ({ ...prev, locationId: '' }));
              }}
              className={getFieldClass('locationId', inputClass)}
              disabled={loadingCatalogs}
            >
              <option value="">Seleccione una opción</option>
              {ubicaciones.length > 0 ? (
                ubicaciones.map(u => (
                  <option key={u.id} value={u.id}>{u.nombre}</option>
                ))
              ) : (
                <option value="">Cargando ubicaciones...</option>
              )}
            </select>
            {getFieldError('locationId') && <p className="text-xs text-red-500 font-medium">{getFieldError('locationId')}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-[#333333]">Fecha de Actividad *</label>
            <input 
              type="date"
              required
              value={formData.activityDate}
              onChange={e => {
                setFormData(prev => ({ ...prev, activityDate: e.target.value }));
                if (formErrors['activityDate']) setFormErrors(prev => ({ ...prev, activityDate: '' }));
              }}
              className={getFieldClass('activityDate', inputClass)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-[#333333]">Tipo de Solicitud *</label>
            <select 
              value={formData.requestType}
              onChange={e => {
                setFormData(prev => ({ ...prev, requestType: e.target.value }));
                if (formErrors['requestType']) setFormErrors(prev => ({ ...prev, requestType: '' }));
              }}
              className={getFieldClass('requestType', inputClass)}
            >
              <option value="">Seleccione una opción</option>
              {TIPO_CHOICES.map(choice => (
                <option key={choice.value} value={choice.value}>{choice.label}</option>
              ))}
            </select>
            {getFieldError('requestType') && <p className="text-xs text-red-500 font-medium">{getFieldError('requestType')}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-[#333333]">Rubro Presupuestal *</label>
            <select 
              value={formData.budgetRubro}
              onChange={e => {
                setFormData(prev => ({ ...prev, budgetRubro: e.target.value }));
                if (formErrors['budgetRubro']) setFormErrors(prev => ({ ...prev, budgetRubro: '' }));
              }}
              className={getFieldClass('budgetRubro', inputClass)}
            >
              <option value="">Seleccione una opción</option>
              {RUBRO_CHOICES.map(choice => (
                <option key={choice.value} value={choice.value}>{choice.label}</option>
              ))}
            </select>
            {getFieldError('budgetRubro') && <p className="text-xs text-red-500 font-medium">{getFieldError('budgetRubro')}</p>}
          </div>

          <div className="space-y-2 col-span-1 md:col-span-2">
            <label className="text-sm font-bold text-[#333333]">Cuenta Analítica *</label>
            <div className={getFieldClass('analyticalAccountId', 'w-full bg-[#F8F9FA] border border-slate-200 rounded-xl px-4 py-1 outline-none focus:ring-2 transition-all disabled:opacity-50') + ' focus:ring-[#003B71]'}>
              <Select 
                className='w-full bg-transparent border-none outline-none'
                styles={{ control: (base) => ({ ...base, border: 'none', boxShadow: 'none', background: 'transparent' }) }}
                defaultValue={formData.analyticalAccountId ? {value: formData.analyticalAccountId, label: cuentasAnaliticas.find(c => c.id === Number(formData.analyticalAccountId)) ? `${cuentasAnaliticas.find(c => c.id === Number(formData.analyticalAccountId))?.codigo} - ${cuentasAnaliticas.find(c => c.id === Number(formData.analyticalAccountId))?.nombre}` : 'Cargando...'} : null} 
                onChange={(newValue) => {
                  setFormData(prev => ({ ...prev, analyticalAccountId: newValue.value }));
                  if (formErrors['analyticalAccountId']) setFormErrors(prev => ({ ...prev, analyticalAccountId: '' }));
                }}
                options={cuentasAnaliticas.map(c=>({value: c.id, label: `${c.codigo} - ${c.nombre}`}))} placeholder="Seleccione la cuenta..." />
            </div>
            {getFieldError('analyticalAccountId') && <p className="text-xs text-red-500 font-medium">{getFieldError('analyticalAccountId')}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-[#333333]">Presupuesto Pre-aprobado (RD$) *</label>
            <input 
              type="number"
              required
              min="0"
              step="0.01"
              value={formData.preApprovedBudget}
              onChange={e => {
                setFormData(prev => ({ ...prev, preApprovedBudget: e.target.value === '' ? '' : Number(e.target.value) }));
                if (formErrors['preApprovedBudget']) setFormErrors(prev => ({ ...prev, preApprovedBudget: '' }));
              }}
              className={getFieldClass('preApprovedBudget', inputClass)}
              placeholder="0"
            />
            {getFieldError('preApprovedBudget') && <p className="text-xs text-red-500 font-medium">{getFieldError('preApprovedBudget')}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-[#333333]">Monto a Ejecutar (RD$) *</label>
            <input 
              type="number"
              required
              min="0"
              step="0.01"
              value={formData.executionAmount}
              onChange={e => {
                setFormData(prev => ({ ...prev, executionAmount: e.target.value === '' ? '' : Number(e.target.value) }));
                if (formErrors['executionAmount']) setFormErrors(prev => ({ ...prev, executionAmount: '' }));
              }}
              className={getFieldClass('executionAmount', inputClass)}
              placeholder="0"
            />
            {getFieldError('executionAmount') && <p className="text-xs text-red-500 font-medium">{getFieldError('executionAmount')}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-[#333333]">Descripción Detallada *</label>
          <textarea 
            required
            rows={4}
            value={formData.description}
            onChange={e => {
              setFormData(prev => ({ ...prev, description: e.target.value }));
              if (formErrors['description']) setFormErrors(prev => ({ ...prev, description: '' }));
            }}
            placeholder="Explique el propósito de este gasto..."
            className={getFieldClass('description', `${inputClass} resize-none`)}
          />
          {getFieldError('description') && <p className="text-xs text-red-500 font-medium">{getFieldError('description')}</p>}
        </div>

        <div className="space-y-3">
          <label className="text-sm font-bold text-[#333333]">Documentación Adjunta</label>          
          {/* ---   ATTACHMENTS --- */}
            <AttachmentList 
              files={formData.files} 
              onDeleteAttachment={handleDeleteAttachment}
            />
          {/* ---   END ATTACHMENTS --- */}
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
          <button type="submit" disabled={loadingCatalogs} className="flex-grow-[2] bg-[#ff8300] hover:bg-[#e67600] text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-orange-100 disabled:opacity-50">
            {initialData ? 'Guardar Cambios' : 'Enviar Solicitud'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BudgetForm;
