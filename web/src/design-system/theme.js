import { createTheme } from '@mui/material/styles';
import { colors, radius, typography } from './tokens';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: colors.primary,
    },
    success: {
      main: colors.success,
    },
    error: {
      main: colors.error,
    },
    warning: {
      main: colors.warning,
    },
    background: {
      default: colors.surface,
      paper: colors.background,
    },
    text: {
      primary: colors.text.primary,
      secondary: colors.text.secondary,
    },
    divider: colors.border,
  },
  shape: {
    borderRadius: 8,
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h3: { ...typography.pageTitle },
    h6: { ...typography.sectionTitle },
    body2: { ...typography.body },
    caption: { ...typography.caption },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: colors.surface,
          color: colors.text.primary,
          WebkitFontSmoothing: 'antialiased',
        },
      },
    },
    MuiCard: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          border: `1px solid ${colors.border}`,
          borderRadius: radius.md,
          backgroundColor: colors.background,
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          borderRadius: radius.sm,
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: `1px solid ${colors.border}`,
          padding: '12px 16px',
          fontSize: typography.body.fontSize,
        },
        head: {
          fontWeight: 600,
          color: colors.text.muted,
          backgroundColor: colors.surface,
        },
      },
    },
  },
});
