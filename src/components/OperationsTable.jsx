export default function OperationsTable({ columns, data }) {
  return (
    <div className="operations-table">
      <table>
        <caption className="sr-only">Detalle de los registros de operaciones crediticias de la página actual</caption>
        <thead><tr>{columns.map((column) => <th key={column.key} scope="col" className={column.numeric ? 'numeric' : ''}>{column.label}</th>)}</tr></thead>
        <tbody>{data.map((operation) => (
          <tr key={operation.id}>{columns.map((column) => (
            <td key={column.key} className={column.numeric ? 'numeric' : ''}>
              {column.render ? column.render(operation) : operation[column.key]}
            </td>
          ))}</tr>
        ))}</tbody>
      </table>
    </div>
  );
}
