import {
  Box,
  Card,
  CardContent,
  Grid,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { getStats } from "../services/api";

const KPICard = ({ label, value, delta, isPositive, degraded, connectionState }) => {
  return (
    <Card sx={{ 
      height: '100%', 
      border: '1px solid', 
      borderColor: degraded ? '#ffebee' : 'rgba(0,0,0,0.06)', 
      boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
      bgcolor: degraded ? '#fffcfc' : '#ffffff'
    }}>
      <CardContent sx={{ p: '20px !important' }}>
        <Typography variant="caption" sx={{ color: degraded ? '#ef5350' : '#697386', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.025em' }}>
          {label}
        </Typography>
        
        {degraded ? (
           <Box sx={{ mt: 1 }}>
             <Typography variant="body2" sx={{ color: '#ef5350', fontWeight: 600 }}>
               ⚠️ Service unavailable
             </Typography>
             <Typography variant="caption" color="text.secondary">
               Link to backend interrupted
             </Typography>
           </Box>
        ) : (
          <Stack direction="row" alignItems="baseline" spacing={1} sx={{ mt: 1 }}>
            <Typography variant="h4" sx={{ fontWeight: 600, fontSize: '24px', letterSpacing: '-0.02em', color: connectionState === 'SYNCING' ? 'text.secondary' : 'text.primary' }}>
              {value}
            </Typography>
            {delta && connectionState === 'CONNECTED' && (
              <Typography variant="caption" sx={{ color: isPositive ? '#00d924' : '#ff0000', fontWeight: 600 }}>
                {delta}
              </Typography>
            )}
          </Stack>
        )}
      </CardContent>
    </Card>
  );
};

const StatsCards = ({ isSocketConnected, systemMode, connectionState }) => {
  const { data: stats = {}, isLoading, isFetching } = useQuery({
    queryKey: ["stats"],
    queryFn: getStats,
    refetchInterval: isSocketConnected ? false : 15000,
  });

  const isDegraded = systemMode === "degraded";
  const isSyncing = connectionState === "SYNCING" || (isLoading && !isDegraded);

  if (isSyncing && !isDegraded) {
    return (
      <Grid container spacing={2}>
        {[1, 2, 3].map((i) => (
          <Grid item xs={12} md={4} key={i}>
            <Skeleton variant="rounded" height={100} sx={{ bgcolor: 'rgba(0,0,0,0.04)' }} />
          </Grid>
        ))}
      </Grid>
    );
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={4}>
        <KPICard 
          label="Total Cars" 
          value={stats.occupied ?? 0} 
          delta="+12%" 
          isPositive={true} 
          degraded={isDegraded}
          connectionState={connectionState}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <KPICard 
          label="Available Slots" 
          value={stats.available ?? 0} 
          delta="-2" 
          isPositive={false} 
          degraded={isDegraded}
          connectionState={connectionState}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <KPICard 
          label="Net Revenue Today" 
          value={`$${(stats.revenueToday ?? 0).toLocaleString()}`} 
          delta="+5.4%" 
          isPositive={true} 
          degraded={isDegraded}
          connectionState={connectionState}
        />
      </Grid>
    </Grid>
  );
};

export default StatsCards;