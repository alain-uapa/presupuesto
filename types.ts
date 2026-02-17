
export enum Role {
  COLABORADOR = 'COLABORADOR',
  ADMINISTRADOR = 'ADMINISTRADOR'
}

export enum BudgetStatus {
  PENDING = 'PENDIENTE',
  APPROVED = 'APROBADA',
  REJECTED = 'RECHAZADA'
}

export interface Attachment {
  name: string;
  size: string;
  type: string;
  data?: string; // Base64
}

export interface Ubicacion {
  id: number;
  nombre: string;
}

export interface CuentaAnalitica {
  id: number;
  codigo: string;
  nombre: string;
}

export interface Colaborador {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
}

export interface BudgetRequest {
  id: number;
  colaborador: Colaborador;
  fecha_solicitud: string;
  titulo: string;
  descripcion: string;
  tipo_solicitud: string;
  rubro_presupuestal: string;
  ubicacion: Ubicacion;
  cuenta_analitica: CuentaAnalitica;
  presupuesto_pre_aprobado: number;
  monto_a_ejecutar: number;
  estado: BudgetStatus;
  observaciones_supervisor: string;
  attachments?: Attachment[];
}

export interface User {
  id: string | number;
  name: string;
  email: string;
  role: Role;
  photoUrl: string;
}

export interface ToastType {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
  duration: number;
}

export interface Choice {
  value: string;
  label: string;
}
