import { cursorPositions, toolTypes } from "src/constants";

export type Element = {
  id: string;
  type: toolTypes;
  index?: number;
  x1?: number;
  y1?: number;
  x2?: number;
  y2?: number;
  roughElement?: any;
  points?: { x: number; y: number }[];
  text?: string;
  offsetX?: number; 
  offsetY?: number;
  position?: cursorPositions;
  xOffsets?: number[]; // Ajout de la propriété xOffsets
  yOffsets?: number[]; // Ajout de la propriété yOffsets
};