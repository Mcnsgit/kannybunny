import React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import ScopedCssBaseline from '@mui/material/ScopedCssBaseline';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import AuthLayout from './components/layout/AuthLayout';
import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Board from './pages/Board';
import CreateBoard from './pages/CreateBoard';
import Favorites from './pages/Favorites.js';

// Add custom styles
const globalStyles = {
  body: {
    margin: '0px',
    backgroundColor: '#F9F9F9'
  },
  list: {
    padding:'0px'
  }
};

function App() {
  const theme = createTheme({
    palette: { 
      mode: 'light',
      components: {
        primary: '#B2D8D8',
        secondary: '#F5E5D5',
        background: '#F9F9F9',
        text: '#333333',
      }
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: globalStyles,
      },
    },
    logoSize: {
      width: '50px',
      padding: '5px',
      height: 'auto',   
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <ScopedCssBaseline>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<AuthLayout />}>
              <Route path="login" element={<Login />} />
              <Route path="signup" element={<Signup />} />
            </Route>
            <Route path="/" element={<AppLayout />}>
              <Route index element={<Home />} />
              <Route path="boards" element={<Home />} />
              <Route path="boards/create" element={<CreateBoard />} />
              <Route path="boards/:boardId" element={<Board />} />
             <Route path='boards/:boardId/lists' element={<Favorites />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ScopedCssBaseline>
    </ThemeProvider>
  );
}

export default App;
