import { Card, CardContent, Stack, Typography, Box, Grid } from "@mui/material";
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

const KPICard = ({ title, value, compareText, isPositive }) => (
  <Card sx={{ height: '100%', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }}>
    <CardContent sx={{ p: '24px !important' }}>
      <Typography variant="caption" sx={{ color: '#697386', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {title}
      </Typography>
      <Typography variant="h4" sx={{ mt: 1, mb: 1, fontWeight: 700, color: '#0a0a0a' }}>
        {value}
      </Typography>
      <Stack direction="row" alignItems="center" spacing={0.5}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          bgcolor: isPositive ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)', 
          color: isPositive ? '#16a34a' : '#dc2626',
          borderRadius: 1, 
          px: 0.5, 
          py: 0.25 
        }}>
          {isPositive ? <TrendingUpIcon sx={{ fontSize: 14, mr: 0.5 }} /> : <TrendingDownIcon sx={{ fontSize: 14, mr: 0.5 }} />}
          <Typography variant="caption" sx={{ fontWeight: 700, fontSize: '0.7rem' }}>
            {compareText}
          </Typography>
        </Box>
        <Typography variant="caption" color="text.secondary" sx={{ ml: 0.5, fontSize: '0.75rem' }}>
          so với hôm qua
        </Typography>
      </Stack>
    </CardContent>
  </Card>
);

const AnalyticsKPI = ({ metrics }) => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={3}>
        <KPICard title="Tổng lượt xe" value={metrics.totalCars || "152"} compareText="+12%" isPositive={true} />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <KPICard title="Doanh thu ngày" value={`${metrics.revenue || "245"} VNĐ`} compareText="+8%" isPositive={true} />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <KPICard title="Thời gian đỗ TB" value={metrics.avgDuration || "1h 48m"} compareText="-5m" isPositive={false} />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <KPICard title="Tỷ lệ lấp đầy cao nhất" value={`${metrics.occupancy || "82"}%`} compareText="+3%" isPositive={true} />
      </Grid>
    </Grid>
  );
};

export default AnalyticsKPI;
