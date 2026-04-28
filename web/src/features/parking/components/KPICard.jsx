import React from 'react';
import { Card, Typography, Stack, Box } from '@mui/material';
import { colors } from '../../../design-system/tokens';

const KPICard = ({ label, value, delta, deltaType = 'neutral' }) => {
  const isPositive = deltaType === 'success';
  const isNegative = deltaType === 'error';

  return (
    <Card
      sx={{
        flex: 1,
        p: 2.5,
        minWidth: '200px',
        transition: 'border-color 0.15s ease',
        '&:hover': {
          borderColor: colors.text.muted,
        },
      }}
    >
      <Stack spacing={1}>
        <Typography variant="caption" sx={{ color: colors.text.muted, textTransform: 'uppercase', letterSpacing: '0.025em' }}>
          {label}
        </Typography>
        <Stack direction="row" alignItems="baseline" spacing={1.5}>
          <Typography variant="h4" sx={{ fontSize: '28px', fontWeight: 600 }}>
            {value}
          </Typography>
          {delta && (
            <Typography
              variant="caption"
              sx={{
                fontWeight: 600,
                color: isPositive ? colors.success : isNegative ? colors.error : colors.text.muted,
              }}
            >
              {delta}
            </Typography>
          )}
        </Stack>
      </Stack>
    </Card>
  );
};

export default KPICard;
