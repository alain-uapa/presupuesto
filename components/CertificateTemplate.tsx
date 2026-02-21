import React from 'react';
import { BudgetRequest } from '../types';

interface CertificateTemplateProps {
  request: BudgetRequest;
  folio?: string;
  centroCosto: string;
  cuentaUtilizar: string;
  onCentroCostoChange: (value: string) => void;
  onCuentaUtilizarChange: (value: string) => void;
}

const CertificateTemplate: React.FC<CertificateTemplateProps> = ({ 
  request, 
  folio = '0001',
  onCentroCostoChange,
  onCuentaUtilizarChange
}) => {

  const fullName = request.colaborador 
    ? `${request.colaborador.first_name} ${request.colaborador.last_name}` 
    : 'Colaborador';
  
  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'N/A';
    const parts = dateStr.split(' ')[0].split('/');
    if (parts.length !== 3) return dateStr;
    const day = parts[0].padStart(2, '0');
    const month = parts[1].padStart(2, '0');
    const year = parts[2];
    return `${day}/${month}/${year}`;
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-DO', { 
      style: 'currency', 
      currency: 'DOP',
      minimumFractionDigits: 2 
    }).format(amount || 0);
  };
  
  const today = new Date();
  const formattedToday = `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`;
  
  const inputStyle: React.CSSProperties = {
    border: 'none',
    background: 'transparent',
    fontSize: '13px',
    color: '#333',
    width: '100%',
    outline: 'none',
    padding: '2px 0',
  };
  
  const valueStyle: React.CSSProperties = {
    color: '#333333',
    fontSize: '14px',
    fontWeight: '500',
  };

  return (
    <div 
      id="certificate-template-preview"
      style={{
        padding: '10mm',
        backgroundColor: '#ffffff',
        fontFamily: 'Arial, Helvetica, sans-serif',
        boxSizing: 'border-box',
        width: '100%',
      }}
    >
      {/* Encabezado adaptable */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start', 
        marginBottom: '20px', 
        flexWrap: 'wrap', 
        gap: '15px' 
      }}>
        {/* Logo y Nombre Institucional */}
        <div style={{ flex: '1 1 250px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '55px',
            height: '55px',
            backgroundColor: '#003B71',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '14px',
            flexShrink: 0
          }}>
            UAPA
          </div>
          <div>
            <div style={{ fontWeight: 'bold', color: '#003B71', fontSize: '1.1rem', lineHeight: '1.2' }}>UAPA</div>
            <div style={{ color: '#E67E22', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase' }}>
              Educación superior a distancia virtual
            </div>
          </div>
        </div>
        
        {/* Título y Folio - Se expande al 100% en Portrait/Móvil */}
        <div style={{ flex: '1 1 350px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{
            backgroundColor: '#001a3d',
            color: 'white',
            padding: '7px 15px',
            borderRadius: '6px',
            fontSize: '0.9rem',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            textAlign: 'center',
            width: '100%',
            boxSizing: 'border-box'
          }}>
            Certificado de disponibilidad presupuestal
          </div>
          <div 
            style={{
              backgroundColor: '#E67E22',
              color: 'white',
              height: '32px', // Altura fija para centrado vertical consistente
              padding: '0 15px',
              borderRadius: '6px',
              fontSize: '0.9rem',
              fontWeight: 'bold',
              width: '100%',
              display: 'flex',
              justifyContent: 'flex-end', // Alineado a la derecha
              alignItems: 'center',      // Centrado vertical exacto
              boxSizing: 'border-box',
              lineHeight: '1',
            }}>
            CERTIFICADO No. {folio}
          </div>
        </div>
      </div>
      
      {/* Tabla de Datos */}
      <div style={{ overflowX: 'auto', marginTop: '20px' }}>
        <table style={{ width: '100%', minWidth: '600px', borderCollapse: 'collapse' }}>
          <tbody>
            <tr>
              <td style={{ border: '1px solid #FFC107', backgroundColor: '#f9f9f9', color: '#000', fontWeight: 'bold', fontSize: '11px', padding: '10px', width: '25%', textTransform: 'uppercase' }}>
                Rubro Presupuestal:
              </td>
              <td style={{ borderBottom: '1px solid #000', padding: '10px', width: '35%' }}>
                <span style={valueStyle}>{request.rubro_presupuestal || 'Actividades'}</span>
              </td>
              <td style={{ border: '1px solid #FFC107', backgroundColor: '#f9f9f9', color: '#000', fontWeight: 'bold', fontSize: '11px', padding: '10px', width: '20%', textTransform: 'uppercase' }}>
                Fecha Solicitud:
              </td>
              <td style={{ borderBottom: '1px solid #000', padding: '10px' }}>
                <span style={valueStyle}>{formatDate(request.fecha_solicitud)}</span>
              </td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #FFC107', backgroundColor: '#f9f9f9', color: '#000', fontWeight: 'bold', fontSize: '11px', padding: '10px', textTransform: 'uppercase' }}>
                Centro de Costo:
              </td>
              <td style={{ borderBottom: '1px solid #000', padding: '10px' }}>
                <input 
                  required
                  type="text" 
                  onChange={(e) => onCentroCostoChange(e.target.value)}
                  style={inputStyle}
                  placeholder="Ingrese centro de costo"
                />
              </td>
              <td style={{ border: '1px solid #FFC107', backgroundColor: '#f9f9f9', color: '#000', fontWeight: 'bold', fontSize: '11px', padding: '10px', textTransform: 'uppercase' }}>
                Fecha Aprobación:
              </td>
              <td style={{ borderBottom: '1px solid #000', padding: '10px' }}>
                <span style={valueStyle}>{formattedToday}</span>
              </td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #FFC107', backgroundColor: '#f9f9f9', color: '#000', fontWeight: 'bold', fontSize: '11px', padding: '10px', textTransform: 'uppercase' }}>
                Solicitante:
              </td>
              <td colSpan={3} style={{ borderBottom: '1px solid #000', padding: '10px' }}>
                <span style={valueStyle}>{fullName}</span>
              </td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #FFC107', backgroundColor: '#f9f9f9', color: '#000', fontWeight: 'bold', fontSize: '11px', padding: '10px', textTransform: 'uppercase' }}>
                Monto Aprobado:
              </td>
              <td colSpan={3} style={{ borderBottom: '1px solid #000', padding: '10px' }}>
                <span style={{ ...valueStyle, fontWeight: 'bold', color: '#003B71' }}>{formatCurrency(request.monto_a_ejecutar)}</span>
              </td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #FFC107', backgroundColor: '#f9f9f9', color: '#000', fontWeight: 'bold', fontSize: '11px', padding: '10px', textTransform: 'uppercase' }}>
                Cuenta a Utilizar:
              </td>
              <td colSpan={3} style={{ borderBottom: '1px solid #000', padding: '10px' }}>
                <input 
                  required
                  type="text" 
                  onChange={(e) => onCuentaUtilizarChange(e.target.value)}
                  style={inputStyle}
                  placeholder="Ingrese cuenta a utilizar"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      {/* Sección de Firmas */}
      <div style={{ marginTop: '60px', display: 'flex', flexWrap: 'wrap', gap: '40px' }}>
        <div style={{ flex: '1 1 250px' }}>
          <div style={{ fontWeight: 'bold', fontSize: '12px', textTransform: 'uppercase', marginBottom: '40px' }}>
            Firma Validación:
          </div>
          <div style={{ borderTop: '1px solid #000', width: '100%', paddingTop: '8px' }}>
            <div style={{ fontSize: '14px', fontWeight: '600' }}>Stephanie Belliard</div>
            <div style={{ fontSize: '12px', color: '#555' }}>Encargada Presupuesto y Control de Gestión</div>
          </div>
        </div>
        
        <div style={{ flex: '1 1 250px' }}>
          <div style={{ fontWeight: 'bold', fontSize: '12px', textTransform: 'uppercase', marginBottom: '40px' }}>
            Firma Ordenador del Gasto:
          </div>
          <div style={{ borderTop: '1px solid #000', width: '100%', paddingTop: '8px' }}>
            <div style={{ fontSize: '14px', fontWeight: '600' }}>SB</div>
            <div style={{ fontSize: '12px', color: '#555' }}>Autoridad Competente</div>
          </div>
        </div>
      </div>
      
      {/* Pie de página */}
      <div style={{
        textAlign: 'right',
        fontSize: '10px',
        color: '#aaa',
        marginTop: '40px',
        borderTop: '1px solid #eee',
        paddingTop: '10px'
      }}>
        Documento generado electrónicamente | Elaborado por: Stephanie B.
      </div>
    </div>
  );
};

export default CertificateTemplate;