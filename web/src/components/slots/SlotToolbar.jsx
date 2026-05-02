import { Box, Stack, ToggleButton, ToggleButtonGroup, TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import ViewListIcon from "@mui/icons-material/ViewList";

const SlotToolbar = ({ filter, setFilter, search, setSearch, viewMode, setViewMode }) => {
  return (
    <Box sx={{ borderBottom: '1px solid', borderColor: 'divider', pb: 2 }}>
      <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems="center" spacing={2}>
        
        {/* Search */}
        <TextField
          size="small"
          placeholder="Tìm vị trí hoặc biển số..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" sx={{ color: 'text.muted' }} />
              </InputAdornment>
            ),
            sx: { bgcolor: 'background.paper', width: { xs: '100%', md: 280 } }
          }}
        />

        <Stack direction="row" spacing={3} alignItems="center">
          {/* Filters */}
          <ToggleButtonGroup
            size="small"
            value={filter}
            exclusive
            onChange={(e, val) => val && setFilter(val)}
            sx={{ bgcolor: 'background.paper' }}
          >
            <ToggleButton value="All" sx={{ px: 2, fontWeight: 600 }}>Tất cả</ToggleButton>
            <ToggleButton value="Available" sx={{ px: 2, fontWeight: 600, color: 'success.dark' }}>Trống</ToggleButton>
            <ToggleButton value="Occupied" sx={{ px: 2, fontWeight: 600, color: 'error.dark' }}>Đang đỗ</ToggleButton>
            <ToggleButton value="Reserved" sx={{ px: 2, fontWeight: 600, color: 'warning.dark' }}>Đã đặt</ToggleButton>
            <ToggleButton value="Fault" sx={{ px: 2, fontWeight: 600, color: 'text.secondary' }}>Lỗi</ToggleButton>
          </ToggleButtonGroup>

          {/* View Mode */}
          <ToggleButtonGroup
            size="small"
            value={viewMode}
            exclusive
            onChange={(e, val) => val && setViewMode(val)}
            sx={{ bgcolor: 'background.paper' }}
          >
            <ToggleButton value="Grid"><ViewModuleIcon fontSize="small" /></ToggleButton>
            <ToggleButton value="Table"><ViewListIcon fontSize="small" /></ToggleButton>
          </ToggleButtonGroup>
        </Stack>

      </Stack>
    </Box>
  );
};

export default SlotToolbar;
