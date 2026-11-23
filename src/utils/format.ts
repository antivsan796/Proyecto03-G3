export const formatNumber = (value: number) => new Intl.NumberFormat('es-EC').format(value);

export const formatMoney = (value: number) => new Intl.NumberFormat('es-EC', {
  style: 'currency', currency: 'USD', minimumFractionDigits: 2,
}).format(value);

export const formatCompact = (value: number) => new Intl.NumberFormat('es-EC', {
  notation: 'compact', maximumFractionDigits: 1,
}).format(value);

// La fecha del dataset es un día de calendario, sin conversión de zona horaria.
export function formatDate(value: string): string {
  if (!value) return 'Sin fecha';
  const [year, month, day] = value.split('-');
  return `${day}/${month}/${year}`;
}

export function formatMonth(value: string): string {
  const [year, month] = value.split('-').map(Number);
  return new Intl.DateTimeFormat('es-EC', { month: 'short', year: '2-digit', timeZone: 'UTC' })
    .format(new Date(Date.UTC(year, month - 1, 1)));
}
