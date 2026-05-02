import { Box, Grid, Skeleton, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip } from "@mui/material";
import { useState, useEffect, useRef } from "react";
import SlotCardNew from "./SlotCardNew";

const getStatusColor = (status) => {
  switch (status) {
    case "Occupied": return "error";
    case "Reserved": return "warning";
    case "Fault": return "default";
    case "Available":
    default: return "success";
  }
};

const SlotGridNew = ({ slots, isLoading, onSlotClick, viewMode }) => {
  // Track recently updated slots for highlighting/pulsing
  const [highlightedIds, setHighlightedIds] = useState({});
  const lastStateMapRef = useRef(new Map());

  useEffect(() => {
    if (!slots.length) return;

    const currentMap = new Map();
    const changes = {};

    slots.forEach(slot => {
      const id = String(slot.id || slot.slotNumber);
      const stateStr = `${slot.logicStatus}-${slot.plateNumber}`;
      currentMap.set(id, stateStr);

      const oldStateStr = lastStateMapRef.current.get(id);
      if (oldStateStr && oldStateStr !== stateStr) {
        changes[id] = true;
      }
    });

    if (Object.keys(changes).length > 0) {
      setHighlightedIds(prev => ({ ...prev, ...changes }));
      setTimeout(() => {
        setHighlightedIds(prev => {
          const next = { ...prev };
          Object.keys(changes).forEach(id => delete next[id]);
          return next;
        });
      }, 2000);
    }

    lastStateMapRef.current = currentMap;
  }, [slots]);


  if (isLoading) {
    return (
      <Grid container spacing={2}>
        {Array.from({ length: 12 }).map((_, i) => (
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={i}>
            <Skeleton variant="rectangular" height={90} sx={{ borderRadius: 1 }} />
          </Grid>
        ))}
      </Grid>
    );
  }

  if (slots.length === 0) {
    return (
      <Box sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">Không tìm thấy vị trí đỗ xe nào khớp với tiêu chí.</Typography>
      </Box>
    );
  }

  if (viewMode === 'Table') {
    return (
      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
        <Table size="small">
          <TableHead sx={{ bgcolor: 'background.default' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>MÃ ĐỊNH DANH</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>TRẠNG THÁI</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>BIỂN SỐ</TableCell>
              <TableCell align="right" sx={{ fontWeight: 600 }}>THỜI LƯỢNG (PHÚT)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {slots.map(slot => {
              const pulse = highlightedIds[slot.id];
              let duration = "---";
              if (slot.logicStatus === 'Occupied' && slot.entryTime) {
                 const diff = Math.floor((new Date() - new Date(slot.entryTime)) / 60000);
                 duration = diff >= 0 ? diff : 0;
              }

              return (
                <TableRow 
                  key={slot.id}
                  hover
                  onClick={() => onSlotClick(slot)}
                  sx={{ 
                    cursor: 'pointer',
                    bgcolor: pulse ? 'rgba(25,118,210,0.05)' : 'inherit',
                    transition: 'background-color 0.5s ease'
                  }}
                >
                  <TableCell sx={{ fontWeight: 600 }}>{slot.name || `Chỗ ${slot.id}`}</TableCell>
                  <TableCell>
                    <Chip 
                      label={slot.logicStatus === 'Occupied' ? 'Đang đỗ' : slot.logicStatus === 'Available' ? 'Trống' : slot.logicStatus === 'Reserved' ? 'Đã đặt' : 'Lỗi'} 
                      size="small" 
                      color={getStatusColor(slot.logicStatus)} 
                      variant={slot.logicStatus === 'Available' ? 'outlined' : 'filled'} 
                      sx={{ fontWeight: 600, fontSize: '0.7rem' }} 
                    />
                  </TableCell>
                  <TableCell sx={{ color: 'text.secondary', fontWeight: 500 }}>{slot.logicStatus === 'Occupied' ? (slot.plateNumber || 'Không rõ') : '---'}</TableCell>
                  <TableCell align="right" sx={{ color: 'text.secondary' }}>{duration}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  // Grid View Default
  return (
    <Grid container spacing={2}>
      {slots.map((slot) => {
        const id = String(slot.id || slot.slotNumber);
        return (
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={id}>
            <SlotCardNew 
              slot={slot} 
              isRecentlyUpdated={highlightedIds[id]} 
              onClick={onSlotClick} 
            />
          </Grid>
        );
      })}
    </Grid>
  );
};

export default SlotGridNew;
