import type { CsvOperation, Operation } from '../types/dashboard';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isCsvOperation(value: unknown): value is CsvOperation {
  if (!isRecord(value)) return false;

  const textFields = [
    'FECHA', 'SUBSISTEMA', 'ENTIDAD', 'TIPO DE CREDITO', 'TIPO DE OPERACION',
    'ESTADO DE LA OPERACION', 'PROVINCIA', 'CANTON', 'SECTOR', 'SUBSECTOR', 'ACTIVIDAD',
  ];

  return textFields.every((field) => typeof value[field] === 'string')
    && typeof value['NÚMERO DE OPERACIONES'] === 'number'
    && Number.isFinite(value['NÚMERO DE OPERACIONES'])
    && typeof value['MONTO OTORGADO'] === 'number'
    && Number.isFinite(value['MONTO OTORGADO']);
}

export function parseCsvOperations(value: unknown): CsvOperation[] {
  const records: unknown[] = Array.isArray(value)
    ? value
    : isRecord(value) ? Object.values(value) : [];

  if (records.length === 0) {
    throw new Error('Firebase no devolvió registros de operaciones.');
  }

  const validRecords = records.filter(isCsvOperation);
  if (validRecords.length !== records.length) {
    throw new Error('Los datos de Firebase no tienen la estructura esperada para las operaciones.');
  }

  return validRecords;
}

export function mapOperations(rows: CsvOperation[]): Operation[] {
  return rows.map((row, index) => ({
    id: index + 1, fecha: row.FECHA, subsistema: row.SUBSISTEMA, entidad: row.ENTIDAD,
    tipoCredito: row['TIPO DE CREDITO'], tipoOperacion: row['TIPO DE OPERACION'],
    estado: row['ESTADO DE LA OPERACION'], provincia: row.PROVINCIA, canton: row.CANTON,
    sector: row.SECTOR, subsector: row.SUBSECTOR, actividad: row.ACTIVIDAD,
    numeroOperaciones: row['NÚMERO DE OPERACIONES'], montoOtorgado: row['MONTO OTORGADO'],
  }));
}

export function toCsvRow(row: Operation): CsvOperation {
  return {
    FECHA: row.fecha, SUBSISTEMA: row.subsistema, ENTIDAD: row.entidad,
    'TIPO DE CREDITO': row.tipoCredito, 'TIPO DE OPERACION': row.tipoOperacion,
    'ESTADO DE LA OPERACION': row.estado, PROVINCIA: row.provincia, CANTON: row.canton,
    SECTOR: row.sector, SUBSECTOR: row.subsector, ACTIVIDAD: row.actividad,
    'NÚMERO DE OPERACIONES': row.numeroOperaciones, 'MONTO OTORGADO': row.montoOtorgado,
  };
}
