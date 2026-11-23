import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { emptyFilters, filterOperations, getMetrics, getPage, groupAmounts, groupSectors, toCsv, updateFilters } from '../src/utils/dashboard';
import { mapOperations, toCsvRow } from '../src/utils/operations';
import { formatDate } from '../src/utils/format';
import type { CsvOperation, DashboardFilters } from '../src/types/dashboard';

const original: CsvOperation[] = JSON.parse(await readFile(new URL('../data/datasetG3.json', import.meta.url), 'utf8'));
const operations = mapOperations(original);
const examples: CsvOperation[] = JSON.parse(await readFile(new URL('../src/data/exampleOperations.json', import.meta.url), 'utf8'));

test('el modelo TypeScript conserva los trece campos y los totales del Sprint 1', () => {
  assert.equal(operations.length, 588);
  assert.deepEqual(operations.map(toCsvRow), original);
  assert.deepEqual(getMetrics(operations), { amount: 1462645012.06, operations: 1206, average: 1212806.81 });
  assert.equal(filterOperations(operations, emptyFilters).length, 588);
});

test('los ejemplos son doce registros reales del JSON con categorías para interactuar', () => {
  assert.equal(examples.length, 12);
  const values = new Set(original.map((row) => JSON.stringify(row)));
  assert.ok(examples.every((row) => values.has(JSON.stringify(row))));
  assert.equal(new Set(examples.map((row) => row['TIPO DE CREDITO'])).size, 4);
  assert.ok(new Set(examples.map((row) => row.PROVINCIA)).size > 1);
});

test('el promedio usa el número de operaciones y conserva los centavos', () => {
  const sample = [{ ...operations[0], montoOtorgado: .1, numeroOperaciones: 1 }, { ...operations[1], montoOtorgado: .2, numeroOperaciones: 2 }];
  assert.deepEqual(getMetrics(sample), { amount: .3, operations: 3, average: .1 });
  assert.deepEqual(getMetrics([]), { amount: 0, operations: 0, average: 0 });
});

test('combina categorías, fechas inclusivas y ambos límites del monto', () => {
  const example = operations[0];
  const filters: DashboardFilters = { ...emptyFilters, startDate: example.fecha, endDate: example.fecha,
    province: example.provincia, creditType: example.tipoCredito, amountRange: [example.montoOtorgado, example.montoOtorgado] };
  const result = filterOperations(operations, filters);
  assert.ok(result.includes(example));
  assert.ok(result.every((row) => row.fecha === example.fecha && row.provincia === example.provincia && row.tipoCredito === example.tipoCredito && row.montoOtorgado === example.montoOtorgado));
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

test('todos los gráficos conservan el monto total y ordenan los meses', () => {
  const cents = (groups: { amount: number }[]) => groups.reduce((sum, group) => sum + Math.round(group.amount * 100), 0);
  const monthly = groupAmounts(operations, 'fecha');
  assert.deepEqual(monthly.map((group) => group.name), monthly.map((group) => group.name).sort());
  assert.equal(monthly[0].name, '2022-01');
  assert.equal(monthly.at(-1)?.name, '2026-07');
  assert.equal(cents(monthly), 146264501206);
  assert.equal(cents(groupAmounts(operations, 'tipoCredito')), 146264501206);
  assert.equal(cents(groupSectors(operations)), 146264501206);
});

test('la paginación no pierde registros y ajusta una página inexistente', () => {
  const pages = [];
  for (let page = 1; page <= 98; page++) pages.push(...getPage(operations, page).data);
  assert.deepEqual(pages, operations);
  assert.equal(getPage(operations.slice(0, 7), 98).page, 2);
  assert.equal(getPage(operations.slice(0, 7), 98).data.length, 1);
  assert.deepEqual(getPage([], 5).data, []);
});

test('las fechas no cambian de día y el CSV exporta trece columnas sin ID interno', () => {
  assert.equal(formatDate('2022-01-31'), '31/01/2022');
  const csv = toCsv([operations[0]]);
  assert.equal(csv.charCodeAt(0), 0xfeff);
  assert.equal(csv.split('\r\n').length, 2);
  assert.equal(csv.split('\r\n')[0].split(';').length, 13);
  assert.ok(csv.includes('"NÚMERO DE OPERACIONES"'));
  assert.ok(toCsv([{ ...operations[0], actividad: 'Texto "con comillas"; completo' }]).includes('"Texto ""con comillas""; completo"'));
});
