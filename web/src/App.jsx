import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import ParkingSlots from "./pages/ParkingSlots";
import { SystemProvider } from "./context/SystemContext";

import Logs from "./pages/Logs";
import Analytics from "./pages/Analytics";

function App() {
  return (
    <BrowserRouter>
      <SystemProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/parking-slots" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/parking-slots" element={<ParkingSlots />} />
          <Route path="/logs" element={<Logs />} />
          <Route path="/analytics" element={<Analytics />} />
        </Routes>
      </SystemProvider>
    </BrowserRouter>
  );
}

export default App;