import { Box, Container, Stack, Typography, Drawer, IconButton, Button, Divider, Alert, TextField } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect, useState, useMemo } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { useSystemContext } from "../context/SystemContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSlots } from "../services/api";
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

  // New states for Assigning Vehicle
  const [assigningSlot, setAssigningSlot] = useState(false);
  const [plateInput, setPlateInput] = useState("");
  
  const { data: slots = [], isLoading } = useQuery({
    queryKey: ["slots"],
    queryFn: getSlots,
    refetchInterval: isSocketConnected ? false : 12000,
  });

  const getSlotLogicStatus = (slot) => {
    if (slot.status === "fault") return "Fault";
    if (slot.status === "reserved") return "Reserved";
    if (slot.isOccupied || slot.occupied || slot.status === "occupied") return "Occupied";
    return "Available";
  };

  const processedSlots = useMemo(() => {
    return slots.map(s => ({
      ...s,
      logicStatus: getSlotLogicStatus(s),
      plateNumber: s.plateNumber || (s.isOccupied ? "UNKNOWN" : ""),
      entryTime: s.entryTime || (s.isOccupied ? new Date().toISOString() : null)
    }));
  }, [slots]);

  const filteredSlots = useMemo(() => {
    return processedSlots.filter(s => {
      if (filter !== "All" && s.logicStatus !== filter) return false;
      if (search) {
        const q = search.toLowerCase();
        const idMatch = String(s.id || s.slotNumber || "").toLowerCase().includes(q);
        const nameMatch = (s.name || "").toLowerCase().includes(q);
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

  // Demo mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }) => {
      // Demo API call, assumes backend might not be ready
      // return axios.put(`http://localhost:3000/api/slots/${id}/status`, { status });
      return new Promise(resolve => setTimeout(resolve, 500));
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["slots"]);
      setSelectedSlot(null);
    }
  });

  const findNearestAvailable = () => {
    const emptySlot = processedSlots.find(s => s.logicStatus === "Available");
    if (emptySlot) {
      setSearch(emptySlot.name || `Slot ${emptySlot.id}`);
    } else {
      alert("System Alert: No available slots found in current zone.");
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
      title="Parking Slot Management"
      isSocketConnected={isSocketConnected}
      activeItem="parking-slots"
      onSelectMenu={() => {}} 
      freshnessState={connectionState.toLowerCase()}
      lastUpdatedAt={lastUpdatedAt}
    >
      <Container maxWidth="xl" sx={{ mt: 2 }}>
        <Stack spacing={4}>
          <Box>
            <Typography variant="h5" sx={{ mb: 1, fontWeight: 600 }}>
              Realtime Monitoring Center
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Live operational view mapped to physical infrastructure layer.
            </Typography>
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
              variant="contained" 
              color="primary" 
              onClick={findNearestAvailable}
              sx={{ fontWeight: 600, px: 3 }}
            >
              Find Nearest Empty Slot
            </Button>
          </Stack>

          {systemMode === "degraded" && (
            <Alert severity="warning" variant="outlined" sx={{ fontWeight: 600 }}>
              ⚠️ Real-time streaming disconnected. Viewing cached topology state.
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

      {/* Side Drawer Component */}
      <Drawer
        anchor="right"
        open={Boolean(selectedSlot)}
        onClose={() => setSelectedSlot(null)}
        PaperProps={{ sx: { width: { xs: '100%', sm: 400 }, p: 0, bgcolor: 'background.paper' } }}
      >
        {selectedSlot && (
          <Stack sx={{ height: '100%' }}>
            <Box sx={{ p: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid', borderColor: 'divider' }}>
              <Typography variant="h6" fontWeight={600}>Slot Detail</Typography>
              <IconButton onClick={() => setSelectedSlot(null)} size="small">
                <CloseIcon />
              </IconButton>
            </Box>
            <Box sx={{ p: 3, flexGrow: 1 }}>
              <Stack spacing={3}>
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>IDENTIFIER</Typography>
                  <Typography variant="h4" fontWeight={700} sx={{ mt: 0.5 }}>{selectedSlot.name || `Slot ${selectedSlot.id}`}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>CURRENT STATUS</Typography>
                  <Typography variant="body1" fontWeight={600} sx={{ mt: 0.5 }}>{selectedSlot.logicStatus.toUpperCase()}</Typography>
                </Box>
                {selectedSlot.logicStatus === 'Occupied' && (
                  <>
                    <Divider />
                    <Box>
                      <Typography variant="caption" color="text.secondary" fontWeight={600}>LICENSE PLATE</Typography>
                      <Typography variant="body1" fontWeight={600} sx={{ mt: 0.5 }}>{selectedSlot.plateNumber || 'Unknown'}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary" fontWeight={600}>ENTRY TIME</Typography>
                      <Typography variant="body2" sx={{ mt: 0.5 }}>{selectedSlot.entryTime ? new Date(selectedSlot.entryTime).toLocaleString() : '---'}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary" fontWeight={600}>ESTIMATED FEE</Typography>
                      <Typography variant="body1" sx={{ mt: 0.5, fontWeight: 700, color: 'success.main' }}>
                        ${calculateFee(selectedSlot.entryTime)}
                      </Typography>
                    </Box>
                  </>
                )}
                {selectedSlot.logicStatus === 'Available' && assigningSlot && (
                  <>
                    <Divider />
                    <Box>
                      <Typography variant="caption" color="text.secondary" fontWeight={600}>ASSIGN NEW VEHICLE</Typography>
                      <TextField 
                        fullWidth 
                        size="small" 
                        placeholder="Enter Plate Number" 
                        value={plateInput}
                        onChange={(e) => setPlateInput(e.target.value)}
                        sx={{ mt: 1 }}
                      />
                      <Button 
                        variant="contained" 
                        fullWidth 
                        sx={{ mt: 1 }}
                        onClick={() => {
                          updateStatusMutation.mutate({ id: selectedSlot.id, status: 'occupied', plate: plateInput });
                          setAssigningSlot(false);
                          setPlateInput("");
                        }}
                      >Confirm Check-in</Button>
                    </Box>
                  </>
                )}
              </Stack>
            </Box>
            <Box sx={{ p: 3, borderTop: '1px solid', borderColor: 'divider', bgcolor: 'background.default' }}>
               <Stack spacing={2}>
                 {selectedSlot.logicStatus === 'Available' && !assigningSlot && (
                   <Button 
                     variant="contained" 
                     fullWidth 
                     color="primary"
                     onClick={() => setAssigningSlot(true)}
                   >
                     Assign Vehicle
                   </Button>
                 )}
                 {selectedSlot.logicStatus === 'Occupied' && (
                   <Button 
                     variant="outlined" 
                     fullWidth 
                     onClick={() => alert('Transfer feature requires map selection context.')}
                   >
                     Transfer Slot
                   </Button>
                 )}

                 <Button 
                   variant="contained" 
                   fullWidth 
                   color="error" 
                   disabled={selectedSlot.logicStatus !== 'Occupied' && selectedSlot.logicStatus !== 'Reserved'}
                   onClick={() => updateStatusMutation.mutate({ id: selectedSlot.id, status: 'available' })}
                 >
                   Release Slot
                 </Button>
                 <Button 
                   variant="outlined" 
                   fullWidth
                   onClick={() => updateStatusMutation.mutate({ id: selectedSlot.id, status: 'reserved' })}
                   disabled={selectedSlot.logicStatus !== 'Available'}
                 >
                   Mark Reserved
                 </Button>
                 <Button 
                   variant="outlined" 
                   fullWidth 
                   color="warning"
                   onClick={() => updateStatusMutation.mutate({ id: selectedSlot.id, status: 'fault' })}
                   disabled={selectedSlot.logicStatus === 'Fault'}
                 >
                   Maintenance (Fault)
                 </Button>
               </Stack>
            </Box>
          </Stack>
        )}
      </Drawer>
    </DashboardLayout>
  );
};

export default ParkingSlots;
