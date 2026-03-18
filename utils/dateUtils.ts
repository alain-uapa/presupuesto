export const parseFromBackend = (dateStr: string): Date | null => {
  if (!dateStr) return null;
  try {
    const [datePart] = dateStr.split(' ');
    const [day, month, year] = datePart.split('/');
    return new Date(Number(year), Number(month) - 1, Number(day));
  } catch {
    return null;
  }
};

export const formatForBackend = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

export const formatForDisplay = (date: Date | string | null | undefined): string => {
  if (!date) return '';
  
  let dateObj: Date;
  
  if (date instanceof Date) {
    dateObj = date;
  } else if (typeof date === 'string' && date.includes('/')) {
    const parsed = parseFromBackend(date);
    if (!parsed) return date;
    dateObj = parsed;
  } 
  return new Intl.DateTimeFormat('es-DO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(dateObj);
};

export const getCurrentDateForBackend = (): string => {
  return formatForBackend(new Date());
};
