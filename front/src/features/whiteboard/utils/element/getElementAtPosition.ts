import { toolTypes, cursorPositions } from "src/constants";
import { Element, Point } from "../../types";


const distance = (a: Point, b: Point): number =>
  Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));

const onLine = ({
  x1, y1, x2, y2, x, y, maxDistance = 1,
}: {
  x1: number; y1: number; x2: number; y2: number; x: number; y: number; maxDistance?: number;
}): cursorPositions | null => {
  const a = { x: x1, y: y1 };
  const b = { x: x2, y: y2 };
  const c = { x, y };

  const offset =
    distance(a, b) - (distance(a, c) + distance(b, c));
  return Math.abs(offset) < maxDistance ? cursorPositions.INSIDE : null;
};


const nearPoint = (x: number, y: number, x1: number, y1: number, cursorPosition: typeof cursorPositions[keyof typeof cursorPositions]) => {
  return Math.abs(x - x1) < 5 && Math.abs(y - y1) < 5 ? cursorPosition : null;
};

const positionWithinElement = (x: number, y: number, element: Element) => {
  const { type, x1, x2, y1, y2 } = element;

  switch (type) {
    case toolTypes.RECTANGLE:
      const topLeft = nearPoint(x, y, (x1 || 0), (y1 || 0), cursorPositions.TOP_LEFT);
      const topRight = nearPoint(x, y, (x2 || 0), (y1 || 0), cursorPositions.TOP_RIGHT);
      const bottomLeft = nearPoint(x, y, (x1 || 0), (y2 || 0), cursorPositions.BOTTOM_LEFT);
      const bottomRight = nearPoint(x, y, (x2 || 0), (y2 || 0), cursorPositions.BOTTOM_RIGHT);
      const inside =
        x >= (x1 || 0) && x <= (x2 || 0) && y >= (y1 || 0) && y <= (y2 || 0)
          ? cursorPositions.INSIDE
          : null;
      return topLeft || topRight || bottomLeft || bottomRight || inside;
    case toolTypes.TEXT:
      return x >= (x1 || 0) && x <= (x2 || 0) && y >= (y1 || 0) && y <= (y2 || 0)
        ? cursorPositions.INSIDE
        : null;
    case toolTypes.LINE:
      const on = onLine({ x1: (x1 || 0), y1: (y1 || 0), x2: (x2 || 0), y2: (y2 || 0), x, y });
      const start = nearPoint(x, y, (x1 || 0), (y1 || 0), cursorPositions.START);
      const end = nearPoint(x, y, (x2 || 0), (y2 || 0), cursorPositions.END);
      return start || end || on;

    case toolTypes.PENCIL:
      const betweenAnyPoint = element.points!.some((point, index) => {
        const nextPoint = element.points![index + 1];
        if (!nextPoint) return false;

        return onLine({
          x1: point.x,
          y1: point.y,
          x2: nextPoint.x,
          y2: nextPoint.y,
          x,
          y,
          maxDistance: 5,
        });
      });

      return betweenAnyPoint ? cursorPositions.INSIDE : null;
    default:
      return null;
  }
};

export function getElementAtPosition(x: number, y: number, elements: Array<Element>) {
  return elements
    .map((el) => ({
      ...el,
      position: positionWithinElement(x, y, el),
    }))
    .find((el) => el.position !== null && el.position !== undefined);
}
