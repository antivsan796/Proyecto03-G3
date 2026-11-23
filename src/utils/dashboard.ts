import type { CategoryColumn, CategoryFilterKey, CategoryValue, DashboardFilters, Metrics, Operation } from '../types/dashboard';
import { toCsvRow } from './operations';

export const categoryFilters: { key: CategoryFilterKey; column: CategoryColumn; label: string }[] = [
  { key: 'creditType', column: 'tipoCredito', label: 'Tipo de crédito' },
  { key: 'operationType', column: 'tipoOperacion', label: 'Tipo de operación' },
  { key: 'status', column: 'estado', label: 'Estado de la operación' },
  { key: 'province', column: 'provincia', label: 'Provincia' },
  { key: 'canton', column: 'canton', label: 'Cantón' },
  { key: 'sector', column: 'sector', label: 'Sector' },
  { key: 'subsector', column: 'subsector', label: 'Subsector' },
  { key: 'activity', column: 'actividad', label: 'Actividad' },
];

export const emptyFilters: DashboardFilters = {
  startDate: '', endDate: '', creditType: '', operationType: '', status: '',
  province: '', canton: '', sector: '', subsector: '', activity: '', amountRange: [0, Number.MAX_SAFE_INTEGER],
};

export function filterOperations(operations: Operation[], filters: DashboardFilters): Operation[] {
  return operations.filter((operation) => {
    if (filters.startDate && operation.fecha < filters.startDate) return false;
    if (filters.endDate && operation.fecha > filters.endDate) return false;
    if (operation.montoOtorgado < filters.amountRange[0] || operation.montoOtorgado > filters.amountRange[1]) return false;
    return categoryFilters.every(({ key, column }) => !filters[key] || operation[column] === filters[key]);
  });
}

export function getOptions(operations: Operation[], column: CategoryColumn): string[] {
  return [...new Set(operations.map((operation) => operation[column]))]
    .sort((a, b) => a.localeCompare(b, 'es'));
}

export function updateFilters(filters: DashboardFilters, key: CategoryFilterKey, value: string): DashboardFilters {
  const next = { ...filters, [key]: value };
  if (key === 'province') next.canton = '';
  if (key === 'sector') { next.subsector = ''; next.activity = ''; }
  if (key === 'subsector') next.activity = '';
  return next;
}

export function getMetrics(operations: Operation[]): Metrics {
  // Sumo en centavos para conservar la precisión de los importes del CSV.
  const cents = operations.reduce((sum, operation) => sum + Math.round(operation.montoOtorgado * 100), 0);
  const count = operations.reduce((sum, operation) => sum + operation.numeroOperaciones, 0);
  return { amount: cents / 100, operations: count, average: count ? Math.round(cents / count) / 100 : 0 };
}

export function groupAmounts(operations: Operation[], column: 'fecha' | 'tipoCredito' | 'sector'): CategoryValue[] {
  const groups = new Map<string, number>();
  for (const operation of operations) {
    const name = column === 'fecha' ? operation.fecha.slice(0, 7) : operation[column];
    groups.set(name, (groups.get(name) || 0) + Math.round(operation.montoOtorgado * 100));
  }
  return [...groups].map(([name, cents]) => ({ name, amount: cents / 100 }))
    .sort((a, b) => column === 'fecha' ? a.name.localeCompare(b.name) : b.amount - a.amount);
}

export function groupSectors(operations: Operation[]): CategoryValue[] {
  const groups = groupAmounts(operations, 'sector');
  if (groups.length <= 5) return groups;
  const rest = groups.slice(5).reduce((sum, group) => sum + Math.round(group.amount * 100), 0);
  return [...groups.slice(0, 5), { name: 'OTROS SECTORES', amount: rest / 100 }];
}

export function getPage(operations: Operation[], currentPage: number, pageSize = 6) {
  const totalPages = Math.max(1, Math.ceil(operations.length / pageSize));
  const page = Math.min(Math.max(1, currentPage), totalPages);
  const start = (page - 1) * pageSize;
  return { page, totalPages, start, data: operations.slice(start, start + pageSize) };
}

export function toCsv(operations: Operation[]): string {
  if (!operations.length) return '';
  const rows = operations.map(toCsvRow);
  const columns = Object.keys(rows[0]) as (keyof typeof rows[number])[];
  const escape = (value: string | number) => `"${String(value).replaceAll('"', '""')}"`;
  return '\uFEFF' + [columns, ...rows.map((row) => columns.map((column) => row[column]))]
    .map((row) => row.map(escape).join(';')).join('\r\n');
}
