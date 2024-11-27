import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography, Divider } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import StarIcon from '@mui/icons-material/Star';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LogoutIcon from '@mui/icons-material/Logout';
import React from 'react';
import { Link, useParams } from 'react-router-dom';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import boardApi from '../../api/boardApi';
import { setBoards } from '../../redux/features/boardSlice';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import Funbunny from '../../assets/Funbunny.png';
import assets from '../../assets/index';

const Sidebar = () => {
  const logo = Funbunny;
  const boards = useSelector((state) => state.board.value);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { recentBoards } = useSelector((state) => state.favourites);
  const user = useSelector((state) => state.user.value);

  const sidebarWidth = 250;

  const mainLinks = [
    {
      text: 'Boards',
      path: '/boards',
      icon: <DashboardIcon />
    },
    {
      text: 'Favorites',
      path: '/favorites',
      icon: <StarIcon />
    },
    {
      text: 'Create Board',
      path: '/boards/create',
      icon: <AddBoxOutlinedIcon />
    }
  ];

  const onDragEnd = async ({ source, destination }) => {
    if (!destination) return;
    const newList = [...boards];
    const [removed] = newList.splice(source.index, 1);
    newList.splice(destination.index, 0, removed);

    try {
      await boardApi.updatePosition({ boards: newList });
      dispatch(setBoards(newList));
    } catch (error) {
      console.error('Error in drag and drop:', error);
    }
  };

  return (
    <Drawer
      container={window.document.body}
      variant='permanent'
      open={true}
      sx={{
        width: sidebarWidth,
        height: '100vh',
        '& > div': { borderRight: 'none' }
      }}
    >
      <List
        disablePadding
        sx={{
          width: sidebarWidth,
          height: '100vh',
          backgroundColor: assets.colors.secondary
        }}
      >
        <ListItem>
          <Box sx={{ width: '100%', display: 'flex', alignItems: 'center' }}>
            <Typography variant='h6' fontWeight='700'>
              Kanny Banny
            </Typography>
          </Box>
        </ListItem>

        <Box sx={{ paddingTop: '10px' }} />

        {mainLinks.map((link) => (
          <ListItem key={link.text} disablePadding>
            <ListItemButton
              selected={location.pathname === link.path}
              onClick={() => navigate(link.path)}
              sx={{
                pl: '20px',
                '&.Mui-selected': {
                  backgroundColor: assets.colors.primary
                },
                '&.Mui-selected:hover': {
                  backgroundColor: assets.colors.primary
                }
              }}
            >
              <ListItemIcon sx={{ color: assets.colors.primary }}>
                {link.icon}
              </ListItemIcon>
              <ListItemText
                primary={link.text}
                sx={{
                  color: assets.colors.primary
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}

        {recentBoards.length > 0 && (
          <>
            <Box sx={{ pt: 2, pb: 1 }}>
              <Divider />
            </Box>
            <ListItem>
              <Box sx={{ width: '100%' }}>
                <Typography
                  variant="subtitle2"
                  fontWeight="700"
                  sx={{ color: assets.colors.primary, pl: 2 }}
                >
                  Recent Boards
                </Typography>
              </Box>
            </ListItem>
            {recentBoards.map((board) => (
              <ListItem key={board.id} disablePadding>
                <ListItemButton
                  onClick={() => navigate(`/boards/${board.id}`)}
                  sx={{
                    pl: '20px',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)'
                    }
                  }}
                >
                  <ListItemIcon sx={{ color: assets.colors.primary }}>
                    <AccessTimeIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary={board.title}
                    sx={{
                      color: assets.colors.primary,
                      '& .MuiTypography-root': {
                        fontSize: '0.875rem',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </>
        )}

        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="board-list">
            {(provided) => (
              <List
                {...provided.droppableProps}
                ref={provided.innerRef}
                sx={{
                  flexGrow: 1,
                  overflow: 'auto',
                  '& .MuiListItem-root': {
                    borderRadius: 1,
                    margin: '4px 8px',
                    '&.Mui-selected': {
                      backgroundColor: 'action.selected'
                    }
                  }
                }}
              >
                {boards.map((item, index) => (
                  <Draggable
                    key={item._id}
                    draggableId={item._id}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <ListItem
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        component={Link}
                        to={`/boards/${item._id}`}
                        sx={{
                          pl: '20px',
                          cursor: snapshot.isDragging ? 'grab' : 'pointer',
                          backgroundColor: snapshot.isDragging ? 'action.hover' : 'transparent'
                        }}
                      >
                        <Typography
                          variant='body2'
                          sx={{
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}
                        >
                          {item.icon} {item.title}
                        </Typography>
                      </ListItem>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </List>
            )}
          </Droppable>
        </DragDropContext>

        <Box sx={{ flexGrow: 1 }} />

        <ListItem>
          <Box sx={{ width: '100%', textAlign: 'center', pb: 1 }}>
            <Typography variant="body2" sx={{ color: assets.colors.primary }}>
              {user?.username || 'User'}
            </Typography>
          </Box>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton
            onClick={() => navigate('/logout')}
            sx={{
              pl: '20px'
            }}
          >
            <ListItemIcon sx={{ color: assets.colors.primary }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText
              primary='Logout'
              sx={{
                color: assets.colors.primary
              }}
            />
          </ListItemButton>
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;
