# Proyecto 03 - Grupo 3

Estoy trabajando en un dashboard sobre las operaciones crediticias de la Corporación Financiera Nacional B.P. para la materia Desarrollo de Aplicaciones Web y Móviles (SOFG1006).

## Lo que he realizado

Revisé el CSV completo y confirmé que tiene 588 registros y 13 columnas. Después hice la conversión a JSON con Python, siguiendo la [guía de clase](https://dawm3.readthedocs.io/es/latest/recursos/extras/csvtojson.html).

Cambié las fechas de `dd/mm/aaaa` a `aaaa-mm-dd`, convertí el número de operaciones a entero y el monto otorgado a decimal. Las demás columnas se mantienen como texto.

También limpié espacios y unifiqué nombres de categorías que estaban escritos con pequeñas diferencias. Conservé el CSV original sin modificarlo.

Finalmente, comprobé el JSON con un script separado. Se mantienen los 588 registros y no encontré valores faltantes, fechas inválidas ni filas duplicadas.

## Cómo lo ejecuto

Uso Python 3.9 o posterior. Desde la carpeta del proyecto ejecuto:

```sh
python scripts/csv_to_json.py
python scripts/validar_json.py
```

El primer comando genera `data/datasetG3.json` y el segundo comprueba el resultado. No necesito instalar paquetes adicionales.

## Archivos del proyecto

- En `data/` dejé el CSV original, el JSON generado y los nombres de categorías que corregí.
- En `scripts/` están el conversor y el validador.
- En `evidencias/` guardé las capturas de VS Code y los resultados de ejecución.

Dejé las imágenes con estos nombres para identificar lo que muestra cada una:

- [Funciones de conversión](evidencias/conversion/funciones_conversion.png).
- [Ejecución del conversor](evidencias/conversion/ejecucion_conversion_csv_json.png).
- [Vista del JSON preliminar](evidencias/conversion/vista_json_preliminar.png).
- [Resultado de la validación](evidencias/validacion/resultado_validacion_json.png).
- [Vista del JSON generado](evidencias/validacion/vista_json_generado.png).

## Lo que me falta

Me falta terminar la sección del Sprint 1 en el informe PDF e incluir las evidencias con su explicación.

Para continuar con el proyecto, todavía tengo que desarrollar los componentes en React, conectar Firebase e implementar los indicadores, gráficos y filtros del dashboard.
