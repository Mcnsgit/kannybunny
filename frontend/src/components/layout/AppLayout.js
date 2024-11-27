import { Box, AppBar, Toolbar, Typography, Drawer, List, ListItem, ListItemIcon, ListItemText, ListItemButton } from '@mui/material';
import { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import authUtils from '../../utils/authUtils';
import Loading from '../common/Loading';
import Funbunny from '../../assets/Funbunny.png';
import { NAVIGATION } from '../../config/navigation';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import { useDispatch } from 'react-redux';
import { getBoards } from '../../redux/features/boardSlice';

const drawerWidth = 250;

const AppLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const user = await authUtils.isAuthenticated();
      if (!user) {
        navigate('/login');
      } else {
        setLoading(false);
      }
    };
    checkAuth();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleNavigation = (segment) => {
    if (segment === 'boards') {
      dispatch(getBoards());
    }
    navigate(`/${segment}`);
  };

  const currentPath = location.pathname.split('/')[1] || 'boards';

  return loading ? (
    <Loading fullHeight />
  ) : (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        {/* Logo */}
        <Toolbar
          sx={{
            px: [1],
            height: '76px',
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'primary.main',
            color: 'white',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <img
              src={Funbunny}
              alt="Logo"
              style={{
                width: 30,
                height: 30,
                borderRadius: '50%',
                backgroundColor: 'white',
                padding: 2,
              }}
            />
            <Typography variant="h6" noWrap>
              Kanny Banny
            </Typography>
          </Box>
        </Toolbar>

        {/* Navigation */}
        <List sx={{ pt: 2, px: 2 }}>
          {NAVIGATION.map((item) => (
            <ListItem key={item.segment} disablePadding>
              <ListItemButton
                selected={currentPath === item.segment}
                onClick={() => handleNavigation(item.segment)}
                sx={{ borderRadius: 1, mb: 1 }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.title} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        {/* Logout */}
        <Box sx={{ flexGrow: 1 }} />
        <List sx={{ p: 2 }}>
          <ListItem disablePadding>
            <ListItemButton onClick={handleLogout} sx={{ borderRadius: 1 }}>
              <ListItemIcon sx={{ minWidth: 40 }}>
                <LogoutOutlinedIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          backgroundColor: 'background.default',
        }}
      >
        {/* Header */}
        <AppBar
          position="fixed"
          sx={{
            ml: `${drawerWidth}px`,
            width: `calc(100% - ${drawerWidth}px)`,
          }}
        >
          <Toolbar sx={{ height: '76px' }}>
            <Typography variant="h6" noWrap component="div">
              {NAVIGATION.find((item) => item.segment === currentPath)?.title || 'Dashboard'}
            </Typography>
          </Toolbar>
        </AppBar>

        {/* Content */}
        <Box
          sx={{
            flexGrow: 1,
            p: 3,
            mt: '76px',
            overflow: 'auto',
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default AppLayout;
