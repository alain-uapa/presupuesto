
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
   * Endpoint: /solicitudes/crear/
   */
  async create(data: any): Promise<BudgetRequest> {
    // Agregamos el slash final / por consistencia con el endpoint de editar
    return this.post<BudgetRequest>('/solicitudes/crear/', data);
  }

  /**
   * Actualiza una solicitud existente utilizando PUT.
   * Endpoint: /solicitudes/editar/<id>/
   */
  async update(id: string | number, data: Partial<BudgetRequest>): Promise<BudgetRequest> {
    // Agregamos el slash final / por convención de Django para evitar problemas con el body en redirecciones
    return this.put<BudgetRequest>(`/solicitudes/editar/${id}/`, data);
  }

  /**
   * Cambia el estado de una solicitud (Aprobar/Rechazar).
   */
  async updateStatus(id: string | number, status: BudgetStatus, comments?: string): Promise<BudgetRequest> {
    return this.patch<BudgetRequest>(`/solicitudes/status/${id}/`, { status, comments });
  }

  /**
   * Obtiene una solicitud específica por su ID.
   */
  async getById(id: string | number): Promise<BudgetRequest> {
    return this.get<BudgetRequest>(`/solicitudes/${id}`);
  }
}

export const budgetService = new BudgetService();
