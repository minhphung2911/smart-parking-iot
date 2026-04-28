import React, { useEffect } from 'react';
import { Box, AppBar, Toolbar, Typography, Container, Stack, Divider } from '@mui/material';
import { colors } from '../design-system/tokens';
import { socket } from '../lib/socket';

export const AppShell = ({ children }) => {
  useEffect(() => {
    socket.connect();
    return () => socket.disconnect();
  }, []);

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          backgroundColor: colors.background,
          borderBottom: `1px solid ${colors.border}`,
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: 1,
                backgroundColor: colors.primary,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '18px',
              }}
            >
              P
            </Box>
            <Typography variant="body2" sx={{ fontWeight: 600, color: colors.text.primary }}>
              Infrastructure Manager
            </Typography>
          </Stack>
          
          <Stack direction="row" alignItems="center" spacing={1}>
            <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: colors.success }} />
            <Typography variant="caption" sx={{ color: colors.text.muted }}>
              Production Cluster: Live
            </Typography>
          </Stack>
        </Toolbar>
      </AppBar>

      <Box component="main" sx={{ flexGrow: 1, pt: 4, pb: 8 }}>
        {children}
      </Box>

      {/* Accessibility announcement area */}
      <Box className="sr-only" aria-live="polite" sx={{ display: 'none' }} />
    </Box>
  );
};
