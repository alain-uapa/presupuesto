
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Ubicacion, CuentaAnalitica, Choice, BudgetStatus } from '../types';
import { catalogService } from '../services/catalog.service';

interface CatalogContextType {
  ubicaciones: Ubicacion[];
  cuentasAnaliticas: CuentaAnalitica[];
  cuentasContables: CuentaAnalitica[];
  loadingCatalogs: boolean;
  fetchCatalogs: () => Promise<void>;
  // Catálogos estáticos (hardcoded según requerimiento)
  ESTADO_CHOICES: Choice[];
  TIPO_CHOICES: Choice[];
  RUBRO_CHOICES: Choice[];
  getLabel: (catalog: Choice[], value: string) => string;
}

const CatalogContext = createContext<CatalogContextType | undefined>(undefined);

export const CatalogProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [ubicaciones, setUbicaciones] = useState<Ubicacion[]>([]);
  const [cuentasAnaliticas, setCuentasAnaliticas] = useState<CuentaAnalitica[]>([]);
  const [cuentasContables, setCuentasContables] = useState<CuentaAnalitica[]>([]);
  const [loadingCatalogs, setLoadingCatalogs] = useState(false);

  const ESTADO_CHOICES: Choice[] = [
    { value: BudgetStatus.PENDING, label: 'Pendiente' },
    { value: BudgetStatus.APPROVED, label: 'Aprobada' },
    { value: BudgetStatus.REJECTED, label: 'Rechazada' },
    { value: BudgetStatus.POR_REVISION, label: 'Por Revisión' },
  ];

  const TIPO_CHOICES: Choice[] = [
    { value: 'DESEMBOLSO', label: 'Desembolso' },
    { value: 'DESVIACION', label: 'Desviación' },
  ];

  const RUBRO_CHOICES: Choice[] = [
    { value: 'SERVICIOS', label: 'Gastos de servicios y suministros' },
    { value: 'ACTIVIDADES', label: 'Plan de actividades' },
    { value: 'INVERSION', label: 'Inversión' },
  ];

  const getLabel = (catalog: Choice[], value: string): string => {
    return catalog.find(c => c.value === value)?.label || value;
  };

  const fetchCatalogs = useCallback(async () => {
    setLoadingCatalogs(true);
    try {
      const [uData, cData, cData2] = await Promise.all([
        catalogService.getUbicaciones(),
        catalogService.getCuentasAnaliticas(),
        catalogService.getCuentasContables()
      ]);
      setUbicaciones(uData);
      setCuentasAnaliticas(cData);
      setCuentasContables(cData2);
    } catch (error) {
      console.error("Error al cargar catálogos dinámicos:", error);
    } finally {
      setLoadingCatalogs(false);
    }
  }, []);

  return (
    <CatalogContext.Provider value={{ 
      ubicaciones, 
      cuentasAnaliticas, 
      cuentasContables,
      loadingCatalogs, 
      fetchCatalogs,
      ESTADO_CHOICES,
      TIPO_CHOICES,
      RUBRO_CHOICES,
      getLabel
    }}>
      {children}
    </CatalogContext.Provider>
  );
};

export const useCatalogs = () => {
  const context = useContext(CatalogContext);
  if (!context) {
    throw new Error('useCatalogs debe ser usado dentro de un CatalogProvider');
  }
  return context;
};
