# Proyecto 03 - Grupo 3

Dashboard de operaciones crediticias de la Corporación Financiera Nacional B.P., para Desarrollo de Aplicaciones Web y Móviles (SOFG1006).

## Avance del Sprint 1

Los pasos 1 a 3 están realizados: inspección del CSV, conversión a JSON y validación independiente. El JSON final de datos es `data/datasetG3.json`. El informe académico del sprint sigue pendiente. La interfaz React y la conexión con Firebase corresponden a sprints posteriores.

El procedimiento sigue la [guía de conversión de CSV a JSON](https://dawm3.readthedocs.io/es/latest/recursos/extras/csvtojson.html): lectura con `csv.DictReader`, funciones de conversión por tipo, escritura con `json.dump` y un script separado de validación. Puede ejecutarse en una computadora o en GitHub Codespaces.

## Ejecución

Requiere Python 3.9 o posterior. Solo utiliza módulos de la biblioteca estándar; no necesita instalar paquetes.

Desde la raíz del repositorio, ejecutar en este orden:

```sh
python scripts/csv_to_json.py
python scripts/validar_json.py
```

Si el entorno utiliza el comando `python3`, sustituir `python` por `python3`. Cada script devuelve código 0 cuando termina correctamente y un código distinto de cero si encuentra errores.

El conversor genera o reemplaza `data/datasetG3.json`. El validador lo vuelve a leer y comprueba todos los registros contra el CSV y el mapa de normalización. No modifica datos.

## Archivos

| Ruta | Contenido |
| --- | --- |
| `data/datasetG3.csv` | CSV original, conservado sin modificaciones; 588 registros y 13 columnas. |
| `data/datasetG3.json` | Arreglo JSON de 588 objetos con las mismas 13 claves, en UTF-8. |
| `data/normalizacion_categorias.json` | Reemplazos explícitos de etiquetas categóricas para que la limpieza sea reproducible. |
| `scripts/csv_to_json.py` | Lectura, limpieza, conversión de tipos y escritura del JSON. |
| `scripts/validar_json.py` | Comprobación independiente de estructura, tipos, registros, faltantes y valores. |
| `evidencias/guia/` | Capturas de VS Code y salida del paso 2, cuando el JSON todavía era preliminar. |
| `evidencias/paso3/` | Salidas de ejecución, revisión de etiquetas y capturas de la validación actual. |

El borrador `datasetG3.preliminar.json` y las primeras capturas de Bloc de notas se conservan solo localmente y no se publican en GitHub.

## Tipos y tratamiento de los datos

El CSV original usa Windows-1252 y separador `;`. Sus campos se leen inicialmente como texto. No se omiten líneas de metadatos porque este archivo no las tiene.

| Columnas | Python en el conversor | JSON |
| --- | --- | --- |
| `FECHA` | Fecha interpretada con `datetime` y convertida a texto ISO. | `string` con formato `aaaa-mm-dd`, a partir de `dd/mm/aaaa`. |
| `NÚMERO DE OPERACIONES` | `int` | Número entero. |
| `MONTO OTORGADO` | `float` | Número decimal sin comillas. |
| `SUBSISTEMA`, `ENTIDAD`, `TIPO DE CREDITO`, `TIPO DE OPERACION`, `ESTADO DE LA OPERACION`, `PROVINCIA`, `CANTON`, `SECTOR`, `SUBSECTOR`, `ACTIVIDAD` | `str` | Cadenas de texto. |

Se eliminan espacios al inicio y al final. Los campos vacíos y los marcadores `NULL`, `N/A`, `NaN` y `None` se convierten a `None` en Python y `null` en JSON; no se reemplazan por ceros. El dataset actual no contiene valores faltantes. Las fechas o números inválidos detienen la exportación antes de escribir el JSON.

El validador lee los montos con `Decimal` y los compara con el valor decimal del CSV para comprobar que los centavos se conservaron al serializar. JSON no tiene un tipo propio para fechas.

Se conserva el orden y no se descartan registros. Compartir una fecha es válido en este dataset y no significa que dos filas estén duplicadas.

### Normalización de categorías

Se revisaron 45 grupos con diferencias de comas o punto y coma y otros 3 casos de espacios internos repetidos. Los reemplazos conservan exactamente la misma secuencia de palabras y acentos; se utiliza la variante presente en el CSV con más puntuación y se reducen espacios repetidos. El mapa registra 50 etiquetas de origen que cambian. No se realizan agrupaciones aproximadas ni se cambian actividades económicas por otras.

| Columna | Etiquetas originales | Etiquetas normalizadas | Campos modificados |
| --- | ---: | ---: | ---: |
| `SECTOR` | 21 | 17 | 150 |
| `SUBSECTOR` | 96 | 87 | 38 |
| `ACTIVIDAD` | 161 | 129 | 261 |

Son 449 campos modificados en 376 registros. El detalle de cada variante, su frecuencia y el texto elegido está en `evidencias/paso3/revision_categorias.json`. El CSV original no se altera.

## Resultado de la validación

- 588 registros en el CSV y en el JSON, con las mismas 13 claves por registro.
- 0 valores faltantes, fechas inválidas o tipos numéricos incorrectos.
- 0 filas completamente duplicadas y 0 diferencias respecto al CSV normalizado.
- 0 variantes de puntuación o espacios internos repetidos pendientes, según el criterio documentado.
- Total de operaciones: **1206**. Los 588 registros son filas del dataset, no el total de operaciones.
- Monto total otorgado: **1462645012.06**.

Las salidas reproducibles están en `evidencias/paso3/conversion.txt` y `evidencias/paso3/validacion_json.txt`. Las capturas de `evidencias/guia/` documentan el paso anterior; las de `evidencias/paso3/` corresponden al JSON final.

## Pendiente para la entrega académica

Seleccionar e incorporar las evidencias al informe PDF y redactar la explicación del Sprint 1. La publicación de estos archivos constituye un avance del repositorio, no la entrega del informe.

Referencia de datos utilizada en las fases anteriores: [serie mensual de volumen de crédito y contingentes](https://www.datosabiertos.gob.ec/dataset/serie-mensual-de-volumen-de-credito-y-contingentes).
