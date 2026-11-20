import { TextField } from '@mui/material';
import type { Option } from '../../types/dashboard';

interface SelectFilterProps { label: string; value: string; options: Option[]; onChange: (value: string) => void }

export default function SelectFilter({ label, value, options, onChange }: SelectFilterProps) {
  return <TextField select label={label} value={value} onChange={(event) => onChange(event.target.value)}
    slotProps={{ select: { native: true }, inputLabel: { shrink: true } }}>
    <option value="">Todos</option>
    {options.map((option) => <option value={option.value} key={option.value}>{option.label}</option>)}
  </TextField>;
}
