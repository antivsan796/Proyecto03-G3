import { Box } from '@mui/material';

interface CategoryTextProps { value: string; limit?: number }

export default function CategoryText({ value, limit = 100 }: CategoryTextProps) {
  if (value.length <= limit) return <>{value}</>;
  return <Box component="details" sx={{ '& summary': { cursor: 'pointer', listStyle: 'none' }, '& summary::-webkit-details-marker': { display: 'none' },
    '& .less': { display: 'none' }, '&[open] .preview, &[open] .more': { display: 'none' }, '&[open] .less': { display: 'inline' } }}>
    <summary><span className="preview">{value.slice(0, limit)}… </span><Box component="span" className="more" sx={{ color: 'primary.main', textDecoration: 'underline' }}>Ver más</Box>
      <Box component="span" className="less" sx={{ color: 'primary.main', textDecoration: 'underline' }}>Ver menos</Box></summary>
    <Box component="p" sx={{ m: 0, mt: 1 }}>{value}</Box>
  </Box>;
}
