import { get, ref } from "firebase/database";
import { database } from "../firebase/firebase";
import type { CsvOperation } from "../types/dashboard";

export async function obtenerdashboard( collection: string ): Promise<CsvOperation | null> {

  const referencia = ref(database, `${collection}`);

  const snapshot = await get(referencia);

  if (snapshot.exists()) {
    return snapshot.val() as CsvOperation;
  }

  return null;
}