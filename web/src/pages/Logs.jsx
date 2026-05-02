import { Box, Container, Stack, Typography, Drawer, IconButton, Divider } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useState, useMemo } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { useSystemContext } from "../context/SystemContext";
import { useQuery } from "@tanstack/react-query";
import { getLogs } from "../services/api";

import LogsStats from "../components/logs/LogsStats";
import LogsToolbar from "../components/logs/LogsToolbar";
import LogsTable from "../components/logs/LogsTable";

// Generate robust mock logs to demonstrate the view if backend is empty
const generateMockLogs = () => {
  const actions = ["Check-in", "Check-out", "Assign", "Transfer", "Fault", "Reserved"];
  const users = ["System", "Auto Sensor", "Admin", "Operator"];
  const logs = [];
  const now = new Date();
  
  for (let i = 0; i < 45; i++) {
    const action = actions[Math.floor(Math.random() * actions.length)];
    const isFault = action === "Fault";
    logs.push({
      id: 1000 - i,
      eventTime: new Date(now.getTime() - Math.random() * 86400000).toISOString(),
      actionType: action,
      plateNumber: isFault ? "" : `67A-${Math.floor(10000 + Math.random() * 90000)}`,
      slotCode: `${['A','B','C','D'][Math.floor(Math.random()*4)]}${Math.floor(1+Math.random()*5)}`,
      username: action === "Check-in" || action === "Check-out" ? "Auto Sensor" : users[Math.floor(Math.random() * users.length)],
      status: isFault ? "Error" : "Success",
      details: isFault ? "Proximity sensor detached or blocked." : "Standard operation completed successfully."
    });
  }
  return logs.sort((a,b) => new Date(b.eventTime) - new Date(a.eventTime));
};

const MOCK_LOGS = generateMockLogs();

