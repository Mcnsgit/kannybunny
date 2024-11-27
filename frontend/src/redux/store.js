import { configureStore } from "@reduxjs/toolkit";
import boardReducer from './features/boardSlice';

export const store = configureStore({
  reducer: {
    board: boardReducer,
  },
  // Redux Toolkit's configureStore adds the thunk middleware by default
});