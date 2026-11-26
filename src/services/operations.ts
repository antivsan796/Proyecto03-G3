import exampleRows from '../data/exampleOperations.json';
import { getFirebaseOperations } from './dashboardService';
import { mapOperations } from '../utils/operations';
import type { Operation } from '../types/dashboard';

export async function getOperations(useExamples: boolean): Promise<Operation[]> {
  if (useExamples) return mapOperations(exampleRows);
  const rows = await getFirebaseOperations();
  return mapOperations(rows);
}
