import React from "react";
import { createRoot } from "react-dom/client";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import "./index.css";

const queryClient = new QueryClient();

const theme = createTheme({
  palette: {
    primary: {
      main: "#635bff", // Stripe Blue
    },
    background: {
      default: "#fafafa",
      paper: "#ffffff",
    },
    text: {
      primary: "#0a0a0a",
      secondary: "#425466",
    },
    divider: "rgba(0, 0, 0, 0.08)",
  },
  typography: {
    fontFamily: '"Inter", -apple-system, sans-serif',
    h5: { fontWeight: 600, fontSize: "20px" },
    subtitle1: { fontWeight: 600, fontSize: "14px" },
    body2: { fontSize: "13px" },
  },
  shape: {
    borderRadius: 8,
  },
});

const root = createRoot(document.getElementById("root"));
root.render(
  <QueryClientProvider client={queryClient}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </QueryClientProvider>
);
