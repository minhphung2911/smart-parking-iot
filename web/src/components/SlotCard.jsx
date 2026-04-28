import { Box, Card, Stack, Typography } from "@mui/material";
import { memo } from "react";

const SlotCard = ({ slotName, isOccupied }) => {
  const accentColor = isOccupied ? "#ff0000" : "#00d924";

  return (
    <Card
      sx={{
        position: 'relative',
        p: '16px 16px 16px 20px',
        border: '1px solid rgba(0,0,0,0.06)',
        boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
        backgroundColor: '#ffffff',
        transition: 'border-color 0.15s ease',
        '&:hover': {
          borderColor: 'rgba(0,0,0,0.12)',
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
          width: '4px',
          backgroundColor: accentColor,
        }}
      />

      <Stack>
        <Typography variant="subtitle1" sx={{ color: '#0a0a0a', fontWeight: 600 }}>
          {slotName}
        </Typography>
        <Typography variant="caption" sx={{ color: '#697386', mt: 0.5 }}>
          {isOccupied ? 'Occupied' : 'Available'}
        </Typography>
      </Stack>
    </Card>
  );
};

export default memo(SlotCard);