import { Box, Slider, Stack, TextField, Typography } from '@mui/material';
import { formatMoney } from '../../utils/format';

interface AmountRangeFilterProps { value: [number, number]; min: number; max: number; onChange: (range: [number, number]) => void }

export default function AmountRangeFilter({ value, min, max, onChange }: AmountRangeFilterProps) {
  return <Box>
    <Stack direction="row" spacing={1}>
      <TextField label="Monto mínimo · USD" type="number" value={value[0]}
        slotProps={{ htmlInput: { min, max: value[1], step: .01 } }}
        onChange={(event) => onChange([Math.max(min, Math.min(value[1], Number(event.target.value))), value[1]])} />
      <TextField label="Monto máximo · USD" type="number" value={value[1]}
        slotProps={{ htmlInput: { min: value[0], max, step: .01 } }}
        onChange={(event) => onChange([value[0], Math.min(max, Math.max(value[0], Number(event.target.value)))])} />
    </Stack>
    <Box sx={{ px: 1.5, pt: .5 }}><Slider value={value} min={min} max={max || 1} step={.01} disableSwap size="small"
      getAriaLabel={(index) => index === 0 ? 'Monto mínimo' : 'Monto máximo'} getAriaValueText={formatMoney}
      onChange={(_, next) => { if (Array.isArray(next) && next.length === 2) onChange([next[0], next[1]]); }} /></Box>
    <Typography variant="caption" color="text.secondary" sx={{ fontSize: 10 }}>Rango de monto por registro</Typography>
  </Box>;
}
