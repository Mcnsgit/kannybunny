import { Box, Typography, Grid, Button, IconButton } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getBoards } from "../redux/features/boardSlice";
import FunBunny from '../assets/Funbunny.png';
import AddIcon from '@mui/icons-material/Add';
import Loading from "../components/common/Loading";
import { colors } from '../styles';
import Sidebar from "../components/common/Sidebar";

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { value: boards, loading, error } = useSelector((state) => state.board);

  useEffect(() => {
    dispatch(getBoards());
  }, [dispatch]);

  const handleCreateBoard = () => {
    navigate('/boards/create');
  };

  if (loading) return <Loading fullHeight />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box sx={{ p: 3, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <img
              src={FunBunny}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: 'white',
                padding: '4px'
              }}
              alt='app logo'
            />
            <Typography variant="h5">
              Welcome to Kanny Banny! Can't handle the workload? Come we Kanny!
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateBoard}
            sx={{ borderRadius: 2 }}
          >
            Create Board
          </Button>
        </Box>

        <Grid container spacing={2}>
          {boards.map((board) => (
            <Grid item key={board._id} xs={12} sm={6} md={4} lg={3}>
              <Box
                onClick={() => navigate(`/boards/${board._id}`)}
                sx={{
                  height: 200,
                  p: 2,
                  borderRadius: 2,
                  bgcolor: 'background.paper',
                  cursor: 'pointer',
                  boxShadow: 1,
                  '&:hover': {
                    boxShadow: 2,
                    transform: 'translateY(-4px)',
                    transition: 'all 0.3s ease-in-out'
                  }
                }}
              >
                <Typography variant="h6" noWrap>
                  {board.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {board.description || 'No description'}
                </Typography>
              </Box>
            </Grid>
          ))}
          
          {/* Add Board Card */}
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Box
              onClick={handleCreateBoard}
              sx={{
                height: 200,
                p: 2,
                borderRadius: 2,
                bgcolor: 'background.paper',
                cursor: 'pointer',
                boxShadow: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                '&:hover': {
                  boxShadow: 2,
                  transform: 'translateY(-4px)',
                  transition: 'all 0.3s ease-in-out'
                }
              }}
            >
              <IconButton size="large">
                <AddIcon sx={{ fontSize: 48 }} />
              </IconButton>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Home;
