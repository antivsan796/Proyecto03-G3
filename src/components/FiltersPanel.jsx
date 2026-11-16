import { categoryFilters } from '../utils/dashboard';
import { formatMoney } from '../utils/format';

export default function FiltersPanel({ filters, onFilterChange, options, bounds, onReset }) {
  const invalidDates = filters.startDate && filters.endDate && filters.startDate > filters.endDate;
  return (
    <section className="filters-panel" aria-labelledby="filters-title">
      <div className="panel-heading">
        <h2 id="filters-title">Filtrar operaciones</h2>
        <button className="text-button" onClick={onReset} type="button">Restablecer filtros</button>
      </div>
      <div className="filters-grid">
        <label>Fecha inicio
          <input type="date" value={filters.startDate} min={bounds.startDate} max={filters.endDate || bounds.endDate}
            aria-invalid={Boolean(invalidDates)} onChange={(event) => onFilterChange('startDate', event.target.value)} />
        </label>
        <label>Fecha fin
          <input type="date" value={filters.endDate} min={filters.startDate || bounds.startDate} max={bounds.endDate}
            aria-invalid={Boolean(invalidDates)} onChange={(event) => onFilterChange('endDate', event.target.value)} />
        </label>
        {categoryFilters.map(({ key, label }) => (
          <div className="filter-field" key={key}>
            <label htmlFor={`filter-${key}`}>{label}</label>
            <select id={`filter-${key}`} value={filters[key]} onChange={(event) => onFilterChange(key, event.target.value)}>
              <option value="">Todos</option>
              {options[key].map((option) => <option key={option} value={option}>{option}</option>)}
            </select>
          </div>
        ))}
        <label className="amount-filter">Monto otorgado máximo · USD
          <input type="number" min="0" max={bounds.maxAmount} step="0.01" placeholder="Sin límite"
            value={filters.maxAmount} onChange={(event) => onFilterChange('maxAmount', event.target.value)} />
          <input aria-label="Ajustar monto máximo" type="range" min="0" max={bounds.maxAmount} step="0.01"
            value={filters.maxAmount === '' ? bounds.maxAmount : filters.maxAmount}
            onChange={(event) => onFilterChange('maxAmount', event.target.value)} />
        </label>
      </div>
      {invalidDates && <p className="field-error" role="alert">La fecha de inicio debe ser anterior o igual a la fecha de fin.</p>}
      <p className="filter-note">Los indicadores, gráficos y registros cambian con los filtros.
        {filters.maxAmount !== '' && ` Monto máximo por registro: ${formatMoney(Number(filters.maxAmount))}.`}</p>
    </section>
  );
}
