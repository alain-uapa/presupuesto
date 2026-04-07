
import { formatDistanceToNow, format, differenceInDays } from 'date-fns';
import { es } from 'date-fns/locale';

export function formatServerDate(dateStr: string): string {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('T')[0].split('-');
  return `${day}/${month}/${year}`;
}

export function dnsDateFormat(fechaStr) {
  //console.log(fechaInteligente("2026-03-21T11:00:00Z")); // "hace 30 minutos"
  //console.log(fechaInteligente("2026-01-21T10:00:00Z")); // "21 de enero"
  const fecha = new Date(fechaStr);
  const hoy = new Date();
  
  // Calculamos la diferencia en días
  const diasDeDiferencia = differenceInDays(hoy, fecha);

  // Si fue hace menos de 2 días, muestra "hace X días"
  if (diasDeDiferencia < 2) {
    return formatDistanceToNow(fecha, { addSuffix: true, locale: es });
  } 
  
  // Si fue hace más de una semana, muestra la fecha fija
  return format(fecha, "d 'de' MMMM", { locale: es });
}

export function formatCurrency(amount, currency = 'DOP'){
  return new Intl.NumberFormat('es-DO', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}