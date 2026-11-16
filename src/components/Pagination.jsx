export default function Pagination({ currentPage, totalPages, onPageChange }) {
  return (
    <nav className="pagination" aria-label="Páginas de registros">
      <button type="button" aria-label="Primera página" disabled={currentPage === 1} onClick={() => onPageChange(1)}>«</button>
      <button type="button" aria-label="Página anterior" disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)}>‹</button>
      <span aria-live="polite">Página <strong>{currentPage}</strong> de {totalPages}</span>
      <button type="button" aria-label="Página siguiente" disabled={currentPage === totalPages} onClick={() => onPageChange(currentPage + 1)}>›</button>
      <button type="button" aria-label="Última página" disabled={currentPage === totalPages} onClick={() => onPageChange(totalPages)}>»</button>
    </nav>
  );
}
