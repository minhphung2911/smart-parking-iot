import { Box, Container, Stack, Typography, FormControl, Select, MenuItem, Grid } from "@mui/material";
import { useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { useSystemContext } from "../context/SystemContext";

import { useQuery } from "@tanstack/react-query";
import { getAnalytics } from "../services/api";

import AnalyticsKPI from "../components/analytics/AnalyticsKPI";
import HourlyChart from "../components/analytics/HourlyChart";
import RevenueChart from "../components/analytics/RevenueChart";
import SlotUsageChart from "../components/analytics/SlotUsageChart";
import InsightPanel from "../components/analytics/InsightPanel";

const Analytics = () => {
  const { isSocketConnected, connectionState, lastUpdatedAt } = useSystemContext();
  const [dateFilter, setDateFilter] = useState("today");

  const { data: analyticsData = {} } = useQuery({
    queryKey: ["analytics", dateFilter],
    queryFn: getAnalytics,
    refetchInterval: isSocketConnected ? 15000 : false,
  });

  const processedMetrics = {
    totalCars: analyticsData.totalSessions || 0,
    revenue: analyticsData.totalRevenue || 0,
    avgDuration: "1h 48m", // Placeholder for actual backend aggregation
    occupancy: "82"        // Placeholder for actual backend aggregation
  };

  return (
    <DashboardLayout
      title="Parking Analytics Dashboard"
      isSocketConnected={isSocketConnected}
      activeItem="analytics"
      freshnessState={connectionState.toLowerCase()}
      lastUpdatedAt={lastUpdatedAt}
    >
      <Container maxWidth="xl" sx={{ mt: 2 }}>
        <Stack spacing={4}>
          <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems="flex-start" spacing={2}>
            <Box>
              <Typography variant="h5" sx={{ mb: 1, fontWeight: 600 }}>
                Business & Usage Intelligence
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Turn parking data into actionable insights for revenue and operation optimization.
              </Typography>
            </Box>

            <FormControl size="small" sx={{ minWidth: 160, bgcolor: 'background.paper' }}>
              <Select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                displayEmpty
              >
                <MenuItem value="today">Today</MenuItem>
                <MenuItem value="7days">Last 7 Days</MenuItem>
                <MenuItem value="month">This Month</MenuItem>
                <MenuItem value="custom">Custom Range</MenuItem>
              </Select>
            </FormControl>
          </Stack>

          <AnalyticsKPI metrics={processedMetrics} />

          <Grid container spacing={3}>
            <Grid item xs={12} lg={8}>
              <HourlyChart />
            </Grid>
            <Grid item xs={12} lg={4}>
              <InsightPanel />
            </Grid>
            
            <Grid item xs={12} lg={6}>
              <RevenueChart />
            </Grid>
            <Grid item xs={12} lg={6}>
              <SlotUsageChart />
            </Grid>
          </Grid>
        </Stack>
      </Container>
    </DashboardLayout>
  );
};

export default Analytics;
