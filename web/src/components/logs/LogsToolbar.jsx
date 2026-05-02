<<<<<<< HEAD
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
            placeholder="Tìm biển số, vị trí, hành động..."
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
              <MenuItem value="today">Hôm nay</MenuItem>
              <MenuItem value="7days">7 ngày qua</MenuItem>
              <MenuItem value="all">Tất cả thời gian</MenuItem>
            </Select>
          </FormControl>

          {/* Action Filter Select */}
          <FormControl size="small" sx={{ minWidth: 160, bgcolor: 'background.paper' }}>
            <Select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              displayEmpty
            >
              <MenuItem value="All">Tất cả hành động</MenuItem>
              <MenuItem value="Check-in">Vào bãi</MenuItem>
              <MenuItem value="Check-out">Ra bãi</MenuItem>
              <MenuItem value="Assign">Gán xe (Thủ công)</MenuItem>
              <MenuItem value="Transfer">Chuyển chỗ</MenuItem>
              <MenuItem value="Fault">Báo lỗi</MenuItem>
              <MenuItem value="Reserved">Đặt trước</MenuItem>
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
          Xuất file CSV
        </Button>
      </Stack>
=======
import { Box, TextField, Button, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";

const LogsToolbar = ({
  filterText,
  setFilterText,
  actionFilter,
  setActionFilter,
  dateRange,
  setDateRange,
  onExportCSV,
}) => {
  return (
    <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", alignItems: "center" }}>
      <TextField
        label="Search"
        placeholder="Plate, slot, action..."
        value={filterText}
        onChange={(e) => setFilterText(e.target.value)}
        size="small"
        sx={{ minWidth: 200 }}
      />

      <FormControl size="small" sx={{ minWidth: 120 }}>
        <InputLabel>Action</InputLabel>
        <Select value={actionFilter} label="Action" onChange={(e) => setActionFilter(e.target.value)}>
          <MenuItem value="All">All</MenuItem>
          <MenuItem value="Check-in">Check-in</MenuItem>
          <MenuItem value="Check-out">Check-out</MenuItem>
          <MenuItem value="Assign">Assign</MenuItem>
          <MenuItem value="Transfer">Transfer</MenuItem>
          <MenuItem value="Fault">Fault</MenuItem>
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 120 }}>
        <InputLabel>Date Range</InputLabel>
        <Select value={dateRange} label="Date Range" onChange={(e) => setDateRange(e.target.value)}>
          <MenuItem value="today">Today</MenuItem>
          <MenuItem value="week">This Week</MenuItem>
          <MenuItem value="month">This Month</MenuItem>
          <MenuItem value="all">All Time</MenuItem>
        </Select>
      </FormControl>

      <Button variant="outlined" startIcon={<DownloadIcon />} onClick={onExportCSV}>
        Export CSV
      </Button>
>>>>>>> 060c646655c4e2280012ae4e519582d7af9eaf4d
    </Box>
  );
};

export default LogsToolbar;
