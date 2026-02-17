
import { HttpClient } from './http-client';
import { BudgetRequest, BudgetStatus } from '../types';

/**
 * Servicio especializado en la gestión de presupuestos.
 * Hereda la configuración base de HttpClient.
 */
class BudgetService extends HttpClient {
  /**
   * Obtiene todas las solicitudes del servidor.
   */
  async getAll(): Promise<BudgetRequest[]> {
    return this.get<BudgetRequest[]>('/solicitudes/list');
  }

  /**
   * Envía una nueva solicitud de presupuesto.
   */
  async create(data: Omit<BudgetRequest, 'id' | 'status'>): Promise<BudgetRequest> {
    return this.post<BudgetRequest>('/solicitudes/create', data);
  }

  /**
   * Actualiza una solicitud existente.
   */
  async update(id: string | number, data: Partial<BudgetRequest>): Promise<BudgetRequest> {
    return this.patch<BudgetRequest>(`/solicitudes/update/${id}`, data);
  }

  /**
   * Cambia el estado de una solicitud (Aprobar/Rechazar).
   */
  async updateStatus(id: string | number, status: BudgetStatus, comments?: string): Promise<BudgetRequest> {
    return this.patch<BudgetRequest>(`/solicitudes/status/${id}`, { status, comments });
  }

  /**
   * Obtiene una solicitud específica por su ID.
   */
  async getById(id: string | number): Promise<BudgetRequest> {
    return this.get<BudgetRequest>(`/solicitudes/${id}`);
  }
}

export const budgetService = new BudgetService();
