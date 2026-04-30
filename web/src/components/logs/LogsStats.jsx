import { Box, Card, CardContent, Typography, Grid } from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import BuildIcon from "@mui/icons-material/Build";
import ErrorIcon from "@mui/icons-material/Error";

const LogsStats = ({ stats }) => {
  const items = [
    { label: "Check-ins", value: stats.checkins, icon: <LoginIcon />, color: "success" },
    { label: "Check-outs", value: stats.checkouts, icon: <LogoutIcon />, color: "info" },
    { label: "Manual Ops", value: stats.manual, icon: <BuildIcon />, color: "warning" },
    { label: "Faults", value: stats.faults, icon: <ErrorIcon />, color: "error" },
  ];

  return (
    <Grid container spacing={2}>
      {items.map((item) => (
        <Grid item xs={6} md={3} key={item.label}>
          <Card>
            <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box color={`${item.color}.main`}>{item.icon}</Box>
              <Box>
                <Typography variant="h6" fontWeight={600}>
                  {item.value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.label}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default LogsStats;
