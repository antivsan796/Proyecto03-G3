# Dashboard de operaciones crediticias de la Corporación Financiera Nacional B.P.

Aplicación web que presenta y analiza las operaciones crediticias de la Corporación Financiera Nacional B.P. mediante filtros, indicadores, gráficos y un detalle paginado de los registros.

## Integrantes del Proyecto 3 DAWM PAR 3 - G3

- Enríquez Pérez Dereck Oscar
- Santana León Anthony Iván

## Análisis

El conjunto de datos seleccionado de la Corporación Financiera Nacional B.P. es adecuado porque contiene variables categóricas, numéricas y de tiempo. Estas permiten realizar agrupaciones por ubicación, tipo de crédito y actividad económica; comparar la colocación y el número de operaciones de crédito entre distintos periodos; y calcular medidas de tendencia para evaluar el comportamiento crediticio y las necesidades de financiamiento de distintos sectores productivos de la sociedad. La fuente es pública y verificable, por lo que los datos pueden consultarse nuevamente durante las siguientes fases de implementación del dashboard.

Se resumen las variables de análisis del conjunto de datos en la siguiente tabla:

| Tipo de variable | Nombre de variable | Descripción |
|---|---|---|
| Tiempo | Fecha | Identifica el periodo (año, mes y día) en el que se registra la operación crediticia y permite analizar su evolución y tendencia en el tiempo. |
| Categórica | Tipo de crédito | Define la línea del crédito otorgado. |
| Categórica | Tipo de operación | Indica la condición de la operación financiera. |
| Categórica | Estado de la operación | Muestra la situación actual del crédito, reestructura o refinanciamiento. |
| Categórica | Provincia, cantón | Indica la ubicación del crédito colocado. |
| Categórica | Sector, subsector, actividad | Describe el sector y la actividad económica específica del crédito. |
| Numérica | Monto otorgado | Monto desembolsado en la operación. Es la métrica cuantitativa principal para sumas, promedios y agregaciones financieras. |
| Numérica | Número de operaciones | Conteo de las operaciones registradas. |

## Diseño

La estructura del dashboard prioriza la lectura uniforme de arriba hacia abajo para guiar de forma natural al usuario mediante los componentes adaptados al proyecto. En la zona superior se disponen los filtros indicados en la fase de análisis para acotar la búsqueda de datos en el conjunto. Debajo se ubican los tres indicadores (KPI): el monto total otorgado, el número de operaciones y el monto promedio por operación, que muestran la jerarquía del impacto financiero en la sociedad. Adicionalmente, el centro de la interfaz concentra los tres gráficos estadísticos para evaluar la evolución temporal, la distribución por tipos de crédito y los sectores en los que se otorgaron, dejando la tabla de registros detallados en la sección inferior.

Para adaptarse a distintos dispositivos, la versión de escritorio aprovecha el ancho disponible para mostrar los elementos en paralelo y la tabla en múltiples columnas. En cambio, la versión móvil reorganiza la estructura en un flujo vertical, distribuye los controles de forma compacta y transforma la tabla de registros en fichas resumidas y legibles. Así se ofrece una experiencia táctil fluida sin comprometer la integridad de los datos ni la consistencia visual.

## Planificación

A partir de la fase de diseño, se estructura el dashboard en varios componentes mediante el uso de React, permitiendo organizar de forma lógica la interfaz de usuario, facilitando el mantenimiento del código, la separación de responsabilidades y la reutilización de componentes similares tanto en su versión de escritorio como en dispositivos móviles para su correcta visualización.

### Identificación de componentes y responsabilidades

