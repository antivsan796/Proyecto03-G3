import type { ReactNode } from 'react';
import { Box, Card, CardContent, Stack, Typography } from '@mui/material';
import { formatMoney, formatNumber } from '../utils/format';

interface KpiCardProps { title: string; value: number; unit?: string; helperText: string; icon: ReactNode }

export default function KpiCard({ title, value, unit, helperText, icon }: KpiCardProps) {
  return <Card component="article" aria-label={title} sx={{ bgcolor: 'primary.main', color: 'white', height: '100%', border: 0 }}>
    <CardContent sx={{ p: 2.5 }}><Stack direction="row" spacing={1} sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
      <Stack direction="row" spacing={.75} sx={{ alignItems: 'center', minWidth: 0 }}>
        <Box aria-hidden="true" sx={{ display: 'flex', flexShrink: 0, opacity: .8 }}>{icon}</Box>
        <Typography variant="h2" sx={{ fontSize: 13, fontWeight: 400 }}>{title}</Typography>
      </Stack>
      <Typography variant="caption" sx={{ opacity: .7 }}>{unit || 'N.º'}</Typography>
    </Stack>
      <Typography className="kpi-value" sx={{ fontSize: { xs: 28, md: 32 }, fontWeight: 600, letterSpacing: '-0.045em', my: 1.5, overflowWrap: 'anywhere', fontVariantNumeric: 'tabular-nums' }}>
        {unit === 'USD' ? formatMoney(value) : formatNumber(value)}
      </Typography>
      <Typography variant="caption" sx={{ color: '#daecf0' }}>{helperText}</Typography>
    </CardContent>
  </Card>;
}
