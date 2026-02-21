import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BudgetRequest, BudgetStatus, Ubicacion, CuentaAnalitica, Colaborador } from '../types';
import CertificateTemplate from './CertificateTemplate';

const mockColaborador: Colaborador = {
  id: 1,
  username: 'jperez',
  first_name: 'Juan',
  last_name: 'Pérez García',
  email: 'jperez@uapa.edu.do',
};

const mockUbicacion: Ubicacion = {
  id: 1,
  nombre: 'Sede Santiago',
};

const mockCuentaAnalitica: CuentaAnalitica = {
  id: 1,
  codigo: 'CTA-001',
  nombre: 'Gastos Operativos',
};

const mockRequest: BudgetRequest = {
  id: 1,
  colaborador: mockColaborador,
  fecha_solicitud: '15/02/2026',
  titulo: 'Taller de Capacitación Docente 2026',
  descripcion: 'Descripción de ejemplo para el certificado',
  tipo_solicitud: 'CAPACITACION',
  rubro_presupuestal: 'Actividades Académicas',
  ubicacion: mockUbicacion,
  cuenta_analitica: mockCuentaAnalitica,
  presupuesto_pre_aprobado: 50000,
  monto_a_ejecutar: 45000,
  estado: BudgetStatus.APPROVED,
  observaciones_supervisor: '',
};

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
            <CertificateTemplate request={mockRequest} folio="0001" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificatePreview;
