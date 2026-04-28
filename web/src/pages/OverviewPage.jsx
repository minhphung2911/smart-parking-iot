import React from 'react';
import { Container, Grid, Stack, Typography, Box } from '@mui/material';
import KPIStrip from '../features/parking/components/KPIStrip';
import OperationalGrid from '../features/slots/components/OperationalGrid';
import ActivityTable from '../features/logs/components/ActivityTable';

const OverviewPage = () => {
  return (
    <Container maxWidth="xl">
      <Stack spacing={6}>
        {/* Header */}
        <Box>
          <Typography variant="h3" sx={{ mb: 1 }}>
            Infrastructure Overview
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Real-time operational status and throughput monitoring for parking assets.
          </Typography>
        </Box>

        {/* KPIs */}
        <KPIStrip />

        {/* Main Content */}
        <Grid container spacing={6}>
          <Grid item xs={12} lg={7}>
            <OperationalGrid />
          </Grid>
          <Grid item xs={12} lg={5}>
            <ActivityTable />
          </Grid>
        </Grid>
      </Stack>
    </Container>
  );
};

export default OverviewPage;