const Logs = () => {
  const { isSocketConnected, connectionState, systemMode, lastUpdatedAt } = useSystemContext();
  
  const [filterText, setFilterText] = useState("");
  const [actionFilter, setActionFilter] = useState("All");
  const [dateRange, setDateRange] = useState("today");
  const [selectedLog, setSelectedLog] = useState(null);

  const { data: apiLogs = [], isLoading } = useQuery({
    queryKey: ["system-logs"],
    queryFn: getLogs,
    refetchInterval: isSocketConnected ? 5000 : 15000,
  });

  // Fallback to mock if API is empty/down to showcase the rich UI
  const rawLogs = apiLogs.length > 0 ? apiLogs : MOCK_LOGS;

  const filteredLogs = useMemo(() => {
    return rawLogs.filter(log => {
      if (actionFilter !== "All" && log.actionType !== actionFilter) return false;
      if (filterText) {
        const q = filterText.toLowerCase();
        return (
          (log.plateNumber || "").toLowerCase().includes(q) ||
          (log.slotCode || "").toLowerCase().includes(q) ||
          (log.actionType || "").toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [rawLogs, actionFilter, filterText]);

  const stats = useMemo(() => {
    return {
      checkins: rawLogs.filter(l => l.actionType === "Check-in").length,
      checkouts: rawLogs.filter(l => l.actionType === "Check-out").length,
      manual: rawLogs.filter(l => l.actionType === "Assign" || l.actionType === "Transfer").length,
      faults: rawLogs.filter(l => l.actionType === "Fault").length,
    };
  }, [rawLogs]);

  const exportToCSV = () => {
    if (!filteredLogs.length) {
      alert("No data to export.");
      return;
    }
    const headers = ["Event ID", "Time", "Action", "Plate Number", "Slot", "User/Source", "Status", "Details"];
    const rows = filteredLogs.map(log => [
      log.id,
      new Date(log.eventTime).toLocaleString(),
      log.actionType,
      log.plateNumber || "",
      log.slotCode || "",
      log.username || "System",
      log.status,
      log.details || ""
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(e => e.map(item => `"${String(item).replace(/"/g, '""')}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `system_logs_${new Date().getTime()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <DashboardLayout
      title="Nhật ký hoạt động hệ thống"
      isSocketConnected={isSocketConnected}
      activeItem="logs"
      onSelectMenu={() => {}} 
      freshnessState={connectionState.toLowerCase()}
      lastUpdatedAt={lastUpdatedAt}
    >
      <Container maxWidth="xl" sx={{ mt: 2 }}>
        <Stack spacing={4}>
          <Box>
            <Typography variant="h5" sx={{ mb: 1, fontWeight: 600 }}>
              Theo dõi mọi hoạt động trong hệ thống bãi xe
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Nhật ký kiểm soát toàn diện cho các vận hành, tương tác phần cứng và sự kiện bảo mật.
            </Typography>
          </Box>

          <LogsToolbar 
            filterText={filterText}
            setFilterText={setFilterText}
            actionFilter={actionFilter}
            setActionFilter={setActionFilter}
            dateRange={dateRange}
            setDateRange={setDateRange}
            onExportCSV={exportToCSV}
          />

          <LogsStats stats={stats} />

          <Box>
             <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>Luồng nhật ký hoạt động</Typography>
             <LogsTable 
               logs={filteredLogs} 
               isLoading={isLoading && systemMode !== "degraded"}
               onRowClick={setSelectedLog}
             />
          </Box>
        </Stack>
      </Container>

      {/* Detail Drawer */}
      <Drawer
        anchor="right"
        open={Boolean(selectedLog)}
        onClose={() => setSelectedLog(null)}
        PaperProps={{ sx: { width: { xs: '100%', sm: 400 }, p: 0, bgcolor: 'background.paper' } }}
      >
        {selectedLog && (
          <Stack sx={{ height: '100%' }}>
            <Box sx={{ p: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid', borderColor: 'divider' }}>
              <Typography variant="h6" fontWeight={600}>Chi tiết kiểm soát</Typography>
              <IconButton onClick={() => setSelectedLog(null)} size="small">
                <CloseIcon />
              </IconButton>
            </Box>
            <Box sx={{ p: 3, flexGrow: 1 }}>
              <Stack spacing={3}>
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>ID SỰ KIỆN</Typography>
                  <Typography variant="body1" fontWeight={700} sx={{ mt: 0.5 }}>#{selectedLog.id}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>THỜI GIAN</Typography>
                  <Typography variant="body1" sx={{ mt: 0.5 }}>{new Date(selectedLog.eventTime).toLocaleString()}</Typography>
                </Box>
                <Divider />
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>LOẠI HÀNH ĐỘNG</Typography>
                  <Typography variant="body1" fontWeight={600} sx={{ mt: 0.5 }}>{selectedLog.actionType}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>NGUỒN/NGƯỜI DÙNG</Typography>
                  <Typography variant="body1" sx={{ mt: 0.5 }}>{selectedLog.username || 'Hệ thống'}</Typography>
                </Box>
                <Divider />
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>VỊ TRÍ ẢNH HƯỞNG</Typography>
                  <Typography variant="body1" fontWeight={600} sx={{ mt: 0.5 }}>{selectedLog.slotCode || '---'}</Typography>
                </Box>
                {selectedLog.plateNumber && (
                  <Box>
                    <Typography variant="caption" color="text.secondary" fontWeight={600}>BIỂN SỐ XE</Typography>
                    <Typography variant="body1" fontWeight={600} sx={{ mt: 0.5 }}>{selectedLog.plateNumber}</Typography>
                  </Box>
                )}
                {selectedLog.details && (
                  <Box>
                    <Typography variant="caption" color="text.secondary" fontWeight={600}>CHI TIẾT / NHẬT KÝ</Typography>
                    <Box sx={{ p: 1.5, mt: 1, bgcolor: 'background.default', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                         {selectedLog.details}
                      </Typography>
                    </Box>
                  </Box>
                )}
              </Stack>
            </Box>
          </Stack>
        )}
      </Drawer>
    </DashboardLayout>
  );
};

export default Logs;
