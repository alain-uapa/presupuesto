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
    return this.post<BudgetRequest>('/solicitudes/crear/', data);
  }

  /**
   * Obtiene el contenido HTML del certificado.
   */
  async getCertificateTemplate(solicitudId: number | string, cuentaContable?: string): Promise<string> {
    const params = cuentaContable ? `?cuenta_contable=${encodeURIComponent(cuentaContable)}` : '';
    return this.getText(`/certificado/edit/${solicitudId}/${params}`);
  }

  /**
   * Actualiza una solicitud existente utilizando PUT.
   * Endpoint: /solicitudes/editar/<id>/
   */
  async update(id: string | number, data: Partial<BudgetRequest>): Promise<BudgetRequest> {
    return this.post<BudgetRequest>(`/solicitudes/editar/${id}/`, data);
  }

  /**
   * Cambia el estado de una solicitud (Aprobar/Rechazar).
   */
  async updateStatus(id: string | number, status: BudgetStatus, comments?: string): Promise<any> {
    return this.patch<BudgetRequest>(`/solicitudes/status/${id}/`, { status, comments });
  }

  /**
   * Elimina una solicitud de presupuesto.
   * Endpoint: /solicitudes/delete/{id}/
   */
  async delete(id: string | number): Promise<BudgetRequest> {
    return this.del<BudgetRequest>(`/solicitudes/delete/${id}/`);
  }

  async deleteAttachment(id: string | number): Promise<BudgetRequest> {
    return this.del<BudgetRequest>(`/solicitudes/delete_attachment/${id}/`);
  }

  /**
   * Obtiene una solicitud específica por su ID.
   */
  async getById(id: string | number): Promise<BudgetRequest> {
    return this.get<BudgetRequest>(`/solicitudes/${id}`);
  }

  /**
   * Crea un certificado de disponibilidad presupuestal desde el template.
   * Envía el formulario al backend, que genera el PDF y lo sube a Google Drive.
   * Retorna el URL de visualización de Drive.
   */
  async createCertificateFromTemplate(id: number | string, formData: FormData): Promise<{ drive_id: string; url_view: string }> {
    return this.post('/certificado/create/' + id + '/', formData);
  }

  /**
   * Crea un certificado de disponibilidad presupuestal.
   * Envía el PDF generado al backend para subirlo a Google Drive.
   */
  async createCertificate(id: string | number, formData: FormData): Promise<BudgetRequest> {
    return this.post<BudgetRequest>(`/solicitudes/certificado/upload/${id}/`, formData);
  }

  /**
   * Confirma una solicitud de presupuesto.
   * Endpoint: /solicitudes/{id}/confirm/
   * Retorna { status: 200 } en éxito o { error: string } en caso de error.
   */
  async confirmation(id: string | number): Promise<{ status?: number; error?: string }> {
    return this.patch<{ status?: number; error?: string }>(`/solicitudes/confirm/${id}/`, {});
  }

  /**
   * Actualiza el estado de una nota de revisión.
   * Endpoint: /solicitudes/revision/{id}/
   */
  async updateRevisionStatus(id: string | number, estado: string): Promise<any> {
    return this.patch(`/solicitudes/revision/${id}/`, { estado });
  }

  /**
   * Obtiene las solicitudes nuevas/actualizadas para refresh automático.
   * Endpoint: /solicitudes/refresh/
   */
  async refreshSolicitudes(lastUpdated: string): Promise<{ solicitudes: BudgetRequest[], last_updated: string }> {
    return this.get<{ solicitudes: BudgetRequest[], last_updated: string }>(`/solicitudes/refresh/?last_updated=${encodeURIComponent(lastUpdated)}`);
  }
}

export const budgetService = new BudgetService();