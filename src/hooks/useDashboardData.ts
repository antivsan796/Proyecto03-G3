import { useEffect, useState } from 'react';
import { getOperations } from '../services/operations';
import { emptyFilters, filterOperations, getMetrics, getPage, groupAmounts, groupSectors } from '../utils/dashboard';
import type { DashboardFilters, DateOrder, Operation } from '../types/dashboard';

export function useDashboardData() {
  const [rows, setRows] = useState<Operation[]>([]);
  const [filters, setFilters] = useState<DashboardFilters>({ ...emptyFilters });
  const [page, setPage] = useState(1);
  const [order, setOrder] = useState<DateOrder>('newest');
  const [useExamples, setUseExamples] = useState(false);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const rowsPerPage = 6;

  useEffect(() => {
    let active = true;
    getOperations(useExamples).then((loadedRows) => {
      if (!active) return;
      setRows(loadedRows);
      setFilters({ ...emptyFilters, amountRange: [0, Math.max(0, ...loadedRows.map((row) => row.montoOtorgado))] });
      setStatus('ready');
    }).catch(() => { if (active) setStatus('error'); });
    return () => { active = false; };
  }, [useExamples]);

  function changeFilters(next: DashboardFilters) {
    setFilters(next);
    setPage(1);
  }

  function resetFilters() {
    changeFilters({ ...emptyFilters, amountRange: [0, Math.max(0, ...rows.map((row) => row.montoOtorgado))] });
  }

  function changeDataMode(next: boolean) {
    setStatus('loading');
    setPage(1);
    setUseExamples(next);
  }

  function changeOrder(next: DateOrder) {
    setOrder(next);
    setPage(1);
  }

  const filteredRows = filterOperations(rows, filters).sort((a, b) => order === 'newest'
    ? b.fecha.localeCompare(a.fecha) || a.id - b.id : a.fecha.localeCompare(b.fecha) || a.id - b.id);
  const pagination = getPage(filteredRows, page, rowsPerPage);
  const dates = rows.map((row) => row.fecha).sort();

  return {
    rows, filteredRows, filters, changeFilters, resetFilters, status, useExamples, changeDataMode,
    order, changeOrder, page: pagination.page, setPage, rowsPerPage,
    totalPages: pagination.totalPages, visibleRows: pagination.data, start: pagination.start,
    metrics: getMetrics(filteredRows),
    timeSeries: groupAmounts(filteredRows, 'fecha'),
    byCreditType: groupAmounts(filteredRows, 'tipoCredito'), bySector: groupSectors(filteredRows),
    bounds: { startDate: dates[0] ?? '', endDate: dates.at(-1) ?? '', maxAmount: Math.max(0, ...rows.map((row) => row.montoOtorgado)) },
  };
}
