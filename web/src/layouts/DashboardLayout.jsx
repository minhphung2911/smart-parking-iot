import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useState } from "react";
import Header from "./Header";
import Sidebar, { drawerWidth } from "./Sidebar";

const DashboardLayout = ({
  title,
  isSocketConnected,
  freshnessState,
  lastUpdatedAt,
  isSyncing,
  children,
}) => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleOpenMenu = () => {
    setMobileOpen(true);
  };

  const handleCloseMenu = () => {
    setMobileOpen(false);
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
      <Sidebar
        mobileOpen={mobileOpen}
        onClose={handleCloseMenu}
        isDesktop={isDesktop}
      />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ml: { lg: drawerWidth + "px" },
          minWidth: 0,
          position: "relative",
        }}
      >
        <Header
          title={title}
          isSocketConnected={isSocketConnected}
          onMenuClick={handleOpenMenu}
          showMenuButton={!isDesktop}
          freshnessState={freshnessState}
          lastUpdatedAt={lastUpdatedAt}
          isSyncing={isSyncing}
        />

        <Box
          sx={{
            p: { xs: 2, md: 3 },
            maxWidth: 1520,
            mx: "auto",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 82,
              right: { xs: 10, md: 24 },
              width: { xs: 140, md: 260 },
              height: { xs: 140, md: 260 },
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(25,118,210,0.12) 0%, rgba(25,118,210,0) 70%)",
              pointerEvents: "none",
            },
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardLayout;