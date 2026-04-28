import React from 'react';
import { Stack, Skeleton } from '@mui/material';
import KPICard from './KPICard';
import { useParkingStats } from '../hooks/useParkingStats';

const KPIStrip = () => {
  const { data: stats, isLoading } = useParkingStats();

  if (isLoading) {
    return (
      <Stack direction="row" spacing={3}>
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} variant="rectangular" height={100} sx={{ flex: 1, borderRadius: 1 }} />
        ))}
      </Stack>
    );
  }

  return (
    <Stack direction="row" spacing={3} sx={{ overflowX: 'auto', pb: 1 }}>
      <KPICard
        label="Total Capacity"
        value={stats?.totalCars || 0}
        delta="+12%"
        deltaType="success"
      />
      <KPICard
        label="Available Infrastructure"
        value={stats?.availableSlots || 0}
        delta="-2%"
        deltaType="error"
      />
      <KPICard
        label="Net Revenue (USD)"
        value={`$${(stats?.revenue || 0).toLocaleString()}`}
        delta="+5.4%"
        deltaType="success"
      />
    </Stack>
  );
};

export default KPIStrip;
