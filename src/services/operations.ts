import exampleRows from '../data/exampleOperations.json';
import { mapOperations } from '../utils/operations';
import type { Operation } from '../types/dashboard';

export async function getOperations(useExamples: boolean): Promise<Operation[]> {
  if (useExamples) return mapOperations(exampleRows);
  const { default: rows } = await import('../../data/datasetG3.json');
  return mapOperations(rows);
}
