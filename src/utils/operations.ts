import type { CsvOperation, Operation } from '../types/dashboard';

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
