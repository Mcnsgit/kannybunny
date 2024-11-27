import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, Grid, Card, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import StarIcon from '@mui/icons-material/Star';
import { getFavourites, toggleFavourite } from '../redux/features/favouriteSlice';
import Loading from '../components/common/Loading';

const Favorites = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { value: favourites, loading, error } = useSelector((state) => state.favourites);

  useEffect(() => {
    dispatch(getFavourites());
  }, [dispatch]);

  const handleBoardClick = (boardId) => {
    navigate(`/boards/${boardId}`);
  };

  const handleToggleFavorite = (e, boardId) => {
    e.stopPropagation();
    dispatch(toggleFavourite(boardId));
  };

  if (loading) return <Loading />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Favorite Boards
      </Typography>

      {favourites.length === 0 ? (
        <Typography color="text.secondary">
          No favorite boards yet. Star a board to see it here!
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {favourites.map((board) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={board.id}>
              <Card
                onClick={() => handleBoardClick(board.id)}
                sx={{
                  p: 2,
                  cursor: 'pointer',
                  position: 'relative',
                  '&:hover': {
                    bgcolor: 'action.hover',
                  },
                }}
              >
                <Typography variant="h6" noWrap>
                  {board.title}
                </Typography>
                <Typography color="text.secondary" noWrap>
                  {board.description || 'No description'}
                </Typography>
                <IconButton
                  size="small"
                  onClick={(e) => handleToggleFavorite(e, board.id)}
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    color: 'warning.main',
                  }}
                >
                  <StarIcon />
                </IconButton>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default Favorites;