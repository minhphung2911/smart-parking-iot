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

export const getStats = async () => {
  return await safeGet("/api/dashboard", {
    totalSlots: 0,
    occupied: 0,
    available: 0,
    revenueToday: 0
  });
};

export const getAnalytics = async () => {
  return await safeGet("/api/analytics", {
    totalRevenue: 0,
    totalSessions: 0
  });
};

export { API_URL };
export default api;