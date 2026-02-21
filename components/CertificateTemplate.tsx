import React from 'react';
import { BudgetRequest } from '../types';

interface CertificateTemplateProps {
  request: BudgetRequest;
  folio?: string;
}

const CertificateTemplate: React.FC<CertificateTemplateProps> = ({ request, folio = '0001' }) => {
  const fullName = request.colaborador 
    ? `${request.colaborador.first_name} ${request.colaborador.last_name}` 
    : 'Colaborador';

  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'N/A';
    return dateStr;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-DO', { 
      style: 'currency', 
      currency: 'DOP',
      minimumFractionDigits: 2 
    }).format(amount || 0);
  };

  const today = new Date().toLocaleDateString('es-DO', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div 
      id="certificate-template-preview"
      style={{
        width: '210mm',
        minHeight: '297mm',
        padding: '20mm',
        backgroundColor: '#ffffff',
        fontFamily: 'Arial, Helvetica, sans-serif',
        boxSizing: 'border-box',
      }}
    >
      {/* Encabezado */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '30px' }}>
        {/* Logo */}
        <div style={{ flex: '0 0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '60px',
              height: '60px',
              backgroundColor: '#003B71',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '14px',
            }}>
              UAPA
            </div>
            <div>
              <div style={{ fontWeight: 'bold', color: '#003B71', fontSize: '18px' }}>UAPA</div>
              <div style={{ color: '#E67E22', fontSize: '11px', fontWeight: '500' }}>
                Educación superior a distancia virtual
              </div>
            </div>
          </div>
        </div>

        {/* Folio */}
        <div style={{
          backgroundColor: '#E67E22',
          color: 'white',
          padding: '8px 16px',
          borderRadius: '6px',
          fontSize: '12px',
          fontWeight: 'bold',
        }}>
          CERTIFICADO No. {folio}
        </div>
      </div>

      {/* Título Principal */}
      <div style={{
        backgroundColor: '#002350',
        color: 'white',
        textAlign: 'center',
        padding: '15px 30px',
        borderRadius: '10px',
        marginBottom: '40px',
        marginTop: '20px',
      }}>
        <h1 style={{ margin: 0, fontSize: '22px', letterSpacing: '1px' }}>
          CERTIFICADO DE DISPONIBILIDAD PRESUPUESTAL
        </h1>
      </div>

      {/* Cuerpo de Datos */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '20px 40px',
        marginBottom: '40px',
      }}>
        {/* Columna Izquierda */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div>
            <div style={{ 
              color: '#E67E22', 
              fontWeight: 'bold', 
              fontSize: '11px',
              marginBottom: '4px',
              borderBottom: '1px solid #E67E22',
              paddingBottom: '2px',
            }}>
              RUBRO PRESUPUESTAL
            </div>
            <div style={{ color: '#333333', fontSize: '14px', fontWeight: '500' }}>
              {request.rubro_presupuestal || 'Actividades'}
            </div>
          </div>

          <div>
            <div style={{ 
              color: '#E67E22', 
              fontWeight: 'bold', 
              fontSize: '11px',
              marginBottom: '4px',
              borderBottom: '1px solid #E67E22',
              paddingBottom: '2px',
            }}>
              CENTRO DE COSTO
            </div>
            <div style={{ color: '#333333', fontSize: '14px', fontWeight: '500' }}>
              {request.ubicacion?.nombre || 'N/A'}
            </div>
          </div>

          <div>
            <div style={{ 
              color: '#E67E22', 
              fontWeight: 'bold', 
              fontSize: '11px',
              marginBottom: '4px',
              borderBottom: '1px solid #E67E22',
              paddingBottom: '2px',
            }}>
              SOLICITANTE
            </div>
            <div style={{ color: '#333333', fontSize: '14px', fontWeight: '500' }}>
              {fullName}
            </div>
          </div>

          <div>
            <div style={{ 
              color: '#E67E22', 
              fontWeight: 'bold', 
              fontSize: '11px',
              marginBottom: '4px',
              borderBottom: '1px solid #E67E22',
              paddingBottom: '2px',
            }}>
              MONTO APROBADO
            </div>
            <div style={{ color: '#333333', fontSize: '14px', fontWeight: '500' }}>
              {formatCurrency(request.monto_a_ejecutar)}
            </div>
          </div>

          <div>
            <div style={{ 
              color: '#E67E22', 
              fontWeight: 'bold', 
              fontSize: '11px',
              marginBottom: '4px',
              borderBottom: '1px solid #E67E22',
              paddingBottom: '2px',
            }}>
              CUENTA A UTILIZAR
            </div>
            <div style={{ color: '#333333', fontSize: '14px', fontWeight: '500' }}>
              {request.cuenta_analitica?.nombre || 'N/A'}
            </div>
          </div>
        </div>

        {/* Columna Derecha */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div>
            <div style={{ 
              color: '#E67E22', 
              fontWeight: 'bold', 
              fontSize: '11px',
              marginBottom: '4px',
              borderBottom: '1px solid #E67E22',
              paddingBottom: '2px',
            }}>
              FECHA SOLICITUD
            </div>
            <div style={{ color: '#333333', fontSize: '14px', fontWeight: '500' }}>
              {formatDate(request.fecha_solicitud)}
            </div>
          </div>

          <div>
            <div style={{ 
              color: '#E67E22', 
              fontWeight: 'bold', 
              fontSize: '11px',
              marginBottom: '4px',
              borderBottom: '1px solid #E67E22',
              paddingBottom: '2px',
            }}>
              FECHA APROBACIÓN
            </div>
            <div style={{ color: '#333333', fontSize: '14px', fontWeight: '500' }}>
              {today}
            </div>
          </div>

          <div>
            <div style={{ 
              color: '#E67E22', 
              fontWeight: 'bold', 
              fontSize: '11px',
              marginBottom: '4px',
              borderBottom: '1px solid #E67E22',
              paddingBottom: '2px',
            }}>
              CONCEPTO
            </div>
            <div style={{ color: '#333333', fontSize: '14px', fontWeight: '500' }}>
              {request.titulo}
            </div>
          </div>
        </div>
      </div>

      {/* Sección de Firmas */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '80px',
        marginBottom: '40px',
      }}>
        {/* Firma 1 */}
        <div style={{ width: '45%', textAlign: 'center' }}>
          <div style={{ 
            borderBottom: '1px solid #000000', 
            marginBottom: '10px',
            height: '40px',
          }}></div>
          <div style={{ fontWeight: 'bold', fontSize: '12px', color: '#333333' }}>
            FIRMA VALIDACIÓN
          </div>
          <div style={{ fontSize: '14px', fontWeight: '500', marginTop: '5px' }}>
            Stephanie Belliard
          </div>
          <div style={{ fontSize: '11px', color: '#666666' }}>
            Encargada Presupuesto y Control de Gestión
          </div>
        </div>

        {/* Firma 2 */}
        <div style={{ width: '45%', textAlign: 'center' }}>
          <div style={{ 
            borderBottom: '1px solid #000000', 
            marginBottom: '10px',
            height: '40px',
          }}></div>
          <div style={{ fontWeight: 'bold', fontSize: '12px', color: '#333333' }}>
            FIRMA ORDENADOR DEL GASTO
          </div>
          <div style={{ fontSize: '14px', fontWeight: '500', marginTop: '5px' }}>
            SB
          </div>
        </div>
      </div>

      {/* Pie de página */}
      <div style={{
        textAlign: 'right',
        color: '#999999',
        fontSize: '10px',
        marginTop: 'auto',
        paddingTop: '20px',
      }}>
        Elaborado por: Stephanie B.
      </div>
    </div>
  );
};

export default CertificateTemplate;