- **Dashboard:** Componente principal que organiza la página. Gestiona el estado global de los datos obtenidos, los filtros activos aplicados por el usuario, maneja la estructura general y distribuye la información a los demás componentes.
- **Header:** Muestra la parte superior con el nombre del dashboard, funciona como un componente único y estático.
- **FiltersPanel:** Contiene los filtros de fecha, ubicación, crédito, operación, sector, tipos y monto otorgado. Administra los eventos de selección de los menús desplegables, agrupa los controles que permiten cambiar la información mostrada y gestiona el estado interactivo de los filtros.
- **KpiCard:** Indicador que se utiliza para monto otorgado, número de operaciones y monto promedio. Este componente es altamente reutilizable, ya que se instancia tres veces en la interfaz recibiendo diferentes métricas a través de sus propiedades.
- **ChartsSection:** Contenedor que agrupa los gráficos estadísticos.
  - **EvoChart:** Muestra la evolución del monto de crédito en función del tiempo. Es un componente reutilizable de gráficos de líneas.
  - **CreditTypeChart:** Muestra el monto agrupado por tipo de crédito. Es un componente reutilizable de visualización categórica.
  - **SectorChart:** Muestra la distribución del monto por sector económico. Es un componente reutilizable de visualización categórica.
- **OperationTable:** Muestra el detalle de operaciones en una tabla ordenada para la visualización de escritorio. Es responsable de la visualización para pantallas grandes.
- **OperationCard:** Muestra cada operación en tarjetas individuales solo en dispositivos móviles para presentar la misma información en un formato más cómodo. Es responsable de la visualización modular adaptada para móviles.
- **Pagination:** Permite cambiar entre las páginas de resultados del listado. Es un componente reutilizable diseñado para la navegación por bloques de datos.
- **Footer:** Responsable de mostrar la fuente y la fecha de actualización del dataset, funciona como un componente único y estático.

### Definición de props

<table>
  <thead>
    <tr>
      <th>Componente</th>
      <th>Propiedad</th>
      <th>Tipo de dato</th>
      <th>Descripción</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td rowspan="2"><code>Header</code></td>
      <td><code>title</code></td>
      <td><code>string</code></td>
      <td>Título principal que se muestra en la cabecera.</td>
    </tr>
    <tr>
      <td><code>logo</code></td>
      <td><code>string</code></td>
      <td>Ruta de la imagen de la cabecera.</td>
    </tr>
    <tr>
      <td rowspan="2"><code>FiltersPanel</code></td>
      <td><code>filters</code></td>
      <td><code>object</code></td>
      <td>Estado actual de los parámetros de búsqueda seleccionados por el usuario.</td>
    </tr>
    <tr>
      <td><code>onFilterChange</code></td>
      <td><code>function</code></td>
      <td>Función de retorno callback, se activa cuando el usuario interactúa con cualquier filtro para actualizar la consulta.</td>
    </tr>
    <tr>
      <td rowspan="3"><code>KpiCard</code></td>
      <td><code>title</code></td>
      <td><code>string</code></td>
      <td>Título descriptivo que identifica el indicador, por ejemplo, el “monto total otorgado”.</td>
    </tr>
    <tr>
      <td><code>value</code></td>
      <td><code>number | string</code></td>
      <td>Valor cuantitativo o métrica calculada y luego formateada para el indicador.</td>
    </tr>
    <tr>
      <td><code>icon</code></td>
      <td><code>node | string</code></td>
      <td>Icono o gráfico asociado visualmente al indicador.</td>
    </tr>
    <tr>
      <td rowspan="2"><code>EvoChart</code></td>
      <td><code>data</code></td>
      <td><code>array&lt;object&gt;</code></td>
      <td>Conjunto de registros de montos por periodo de tiempo para el gráfico de líneas.</td>
    </tr>
    <tr>
      <td><code>xAxisKey</code></td>
      <td><code>string</code></td>
      <td>Clave del objeto utilizada para etiquetar el eje horizontal temporal, por ejemplo, el “mes”.</td>
    </tr>
    <tr>
      <td><code>CreditTypeChart</code></td>
      <td><code>data</code></td>
      <td><code>array&lt;object&gt;</code></td>
      <td>Arreglo con la distribución de montos agrupados por cada categoría de tipo de crédito.</td>
    </tr>
    <tr>
      <td><code>SectorChart</code></td>
      <td><code>data</code></td>
      <td><code>array&lt;object&gt;</code></td>
      <td>Arreglo de datos estadísticos que muestran los sectores económicos de los créditos.</td>
    </tr>
    <tr>
      <td rowspan="2"><code>OperationsTable</code></td>
      <td><code>columns</code></td>
      <td><code>array&lt;object&gt;</code></td>
      <td>Arreglo de los encabezados, anchos y claves de acceso para renderizar las columnas en la visualización de escritorio.</td>
    </tr>
    <tr>
      <td><code>data</code></td>
      <td><code>array&lt;object&gt;</code></td>
      <td>Arreglo de registros de operaciones crediticias filtradas para listar en filas.</td>
    </tr>
    <tr>
      <td><code>OperationCard</code></td>
      <td><code>operation</code></td>
      <td><code>object</code></td>
      <td>Objeto individual que contiene todos los atributos de una operación para su visualización de móviles.</td>
    </tr>
    <tr>
      <td rowspan="3"><code>Pagination</code></td>
      <td><code>currentPage</code></td>
      <td><code>number</code></td>
      <td>Número que indica la página actual en la que se encuentra navegando el usuario.</td>
    </tr>
    <tr>
      <td><code>totalPages</code></td>
      <td><code>number</code></td>
      <td>Cantidad total de páginas disponibles de acuerdo con los resultados del filtro aplicado por el usuario.</td>
    </tr>
    <tr>
      <td><code>onPageChange</code></td>
      <td><code>function</code></td>
      <td>Función encargada de actualizar la vista al cambiar de página.</td>
    </tr>
    <tr>
      <td rowspan="2"><code>Footer</code></td>
      <td><code>datasetSource</code></td>
      <td><code>string</code></td>
      <td>Texto que indica la fuente oficial de obtención de los datos del dashboard.</td>
    </tr>
    <tr>
      <td><code>lastUpdate</code></td>
      <td><code>string</code></td>
      <td>Fecha de la última actualización del dataset.</td>
    </tr>
  </tbody>
