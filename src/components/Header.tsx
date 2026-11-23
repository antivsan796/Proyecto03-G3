import { AppBar, Box, Toolbar, Typography } from '@mui/material';

interface HeaderProps {
  title: string;
  logo?: string;
}

export default function Header({ title, logo }: HeaderProps) {
  return (
    <AppBar
      component="header"
      position="static"
      color="inherit"
      elevation={0}
      sx={{
        height: { xs: 62, sm: 76 },
        px: { xs: 2.25, sm: 3.5 },
        borderBottom: '1px solid #dce5e7',
        bgcolor: '#fff',
        color: '#1c343e',
      }}
    >
      <Toolbar disableGutters sx={{ minHeight: '100% !important', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 1.25 } }}>
          {logo ? (
            <Box component="img" src={logo} alt="" sx={{ width: { xs: 26, sm: 31 }, height: { xs: 26, sm: 31 }, borderRadius: 1 }} />
          ) : (
            <Box
              component="span"
              aria-hidden="true"
              sx={{
                display: 'grid',
                placeItems: 'center',
                width: { xs: 26, sm: 31 },
                height: { xs: 26, sm: 31 },
                borderRadius: 1,
                bgcolor: '#145c6e',
                color: '#fff',
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" width="23" height="23">
              <path d="M4 19h16M6 16v-5m6 5V8m6 8V5M5 8l6-4 5 1 4-3" />
              </svg>
            </Box>
          )}
          <Typography sx={{ fontSize: { xs: 10, sm: 12 }, fontWeight: 700, letterSpacing: '0.04em' }}>
            {title}
          </Typography>
        </Box>
        <Typography sx={{ fontSize: { xs: 9, sm: 12 }, color: '#5b7079' }}>
          CFN B.P. <Box component="span" aria-hidden="true" sx={{ mx: { xs: 0.5, sm: 1.25 }, color: '#adbcc1' }}>/</Box> Grupo 3
        </Typography>
      </Toolbar>
    </AppBar>
  );
}
