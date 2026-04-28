import React, { memo } from 'react';
import { Box, Card, Typography, Stack } from '@mui/material';
import { colors } from '../../../design-system/tokens';

const SlotCard = ({ id, status }) => {
  const isOccupied = status === 'occupied' || status === true;

  return (
    <Card
      sx={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        p: 2,
        height: '64px',
        transition: 'border-color 0.15s ease',
        '&:hover': {
          borderColor: colors.text.muted,
        },
      }}
    >
      {/* Left status bar */}
      <Box
        sx={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: '3px',
          backgroundColor: isOccupied ? colors.error : colors.success,
        }}
      />

      <Stack sx={{ ml: 1 }}>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          Slot {id}
        </Typography>
        <Typography variant="caption" sx={{ color: colors.text.muted }}>
          {isOccupied ? 'Occupied' : 'Available'}
        </Typography>
      </Stack>
    </Card>
  );
};

export default memo(SlotCard);
