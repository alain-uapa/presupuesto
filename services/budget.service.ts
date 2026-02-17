
import { HttpClient } from './http-client';
import { BudgetRequest, BudgetStatus } from '../types';

/**
 * Servicio especializado en la gestión de presupuestos.
 * Hereda la configuración base de HttpClient.
 */
class BudgetService extends HttpClient {
  // No requiere constructor si usa la baseUrl por defecto de HttpClient.
  // En caso de que este servicio necesitara otra URL, se podría hacer:
  // protected baseUrl: string = 'https://otra-api.uapa.edu.do';

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
   * Cambia el estado de una solicitud (Aprobar/Rechazar).
   */
  async updateStatus(id: string, status: BudgetStatus, comments?: string): Promise<BudgetRequest> {
    return this.patch<BudgetRequest>(`/solicitudes/status/${id}`, { status, comments });
  }

  /**
   * Obtiene una solicitud específica por su ID.
   */
  async getById(id: string): Promise<BudgetRequest> {
    return this.get<BudgetRequest>(`/solicitudes/${id}`);
  }
}

export const budgetService = new BudgetService();
