
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

export interface BudgetRequest {
  id: string;
  userId: string;
  userName: string;
  name: string;
  requestDate: string;
  description: string;
  status: BudgetStatus;
  rejectionComments?: string;
  attachments: Attachment[];
  // Nuevos campos
  location: string;
  requestType: string;
  budgetRubro: string;
  analyticalAccount: string;
  preApprovedBudget: number;
  executionAmount: number;
}

export interface User {
  id: string;
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
