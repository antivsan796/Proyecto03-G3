import { Pagination } from '@mui/material';

interface PaginationControlProps { page: number; count: number; onChange: (page: number) => void }

export default function PaginationControl({ page, count, onChange }: PaginationControlProps) {
  return <Pagination page={page} count={count} onChange={(_, next) => onChange(next)} color="primary" shape="rounded"
    showFirstButton showLastButton siblingCount={0} boundaryCount={1} size="small" aria-label="Páginas de registros"
    getItemAriaLabel={(type, itemPage, selected) => {
      if (type === 'page') return `${selected ? 'Página actual' : 'Ir a la página'} ${itemPage}`;
      return { first: 'Primera página', last: 'Última página', next: 'Página siguiente', previous: 'Página anterior',
        'start-ellipsis': 'Más páginas anteriores', 'end-ellipsis': 'Más páginas siguientes' }[type];
    }} />;
}
