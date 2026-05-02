import { Card, CardContent, Grid, Stack, Typography, Box } from "@mui/material";

const StatBox = ({ label, count, colorHex }) => (
  <Card sx={{ flex: 1, border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 1px 2px rgba(0,0,0,0.02)', position: 'relative', overflow: 'hidden' }}>
    <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', bgcolor: colorHex }} />
    <CardContent sx={{ p: '24px !important' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="caption" sx={{ color: '#697386', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {label}
        </Typography>
      </Stack>
      <Typography variant="h3" sx={{ mt: 2, fontWeight: 700, color: '#0a0a0a' }}>
        {count}
      </Typography>
    </CardContent>
  </Card>
);

const LogsStats = ({ stats }) => {
  return (
    <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
      <StatBox label="Lượt vào hôm nay" count={stats.checkins || 0} colorHex="#22c55e" />
      <StatBox label="Lượt ra hôm nay" count={stats.checkouts || 0} colorHex="#ef4444" />
      <StatBox label="Thao tác thủ công" count={stats.manual || 0} colorHex="#3b82f6" />
      <StatBox label="Sự kiện lỗi" count={stats.faults || 0} colorHex="#3f3f46" />
    </Stack>
  );
};

export default LogsStats;
