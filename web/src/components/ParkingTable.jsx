import {
  Box,
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Alert,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { getLogs } from "../services/api";

const ActivityTable = ({ isSocketConnected, systemMode, connectionState }) => {
  const { data: logs = [], isLoading } = useQuery({
    queryKey: ["logs"],
    queryFn: getLogs,
    refetchInterval: isSocketConnected ? false : 15000,
    placeholderData: (prev) => prev,
  });

  const formatDate = (dateStr) => {
    if (!dateStr) return "---";
    return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const isDegraded = systemMode === "degraded";
  const isSyncing = connectionState === "SYNCING" && !isDegraded;

  if (isSyncing) {
    return (
      <Box sx={{ mt: 2 }}>
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} variant="text" height={40} />
        ))}
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 2 }}>
      {isDegraded && (
        <Alert severity="warning" variant="outlined" sx={{ mb: 2, py: 0.5, border: '1px dashed' }}>
          Historical feed interrupted.
        </Alert>
      )}
      
      <TableContainer component={Box} sx={{ 
        border: '1px solid rgba(0,0,0,0.06)', 
        borderRadius: 1, 
        backgroundColor: '#ffffff',
        opacity: isDegraded ? 0.6 : 1
      }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: '#fafafa' }}>
              <TableCell sx={{ fontWeight: 600, color: '#697386', py: 1.5 }}>TIME</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#697386', py: 1.5 }}>ACTION</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#697386', py: 1.5 }}>PLATE</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#697386', py: 1.5 }}>SLOT</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {logs.map((log, i) => (
              <TableRow 
                key={log.logID || i} 
                sx={{ 
                  '&:hover': { backgroundColor: '#fafafa' },
                  transition: 'background-color 0.1s ease'
                }}
              >
                <TableCell sx={{ color: '#697386', py: 1.5 }}>{formatDate(log.eventTime)}</TableCell>
                <TableCell sx={{ fontWeight: 600, color: 'primary.main', py: 1.5 }}>{log.actionType || "System"}</TableCell>
                <TableCell sx={{ fontWeight: 500, py: 1.5 }}>{log.plateNumber || "---"}</TableCell>
                <TableCell sx={{ color: '#425466', fontWeight: 700, py: 1.5 }}>{log.slotCode || "---"}</TableCell>
              </TableRow>
            ))}
            {logs.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 4, color: '#697386' }}>
                  {isDegraded ? "Data source unavailable" : "No recent activity records."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ActivityTable;