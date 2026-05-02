import {
  Box,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import LocalParkingRoundedIcon from "@mui/icons-material/LocalParkingRounded";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import InsightsRoundedIcon from "@mui/icons-material/InsightsRounded";

const drawerWidth = 240;

const navGroups = [
  {
    title: "CHÍNH",
    items: [
      { key: "dashboard", label: "Bảng điều khiển", icon: <DashboardRoundedIcon /> },
      { key: "parking-slots", label: "Vị trí đỗ xe", icon: <LocalParkingRoundedIcon /> },
    ],
  },
  {
    title: "HỆ THỐNG",
    items: [
      { key: "logs", label: "Nhật ký", icon: <ReceiptLongRoundedIcon /> },
      { key: "reports", label: "Báo cáo", icon: <InsightsRoundedIcon /> },
    ],
  },
];

const SidebarContent = ({ onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const activeItem = location.pathname.substring(1) || "parking-slots";

  const handleSelect = (key) => {
    navigate(`/${key}`);
    if (onClose) onClose();
  };

  return (
    <Box
      sx={{
        height: "100%",
        bgcolor: "#0f172a",
        color: "#e2e8f0",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Toolbar>
        <Typography variant="h6" fontWeight={700}>
          Smart Parking
        </Typography>
      </Toolbar>

      <Divider sx={{ borderColor: "rgba(148, 163, 184, 0.25)" }} />

      <Box sx={{ p: 1.5, gap: 1.25, display: "grid" }}>
        {navGroups.map((group) => (
          <Box key={group.title}>
            <Typography
              variant="caption"
              sx={{
                px: 1,
                mb: 0.5,
                color: "#94a3b8",
                letterSpacing: 1,
                fontWeight: 700,
                display: "block",
              }}
            >
              {group.title}
            </Typography>

            <List sx={{ p: 0, gap: 0.5, display: "grid" }}>
              {group.items.map((item) => {
                const selected = activeItem === item.key;

                return (
                  <ListItemButton
                    key={item.key}
                    selected={selected}
                    onClick={() => handleSelect(item.key)}
                    sx={{
                      borderRadius: 2,
                      minHeight: 44,
                      borderLeft: "3px solid",
                      borderLeftColor: selected ? "#60a5fa" : "transparent",
                      transition: "all 0.25s ease",
                      color: selected ? "#ffffff" : "#cbd5e1",
                      bgcolor: selected ? "rgba(25, 118, 210, 0.4)" : "transparent",
                      "&:hover": {
                        bgcolor: "rgba(148, 163, 184, 0.2)",
                        color: "#ffffff",
                        transform: "translateX(2px)",
                      },
                      "&:active": {
                        transform: "translateX(1px) scale(0.995)",
                        filter: "brightness(1.05)",
                      },
                      "& .MuiListItemIcon-root": {
                        color: selected ? "#93c5fd" : "#94a3b8",
                        minWidth: 36,
                        transition: "color 0.25s ease",
                      },
                    }}
                  >
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText 
                      primary={<Typography variant="body2" sx={{ fontWeight: 600, color: 'inherit' }}>{item.label}</Typography>} 
                    />
                  </ListItemButton>
                );
              })}
            </List>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

const Sidebar = ({ mobileOpen, onClose, isDesktop }) => {
  return (
    <>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", lg: "none" },
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            border: "none",
          },
        }}
      >
        <SidebarContent onClose={onClose} />
      </Drawer>

      <Drawer
        variant="persistent"
        open={isDesktop}
        sx={{
          display: { xs: "none", lg: "block" },
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            border: "none",
          },
        }}
      >
        <SidebarContent />
      </Drawer>
    </>
  );
};

export { drawerWidth };
export default Sidebar;