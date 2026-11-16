"""Validación independiente del JSON contra el CSV y el mapa de categorías.

Ejecutar: python scripts/validar_json.py
Usa Decimal al leer los montos para comprobar los centavos sin redondearlos.
"""

import csv
import json
import re
from collections import Counter, defaultdict
from datetime import datetime
from decimal import Decimal
from pathlib import Path


BASE = Path(__file__).resolve().parents[1]
NUMERICAS = ("NÚMERO DE OPERACIONES", "MONTO OTORGADO")


def palabras(texto):
    return " ".join(re.sub(r"[,;]", " ", texto).split())


def rechazar_constante(valor):
    raise ValueError(f"JSON no permite este número: {valor}")


def objeto_sin_claves_duplicadas(pares):
    objeto = {}
    for clave, valor in pares:
        if clave in objeto:
            raise ValueError(f"Clave repetida en un objeto JSON: {clave}")
        objeto[clave] = valor
    return objeto


def validar_json(ruta_json, ruta_csv, ruta_mapa):
    with open(ruta_csv, encoding="cp1252", newline="") as archivo:
        lector = csv.DictReader(archivo, delimiter=";", strict=True)
        columnas = lector.fieldnames
        originales = list(lector)
    if not columnas or len(columnas) != 13 or not originales:
        raise ValueError("El CSV de referencia debe tener 13 columnas y registros.")
    if any(set(fila) != set(columnas) or None in fila.values() for fila in originales):
        raise ValueError("El CSV de referencia contiene filas incompletas o campos adicionales.")
    with open(ruta_json, encoding="utf-8") as archivo:
        registros = json.load(archivo, parse_float=Decimal, parse_constant=rechazar_constante,
                              object_pairs_hook=objeto_sin_claves_duplicadas)
    with open(ruta_mapa, encoding="utf-8") as archivo:
        mapa = json.load(archivo)
    if not isinstance(registros, list):
        raise ValueError("La raíz del JSON debe ser un arreglo.")
    if any(not isinstance(r, dict) or set(r) != set(columnas) for r in registros):
        raise ValueError("Todos los registros JSON deben conservar las mismas 13 claves del CSV.")

    errores = []
    if len(registros) != len(originales):
        errores.append("La cantidad de registros JSON no coincide con la del CSV.")
    for columna, reemplazos in mapa.items():
        if columna not in columnas or columna in ("FECHA", *NUMERICAS):
            raise ValueError(f"Columna no categórica en el mapa: {columna}")
        etiquetas = {fila[columna].strip() for fila in originales}
        for origen, destino in reemplazos.items():
            if origen not in etiquetas or not isinstance(destino, str) or palabras(origen) != palabras(destino):
                raise ValueError(f"El mapa altera palabras o contiene una etiqueta ajena al CSV: {columna}")

    faltantes = Counter()
    invalidos = Counter()
    cambios = Counter()
    diferencias = 0
    filas_normalizadas = 0
    for indice, (registro, fila) in enumerate(zip(registros, originales), start=1):
        esperado = {}
        hubo_cambio = False
        for columna, texto in fila.items():
            texto = texto.strip()
            valor = None if texto.upper() in ("", "NULL", "N/A", "NAN", "NONE") else texto
            if valor is not None:
                if columna == "FECHA":
                    valor = datetime.strptime(valor, "%d/%m/%Y").strftime("%Y-%m-%d")
                elif columna == "NÚMERO DE OPERACIONES":
                    valor = int(valor)
                elif columna == "MONTO OTORGADO":
                    valor = Decimal(valor)
                else:
                    destino = mapa.get(columna, {}).get(valor, valor)
                    cambios[columna] += destino != valor
                    hubo_cambio = hubo_cambio or destino != valor
                    valor = destino
            esperado[columna] = valor
        filas_normalizadas += hubo_cambio
        for columna, valor in registro.items():
            if valor is None:
                faltantes[columna] += 1
                continue
            if columna == "FECHA":
                try:
                    valido = isinstance(valor, str) and bool(re.fullmatch(r"[0-9]{4}-[0-9]{2}-[0-9]{2}", valor))
                    if valido:
                        datetime.strptime(valor, "%Y-%m-%d")
                except ValueError:
                    valido = False
            elif columna == "NÚMERO DE OPERACIONES":
                valido = type(valor) is int
            elif columna == "MONTO OTORGADO":
                valido = type(valor) in (int, Decimal)
            else:
                valido = isinstance(valor, str) and valor == valor.strip()
            if not valido:
                invalidos[columna] += 1
        if registro != esperado:
            diferencias += 1
            errores.append(f"Registro {indice}: valores diferentes del CSV normalizado.")

    duplicados = len(registros) - len({tuple(r[c] for c in columnas) for r in registros})
    pendientes = Counter()
    for columna in columnas:
        if columna in ("FECHA", *NUMERICAS):
            continue
        grupos = defaultdict(set)
        for registro in registros:
            valor = registro[columna]
            if isinstance(valor, str):
                grupos[palabras(valor)].add(valor)
                if re.search(r"\s{2,}", valor):
                    pendientes[columna] += 1
        pendientes[columna] += sum(len(variantes) > 1 for variantes in grupos.values())
    if sum(invalidos.values()) or sum(pendientes.values()):
        errores.append("Hay tipos inválidos o variantes categóricas sin normalizar.")
    if duplicados:
        errores.append("Se encontraron filas completamente duplicadas; no se eliminan automáticamente.")

    print("VALIDACIÓN INDEPENDIENTE DEL JSON")
    print(f"Tipo de la raíz: {type(registros).__name__}")
    print(f"Registros CSV: {len(originales)} | Registros JSON: {len(registros)}")
    print("Claves por registro: 13; mismas columnas que el CSV.")
    print("Valores faltantes por columna:")
    for columna in columnas:
        print(f"  {columna}: {faltantes[columna]}")
    print(f"Fechas inválidas: {invalidos['FECHA']}")
    print(f"Enteros inválidos: {invalidos['NÚMERO DE OPERACIONES']}")
    print(f"Decimales inválidos: {invalidos['MONTO OTORGADO']}")
    print(f"Otros tipos inválidos: {sum(invalidos.values()) - sum(invalidos[c] for c in ('FECHA', *NUMERICAS))}")
    print(f"Filas duplicadas completas: {duplicados}")
    print(f"Registros diferentes del CSV normalizado: {diferencias}")
    print(f"Variantes o espacios internos pendientes: {sum(pendientes.values())}")
    print(f"Campos categóricos normalizados: {sum(cambios.values())}; registros afectados: {filas_normalizadas}")
    for columna in cambios:
        if cambios[columna]:
            print(f"  {columna}: {cambios[columna]} campos normalizados")
    if not errores:
        print(f"Total de operaciones: {sum(r['NÚMERO DE OPERACIONES'] or 0 for r in registros)}")
        print(f"Monto total otorgado: {sum((r['MONTO OTORGADO'] or Decimal('0') for r in registros), Decimal('0')):.2f}")
    for error in errores[:10]:
        print(f"ERROR: {error}")
    print("Validación terminada: " + ("CON ERRORES." if errores else "CORRECTA."))
    return not errores


if __name__ == "__main__":
    try:
        correcto = validar_json(BASE / "data/datasetG3.json", BASE / "data/datasetG3.csv",
                                BASE / "data/normalizacion_categorias.json")
        raise SystemExit(0 if correcto else 1)
    except (OSError, UnicodeError, csv.Error, ValueError, TypeError) as error:
        raise SystemExit(f"ERROR: {error}")
