import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Skeleton,
  Box,
  Typography,
} from "@mui/material";

const LogsTable = ({ logs, isLoading, onRowClick }) => {
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "success":
        return "success";
      case "error":
        return "error";
      case "warning":
        return "warning";
      default:
        return "default";
    }
  };

  const getActionColor = (action) => {
    switch (action) {
      case "Check-in":
        return "success";
      case "Check-out":
        return "info";
      case "Assign":
      case "Transfer":
        return "warning";
      case "Fault":
        return "error";
      default:
        return "default";
    }
  };

  if (isLoading) {
    return (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Time</TableCell>
              <TableCell>Action</TableCell>
              <TableCell>Plate</TableCell>
              <TableCell>Slot</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {[...Array(5)].map((_, i) => (
              <TableRow key={i}>
                <TableCell><Skeleton width={120} /></TableCell>
                <TableCell><Skeleton width={80} /></TableCell>
                <TableCell><Skeleton width={100} /></TableCell>
                <TableCell><Skeleton width={60} /></TableCell>
                <TableCell><Skeleton width={80} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  if (!logs.length) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography color="text.secondary">No logs found matching your filters.</Typography>
      </Box>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Time</TableCell>
            <TableCell>Action</TableCell>
            <TableCell>Plate Number</TableCell>
            <TableCell>Slot</TableCell>
            <TableCell>Source</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {logs.map((log) => (
            <TableRow
              key={log.id}
              hover
              onClick={() => onRowClick?.(log)}
              sx={{ cursor: onRowClick ? "pointer" : "default" }}
            >
              <TableCell>{new Date(log.eventTime).toLocaleString()}</TableCell>
              <TableCell>
                <Chip label={log.actionType} color={getActionColor(log.actionType)} size="small" />
              </TableCell>
              <TableCell>{log.plateNumber || "—"}</TableCell>
              <TableCell>{log.slotCode || "—"}</TableCell>
              <TableCell>{log.username || "System"}</TableCell>
              <TableCell>
                <Chip label={log.status} color={getStatusColor(log.status)} size="small" variant="outlined" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default LogsTable;
