import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {Element } from "./types";


interface WhiteboardState {
  tool: string | null;
  elements: Element[];
  action: string | null;
  selectedElement: Element | null; // <-- modifié ici
}

const initialState: WhiteboardState = {
  tool: null,
  elements: [],
  action: null,
  selectedElement: null,
};

const whiteboardSlice = createSlice({
  name: "whiteboard",
  initialState,
  reducers: {
    setToolType: (state, action: PayloadAction<string | null>) => {
      state.tool = action.payload;
    },
    updateElement: (state, action: PayloadAction<Element>) => {
      const { id } = action.payload;
      const index = state.elements.findIndex((element) => element.id === id);
      if (index === -1) {
        state.elements.push(action.payload);
      } else {
        // if index will be found
        // update element in our array of elements
        state.elements[index] = action.payload;
      }
    },
    setElements: (state, action: PayloadAction<Element[]>) => {
      state.elements = action.payload;
    },
  },
});

export const { setToolType, updateElement, setElements } =
  whiteboardSlice.actions;

export default whiteboardSlice.reducer;
