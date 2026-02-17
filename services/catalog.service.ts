
import { HttpClient } from './http-client';
import { Ubicacion, CuentaAnalitica } from '../types';

/**
 * Servicio para gestionar catálogos institucionales.
 */
class CatalogService extends HttpClient {
  /**
   * Obtiene la lista de ubicaciones disponibles.
   */
  async getUbicaciones(): Promise<Ubicacion[]> {
    return this.get<Ubicacion[]>('/ubicaciones/list/');
  }

  /**
   * Obtiene la lista de cuentas analíticas.
   */
  async getCuentasAnaliticas(): Promise<CuentaAnalitica[]> {
    return this.get<CuentaAnalitica[]>('/cuentas-analiticas/list/');
  }
}

export const catalogService = new CatalogService();
