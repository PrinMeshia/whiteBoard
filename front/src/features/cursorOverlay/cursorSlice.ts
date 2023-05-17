import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Cursor {
  userId: string;
  x: number;
  y: number;
}

interface CursorState {
  cursors: Cursor[];
}

const initialState: CursorState = {
  cursors: [],
};

const cursorSlice = createSlice({
  name: "cursor",
  initialState,
  reducers: {
    updateCursorPosition: (
      state,
      action: PayloadAction<{ userId: string; x: number; y: number }>
    ) => {
      const { x, y, userId } = action.payload;

      const index = state.cursors.findIndex((c) => c.userId === userId);

      if (index !== -1) {
        state.cursors[index] = {
          userId,
          x,
          y,
        };
      } else {
        state.cursors.push({
          userId,
          x,
          y,
        });
      }
    },
    removeCursorPosition: (state, action: PayloadAction<string>) => {
      state.cursors = state.cursors.filter((c) => c.userId !== action.payload);
    },
  },
});

export const { updateCursorPosition, removeCursorPosition } =
  cursorSlice.actions;

export default cursorSlice.reducer;
