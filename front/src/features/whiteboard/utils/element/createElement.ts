import { toolTypes } from "src/constants";
import rough from "roughjs/bin/rough";

const generator = rough.generator();

const generateRectangle = ({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) => {
  return generator.rectangle(x1, y1, x2 - x1, y2 - y1);
};
const generateLine = ({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) => {
  return generator.line(x1, y1, x2, y2);
};
;
export const createElement = ({ x1, y1, x2, y2, toolType, id, text }: { x1: number; y1: number; x2: number; y2: number; toolType: toolTypes; id: string, text?: string }) => {
  let roughElement;
  let options;
  switch (toolType) {
    case toolTypes.RECTANGLE:
      roughElement = generateRectangle({ x1, y1, x2, y2 });
      options = { ...roughElement.options };
      delete options.randomizer;
      return {
        id: id,
        roughElement: { ...roughElement, options },
        type: toolType,
        x1,
        y1,
        x2,
        y2,
      };
    case toolTypes.LINE:
      roughElement = generateLine({ x1, x2, y1, y2 });
      options = { ...roughElement.options };
      delete options.randomizer;
      return {
        id: id,
        roughElement: { ...roughElement, options },
        type: toolType,
        x1,
        y1,
        x2,
        y2,
      };
    case toolTypes.PENCIL:
      return {
        id,
        type: toolType,
        points: [{ x: x1, y: y1 }],
      };
    case toolTypes.TEXT:
      return { id, type: toolType, x1, y1, x2, y2, text: text || "" };
    default:
      throw new Error("Something went wrong when creating element");
  }
};
