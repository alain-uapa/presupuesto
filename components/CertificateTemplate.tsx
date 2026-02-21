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
  centroCosto,
  cuentaUtilizar,
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

  const labelStyle: React.CSSProperties = {
    color: '#E67E22',
    fontWeight: 'bold',
    fontSize: '11px',
    marginBottom: '4px',
    borderBottom: '1px solid #E67E22',
    paddingBottom: '2px',
    display: 'block',
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
      }}
    >
      {/* Encabezado */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
        {/* Logo */}
        <div style={{ flex: '0 0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '50px',
              height: '50px',
              backgroundColor: '#003B71',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '12px',
            }}>
              UAPA
            </div>
            <div>
              <div style={{ fontWeight: 'bold', color: '#003B71', fontSize: '14px' }}>UAPA</div>
              <div style={{ color: '#E67E22', fontSize: '9px', fontWeight: '500' }}>
                Educación superior a distancia virtual
              </div>
            </div>
          </div>
        </div>

        {/* Título y Folio */}
        <div style={{ textAlign: 'right' }}>
          <div style={{
            backgroundColor: '#001a3d',
            color: 'white',
            padding: '6px 12px',
            borderRadius: '6px',
            fontSize: '10px',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            width: '100%',
          }}>
            Certificado de disponibilidad presupuestal
          </div>
          <div style={{
            backgroundColor: '#E67E22',
            color: 'white',
            padding: '4px 10px',
            borderRadius: '6px',
            fontSize: '10px',
            fontWeight: 'bold',
            display: 'inline-block',
            marginTop: '8px',
          }}>
            CERTIFICADO No. {folio}
          </div>
        </div>
      </div>

      {/* Tabla de Datos con scroll horizontal */}
      <div style={{ overflowX: 'auto', marginTop: '15px' }}>
        <table style={{ width: '100%', minWidth: '600px', borderCollapse: 'collapse' }}>
        <tbody>
          <tr>
            <td style={{ border: '1px solid #FFC107', backgroundColor: '#f9f9f9', color: '#000', fontWeight: 'bold', fontSize: '11px', padding: '8px', width: '30%', textTransform: 'uppercase' }}>
              Rubro Presupuestal:
            </td>
            <td style={{ borderBottom: '1px solid #000', padding: '8px', width: '40%' }}>
              <span style={valueStyle}>{request.rubro_presupuestal || 'Actividades'}</span>
            </td>
            <td style={{ border: '1px solid #FFC107', backgroundColor: '#f9f9f9', color: '#000', fontWeight: 'bold', fontSize: '11px', padding: '8px', width: '20%', textTransform: 'uppercase' }}>
              Fecha Solicitud:
            </td>
            <td style={{ borderBottom: '1px solid #000', padding: '8px' }}>
              <span style={valueStyle}>{formatDate(request.fecha_solicitud)}</span>
            </td>
          </tr>
          <tr>
            <td style={{ border: '1px solid #FFC107', backgroundColor: '#f9f9f9', color: '#000', fontWeight: 'bold', fontSize: '11px', padding: '8px', width: '30%', textTransform: 'uppercase' }}>
              Centro de Costo:
            </td>
            <td style={{ borderBottom: '1px solid #000', padding: '8px', width: '40%' }}>
              <input 
                required
                type="text" 
                onChange={(e) => onCentroCostoChange(e.target.value)}
                style={inputStyle}
                placeholder="Ingrese centro de costo"
              />
            </td>
            <td style={{ border: '1px solid #FFC107', backgroundColor: '#f9f9f9', color: '#000', fontWeight: 'bold', fontSize: '11px', padding: '8px', width: '20%', textTransform: 'uppercase' }}>
              Fecha Aprobación:
            </td>
            <td style={{ borderBottom: '1px solid #000', padding: '8px' }}>
              <span style={valueStyle}>{formattedToday}</span>
            </td>
          </tr>
          <tr>
            <td style={{ border: '1px solid #FFC107', backgroundColor: '#f9f9f9', color: '#000', fontWeight: 'bold', fontSize: '11px', padding: '8px', width: '30%', textTransform: 'uppercase' }}>
              Solicitante:
            </td>
            <td style={{ borderBottom: '1px solid #000', padding: '8px', colspan: 3 }}>
              <span style={valueStyle}>{fullName}</span>
            </td>
          </tr>
          <tr>
            <td style={{ border: '1px solid #FFC107', backgroundColor: '#f9f9f9', color: '#000', fontWeight: 'bold', fontSize: '11px', padding: '8px', width: '30%', textTransform: 'uppercase' }}>
              Monto Aprobado:
            </td>
            <td style={{ borderBottom: '1px solid #000', padding: '8px', colspan: 3 }}>
              <span style={valueStyle}>{formatCurrency(request.monto_a_ejecutar)}</span>
            </td>
          </tr>
          <tr>
            <td style={{ border: '1px solid #FFC107', backgroundColor: '#f9f9f9', color: '#000', fontWeight: 'bold', fontSize: '11px', padding: '8px', width: '30%', textTransform: 'uppercase' }}>
              Cuenta a Utilizar:
            </td>
            <td style={{ borderBottom: '1px solid #000', padding: '8px', colspan: 3 }}>
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
      <div style={{ marginTop: '50px' }}>
        <div style={{ marginBottom: '40px' }}>
          <div style={{ fontWeight: 'bold', fontSize: '14px', textTransform: 'uppercase', marginBottom: '5px' }}>
            Firma Validación:
          </div>
          <div style={{ borderTop: '1px solid #000', width: '100%', marginBottom: '5px' }}></div>
          <div style={{ fontSize: '14px', fontWeight: '500', margin: '2px 0' }}>Stephanie Belliard</div>
          <div style={{ fontSize: '13px', color: '#444' }}>Encargada Presupuesto y Control de Gestión</div>
        </div>

        <div>
          <div style={{ fontWeight: 'bold', fontSize: '14px', textTransform: 'uppercase', marginBottom: '5px' }}>
            Firma Ordenador del Gasto:
          </div>
          <div style={{ borderTop: '1px solid #000', width: '100%', marginBottom: '5px' }}></div>
          <div style={{ fontSize: '14px', fontWeight: '500', margin: '2px 0' }}>SB</div>
        </div>
      </div>

      {/* Pie de página */}
      <div style={{
        textAlign: 'right',
        fontSize: '11px',
        color: '#bbb',
        marginTop: '30px',
      }}>
        Elaborado por: Stephanie B.
      </div>
    </div>
  );
};

export default CertificateTemplate;
