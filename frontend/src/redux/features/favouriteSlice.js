import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import boardApi from '../../api/boardApi'

const initialState = { 
  value: [], 
  loading: false, 
  error: null,
  recentBoards: []
}

export const getFavourites = createAsyncThunk(
  'favourite/getFavourites',
  async (_, { rejectWithValue }) => {
    try {
      const response = await boardApi.getFavourites();
      return response;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const toggleFavourite = createAsyncThunk(
  'favourite/toggleFavourite',
  async (boardId, { rejectWithValue }) => {
    try {
      const response = await boardApi.updateFavouritePosition(boardId);
      return response;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const favouriteSlice = createSlice({
  name: 'favourites',
  initialState,
  reducers: {
    addRecent: (state, action) => {
      const board = action.payload;
      state.recentBoards = [
        board,
        ...state.recentBoards.filter(b => b.id !== board.id)
      ].slice(0, 5); // Keep only last 5 recent boards
    },
    clearRecents: (state) => {
      state.recentBoards = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFavourites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFavourites.fulfilled, (state, action) => {
        state.loading = false;
        state.value = action.payload;
      })
      .addCase(getFavourites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(toggleFavourite.fulfilled, (state, action) => {
        const board = action.payload;
        const exists = state.value.find(b => b.id === board.id);
        if (exists) {
          state.value = state.value.filter(b => b.id !== board.id);
        } else {
          state.value.push(board);
        }
      });
  }
});

export const { addRecent, clearRecents } = favouriteSlice.actions;

export default favouriteSlice.reducer;
