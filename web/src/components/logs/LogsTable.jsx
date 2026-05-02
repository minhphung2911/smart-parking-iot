import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, Typography, Skeleton } from "@mui/material";

const getActionColor = (action) => {
  switch (action) {
    case "Check-in": return { bg: "#dcfce7", color: "#166534" }; // Green
    case "Check-out": return { bg: "#fee2e2", color: "#991b1b" }; // Red
    case "Assign": return { bg: "#e0e7ff", color: "#3730a3" }; // Indigo
    case "Transfer": return { bg: "#dbeafe", color: "#1e40af" }; // Blue
    case "Warning":
    case "Reserved": return { bg: "#fef3c7", color: "#92400e" }; // Yellow
    case "Fault": return { bg: "#f3f4f6", color: "#1f2937" }; // Dark
    default: return { bg: "#f3f4f6", color: "#1f2937" };
  }
};

const LogsTable = ({ logs, isLoading, onRowClick }) => {
  if (isLoading) {
    return (
      <Box sx={{ mt: 2 }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} variant="rectangular" height={50} sx={{ mb: 1, borderRadius: 1 }} />
        ))}
      </Box>
    );
  }

  if (logs.length === 0) {
    return (
      <Box sx={{ py: 8, textAlign: 'center', border: '1px solid', borderColor: 'divider', borderRadius: 1, mt: 2, bgcolor: 'background.paper' }}>
        <Typography variant="body1" color="text.secondary">No activity logs found for the selected criteria.</Typography>
      </Box>
    );
  }

  return (
    <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid', borderColor: 'divider', mt: 2 }}>
      <Table size="medium">
        <TableHead sx={{ bgcolor: '#fafafa' }}>
          <TableRow>
            <TableCell sx={{ fontWeight: 600, color: 'text.secondary', width: 140 }}>TIME</TableCell>
            <TableCell sx={{ fontWeight: 600, color: 'text.secondary', width: 140 }}>ACTION</TableCell>
            <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>PLATE</TableCell>
            <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>SLOT</TableCell>
            <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>USER/SOURCE</TableCell>
            <TableCell align="right" sx={{ fontWeight: 600, color: 'text.secondary' }}>STATUS</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {logs.map(log => {
            const colorSpec = getActionColor(log.actionType);
            return (
              <TableRow 
                key={log.id}
                hover
                onClick={() => onRowClick(log)}
                sx={{ 
                  cursor: 'pointer',
                  '&:hover': { bgcolor: 'rgba(0,0,0,0.02)' }
                }}
              >
                <TableCell sx={{ color: 'text.secondary', fontWeight: 500 }}>
                   {new Date(log.eventTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </TableCell>
                <TableCell>
                  <Chip 
                    label={log.actionType} 
                    size="small" 
                    sx={{ 
                      bgcolor: colorSpec.bg, 
                      color: colorSpec.color, 
                      fontWeight: 700, 
                      fontSize: '0.7rem',
                      borderRadius: 1
                    }} 
                  />
                </TableCell>
                <TableCell sx={{ fontWeight: 600 }}>{log.plateNumber || "---"}</TableCell>
                <TableCell sx={{ color: 'text.primary', fontWeight: 500 }}>{log.slotCode || "---"}</TableCell>
                <TableCell sx={{ color: 'text.secondary' }}>{log.username || "System"}</TableCell>
                <TableCell align="right">
                   <Typography variant="body2" sx={{ color: log.status === 'Success' ? 'success.main' : 'error.main', fontWeight: 600 }}>
                     {log.status || 'Success'}
                   </Typography>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default LogsTable;
