import React, { createContext, useContext, useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import socket from "../socket/socket";

const SystemContext = createContext();

export const useSystemContext = () => useContext(SystemContext);

export const SystemProvider = ({ children }) => {
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const [lastHeartbeat, setLastHeartbeat] = useState(null);
  const [apiStatus, setApiStatus] = useState("checking");
  const [lastUpdatedAt, setLastUpdatedAt] = useState(new Date());

  const queryClient = useQueryClient();

  const checkApiHealth = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/slots", { method: 'GET' });
      if (response.ok) {
        setApiStatus("online");
      } else {
        setApiStatus("offline");
      }
    } catch (e) {
      setApiStatus("offline");
    }
  };

  useEffect(() => {
    checkApiHealth();
    const interval = setInterval(checkApiHealth, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const onConnect = () => {
      setIsSocketConnected(true);
      setReconnectAttempts(0);
      setLastHeartbeat(new Date());
    };
    const onDisconnect = () => setIsSocketConnected(false);
    const onReconnectAttempt = (attempt) => setReconnectAttempts(attempt);

    const onDataEvent = () => {
      queryClient.invalidateQueries({ queryKey: ["stats"] });
      queryClient.invalidateQueries({ queryKey: ["slots"] });
      queryClient.invalidateQueries({ queryKey: ["logs"] });
      setLastUpdatedAt(new Date());
      setLastHeartbeat(new Date());
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.io.on("reconnect_attempt", onReconnectAttempt);
    socket.on("parkingUpdate", onDataEvent);
    socket.on("slotUpdated", onDataEvent);

    // .NET Backend uses strict REST via TanStack Polling (15s interval).
    // Socket.io disabled to prevent 404 spam. Can be migrated to SignalR later.
    // socket.connect();

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.io.off("reconnect_attempt", onReconnectAttempt);
      socket.off("parkingUpdate", onDataEvent);
      socket.off("slotUpdated", onDataEvent);
      socket.disconnect();
    };
  }, [queryClient]);

  const systemMode = apiStatus === "offline" ? "degraded" : "operational";
  const connectionState = apiStatus === "online" ? "CONNECTED" : "DISCONNECTED";

  return (
    <SystemContext.Provider
      value={{
        isSocketConnected,
        reconnectAttempts,
        lastHeartbeat,
        apiStatus,
        lastUpdatedAt,
        systemMode,
        connectionState,
      }}
    >
      {children}
    </SystemContext.Provider>
  );
};
