import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import whiteboardSliceReducer from 'src/features/whiteboard/whiteboardSlice';
import cursorSliceReducer from "src/features/cursorOverlay/cursorSlice";
import userSlice from 'src/features/user/userSlice';


export const store = configureStore({
  reducer: {
    whiteboard: whiteboardSliceReducer,
    Cursor: cursorSliceReducer,
    User: userSlice,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck : {
      ignoredActions: ['whiteboard/setElements'],
      ignorePaths: ['whiteboard.elements']
    }
  })
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

