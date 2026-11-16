import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { emptyFilters, filterOperations, getMetrics, getPage, groupAmounts, groupSectors, toCsv, updateFilters } from '../src/utils/dashboard.js';
import { formatDate } from '../src/utils/format.js';

const operations = JSON.parse(await readFile(new URL('../data/datasetG3.json', import.meta.url), 'utf8'));

test('los indicadores conservan los totales comprobados del Sprint 1', () => {
  assert.equal(operations.length, 588);
  assert.deepEqual(getMetrics(operations), { amount: 1462645012.06, operations: 1206, average: 1212806.81 });
  assert.equal(filterOperations(operations, emptyFilters).length, 588);
});

test('el promedio usa el número de operaciones y conserva los centavos', () => {
  const sample = [{ 'MONTO OTORGADO': 0.1, 'NÚMERO DE OPERACIONES': 1 }, { 'MONTO OTORGADO': 0.2, 'NÚMERO DE OPERACIONES': 2 }];
  assert.deepEqual(getMetrics(sample), { amount: 0.3, operations: 3, average: 0.1 });
  assert.deepEqual(getMetrics([]), { amount: 0, operations: 0, average: 0 });
});

test('combina filtros con fechas inclusivas, montos y categorías reales', () => {
  const example = operations[0];
  const filters = { ...emptyFilters, startDate: example.FECHA, endDate: example.FECHA, province: example.PROVINCIA, creditType: example['TIPO DE CREDITO'], maxAmount: String(example['MONTO OTORGADO']) };
  const result = filterOperations(operations, filters);
  assert.ok(result.includes(example));
  assert.ok(result.every((row) => row.FECHA === example.FECHA && row.PROVINCIA === example.PROVINCIA && row['TIPO DE CREDITO'] === example['TIPO DE CREDITO'] && row['MONTO OTORGADO'] <= example['MONTO OTORGADO']));
  assert.equal(filterOperations(operations, { ...emptyFilters, startDate: '2099-01-01' }).length, 0);
  assert.equal(filterOperations(operations, { ...emptyFilters, startDate: '2026-01-01', endDate: '2022-01-01' }).length, 0);
});

test('cambiar provincia o sector limpia los filtros dependientes', () => {
  const filters = { ...emptyFilters, province: 'GUAYAS', canton: 'GUAYAQUIL', sector: 'A', subsector: 'B', activity: 'C' };
  assert.equal(updateFilters(filters, 'province', 'PICHINCHA').canton, '');
  const changed = updateFilters(filters, 'sector', 'D');
  assert.equal(changed.subsector, '');
  assert.equal(changed.activity, '');
  assert.equal(updateFilters(filters, 'subsector', 'E').activity, '');
});

test('todos los gráficos conservan el monto total y los meses quedan ordenados', () => {
  const cents = (groups) => groups.reduce((sum, group) => sum + Math.round(group.amount * 100), 0);
  const monthly = groupAmounts(operations, 'FECHA');
  assert.deepEqual(monthly.map((group) => group.name), monthly.map((group) => group.name).sort());
  assert.equal(monthly[0].name, '2022-01');
  assert.equal(monthly.at(-1).name, '2026-07');
  assert.equal(cents(monthly), 146264501206);
  assert.equal(cents(groupAmounts(operations, 'TIPO DE CREDITO')), 146264501206);
  assert.equal(cents(groupSectors(operations)), 146264501206);
  assert.equal(groupSectors(operations).at(-1).name, 'OTROS SECTORES');
});

test('la paginación no pierde registros y ajusta una página que deja de existir', () => {
  const pages = [];
  for (let page = 1; page <= 98; page++) pages.push(...getPage(operations, page).data);
  assert.deepEqual(pages, operations);
  const shortened = getPage(operations.slice(0, 7), 98);
  assert.equal(shortened.page, 2);
  assert.equal(shortened.data.length, 1);
  assert.equal(getPage([], 5).page, 1);
  assert.deepEqual(getPage([], 5).data, []);
});

test('las fechas no cambian de día y la exportación conserva las trece columnas', () => {
  assert.equal(formatDate('2022-01-31'), '31/01/2022');
  const csv = toCsv([operations[0]]);
  assert.equal(csv.charCodeAt(0), 0xfeff);
  assert.equal(csv.split('\r\n').length, 2);
  assert.equal(csv.split('\r\n')[0].split(';').length, 13);
  assert.ok(csv.includes('"NÚMERO DE OPERACIONES"'));
  assert.equal(toCsv([{ ACTIVIDAD: 'Texto "con comillas"; completo' }]), '\uFEFF"ACTIVIDAD"\r\n"Texto ""con comillas""; completo"');
});
