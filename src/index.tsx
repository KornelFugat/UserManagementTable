import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store/store';
import App from './App';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { createRoot } from 'react-dom/client';

const theme = createTheme({
  palette: {
    mode: 'light', // Can be switched dynamically to 'dark' based on user preference
    primary: {
      main: '#0D47A1',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#FF6F00',
    },
    background: {
      default: '#F5F5F5',
    },
    text: {
      primary: '#212121',
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    h4: {
      fontWeight: 600,
    },
    body1: {
      fontSize: '1rem',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          margin: 0,
          padding: 0,
          boxSizing: 'border-box',
        },
      },
    },
  },
});

const root = createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);
