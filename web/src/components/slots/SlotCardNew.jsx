import { Box, Card, Stack, Typography, Fade } from "@mui/material";
import { memo, useEffect, useState } from "react";

const getStatusColor = (status) => {
  switch (status) {
    case "Occupied": return "#ef4444"; // Red
    case "Reserved": return "#f59e0b"; // Yellow
    case "Fault": return "#3f3f46"; // Dark
    case "Available":
    default: return "#22c55e"; // Green
  }
};

const SlotCardNew = ({ slot, onClick, isRecentlyUpdated }) => {
  const accentColor = getStatusColor(slot.logicStatus);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    if (isRecentlyUpdated) {
      setPulse(true);
      const timer = setTimeout(() => setPulse(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isRecentlyUpdated]);

  return (
    <Card
      onClick={() => onClick && onClick(slot)}
      sx={{
        position: 'relative',
        p: '16px 16px 16px 20px',
        border: '1px solid rgba(0,0,0,0.08)',
        boxShadow: pulse ? `0 0 16px ${accentColor}40` : '0 1px 2px rgba(0,0,0,0.02)',
        backgroundColor: '#ffffff',
        cursor: 'pointer',
        transition: 'all 0.25s ease',
        animation: pulse && slot.logicStatus === 'Occupied' ? 'pulse 1s infinite' : 'none',
        '&:hover': {
          borderColor: 'rgba(0,0,0,0.16)',
          transform: 'translateY(-2px)',
          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
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
          width: '5px',
          backgroundColor: accentColor,
          transition: 'background-color 0.5s ease',
        }}
      />

      <Stack spacing={0.5}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="subtitle1" sx={{ color: '#0a0a0a', fontWeight: 600 }}>
            {slot.name || `Slot ${slot.id}`}
          </Typography>
          <Typography variant="caption" sx={{ color: accentColor, fontWeight: 700, fontSize: '0.7rem', textTransform: 'uppercase' }}>
            {slot.logicStatus === 'Occupied' ? 'Đang đỗ' : slot.logicStatus === 'Available' ? 'Trống' : slot.logicStatus === 'Reserved' ? 'Đã đặt' : 'Lỗi'}
          </Typography>
        </Stack>
        
        {/* Dynamic content based on status */}
        {slot.logicStatus === 'Occupied' && (
          <Box sx={{ mt: 1 }}>
            <Typography variant="caption" sx={{ color: '#0a0a0a', fontWeight: 600, display: 'block' }}>
              {slot.plateNumber || 'Không rõ biển số'}
            </Typography>
            <Typography variant="caption" sx={{ color: '#697386' }}>
              {slot.entryTime ? new Date(slot.entryTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '---'}
            </Typography>
          </Box>
        )}

        {slot.logicStatus === 'Reserved' && (
          <Box sx={{ mt: 1 }}>
            <Typography variant="caption" sx={{ color: '#697386' }}>Đang chờ...</Typography>
          </Box>
        )}

        {slot.logicStatus === 'Fault' && (
          <Box sx={{ mt: 1 }}>
            <Typography variant="caption" sx={{ color: '#ef4444', fontWeight: 600 }}>Lỗi cảm biến</Typography>
          </Box>
        )}

        {slot.logicStatus === 'Available' && (
          <Box sx={{ mt: 1 }}>
            <Typography variant="caption" sx={{ color: '#697386' }}>Còn trống</Typography>
          </Box>
        )}
      </Stack>
    </Card>
  );
};

export default memo(SlotCardNew);
