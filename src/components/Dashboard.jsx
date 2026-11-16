import { lazy, Suspense, useEffect, useState } from 'react';
import Header from './Header';
import FiltersPanel from './FiltersPanel';
import KpiCard from './KpiCard';
import OperationsTable from './OperationsTable';
import OperationCard from './OperationCard';
import CategoryText from './CategoryText';
import Pagination from './Pagination';
import Footer from './Footer';
import { getOperations } from '../services/operations';
import { categoryFilters, emptyFilters, filterOperations, getMetrics, getOptions, getPage, toCsv, updateFilters } from '../utils/dashboard';
import { formatDate, formatMoney, formatNumber } from '../utils/format';

const ChartsSection = lazy(() => import('./ChartsSection'));

const columns = [
  { key: 'FECHA', label: 'Fecha', render: (operation) => formatDate(operation.FECHA) },
  { key: 'TIPO DE CREDITO', label: 'Tipo de crédito' },
  { key: 'TIPO DE OPERACION', label: 'Tipo de operación' },
  { key: 'ESTADO DE LA OPERACION', label: 'Estado', render: (operation) => <span className="status-tag">{operation['ESTADO DE LA OPERACION']}</span> },
  { key: 'PROVINCIA', label: 'Provincia / cantón', render: (operation) => <>{operation.PROVINCIA}<span className="cell-secondary">{operation.CANTON}</span></> },
  { key: 'SECTOR', label: 'Sector' },
  { key: 'SUBSECTOR', label: 'Subsector', render: (operation) => <CategoryText value={operation.SUBSECTOR} limit={70} /> },
  { key: 'ACTIVIDAD', label: 'Actividad', render: (operation) => <CategoryText value={operation.ACTIVIDAD} /> },
  { key: 'NÚMERO DE OPERACIONES', label: 'Operaciones', numeric: true, render: (operation) => formatNumber(operation['NÚMERO DE OPERACIONES']) },
  { key: 'MONTO OTORGADO', label: 'Monto · USD', numeric: true, render: (operation) => formatMoney(operation['MONTO OTORGADO']) },
];

export default function Dashboard() {
  const [operations, setOperations] = useState([]);
  const [status, setStatus] = useState('loading');
  const [filters, setFilters] = useState(emptyFilters);
  const [currentPage, setCurrentPage] = useState(1);
  const [order, setOrder] = useState('newest');

  useEffect(() => {
    let active = true;
    getOperations().then((data) => {
      if (!active) return;
      setOperations(data.map((operation, index) => ({ ...operation, id: index + 1 })));
      setStatus('ready');
    }).catch(() => { if (active) setStatus('error'); });
    return () => { active = false; };
  }, []);

  function changeFilter(key, value) {
    setFilters((previous) => updateFilters(previous, key, value));
    setCurrentPage(1);
  }

  function resetFilters() {
    setFilters({ ...emptyFilters });
    setCurrentPage(1);
  }

  const filtered = filterOperations(operations, filters);
  const sorted = [...filtered].sort((a, b) => order === 'newest' ? b.FECHA.localeCompare(a.FECHA) || a.id - b.id : a.FECHA.localeCompare(b.FECHA) || a.id - b.id);
  const page = getPage(sorted, currentPage);
  const metrics = getMetrics(filtered);
  const dates = operations.map((operation) => operation.FECHA).sort();
  const bounds = {
    startDate: dates[0], endDate: dates.at(-1),
    maxAmount: Math.max(0, ...operations.map((operation) => operation['MONTO OTORGADO'])),
  };
  const options = Object.fromEntries(categoryFilters.map(({ key, column }) => {
    let records = operations;
    if (key === 'canton' && filters.province) records = records.filter((operation) => operation.PROVINCIA === filters.province);
    if ((key === 'subsector' || key === 'activity') && filters.sector) records = records.filter((operation) => operation.SECTOR === filters.sector);
    if (key === 'activity' && filters.subsector) records = records.filter((operation) => operation.SUBSECTOR === filters.subsector);
    return [key, getOptions(records, column)];
  }));

  function exportCsv() {
    const records = sorted.map(({ id, ...operation }) => operation);
    const url = URL.createObjectURL(new Blob([toCsv(records)], { type: 'text/csv;charset=utf-8;' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'operaciones_cfn_filtradas.csv';
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return (
    <>
      <a className="skip-link" href="#main">Ir al contenido</a>
      <Header title="DASHBOARD INFORMATIVO" />
      <main id="main" className="dashboard">
        <section className="intro" aria-labelledby="dashboard-title">
          <div><p className="eyebrow">Resumen general</p><h1 id="dashboard-title">Operaciones de Corporación Financiera Nacional B.P.</h1>
            <p>Una visión del financiamiento, su evolución y su distribución.</p></div>
          <button className="secondary-button" type="button" onClick={exportCsv} disabled={status !== 'ready' || !filtered.length}>
            <span aria-hidden="true">↓</span> Exportar CSV
          </button>
        </section>
        {status === 'loading' && <p className="state-panel" role="status">Cargando operaciones crediticias…</p>}
        {status === 'error' && <div className="state-panel" role="alert"><h2>No se pudieron cargar los datos</h2><p>Vuelve a cargar la página para intentarlo de nuevo.</p>
          <button className="secondary-button" onClick={() => window.location.reload()}>Reintentar</button></div>}
        {status === 'ready' && <>
          <FiltersPanel filters={filters} onFilterChange={changeFilter} options={options} bounds={bounds} onReset={resetFilters} />
          <div className="kpis" aria-live="polite">
            <KpiCard title="Monto otorgado" value={formatMoney(metrics.amount)} icon="$" description="Total desembolsado en el período seleccionado" />
            <KpiCard title="Número de operaciones" value={formatNumber(metrics.operations)} icon="↗" description="Suma de operaciones de los registros seleccionados" />
            <KpiCard title="Monto promedio por operación" value={formatMoney(metrics.average)} icon="÷" description="Monto otorgado / número de operaciones" />
          </div>
          <Suspense fallback={<p className="state-panel" role="status">Cargando gráficos…</p>}>
            <ChartsSection operations={filtered} />
          </Suspense>
          <section className="operations-section" aria-labelledby="operations-title">
            <div className="section-heading"><h2 id="operations-title">Detalle de operaciones</h2>
              <span className="result-count" role="status">{formatNumber(filtered.length)} registros · {formatNumber(metrics.operations)} operaciones</span></div>
            <div className="list-toolbar"><label htmlFor="date-order">Ordenar por fecha</label>
              <select id="date-order" value={order} onChange={(event) => { setOrder(event.target.value); setCurrentPage(1); }}>
                <option value="newest">De más reciente a más antigua</option><option value="oldest">De más antigua a más reciente</option>
              </select></div>
            {filtered.length ? <>
              <OperationsTable columns={columns} data={page.data} />
              <div className="operation-cards">{page.data.map((operation) => <OperationCard key={operation.id} operation={operation} />)}</div>
              <div className="list-footer"><p>Mostrando {page.start + 1}–{page.start + page.data.length} de {formatNumber(filtered.length)} registros</p>
                <Pagination currentPage={page.page} totalPages={page.totalPages} onPageChange={setCurrentPage} /></div>
            </> : <div className="state-panel empty-results"><h3>No hay operaciones con estos filtros</h3><p>Prueba con otro período o restablece los filtros.</p>
              <button className="secondary-button" onClick={resetFilters}>Mostrar todas las operaciones</button></div>}
          </section>
          <Footer datasetSource="Corporación Financiera Nacional B.P." lastUpdate={bounds.endDate} />
        </>}
      </main>
    </>
  );
}
