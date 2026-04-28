import React from 'react';
import { Grid, Typography, Box, Skeleton, Stack } from '@mui/material';
import SlotCard from './SlotCard';
import { useSlots } from '../hooks/useSlots';

const OperationalGrid = () => {
  const { data: slots, isLoading, error } = useSlots();

  if (isLoading) {
    return (
      <Grid container spacing={2}>
        {Array.from({ length: 8 }).map((_, i) => (
          <Grid item xs={12} sm={6} md={4} key={i}>
            <Skeleton variant="rectangular" height={64} sx={{ borderRadius: 1 }} />
          </Grid>
        ))}
      </Grid>
    );
  }

  if (error) return <Typography color="error">Failed to load infrastructure state.</Typography>;

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Live Infrastructure Monitoring
      </Typography>
      <Grid container spacing={2}>
        {slots?.map((slot) => (
          <Grid item xs={12} sm={6} md={4} key={slot.id}>
            <SlotCard id={slot.id} status={slot.status || slot.isOccupied} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default OperationalGrid;
