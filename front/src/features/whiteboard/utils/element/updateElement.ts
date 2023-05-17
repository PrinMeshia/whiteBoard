import { toolTypes } from "src/constants";
import { createElement } from "./createElement";
import { setElements } from "src/features/whiteboard/whiteboardSlice";
import { store } from "src/app/store";
import { emitElementUpdate } from "src/socketConn/socketConn";
import { Element } from "src/features/whiteboard/types";


export const updatePencilElementWhenMoving = (
  { index, newPoints }: { index: number, newPoints: {x: number, y: number}[] },
  elements: Element[]
) => {
  const elementsCopy = [...elements];

  elementsCopy[index] = {
    ...elementsCopy[index],
    points: newPoints,
  };

  const updatedPencilElement = elementsCopy[index];

  store.dispatch(setElements(elementsCopy));
  emitElementUpdate(updatedPencilElement);
};

export const updateElement = (
  { id, x1, x2, y1, y2, type, index, text }: {
    id: string;
    x1?: number;
    x2?: number;
    y1?: number;
    y2?: number;
    type: toolTypes;
    index: number;
    text?: string;
  },
  elements: (Element)[]
) => {
  const elementsCopy = [...elements];

  switch (type) {
    case toolTypes.LINE:
    case toolTypes.RECTANGLE:
      const updatedElement = createElement({
        id,
        x1: x1 || 0,
        y1: y1 || 0,
        x2: x2 || 0,
        y2: y2 || 0,
        toolType: type,
      });

      elementsCopy[index] = updatedElement;

      store.dispatch(setElements(elementsCopy));

      emitElementUpdate(updatedElement);
      break;
    case toolTypes.PENCIL:
      elementsCopy[index] = {
        ...elementsCopy[index],
        points: [
          ...elementsCopy[index]?.points ?? [],
          {
            x: x2 || 0,
            y: y2 || 0,
          },
        ],
      };

      const updatedPencilElement = elementsCopy[index];

      store.dispatch(setElements(elementsCopy));

      emitElementUpdate(updatedPencilElement);
      break;
    case toolTypes.TEXT:
      const canvas = document.querySelector("canvas") as HTMLCanvasElement;
      const context = canvas.getContext("2d");

      if (context) {
        const textWidth = context.measureText(text || "").width;
        const textHeight = 24;
        const updatedElement = createElement({
          id,
          x1: x1 || 0,
          y1: y1 || 0,
          x2: (x1 || 0) + textWidth,
          y2: (y1 || 0) + textHeight,
          toolType: type,
          text: text
        });

        elementsCopy[index] = updatedElement;

      };

      const updatedTextElement = elementsCopy[index];

      store.dispatch(setElements(elementsCopy));

      emitElementUpdate(updatedTextElement);
      break;
    default:
      throw new Error("Something went wrong when updating element");
  }
};
