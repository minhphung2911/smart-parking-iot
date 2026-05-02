<<<<<<< HEAD
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
        <Typography variant="body1" color="text.secondary">Không tìm thấy nhật ký hoạt động nào cho các tiêu chí đã chọn.</Typography>
=======
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
>>>>>>> 060c646655c4e2280012ae4e519582d7af9eaf4d
      </Box>
    );
  }

  return (
<<<<<<< HEAD
    <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid', borderColor: 'divider', mt: 2 }}>
      <Table size="medium">
        <TableHead sx={{ bgcolor: '#fafafa' }}>
          <TableRow>
            <TableCell sx={{ fontWeight: 600, color: 'text.secondary', width: 140 }}>THỜI GIAN</TableCell>
            <TableCell sx={{ fontWeight: 600, color: 'text.secondary', width: 140 }}>HÀNH ĐỘNG</TableCell>
            <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>BIỂN SỐ</TableCell>
            <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>VỊ TRÍ</TableCell>
            <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>NGƯỜI DÙNG/NGUỒN</TableCell>
            <TableCell align="right" sx={{ fontWeight: 600, color: 'text.secondary' }}>TRẠNG THÁI</TableCell>
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
                <TableCell sx={{ color: 'text.secondary' }}>{log.username === "System" ? "Hệ thống" : (log.username || "Hệ thống")}</TableCell>
                <TableCell align="right">
                   <Typography variant="body2" sx={{ color: log.status === 'Success' ? 'success.main' : 'error.main', fontWeight: 600 }}>
                     {log.status === 'Success' ? 'Thành công' : (log.status || 'Thành công')}
                   </Typography>
                </TableCell>
              </TableRow>
            );
          })}
=======
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
>>>>>>> 060c646655c4e2280012ae4e519582d7af9eaf4d
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default LogsTable;
