import { useState } from 'react';
import { Box, Button, TextField, Typography, Container } from '@mui/material';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import boardApi from '../api/boardApi';
import { getBoards } from '../redux/features/boardSlice';

const CreateBoard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await boardApi.create({ title: title || 'Untitled Board', description });
      dispatch(getBoards()); // Refresh the boards list
      navigate(`/boards/${res._id}`);
    } catch (err) {
      setError(err.message || 'Failed to create board');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          mt: 4,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          '& .MuiTextField-root': { width: '100%' },
        }}
      >
        <Typography variant="h5" sx={{ mb: 2 }}>
          Create New Board
        </Typography>

        <TextField
          label="Board Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter board title"
          variant="outlined"
        />

        <TextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter board description"
          variant="outlined"
          multiline
          rows={4}
        />

        {error && (
          <Typography color="error" variant="body2">
            {error}
          </Typography>
        )}

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Button
            variant="outlined"
            onClick={() => navigate('/boards')}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
          >
            Create Board
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default CreateBoard;