</table>

### Adaptación responsiva

En escritorio, los indicadores y gráficos se distribuyen en columnas y las operaciones se muestran en una tabla. En dispositivos móviles, los indicadores y gráficos se presentan en una columna; el panel de filtros reorganiza sus controles y la tabla se sustituye por tarjetas individuales para evitar el desplazamiento horizontal. La paginación también adapta su disposición al espacio disponible.

## Desarrollo

- Se revisó el CSV completo, que contiene 588 registros y 13 columnas, y se convirtió a JSON con Python siguiendo la [guía de clase](https://dawm3.readthedocs.io/es/latest/recursos/extras/csvtojson.html).

- Las fechas se transformaron de `dd/mm/aaaa` a `aaaa-mm-dd`; el número de operaciones se convirtió a entero y el monto otorgado, a decimal. Las demás columnas se conservaron como texto.

- Se eliminaron espacios innecesarios y se unificaron los nombres de categorías que presentaban pequeñas diferencias. El CSV original se conservó sin modificaciones.

- El JSON se comprobó con un script independiente. Se mantienen los 588 registros y la validación no detectó valores faltantes, fechas inválidas ni filas duplicadas.

- El dashboard se adaptó a React con TypeScript y Material UI, siguiendo el árbol definido en la planificación. Los filtros, indicadores, gráficos y el detalle de operaciones se organizaron en componentes con props.

- Se muestran valores y datos de prueba para test: 12 registros de ejemplo tomados del JSON, y el usuario puede intercambiar los datos de prueba por el conjunto completo mediante el interruptor “Usar datos de ejemplo”. Al seleccionar una provincia, `useState` guarda el filtro, actualiza los indicadores y vuelve a la primera página.

### Componentes implementados y responsabilidades

| Componente | Responsabilidad | Elementos de Material UI |
|---|---|---|
| `App` | Aplica el tema y carga la página principal. | `ThemeProvider`, `CssBaseline` |
| `DashboardPage` | Reúne las secciones y distribuye datos y callbacks. | `Container`, `Stack`, `Switch` |
| `DashboardHeader` | Muestra el título y permite exportar los registros filtrados. | `AppBar`, `Toolbar`, `Button` |
| `FiltersPanel` | Agrupa los controles y comunica los filtros elegidos. | `Paper`, `Grid`, `Alert` |
| `DateFilter` | Selecciona una fecha inicial o final. | `TextField` |
| `SelectFilter` | Muestra las opciones de un filtro categórico. Se usa ocho veces. | `TextField` con selector |
| `AmountRangeFilter` | Selecciona los límites mínimo y máximo del monto. | `TextField`, `Slider` |
| `KpiSection` y `KpiCard` | Presentan monto total, número de operaciones y promedio. | `Grid`, `Card`, `Typography` |
| `ChartsSection` y `ChartPanel` | Distribuyen los gráficos y muestran su título o estado vacío. | `Grid`, `Card` |
| `TimeSeriesChart` | Muestra los montos agrupados por mes. | `Box`; línea con Recharts |
| `CreditTypeBarChart` | Compara el monto por tipo de crédito. | `Stack`, `Box`, `Typography` |
| `SectorDonutChart` | Muestra la distribución del monto por sector. | `Box`, `Stack`; gráfico con Recharts |
| `OperationsSection` | Organiza el detalle, el orden por fecha y la paginación. | `useMediaQuery`, `TextField`, `Paper` |
| `OperationsTable` | Muestra las filas de la página actual en escritorio. | `TableContainer`, `Table`, `Chip` |
| `OperationCardList` y `OperationCard` | Presentan los mismos registros en tarjetas para móvil. | `Grid`, `Card`, `Divider` |
| `PaginationControl` | Comunica el cambio de página al componente padre. | `Pagination` |
| `CategoryText` y `Footer` | Despliegan descripciones largas y muestran la fuente de datos. | `Box`, `Typography`, `Link` |

### Props y uso de useState

Las props se definen con interfaces de TypeScript en los componentes y con tipos compartidos en `src/types/dashboard.ts`. El componente padre prepara la información; los componentes hijos la muestran y comunican los cambios mediante callbacks.

| Comunicación | Props utilizadas | Uso en la interfaz |
|---|---|---|
| `DashboardPage` → `DashboardHeader` | `title`, `subtitle`, `onExport`, `exportDisabled` | Muestra los textos y ejecuta la exportación. |
| `DashboardPage` → `FiltersPanel` | `filters: DashboardFilters`; `onChange: (next: DashboardFilters) => void` | Envía los valores seleccionados y recibe un nuevo objeto de filtros. |
| `FiltersPanel` → filtros reutilizables | `label`, `value`, `options`, `min`, `max`, `onChange` | Configura fechas, categorías y rango de monto. |
| `KpiSection` → `KpiCard` | `title: string`; `value: number`; `unit?: string`; `helperText: string` | Reutiliza la tarjeta para los tres indicadores. |
| `ChartsSection` → gráficos | `data: TimePoint[]` o `CategoryValue[]`; `title: string` | Cada gráfico recibe los datos ya agrupados. |
| `OperationsSection` → detalle | `rows: Operation[]`; `page: number`; `rowsPerPage: number` | La tabla muestra la página actual; la lista móvil recibe las filas de esa página. |
| `OperationsSection` → `PaginationControl` | `page`, `count`, `onChange: (page: number) => void` | Un clic actualiza la página sin cambiar los filtros. |

## Ejecución

Se requiere Python 3.9 o posterior. Desde la carpeta del proyecto se ejecutan:

```sh
python scripts/csv_to_json.py
python scripts/validar_json.py
```

El primer comando genera `data/datasetG3.json` y el segundo comprueba el resultado. No se requiere instalar paquetes adicionales.

Para abrir el dashboard se requiere Node.js 22.12 o posterior. Desde la carpeta del proyecto se ejecutan:

```sh
npm install
npm run dev
```

La dirección que aparece en la consola permite acceder al dashboard. En Codespaces también se puede abrir el puerto 5173 desde la pestaña Ports. El dashboard lee las operaciones desde la raíz (`/`) de Firebase Realtime Database, donde el JSON importado debe aparecer con claves numéricas de `0` a `587`. El interruptor «Usar datos de ejemplo» permite cargar el conjunto reducido local de `src/data/exampleOperations.json`. Si falla la lectura, se muestra el error y se puede reintentar sin recargar la página.

Para comprobar los tipos se ejecuta `npm run typecheck`; para revisar los cálculos, `npm test`. Con `npm run build` se comprueban los tipos y se genera la aplicación.

## Recursos

- En `data/` se encuentran el CSV original, el JSON generado y los nombres de categorías unificados.
- En `scripts/` están el conversor y el validador.
- En `evidencias/` se encuentran las capturas de VS Code y los resultados de ejecución.
- En `src/components/` están los componentes TSX; en `src/hooks/`, el estado y los datos; y en `src/types/`, las interfaces compartidas.
- Los informes del proyecto se encuentran en la carpeta `informe/`.

Las imágenes se organizan con estos nombres para identificar lo que muestra cada una:

- [Funciones de conversión](evidencias/conversion/funciones_conversion.png).
- [Ejecución del conversor](evidencias/conversion/ejecucion_conversion_csv_json.png).
- [Vista del JSON preliminar](evidencias/conversion/vista_json_preliminar.png).
- [Resultado de la validación](evidencias/validacion/resultado_validacion_json.png).
- [Vista del JSON generado](evidencias/validacion/vista_json_generado.png).
- [Dashboard en escritorio](evidencias/dashboard/dashboard_escritorio.png).
- [Dashboard en móvil](evidencias/dashboard/dashboard_movil.png).
- [Dashboard con filtros aplicados](evidencias/dashboard/dashboard_filtrado.png).
- [Interfaz del Sprint 2 en escritorio](evidencias/sprint2/interfaz_escritorio.png).
- [Indicadores en móvil](evidencias/sprint2/movil_indicadores.png).
- [Operaciones en móvil](evidencias/sprint2/movil_operaciones.png).
- [Cambio del filtro de provincia](evidencias/sprint2/interaccion_filtro_provincia.png).

## Bibliografía

- Avendaño, A. (18 de noviembre de 2026). *readthedocs*. Obtenido de readthedocs: [https://dawm3.readthedocs.io/es/latest/recursos/extras/csvtojson.html](https://dawm3.readthedocs.io/es/latest/recursos/extras/csvtojson.html)
- Componentdriven. (13 de noviembre de 2026). *Componentdriven*. Obtenido de Componentdriven: [https://www.componentdriven.org/](https://www.componentdriven.org/)
- Corporación Financiera Nacional B.P. (27 de agosto de 2026). *datosabiertos*. Obtenido de datosabiertos: [https://www.datosabiertos.gob.ec/dataset/serie-mensual-de-volumen-de-credito-y-contingentes](https://www.datosabiertos.gob.ec/dataset/serie-mensual-de-volumen-de-credito-y-contingentes)
- developer.mozilla. (13 de noviembre de 2026). *developer.mozilla*. Obtenido de developer.mozilla: [https://developer.mozilla.org/es/docs/Learn_web_development/Core/CSS_layout/Responsive_Design](https://developer.mozilla.org/es/docs/Learn_web_development/Core/CSS_layout/Responsive_Design)
- Figma. (05 de noviembre de 2026). *Figma*. Obtenido de Figma: [https://www.figma.com/](https://www.figma.com/)
- MaterialUI. (20 de noviembre de 2026). *MaterialUI*. Obtenido de MaterialUI: [https://mui.com/material-ui/getting-started/installation/](https://mui.com/material-ui/getting-started/installation/)
- MaterialUI. (20 de noviembre de 2026). *MaterialUI*. Obtenido de MaterialUI: [https://mui.com/material-ui/react-grid/](https://mui.com/material-ui/react-grid/)
- python. (19 de noviembre de 2026). *python*. Obtenido de python: [https://docs.python.org/3/library/csv.html](https://docs.python.org/3/library/csv.html)
- React. (13 de noviembre de 2026). *React*. Obtenido de React: [https://react.dev/learn/passing-props-to-a-component](https://react.dev/learn/passing-props-to-a-component)
- Typescript. (13 de noviembre de 2026). *TypescriptLang*. Obtenido de TypescriptLang: [https://www.typescriptlang.org/docs/](https://www.typescriptlang.org/docs/)
