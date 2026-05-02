import { useEffect, useMemo, useState } from "react";
import {
  AppBar,
  Avatar,
  Box,
  CircularProgress,
  Divider,
  IconButton,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";

const Header = ({
  title,
  isSocketConnected,
  onMenuClick,
  showMenuButton,
  freshnessState = "live",
  lastUpdatedAt,
  isSyncing = false,
}) => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  const formattedTime = useMemo(() => {
    return now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  }, [now]);

  const freshnessConfig =
    freshnessState === "syncing"
      ? { label: "Đang đồng bộ", color: "warning.main", bg: "rgba(237,108,2,0.14)" }
      : freshnessState === "delayed"
      ? { label: "Bị trễ", color: "warning.main", bg: "rgba(237,108,2,0.14)" }
      : freshnessState === "stale"
      ? { label: "Cũ", color: "error.main", bg: "rgba(211,47,47,0.12)" }
      : { label: "Trực tiếp", color: "success.main", bg: "rgba(46,125,50,0.14)" };

  const lastUpdatedLabel = lastUpdatedAt
    ? new Date(lastUpdatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : "--:--";

  return (
    <AppBar
      position="sticky"
      elevation={0}
      color="inherit"
      sx={{
        borderBottom: "1px solid",
        borderColor: "divider",
        bgcolor: "rgba(255,255,255,0.85)",
        backdropFilter: "blur(6px)",
      }}
    >
      <Toolbar sx={{ minHeight: 72, px: { xs: 2, md: 3 } }}>
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ flexGrow: 1 }}>
          {showMenuButton ? (
            <IconButton color="primary" onClick={onMenuClick} sx={{ display: { lg: "none" } }}>
              <MenuRoundedIcon />
            </IconButton>
          ) : null}
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
              Tổng quan
            </Typography>
            <Typography variant="h5">{title}</Typography>
          </Box>
        </Stack>

        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            sx={{
              px: 1.15,
              py: 0.55,
              borderRadius: 2,
              bgcolor: freshnessConfig.bg,
              color: freshnessConfig.color,
            }}
          >
            {isSyncing ? <CircularProgress size={12} thickness={5} color="inherit" /> : null}
            <Typography variant="caption" sx={{ fontWeight: 700 }}>
              {freshnessConfig.label}
            </Typography>
          </Stack>

          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            sx={{ px: 1.25, py: 0.65, borderRadius: 2, bgcolor: "rgba(255,255,255,0.7)" }}
          >
            <Box
              sx={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                bgcolor: isSocketConnected ? "success.main" : "error.main",
                boxShadow: isSocketConnected
                  ? "0 0 0 6px rgba(46, 125, 50, 0.16)"
                  : "0 0 0 4px rgba(211, 47, 47, 0.12)",
                animation: isSocketConnected ? "pulseDot 1.8s ease-in-out infinite" : "none",
              }}
            />
            <Box>
              <Typography variant="caption" color="text.secondary" display="block">
                Thời gian thực
              </Typography>
              <Typography variant="body2" fontWeight={700}>
                {isSocketConnected ? "Đã kết nối" : "Mất kết nối"}
              </Typography>
            </Box>
          </Stack>

          <Divider orientation="vertical" flexItem sx={{ borderColor: "divider" }} />

          <Box
            sx={{
              px: 1.5,
              py: 0.8,
              borderRadius: 2,
              bgcolor: "rgba(255,255,255,0.78)",
              border: "1px solid",
              borderColor: "rgba(148,163,184,0.3)",
              minWidth: 116,
              textAlign: "center",
            }}
          >
            <Typography variant="caption" color="text.secondary" display="block">
              Giờ địa phương
            </Typography>
            <Typography variant="body2" fontWeight={700} letterSpacing={0.2}>
              {formattedTime}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Cập nhật {lastUpdatedLabel}
            </Typography>
          </Box>

          <Avatar sx={{ bgcolor: "primary.main", width: 36, height: 36 }}>SP</Avatar>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default Header;