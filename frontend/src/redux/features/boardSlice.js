import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import boardApi from '../../api/boardApi';

const initialState = {
  value: [],
  loading: false,
  error: null
};

// Async thunks
export const getBoards = createAsyncThunk(
  'board/getBoards',
  async (_, { rejectWithValue }) => {
    try {
      const response = await boardApi.getAll();
      return response;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const updateBoard = createAsyncThunk(
  'board/updateBoard',
  async ({ boardId, updatedFields }, { rejectWithValue }) => {
    try {
      const response = await boardApi.update(boardId, updatedFields);
      return response;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const deleteBoard = createAsyncThunk(
  'board/deleteBoard',
  async (boardId, { rejectWithValue }) => {
    try {
      await boardApi.delete(boardId);
      return boardId;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const boardSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {
    setBoards: (state, action) => {
      state.value = action.payload;
    },
    updateBoardInState: (state, action) => {
      const { boardId, updatedFields } = action.payload;
      state.value = state.value.map(board => 
        board.id === boardId ? { ...board, ...updatedFields } : board
      );
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Boards
      .addCase(getBoards.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBoards.fulfilled, (state, action) => {
        state.loading = false;
        state.value = action.payload;
      })
      .addCase(getBoards.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch boards';
      })
      // Update Board
      .addCase(updateBoard.fulfilled, (state, action) => {
        const updatedBoard = action.payload;
        state.value = state.value.map(board => 
          board.id === updatedBoard.id ? updatedBoard : board
        );
      })
      // Delete Board
      .addCase(deleteBoard.fulfilled, (state, action) => {
        state.value = state.value.filter(board => board.id !== action.payload);
      });
  },
});

export const { setBoards, updateBoardInState } = boardSlice.actions;

export default boardSlice.reducer;