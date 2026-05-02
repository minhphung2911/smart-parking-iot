import { Box, Stack, TextField, InputAdornment, Button, Select, MenuItem, FormControl } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import DownloadIcon from "@mui/icons-material/Download";

const LogsToolbar = ({ filterText, setFilterText, actionFilter, setActionFilter, dateRange, setDateRange, onExportCSV }) => {
  return (
    <Box sx={{ borderBottom: '1px solid', borderColor: 'divider', pb: 2 }}>
      <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems="center" spacing={2}>
        
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ width: { xs: '100%', md: 'auto' } }}>
          {/* Search */}
          <TextField
            size="small"
            placeholder="Search plate, slot, action..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" sx={{ color: 'text.muted' }} />
                </InputAdornment>
              ),
              sx: { bgcolor: 'background.paper', width: { xs: '100%', sm: 260 } }
            }}
          />

          {/* Date Range Select */}
          <FormControl size="small" sx={{ minWidth: 140, bgcolor: 'background.paper' }}>
            <Select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              displayEmpty
            >
              <MenuItem value="today">Today</MenuItem>
              <MenuItem value="7days">Past 7 Days</MenuItem>
              <MenuItem value="all">All Time</MenuItem>
            </Select>
          </FormControl>

          {/* Action Filter Select */}
          <FormControl size="small" sx={{ minWidth: 160, bgcolor: 'background.paper' }}>
            <Select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              displayEmpty
            >
              <MenuItem value="All">All Actions</MenuItem>
              <MenuItem value="Check-in">Check-in</MenuItem>
              <MenuItem value="Check-out">Check-out</MenuItem>
              <MenuItem value="Assign">Assign (Manual)</MenuItem>
              <MenuItem value="Transfer">Transfer</MenuItem>
              <MenuItem value="Fault">Fault</MenuItem>
              <MenuItem value="Reserved">Reserved</MenuItem>
            </Select>
          </FormControl>
        </Stack>

        {/* Action Button */}
        <Button
          variant="outlined"
          startIcon={<DownloadIcon />}
          sx={{ fontWeight: 600, color: 'text.primary', borderColor: 'divider', bgcolor: 'background.paper', '&:hover': { bgcolor: 'rgba(0,0,0,0.02)' } }}
          onClick={onExportCSV}
        >
          Export CSV
        </Button>
      </Stack>
    </Box>
  );
};

export default LogsToolbar;
