import { toolTypes } from "src/constants";
import getStroke from "perfect-freehand";
import { Element } from "src/features/whiteboard/types";
import { getSvgPathFromStroke } from "./getSvgPathFromStroke";

const drawPencilElement = (context: CanvasRenderingContext2D, element: Element) => {
  const myStroke = getStroke(element.points || [], {
    size: 10,
  }) as (number)[][];

  const pathData = getSvgPathFromStroke(myStroke.map(([x, y]) => [x, y ?? 0]));

  const myPath = new Path2D(pathData);
  context.fill(myPath);
};

const drawTextElement = (context: CanvasRenderingContext2D, element: Element) => {
  context.textBaseline = "top";
  context.font = "24px sans-serif";
  context.fillText(element.text || "", element.x1 || 0, element.y1 || 0);
};

export const drawElement = ({ roughCanvas, context, element }: { roughCanvas: any, context: CanvasRenderingContext2D, element: Element }) => {
  switch (element.type) {
    case toolTypes.RECTANGLE:
    case toolTypes.LINE:
      return roughCanvas.draw((element as Element).roughElement);
    case toolTypes.PENCIL:
      drawPencilElement(context, element);
      break;
    case toolTypes.TEXT:
      drawTextElement(context, element);
      break;
    default:
      throw new Error("Something went wrong when drawing element");
  }
};
