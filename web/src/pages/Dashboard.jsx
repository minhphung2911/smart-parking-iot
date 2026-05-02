import { Box, Container, Grid, Stack, Typography, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import ParkingTable from "../components/ParkingTable";
import SlotGrid from "../components/SlotGrid";
import StatsCards from "../components/StatsCards";
import DashboardLayout from "../layouts/DashboardLayout";
import socket from "../socket/socket";

import { useSystemContext } from "../context/SystemContext";

const Dashboard = () => {
  const { isSocketConnected, reconnectAttempts, lastHeartbeat, apiStatus, lastUpdatedAt, systemMode, connectionState } = useSystemContext();


  return (
    <DashboardLayout
      title="Quản lý hạ tầng"
      isSocketConnected={isSocketConnected}
      activeItem="dashboard"
      onSelectMenu={(key) => {}}
      freshnessState={connectionState.toLowerCase()}
      lastUpdatedAt={lastUpdatedAt}
    >
      <Container maxWidth="xl" sx={{ mt: 2 }}>
        <Stack spacing={4}>
          {/* System Health Layer */}
          <Box sx={{ border: '1px solid', borderColor: connectionState === 'DISCONNECTED' ? 'error.light' : 'divider', borderRadius: 1, p: 2, bgcolor: connectionState === 'DISCONNECTED' ? 'rgba(255,0,0,0.02)' : 'transparent' }}>
             <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="center" spacing={2}>
                <Stack direction="row" spacing={2} alignItems="center">
                   <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: connectionState === 'CONNECTED' ? '#00d924' : (connectionState === 'SYNCING' ? '#f5a623' : '#ff0000'), animation: connectionState === 'SYNCING' ? 'pulse 1.5s infinite' : 'none' }} />
                   <Typography variant="subtitle2" sx={{ fontWeight: 700, letterSpacing: '0.05em' }}>
                      HỆ THỐNG {connectionState === 'CONNECTED' ? 'ĐÃ KẾT NỐI' : connectionState === 'SYNCING' ? 'ĐANG ĐỒNG BỘ' : 'MẤT KẾT NỐI'}
                   </Typography>
                </Stack>
                
                <Stack direction="row" spacing={3} sx={{ color: 'text.secondary' }}>
                   <Box>
                      <Typography variant="caption" display="block" sx={{ fontWeight: 600, color: 'text.muted' }}>NHỊP TIM CUỐI</Typography>
                      <Typography variant="body2">{lastHeartbeat ? lastHeartbeat.toLocaleTimeString() : '---'}</Typography>
                   </Box>
                   <Box>
                      <Typography variant="caption" display="block" sx={{ fontWeight: 600, color: 'text.muted' }}>SỐ LẦN THỬ LẠI</Typography>
                      <Typography variant="body2">{reconnectAttempts}</Typography>
                   </Box>
                   <Box>
                      <Typography variant="caption" display="block" sx={{ fontWeight: 600, color: 'text.muted' }}>TRẠNG THÁI API</Typography>
                      <Typography variant="body2" sx={{ color: apiStatus === 'online' ? 'success.main' : 'error.main', fontWeight: 600 }}>{apiStatus === 'online' ? 'TRỰC TUYẾN' : 'NGOẠI TUYẾN'}</Typography>
                   </Box>
                </Stack>
             </Stack>
             {connectionState === 'DISCONNECTED' && (
               <Alert severity="error" sx={{ mt: 2, border: 'none', bgcolor: 'transparent', p: 0 }}>
                 Kết nối hạ tầng thời gian thực bị gián đoạn. Dữ liệu hiển thị được lấy từ lần đồng bộ thành công cuối cùng.
               </Alert>
             )}
          </Box>

          {/* Header section */}
          <Box>
            <Typography variant="h5" sx={{ mb: 1, letterSpacing: '-0.02em', fontWeight: 600 }}>
              Tổng quan hạ tầng
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Giám sát thời gian thực và phân tích lưu lượng cho bãi đỗ xe của bạn.
            </Typography>
          </Box>

          {/* Metric Section */}
          <StatsCards 
            isSocketConnected={isSocketConnected} 
            systemMode={systemMode}
            connectionState={connectionState}
          />

          {/* Main Content Grid */}
          <Grid container spacing={6}>
            <Grid item xs={12} lg={7}>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                Trạng thái hệ thống trực tiếp
              </Typography>
              <SlotGrid 
                isSocketConnected={isSocketConnected} 
                systemMode={systemMode}
                connectionState={connectionState}
              />
            </Grid>
            <Grid item xs={12} lg={5}>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                Luồng hoạt động
              </Typography>
              <ParkingTable 
                isSocketConnected={isSocketConnected} 
                systemMode={systemMode}
                connectionState={connectionState}
              />
            </Grid>
          </Grid>
        </Stack>
      </Container>
    </DashboardLayout>
  );
};

export default Dashboard;