import { get, ref } from "firebase/database";
import { database } from "../firebase/firebase";
import { parseCsvOperations } from "../utils/operations";
import type { CsvOperation } from "../types/dashboard";

export async function getFirebaseOperations(): Promise<CsvOperation[]> {
  const snapshot = await get(ref(database));
  if (!snapshot.exists()) {
    throw new Error('No se encontraron operaciones en la raíz de Realtime Database.');
  }

  return parseCsvOperations(snapshot.val());
}