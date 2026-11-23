import { TextField } from '@mui/material';

interface DateFilterProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  min: string;
  max: string;
  error?: boolean;
}

export default function DateFilter({ label, value, onChange, min, max, error }: DateFilterProps) {
  return <TextField label={label} type="date" value={value} error={error}
    onChange={(event) => onChange(event.target.value)}
    slotProps={{ inputLabel: { shrink: true }, htmlInput: { min, max } }} />;
}
