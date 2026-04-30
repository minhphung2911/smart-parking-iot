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
    </Box>
  );
};

export default LogsToolbar;
