import {
  Alert,
  Box,
  Card,
  CardContent,
  Grid,
  Skeleton,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";
import { getSlots } from "../services/api";
import socket from "../socket/socket";
import SlotCard from "./SlotCard";

const getSlotStatus = (slot) => {
  const status = (slot?.status || slot?.Status || "").toLowerCase();
  return status === "occupied" || status === "reserved";
};

const SlotGridSkeleton = () => {
  return (
    <Grid container spacing={2}>
      {Array.from({ length: 8 }).map((_, index) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
          <Card sx={{ border: '1px solid rgba(0,0,0,0.06)', boxShadow: 'none' }}>
            <CardContent sx={{ p: '16px 16px 16px 20px' }}>
              <Stack spacing={1}>
                <Skeleton variant="text" width="60%" height={24} />
                <Skeleton variant="text" width="40%" height={16} />
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

const SLOT_POLL_INTERVAL = 12000;

const extractSlotIds = (payload) => {
  if (!payload) return [];
  if (Array.isArray(payload)) {
    return payload
      .map((item) => item?.slotID ?? item?.SlotID ?? item?.slotId ?? item?.id)
      .filter((id) => id != null)
      .map((id) => String(id));
  }
  const singleId = payload?.slotID ?? payload?.SlotID ?? payload?.slotId ?? payload?.id;
  return singleId != null ? [String(singleId)] : [];
};

const SlotGrid = ({ isSocketConnected, systemMode, connectionState }) => {
  const queryClient = useQueryClient();
  const [toastMessage, setToastMessage] = useState("");
  const [toastOpen, setToastOpen] = useState(false);
  const [changeLabels, setChangeLabels] = useState({});
  const [highlightedIds, setHighlightedIds] = useState({});

  const toastQueueRef = useRef([]);

  const { data: slots = [], isLoading } = useQuery({
    queryKey: ["slots"],
    queryFn: getSlots,
    refetchInterval: isSocketConnected ? false : SLOT_POLL_INTERVAL,
    placeholderData: (prev) => prev,
    enabled: systemMode !== "degraded" || !!queryClient.getQueryData(["slots"]),
  });

  const availableSlots = useMemo(() => slots.filter((s) => !getSlotStatus(s)), [slots]);
  const occupiedSlots = useMemo(() => slots.filter((s) => getSlotStatus(s)), [slots]);

  const markUpdated = (ids, statusMap = {}) => {
    if (!ids.length) return;
    const patch = {};
    const labels = {};
    ids.forEach((id) => {
      patch[id] = true;
      const state = statusMap[id];
      if (typeof state === "boolean") {
        labels[id] = state ? "Đã đỗ" : "Đã trống";
      }
    });

    setHighlightedIds((p) => ({ ...p, ...patch }));
    setChangeLabels((p) => ({ ...p, ...labels }));

    setTimeout(() => {
      setHighlightedIds((p) => {
        const n = { ...p };
        ids.forEach((i) => delete n[i]);
        return n;
      });
    }, 1500);
  };

  useEffect(() => {
    const onUpdate = (payload) => {
      const ids = extractSlotIds(payload);
      if (ids.length) {
        markUpdated(ids);
        queryClient.invalidateQueries({ queryKey: ["slots"] });
      }
    };

    socket.on("slotUpdated", onUpdate);
    socket.on("slotsUpdated", onUpdate);
    socket.on("parkingUpdate", onUpdate);

    return () => {
      socket.off("slotUpdated", onUpdate);
      socket.off("slotsUpdated", onUpdate);
      socket.off("parkingUpdate", onUpdate);
    };
  }, [queryClient]);

  const isDegraded = systemMode === "degraded";
  const isSyncing = connectionState === "SYNCING" && !isDegraded;

  if (isSyncing) return <SlotGridSkeleton />;

  const renderGroup = (title, list) => (
    <Stack spacing={1.2}>
      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "text.secondary" }}>
        {title} ({list.length})
      </Typography>
      <Grid container spacing={2}>
        {list.map((slot) => {
          const id = String(slot?.slotID ?? slot?.SlotID ?? slot?.id);
          const name = slot?.slotCode ?? slot?.SlotCode ?? `Slot ${id}`;
          return (
            <Grid item xs={12} sm={6} md={4} lg={3} key={id}>
              <SlotCard
                slotName={name}
                isOccupied={getSlotStatus(slot)}
                isRecentlyUpdated={highlightedIds[id]}
                changeLabel={changeLabels[id]}
                degraded={isDegraded}
              />
            </Grid>
          );
        })}
      </Grid>
    </Stack>
  );

  return (
    <Box sx={{ position: 'relative' }}>
      {isDegraded && (
        <Alert severity="warning" variant="outlined" sx={{ mb: 2, fontWeight: 600 }}>
          ⚠️ Kết nối hạ tầng ngoại tuyến. Đang hiển thị trạng thái cuối cùng.
        </Alert>
      )}
      
      {isLoading && !isDegraded ? (
        <SlotGridSkeleton />
      ) : (
        <Stack spacing={3} sx={{ opacity: isDegraded ? 0.7 : 1 }}>
          {renderGroup("Trống", availableSlots)}
          {renderGroup("Đang đỗ", occupiedSlots)}
        </Stack>
      )}
      
      <Snackbar
        open={toastOpen}
        autoHideDuration={2000}
        onClose={() => setToastOpen(false)}
        message={toastMessage}
      />
    </Box>
  );
};

export default SlotGrid;