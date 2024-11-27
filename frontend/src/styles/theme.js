import { createTheme } from '@mui/material/styles';

const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

const breakpoints = {
  values: {
    xs: 0,
    sm: 600,
    md: 900,
    lg: 1200,
    xl: 1536,
  },
};

const getDesignTokens = (mode) => ({
  palette: {
    mode,
    primary: {
      main: '#B2D8D8',
      light: '#e3f2fd',
      dark: '#42a5f5',
    },
    secondary: {
      main: '#F5E5D5',
    },
    background: {
      default: '#f0f2f5',
      paper: '#ffffff',
      board: mode === 'light' ? '#f0f2f5' : '#2d2d2d',
    },
    text: {
      primary: mode === 'light' ? '#172b4d' : '#ffffff',
      secondary: mode === 'light' ? '#5e6c84' : '#b0bec5',
    },
  },
  spacing,
  breakpoints,
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          margin: 0,
          padding: 0,
          backgroundColor: '#f0f2f5',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#ffffff',
          borderRight: '1px solid rgba(0, 0, 0, 0.12)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          color: '#000000',
          boxShadow: 'none',
          borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          '&.Mui-selected': {
            backgroundColor: '#e3f2fd',
            '&:hover': {
              backgroundColor: '#e3f2fd',
            },
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: mode === 'light' 
            ? '0 1px 2px 0 rgba(0,0,0,0.05)'
            : '0 1px 2px 0 rgba(255,255,255,0.05)',
        },
      },
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.43,
    },
  },
});

export const getTheme = (mode) => createTheme(getDesignTokens(mode));

// export const spacing = spacing;
// export const breakpoints = breakpoints;
