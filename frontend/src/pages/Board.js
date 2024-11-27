import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  IconButton,
  TextField,
  Typography,
  Button,
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { toggleFavourite } from '../redux/features/favouriteSlice';
import { deleteBoard, updateBoard } from '../redux/features/boardSlice';
import { addRecent } from '../redux/features/favouriteSlice';
import EmojiPicker from '../components/common/EmojiPicker.js';
import Kanban from '../components/common/Kanban';

const Board = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { boardId } = useParams();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [sections, setSections] = useState([]);
  const [icon, setIcon] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);

  const boards = useSelector((state) => state.board.value);
  const favorites = useSelector((state) => state.favourites.value);

  useEffect(() => {
    const board = boards.find(e => e.id === boardId);
    if (board) {
      setTitle(board.title);
      setDescription(board.description);
      setSections(board.sections);
      setIcon(board.icon);
      setIsFavorite(favorites.some(f => f.id === boardId));
      dispatch(addRecent(board));
    }
  }, [boardId, boards, favorites, dispatch]);

  const handleUpdateTitle = async (e) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    dispatch(updateBoard({ boardId, title: newTitle }));
  };

  const handleUpdateDescription = async (e) => {
    const newDescription = e.target.value;
    setDescription(newDescription);
    dispatch(updateBoard({ boardId, description: newDescription }));
  };

  const handleDeleteBoard = async () => {
    try {
      await dispatch(deleteBoard(boardId));
      navigate('/boards');
    } catch (err) {
      console.error('Error deleting board:', err);
    }
  };

  const handleToggleFavorite = () => {
    dispatch(toggleFavourite(boardId));
    setIsFavorite(!isFavorite);
  };

  const onIconChange = async (newIcon) => {
    setIcon(newIcon);
    dispatch(updateBoard({ boardId, icon: newIcon }));
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <EmojiPicker icon={icon} onChange={onIconChange} />
          <TextField
            value={title}
            onChange={handleUpdateTitle}
            placeholder='Untitled'
            variant='outlined'
            sx={{
              '& .MuiOutlinedInput-input': { padding: '5px 10px' },
              '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
              '& .MuiOutlinedInput-root': { fontSize: '2rem', fontWeight: '700' }
            }}
          />
          <IconButton onClick={handleToggleFavorite}>
            {isFavorite ? (
              <StarIcon sx={{ color: 'warning.main' }} />
            ) : (
              <StarBorderIcon />
            )}
          </IconButton>
        </Box>
        <Button
          variant='outlined'
          color='error'
          startIcon={<DeleteOutlineIcon />}
          onClick={handleDeleteBoard}
        >
          Delete
        </Button>
      </Box>
      <Box sx={{ mb: 3 }}>
        <TextField
          value={description}
          onChange={handleUpdateDescription}
          placeholder='Add a description'
          variant='outlined'
          multiline
          fullWidth
          sx={{
            '& .MuiOutlinedInput-input': { padding: '5px 10px' },
            '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
            '& .MuiOutlinedInput-root': { fontSize: '1rem' }
          }}
        />
      </Box>
      <Box>
        <Kanban data={sections} boardId={boardId} />
      </Box>
    </Box>
  );
};

export default Board;