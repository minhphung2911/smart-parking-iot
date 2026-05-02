import axios from "axios";

const API_URL = "http://localhost:3000";

const api = axios.create({
  baseURL: API_URL,
  timeout: 12000,
});

const safeGet = async (endpoint, fallbackValue) => {
  try {
    const { data } = await api.get(endpoint);
    return data;
  } catch (error) {
    console.error(`API Error on ${endpoint}:`, error);
    return fallbackValue;
  }
};

export const getSlots = async () => {
  return await safeGet("/api/slots", []);
};

export const getLogs = async () => {
  return await safeGet("/api/logs", []);
};

export const getDashboardSummary = async () => {
  return await safeGet("/api/dashboard/summary", {
    totalSlots: 0,
    occupied: 0,
    available: 0,
    carsInToday: 0,
    carsOutToday: 0,
    revenueToday: 0
  });
};

export const getStats = async () => {
  return await getDashboardSummary();
};

export const parkingEntry = async (plateNumber, vehicleType, slotId) => {
  try {
    const { data } = await api.post("/api/parking/entry", { plateNumber, vehicleType, slotId });
    return data;
  } catch (error) {
    console.error("Entry Error:", error);
    throw error;
  }
};

export const parkingExit = async (plateNumber) => {
  try {
    const { data } = await api.post("/api/parking/exit", { plateNumber });
    return data;
  } catch (error) {
    console.error("Exit Error:", error);
    throw error;
  }
};

export const getAnalytics = async () => {
  return await safeGet("/api/analytics", {
    totalRevenue: 0,
    totalSessions: 0
  });
};

export const updateSlotStatus = async (id, status) => {
  try {
    const { data } = await api.put(`/api/slots/${id}/status`, { status });
    return data;
  } catch (error) {
    console.error(`API Error on updating slot ${id}:`, error);
    throw error;
  }
};

export { API_URL };
export default api;