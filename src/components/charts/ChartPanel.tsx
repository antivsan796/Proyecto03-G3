import type { ReactNode } from 'react';
import { Box, Card, CardContent, Stack, Typography } from '@mui/material';

interface ChartPanelProps { title: string; subtitle: string; empty: boolean; icon: ReactNode; children: ReactNode }

export default function ChartPanel({ title, subtitle, empty, icon, children }: ChartPanelProps) {
  return <Card component="article" sx={{ height: '100%' }}><CardContent sx={{ p: 2 }}>
    <Stack direction="row" spacing={.75} sx={{ alignItems: 'center' }}>
      <Box aria-hidden="true" sx={{ display: 'flex', color: 'primary.main' }}>{icon}</Box>
      <Typography variant="h3">{title}</Typography>
    </Stack>
    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: .75, mb: 2 }}>{subtitle}</Typography>
    {empty ? <Box sx={{ height: 280, display: 'grid', placeItems: 'center', textAlign: 'center' }}><Typography color="text.secondary" variant="body2">No hay datos para graficar con estos filtros.</Typography></Box> : children}
  </CardContent></Card>;
}
