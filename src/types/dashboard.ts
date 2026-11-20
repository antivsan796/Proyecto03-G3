export interface CsvOperation {
  FECHA: string;
  SUBSISTEMA: string;
  ENTIDAD: string;
  'TIPO DE CREDITO': string;
  'TIPO DE OPERACION': string;
  'ESTADO DE LA OPERACION': string;
  PROVINCIA: string;
  CANTON: string;
  SECTOR: string;
  SUBSECTOR: string;
  ACTIVIDAD: string;
  'NÚMERO DE OPERACIONES': number;
  'MONTO OTORGADO': number;
}

export interface Operation {
  id: number;
  fecha: string;
  subsistema: string;
  entidad: string;
  tipoCredito: string;
  tipoOperacion: string;
  estado: string;
  provincia: string;
  canton: string;
  sector: string;
  subsector: string;
  actividad: string;
  numeroOperaciones: number;
  montoOtorgado: number;
}

export interface DashboardFilters {
  startDate: string;
  endDate: string;
  creditType: string;
  operationType: string;
  status: string;
  province: string;
  canton: string;
  sector: string;
  subsector: string;
  activity: string;
  amountRange: [number, number];
}

export type CategoryFilterKey = Exclude<keyof DashboardFilters, 'startDate' | 'endDate' | 'amountRange'>;
export type CategoryColumn = 'tipoCredito' | 'tipoOperacion' | 'estado' | 'provincia' | 'canton' | 'sector' | 'subsector' | 'actividad';
export interface Option { value: string; label: string }
export interface CategoryValue { name: string; amount: number }
export interface TimePoint { name: string; amount: number }
export interface Metrics { amount: number; operations: number; average: number }
export type DateOrder = 'newest' | 'oldest';
