import { Box, Container, Stack, Typography, Drawer, IconButton, Button, Divider, Alert, TextField, FormControl, Select, MenuItem, Chip } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect, useState, useMemo } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { useSystemContext } from "../context/SystemContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSlots, updateSlotStatus, parkingEntry, parkingExit } from "../services/api";
import axios from "axios";
import SlotStats from "../components/slots/SlotStats";
import SlotToolbar from "../components/slots/SlotToolbar";
import SlotGridNew from "../components/slots/SlotGridNew";
import socket from "../socket/socket";

const ParkingSlots = () => {
  const { isSocketConnected, connectionState, systemMode, lastUpdatedAt } = useSystemContext();
  const queryClient = useQueryClient();
  
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState("Grid");
  const [selectedSlot, setSelectedSlot] = useState(null);

  const { data: slots = [], isLoading } = useQuery({
    queryKey: ["slots"],
    queryFn: getSlots,
    refetchInterval: 10000, // 10s as requested
  });

  const getSlotLogicStatus = (slot) => {
    const status = (slot.status || slot.Status || "").toLowerCase();
    if (status === "fault") return "Fault";
    if (status === "reserved") return "Reserved";
    if (status === "occupied") return "Occupied";
    return "Available";
  };

  const processedSlots = useMemo(() => {
    return slots.map(s => ({
      ...s,
      logicStatus: getSlotLogicStatus(s),
      plateNumber: s.plateNumber || s.PlateNumber || (s.status === "Occupied" ? "UNKNOWN" : ""),
      entryTime: s.entryTime || s.EntryTime || (s.status === "Occupied" ? new Date().toISOString() : null)
    }));
  }, [slots]);

  const filteredSlots = useMemo(() => {
    return processedSlots.filter(s => {
      if (filter !== "All" && s.logicStatus !== filter) return false;
      if (search) {
        const q = search.toLowerCase();
        const idMatch = String(s.id || s.slotID || s.SlotID || "").toLowerCase().includes(q);
        const nameMatch = (s.name || s.slotCode || s.SlotCode || "").toLowerCase().includes(q);
        const plateMatch = (s.plateNumber || "").toLowerCase().includes(q);
        return idMatch || nameMatch || plateMatch;
      }
      return true;
    });
  }, [processedSlots, filter, search]);

  const stats = useMemo(() => {
    return {
      available: processedSlots.filter(s => s.logicStatus === "Available").length,
      occupied: processedSlots.filter(s => s.logicStatus === "Occupied").length,
      reserved: processedSlots.filter(s => s.logicStatus === "Reserved").length,
      fault: processedSlots.filter(s => s.logicStatus === "Fault").length,
    };
  }, [processedSlots]);

  const findNearestAvailable = () => {
    const emptySlot = processedSlots.find(s => s.logicStatus === "Available");
    if (emptySlot) {
      setSearch(emptySlot.slotCode || emptySlot.name || `Slot ${emptySlot.id}`);
    }
  };

  // Utility to calculate mock estimated fee
  const calculateFee = (entryTime) => {
    if (!entryTime) return 0;
    const mins = Math.floor((new Date() - new Date(entryTime)) / 60000);
    if (mins < 0) return 0;
    // Example: $2 basic + $0.05 per minute
    return (2 + (mins * 0.05)).toFixed(2);
  };

  return (
    <DashboardLayout
      title="Giám sát Hạ tầng"
      isSocketConnected={isSocketConnected}
      activeItem="parking-slots"
      freshnessState={connectionState.toLowerCase()}
      lastUpdatedAt={lastUpdatedAt}
    >
      <Container maxWidth="xl" sx={{ mt: 2 }}>
        <Stack spacing={4}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box>
              <Typography variant="h5" sx={{ mb: 1, fontWeight: 600 }}>
                Bản đồ Vị trí trực tuyến
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Dữ liệu đồng bộ trực tiếp từ trạm vận hành WinForms.
              </Typography>
            </Box>
            <Alert icon={false} severity="info" sx={{ borderRadius: 2, bgcolor: 'rgba(25, 118, 210, 0.05)', border: '1px solid rgba(25, 118, 210, 0.1)' }}>
              <Typography variant="caption" fontWeight={600} color="primary.main">CHẾ ĐỘ GIÁM SÁT (READ-ONLY)</Typography>
            </Alert>
          </Box>

          <SlotStats stats={stats} />

          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} justifyContent="space-between" alignItems="center">
            <SlotToolbar 
              filter={filter} 
              setFilter={setFilter} 
              search={search} 
              setSearch={setSearch} 
              viewMode={viewMode}
              setViewMode={setViewMode}
            />
            <Button 
              variant="outlined" 
              onClick={findNearestAvailable}
              sx={{ fontWeight: 600, px: 3 }}
            >
              Lọc vị trí trống
            </Button>
          </Stack>

          {systemMode === "degraded" && (
            <Alert severity="warning" variant="outlined" sx={{ fontWeight: 600 }}>
              ⚠️ Kết nối WinForms bị gián đoạn. Đang hiển thị dữ liệu bộ nhớ đệm.
            </Alert>
          )}

          <SlotGridNew 
            slots={filteredSlots} 
            isLoading={isLoading && systemMode !== "degraded"}
            onSlotClick={(slot) => setSelectedSlot(slot)}
            viewMode={viewMode}
          />
        </Stack>
      </Container>

      {/* Side Info Drawer */}
      <Drawer
        anchor="right"
        open={Boolean(selectedSlot)}
        onClose={() => setSelectedSlot(null)}
        PaperProps={{ sx: { width: { xs: '100%', sm: 400 }, p: 0, bgcolor: 'background.paper' } }}
      >
        {selectedSlot && (
          <Stack sx={{ height: '100%' }}>
            <Box sx={{ p: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid', borderColor: 'divider' }}>
              <Typography variant="h6" fontWeight={600}>Thông tin Chi tiết</Typography>
              <IconButton onClick={() => setSelectedSlot(null)} size="small">
                <CloseIcon />
              </IconButton>
            </Box>
            <Box sx={{ p: 3, flexGrow: 1 }}>
              <Stack spacing={4}>
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>MÃ VỊ TRÍ</Typography>
                  <Typography variant="h4" fontWeight={700} sx={{ mt: 0.5, letterSpacing: '-0.02em' }}>{selectedSlot.slotCode || selectedSlot.name || `CHỖ ${selectedSlot.id}`}</Typography>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>TRẠNG THÁI HIỆN TẠI</Typography>
                  <Box sx={{ mt: 1 }}>
                     <Chip 
                       label={selectedSlot.logicStatus === 'Occupied' ? 'ĐANG CÓ XE' : selectedSlot.logicStatus === 'Available' ? 'CÒN TRỐNG' : selectedSlot.logicStatus === 'Reserved' ? 'ĐÃ ĐẶT CHỖ' : 'CẢM BIẾN LỖI'} 
                       color={selectedSlot.logicStatus === 'Occupied' ? 'error' : selectedSlot.logicStatus === 'Available' ? 'success' : selectedSlot.logicStatus === 'Reserved' ? 'warning' : 'default'}
                       sx={{ fontWeight: 700, borderRadius: 1.5, px: 1 }}
                     />
                  </Box>
                </Box>

                {selectedSlot.logicStatus === 'Occupied' && (
                  <>
                    <Divider />
                    <Box>
                      <Typography variant="caption" color="text.secondary" fontWeight={600}>BIỂN SỐ XE ĐANG ĐỖ</Typography>
                      <Typography variant="h5" fontWeight={600} sx={{ mt: 0.5, color: 'primary.main' }}>{selectedSlot.plateNumber || 'KHÔNG XÁC ĐỊNH'}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary" fontWeight={600}>THỜI ĐIỂM VÀO BÃI</Typography>
                      <Typography variant="body1" sx={{ mt: 0.5, fontWeight: 500 }}>{selectedSlot.entryTime ? new Date(selectedSlot.entryTime).toLocaleString() : '---'}</Typography>
                    </Box>
                  </>
                )}
                
                <Box sx={{ mt: 'auto', p: 2, bgcolor: 'rgba(0,0,0,0.02)', borderRadius: 2, border: '1px dashed rgba(0,0,0,0.1)' }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                    * Mọi thao tác nghiệp vụ (Vào/Ra/Thu phí) phải được thực hiện tại quầy vận hành WinForms.
                  </Typography>
                </Box>
              </Stack>
            </Box>
            
            <Box sx={{ p: 3, borderTop: '1px solid', borderColor: 'divider', bgcolor: 'grey.50' }}>
               <Button 
                 variant="outlined" 
                 fullWidth 
                 disabled
                 sx={{ borderRadius: 2 }}
               >
                 Vận hành bị khóa trên Web
               </Button>
            </Box>
          </Stack>
        )}
      </Drawer>
    </DashboardLayout>
  );
};

export default ParkingSlots;
