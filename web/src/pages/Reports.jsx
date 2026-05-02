import { Box, Container, Stack, Typography, FormControl, Select, MenuItem, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { useState, useMemo } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { useSystemContext } from "../context/SystemContext";

import { useQuery } from "@tanstack/react-query";
import { getAnalytics } from "../services/api";

import AnalyticsKPI from "../components/analytics/AnalyticsKPI";
import RevenueChart from "../components/analytics/RevenueChart";

const Reports = () => {
  const { isSocketConnected, connectionState, lastUpdatedAt } = useSystemContext();
  const [dateFilter, setDateFilter] = useState("today");

  const { data: analyticsData = {} } = useQuery({
    queryKey: ["analytics", dateFilter],
    queryFn: getAnalytics,
    refetchInterval: 30000,
  });

  const processedMetrics = useMemo(() => {
    return {
      revenueToday: analyticsData.totalRevenue || 0,
      totalCars: analyticsData.totalSessions || 0,
      bikeCount: analyticsData.bikeCount || 0,
      carCount: analyticsData.carCount || 0,
      avgFee: analyticsData.totalSessions > 0 
        ? Math.round(analyticsData.totalRevenue / analyticsData.totalSessions) 
        : 0
    };
  }, [analyticsData]);

  return (
    <DashboardLayout
      title="Báo cáo doanh thu & Thống kê"
      isSocketConnected={isSocketConnected}
      activeItem="reports"
      freshnessState={connectionState.toLowerCase()}
      lastUpdatedAt={lastUpdatedAt}
    >
      <Container maxWidth="xl" sx={{ mt: 2 }}>
        <Stack spacing={4}>
          <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems="flex-start" spacing={2}>
            <Box>
              <Typography variant="h5" sx={{ mb: 1, fontWeight: 600 }}>
                Trung tâm Báo cáo
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Phân tích dữ liệu doanh thu và lưu lượng xe theo thời gian.
              </Typography>
            </Box>

            <FormControl size="small" sx={{ minWidth: 160, bgcolor: 'background.paper' }}>
              <Select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              >
                <MenuItem value="today">Hôm nay</MenuItem>
                <MenuItem value="7days">Tuần này</MenuItem>
                <MenuItem value="month">Tháng này</MenuItem>
                <MenuItem value="custom">Tùy chỉnh</MenuItem>
              </Select>
            </FormControl>
          </Stack>

          {/* KPI Cards */}
          <Grid container spacing={2}>
             <Grid item xs={12} sm={6} md={2.4}>
                <Paper sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="caption" color="text.secondary" fontWeight={700}>DOANH THU</Typography>
                  <Typography variant="h6">{processedMetrics.revenueToday.toLocaleString()}đ</Typography>
                </Paper>
             </Grid>
             <Grid item xs={12} sm={6} md={2.4}>
                <Paper sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="caption" color="text.secondary" fontWeight={700}>TỔNG LƯỢT XE</Typography>
                  <Typography variant="h6">{processedMetrics.totalCars}</Typography>
                </Paper>
             </Grid>
             <Grid item xs={12} sm={6} md={2.4}>
                <Paper sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="caption" color="text.secondary" fontWeight={700}>XE MÁY</Typography>
                  <Typography variant="h6">{processedMetrics.bikeCount}</Typography>
                </Paper>
             </Grid>
             <Grid item xs={12} sm={6} md={2.4}>
                <Paper sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="caption" color="text.secondary" fontWeight={700}>Ô TÔ</Typography>
                  <Typography variant="h6">{processedMetrics.carCount}</Typography>
                </Paper>
             </Grid>
             <Grid item xs={12} sm={6} md={2.4}>
                <Paper sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="caption" color="text.secondary" fontWeight={700}>TB MỖI XE</Typography>
                  <Typography variant="h6">{processedMetrics.avgFee.toLocaleString()}đ</Typography>
                </Paper>
             </Grid>
          </Grid>

          <Grid container spacing={3}>
            <Grid item xs={12} lg={8}>
               <RevenueChart data={analyticsData.revenueTrend} />
            </Grid>
            <Grid item xs={12} lg={4}>
               <TableContainer component={Paper} sx={{ border: '1px solid rgba(0,0,0,0.06)', boxShadow: 'none' }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700 }}>Ngày</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Lượt xe</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Doanh thu</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {(analyticsData.dailyStats || []).map((row) => (
                        <TableRow key={row.date}>
                          <TableCell>{row.date}</TableCell>
                          <TableCell>{row.cars}</TableCell>
                          <TableCell>{(row.revenue / 1000000).toFixed(1)}tr</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
               </TableContainer>
            </Grid>
          </Grid>
        </Stack>
      </Container>
    </DashboardLayout>
  );
};

export default Reports;
