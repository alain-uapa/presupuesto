
export enum Role {
  COLABORADOR = 'COLABORADOR',
  SUPERVISOR = 'SUPERVISOR',
  COMPRA_RSS = 'COMPRA RSS',
  COMPRA_RSD = 'COMPRA RSD',
  COMPRA_RCO = 'COMPRA RCO'
}

export enum BudgetStatus {
  PENDING = 'PENDIENTE',
  APPROVED = 'APROBADA',
  REJECTED = 'RECHAZADA',
  POR_REVISION = 'POR_REVISION'
}

export interface Attachment {
  name: string;
  size: string;
  type: string;
  data?: string; // Base64
}

export interface ReviewNote {
  id: number;
  contenido: string;
  supervisor: string;
  fecha_creacion: string;
  estado?: string;
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
  certificado_url?: string;
  confirmado?: boolean;
  review_notes?: ReviewNote[];
  updated_at?: string;
  files?: Attachment[];
}

export interface User {
  id: string | number;
  name: string;
  email: string;
  role: Role;
  picture: string;
}

export interface ToastType {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration: number;
}

export interface Choice {
  value: string;
  label: string;
}
