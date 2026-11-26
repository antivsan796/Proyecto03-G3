import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { emptyFilters, filterOperations, getMetrics, getPage, groupAmounts, groupSectors, toCsv, updateFilters } from '../src/utils/dashboard';
import { mapOperations, parseCsvOperations, toCsvRow } from '../src/utils/operations';
import { formatDate } from '../src/utils/format';
import { getOperationStatusStyle } from '../src/utils/operationStatus';
import type { CsvOperation, DashboardFilters } from '../src/types/dashboard';

const examples: CsvOperation[] = JSON.parse(await readFile(new URL('../src/data/exampleOperations.json', import.meta.url), 'utf8'));
const operations = mapOperations(examples);

test('el modelo TypeScript conserva los trece campos de los datos de prueba', () => {
  assert.equal(operations.length, 12);
  assert.deepEqual(operations.map(toCsvRow), examples);
  assert.equal(filterOperations(operations, emptyFilters).length, 12);
});

test('lee registros desde la raíz numérica de Firebase y rechaza estructuras inválidas', () => {
  const indexedRecords = { '0': examples[0], '1': examples[1] };
  assert.deepEqual(parseCsvOperations(indexedRecords), examples.slice(0, 2));
  assert.deepEqual(parseCsvOperations(examples.slice(0, 2)), examples.slice(0, 2));
  assert.throws(() => parseCsvOperations([]), /no devolvió registros/i);
  assert.throws(() => parseCsvOperations({ '0': { ...examples[0], FECHA: 42 } }), /estructura esperada/i);
});

test('los ejemplos son doce registros reales del JSON con categorías para interactuar', () => {
  assert.equal(examples.length, 12);
  assert.equal(new Set(examples.map((row) => row['TIPO DE CREDITO'])).size, 4);
  assert.ok(new Set(examples.map((row) => row.PROVINCIA)).size > 1);
});

test('el promedio usa el número de operaciones y conserva los centavos', () => {
  const sample = [{ ...operations[0], montoOtorgado: .1, numeroOperaciones: 1 }, { ...operations[1], montoOtorgado: .2, numeroOperaciones: 2 }];
  assert.deepEqual(getMetrics(sample), { amount: .3, operations: 3, average: .1 });
  assert.deepEqual(getMetrics([]), { amount: 0, operations: 0, average: 0 });
});

test('combina categorías, fechas inclusivas y ambos límites del monto', () => {
  const example = operations[0]!;
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

test('asigna colores semánticos a cada estado de crédito', () => {
  assert.equal(getOperationStatusStyle('ORIGINAL').color, '#2f6553');
  assert.equal(getOperationStatusStyle('NOVADA').color, '#315a89');
  assert.equal(getOperationStatusStyle('REFINANCIADA').color, '#a32727');
  assert.equal(getOperationStatusStyle('REESTRUCTURADA').color, '#653d80');
  assert.equal(getOperationStatusStyle('REFINANCIAMIENTO').color, '#a32727');
});

test('todos los gráficos conservan el monto total y ordenan los meses', () => {
  const cents = (groups: { amount: number }[]) => groups.reduce((sum, group) => sum + Math.round(group.amount * 100), 0);
  const monthly = groupAmounts(operations, 'fecha');
  const expectedCents = Math.round(getMetrics(operations).amount * 100);
  assert.deepEqual(monthly.map((group) => group.name), monthly.map((group) => group.name).sort());
  assert.equal(monthly[0].name, '2022-01');
  assert.equal(monthly.at(-1)?.name, '2026-07');
  assert.equal(cents(monthly), expectedCents);
  assert.equal(cents(groupAmounts(operations, 'tipoCredito')), expectedCents);
  assert.equal(cents(groupSectors(operations)), expectedCents);
});

test('la paginación no pierde registros y ajusta una página inexistente', () => {
  const pages = [];
  for (let page = 1; page <= Math.ceil(operations.length / 6); page++) pages.push(...getPage(operations, page).data);
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
