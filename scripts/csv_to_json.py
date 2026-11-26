"""Conversión de CSV a JSON, siguiendo la guía de clase.

Ejecutar: python scripts/csv_to_json.py
Comprobar después con: python scripts/validar_json.py
"""

import csv
import json
import math
from datetime import datetime
from pathlib import Path


BASE = Path(__file__).resolve().parents[1]
COLUMNAS = [
    "FECHA", "SUBSISTEMA", "ENTIDAD", "TIPO DE CREDITO",
    "TIPO DE OPERACION", "ESTADO DE LA OPERACION", "PROVINCIA", "CANTON",
    "SECTOR", "SUBSECTOR", "ACTIVIDAD", "NÚMERO DE OPERACIONES", "MONTO OTORGADO",
]


def a_float(valor):
    if valor is None:
        return None
    numero = float(valor)
    if not math.isfinite(numero):
        raise ValueError("El monto debe ser un número finito.")
    return numero


def a_int(valor):
    return int(valor) if valor is not None else None


def a_fecha(valor):
    if valor is None:
        return None
    fecha = datetime.strptime(valor, "%d/%m/%Y")
    if fecha.strftime("%d/%m/%Y") != valor:
        raise ValueError("La fecha debe usar dd/mm/aaaa.")
    return fecha.strftime("%Y-%m-%d")


def limpiar_fila(fila):
    registro = {}
    for columna, valor in fila.items():
        texto = valor.strip()
        registro[columna] = None if texto.upper() in ("", "NULL", "N/A", "NAN", "NONE") else texto
    return registro


def convertir_fila(fila):
    registro = dict(fila)
    registro["FECHA"] = a_fecha(fila["FECHA"])
    registro["NÚMERO DE OPERACIONES"] = a_int(fila["NÚMERO DE OPERACIONES"])
    registro["MONTO OTORGADO"] = a_float(fila["MONTO OTORGADO"])
    return registro


def csv_a_json(ruta_csv, ruta_json):
    if Path(ruta_csv).resolve() == Path(ruta_json).resolve():
        raise ValueError("El JSON no puede reemplazar el CSV original.")
    # CFN usa punto y coma y Windows-1252; no tiene líneas de metadatos.
    with open(ruta_csv, encoding="cp1252", newline="") as archivo_csv:
        lector = csv.DictReader(archivo_csv, delimiter=";", strict=True)
        if lector.fieldnames != COLUMNAS:
            raise ValueError("Los encabezados no coinciden con las 13 columnas de CFN.")
        filas = list(lector)
    if not filas:
        raise ValueError("El CSV no contiene registros.")
    if any(set(fila) != set(COLUMNAS) or None in fila.values() for fila in filas):
        raise ValueError("Hay filas con una cantidad incorrecta de campos.")

    limpias = [limpiar_fila(fila) for fila in filas]
    faltantes = {columna: sum(fila[columna] is None for fila in limpias) for columna in COLUMNAS}
    conversiones = {"FECHA": a_fecha, "NÚMERO DE OPERACIONES": a_int, "MONTO OTORGADO": a_float}
    invalidos = {columna: 0 for columna in conversiones}
    errores = []
    for linea, fila in enumerate(limpias, start=2):
        for columna, convertir in conversiones.items():
            try:
                convertir(fila[columna])
            except (ValueError, OverflowError):
                invalidos[columna] += 1
                errores.append(f"Línea {linea}, {columna}: {fila[columna]!r}")

    duplicadas = len(limpias) - len({tuple(fila.values()) for fila in limpias})
    espacios = sum(filas[i][c] != filas[i][c].strip() for i in range(len(filas)) for c in COLUMNAS)
    print(f"Registros del CSV: {len(filas)}")
    print(f"Columnas: {len(COLUMNAS)}")
    print("Nombres de columnas:", ", ".join(COLUMNAS))
    print("Valores faltantes por columna:")
    for columna, cantidad in faltantes.items():
        print(f"  {columna}: {cantidad}")
    print(f"Fechas inválidas: {invalidos['FECHA']}")
    print(f"Enteros inválidos: {invalidos['NÚMERO DE OPERACIONES']}")
    print(f"Decimales inválidos: {invalidos['MONTO OTORGADO']}")
    print(f"Filas duplicadas después de limpiar espacios: {duplicadas}")
    print(f"Campos con espacios exteriores limpiados: {espacios}")
    print("Etapa de validación del CSV terminada.")
    if errores:
        raise ValueError("No se generó JSON. Corregir: " + "; ".join(errores[:5]))

    with open(BASE / "data/normalizacion_categorias.json", encoding="utf-8") as archivo:
        normalizaciones = json.load(archivo)
    registros = [convertir_fila(fila) for fila in limpias]
    cambios = 0
    for registro in registros:
        for columna, reemplazos in normalizaciones.items():
            original = registro[columna]
            registro[columna] = reemplazos.get(original, original)
            cambios += registro[columna] != original
    with open(ruta_json, "w", encoding="utf-8", newline="\n") as archivo_json:
        json.dump(registros, archivo_json, indent=4, ensure_ascii=False, allow_nan=False)
        archivo_json.write("\n")
    print(f"{len(registros)} registros convertidos.")
    print("FECHA: aaaa-mm-dd | operaciones: int | monto: float | categorías: str")
    print(f"Campos categóricos normalizados: {cambios}")
    print(f"JSON generado: {Path(ruta_json).name}")
    print("Siguiente comprobación: python scripts/validar_json.py")


if __name__ == "__main__":
    # la aplicación toma los datos de Firebase y localmente solo se usan 12 registros de ejemplo.
    # try:
    #     csv_a_json(BASE / "data/datasetG3.csv", BASE / "data/datasetG3.json")
    # except (OSError, UnicodeError, csv.Error, ValueError, OverflowError) as error:
    #     raise SystemExit(f"ERROR: {error}")
    print("los datos provienen de Firebase")
