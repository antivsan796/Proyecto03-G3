export const categoryFilters = [
  { key: 'creditType', column: 'TIPO DE CREDITO', label: 'Tipo de crédito' },
  { key: 'operationType', column: 'TIPO DE OPERACION', label: 'Tipo de operación' },
  { key: 'status', column: 'ESTADO DE LA OPERACION', label: 'Estado de la operación' },
  { key: 'province', column: 'PROVINCIA', label: 'Provincia' },
  { key: 'canton', column: 'CANTON', label: 'Cantón' },
  { key: 'sector', column: 'SECTOR', label: 'Sector' },
  { key: 'subsector', column: 'SUBSECTOR', label: 'Subsector' },
  { key: 'activity', column: 'ACTIVIDAD', label: 'Actividad' },
];

export const emptyFilters = {
  startDate: '', endDate: '', creditType: '', operationType: '', status: '',
  province: '', canton: '', sector: '', subsector: '', activity: '', maxAmount: '',
};

export function filterOperations(operations, filters) {
  return operations.filter((operation) => {
    if (filters.startDate && operation.FECHA < filters.startDate) return false;
    if (filters.endDate && operation.FECHA > filters.endDate) return false;
    if (filters.maxAmount !== '' && operation['MONTO OTORGADO'] > Number(filters.maxAmount)) return false;
    return categoryFilters.every(({ key, column }) => !filters[key] || operation[column] === filters[key]);
  });
}

export function getOptions(operations, column) {
  return [...new Set(operations.map((operation) => operation[column]))]
    .sort((a, b) => a.localeCompare(b, 'es'));
}

export function updateFilters(filters, key, value) {
  const next = { ...filters, [key]: value };
  if (key === 'province') next.canton = '';
  if (key === 'sector') { next.subsector = ''; next.activity = ''; }
  if (key === 'subsector') next.activity = '';
  return next;
}

export function getMetrics(operations) {
  // Sumo en centavos para conservar la precisión de los importes del CSV.
  const cents = operations.reduce((sum, operation) => sum + Math.round(operation['MONTO OTORGADO'] * 100), 0);
  const count = operations.reduce((sum, operation) => sum + operation['NÚMERO DE OPERACIONES'], 0);
  return { amount: cents / 100, operations: count, average: count ? Math.round(cents / count) / 100 : 0 };
}

export function groupAmounts(operations, column) {
  const groups = new Map();
  for (const operation of operations) {
    const name = column === 'FECHA' ? operation.FECHA.slice(0, 7) : operation[column];
    groups.set(name, (groups.get(name) || 0) + Math.round(operation['MONTO OTORGADO'] * 100));
  }
  return [...groups].map(([name, cents]) => ({ name, amount: cents / 100 }))
    .sort((a, b) => column === 'FECHA' ? a.name.localeCompare(b.name) : b.amount - a.amount);
}

export function groupSectors(operations) {
  const groups = groupAmounts(operations, 'SECTOR');
  if (groups.length <= 5) return groups;
  const rest = groups.slice(5).reduce((sum, group) => sum + Math.round(group.amount * 100), 0);
  return [...groups.slice(0, 5), { name: 'OTROS SECTORES', amount: rest / 100 }];
}

export function getPage(operations, currentPage, pageSize = 6) {
  const totalPages = Math.max(1, Math.ceil(operations.length / pageSize));
  const page = Math.min(Math.max(1, currentPage), totalPages);
  const start = (page - 1) * pageSize;
  return { page, totalPages, start, data: operations.slice(start, start + pageSize) };
}

export function toCsv(operations) {
  if (!operations.length) return '';
  const columns = Object.keys(operations[0]);
  const escape = (value) => `"${String(value ?? '').replaceAll('"', '""')}"`;
  return '\uFEFF' + [columns, ...operations.map((operation) => columns.map((column) => operation[column]))]
    .map((row) => row.map(escape).join(';')).join('\r\n');
}
