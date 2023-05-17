import React, { useRef, useLayoutEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Menu from "./Menu";
import rough from "roughjs/bin/rough";
import { RootState } from "src/app/store";
import {
  createElement,
  updateElement,
  drawElement,
  adjustmentRequired,
  adjustElementCoordinates,
  getElementAtPosition,
  getCursorForPosition,
  getResizedCoordinates,
  updatePencilElementWhenMoving,
} from "./utils";
import { v4 as uuid } from "uuid";
import { updateElement as updateElementInStore } from "./whiteboardSlice";
import { actions, toolTypes, cursorPositions } from "src/constants";
import { Element, Point } from "./types";
import { emitCursorPosition } from "src/socketConn/socketConn";

let emitCursor = true;
let lastCursorPosition:Point;

type ElementWithOffset = Element;

const Whiteboard = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const toolType = useSelector((state: RootState) => state.whiteboard.tool);
  const elements = useSelector((state: RootState) => state.whiteboard.elements);

  const [action, setAction] = useState<string | null>(null);
  const [selectedElement, setSelectedElement] = useState<ElementWithOffset | null>(null);

  const dispatch = useDispatch();

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const roughCanvas = rough.canvas(canvas);

    elements.forEach((element: Element) => {
      drawElement({ roughCanvas, context: ctx, element });
    });
  }, [elements]);

  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const { clientX, clientY } = event;
    if (selectedElement && action === actions.WRITING) {
      return;
    }
    switch (toolType) {
      case toolTypes.RECTANGLE:
      case toolTypes.LINE:
      case toolTypes.PENCIL: {
        const element = createElement({
          x1: clientX,
          y1: clientY,
          x2: clientX,
          y2: clientY,
          toolType: toolType as toolTypes,
          id: uuid(),
        });
        setAction(actions.DRAWING);
        setSelectedElement(element);
        dispatch(updateElementInStore(element));
        break;
      }
      case toolTypes.TEXT:
        const element = createElement({
          x1: clientX,
          y1: clientY,
          x2: clientX,
          y2: clientY,
          toolType: toolType as toolTypes,
          id: uuid(),
        });
        setAction(actions.WRITING);
        setSelectedElement(element);
        dispatch(updateElementInStore(element));
        break;
      case toolTypes.SELECTION: {
        const element = getElementAtPosition(clientX, clientY, elements);
        if (element &&
          (element.type === toolTypes.RECTANGLE ||
            element.type === toolTypes.TEXT ||
            element.type === toolTypes.LINE)
        ) {
          setAction(
            element.position === cursorPositions.INSIDE
              ? actions.MOVING
              : actions.RESIZING
          );

          const offsetX = clientX - (element.x1 || 0);
          const offsetY = clientY - (element.y1 || 0);

          setSelectedElement({ ...element, offsetX, offsetY, position: element.position ?? cursorPositions.START });
        }
        if (element && element.type === toolTypes.PENCIL && element.points) {
          setAction(actions.MOVING);
        
          const xOffsets = element.points.map((point) => clientX - point.x);
          const yOffsets = element.points.map((point) => clientY - point.y);
        
          setSelectedElement({ ...element, xOffsets, yOffsets,position: element.position ?? cursorPositions.START });
        }
        break;
      }

    }
  };
  const handleMouseUp = () => {
    

    if (!selectedElement) return
    const selectedElementIndex = elements.findIndex((el) => el.id === (selectedElement?.id ?? ""));
    if (selectedElementIndex !== -1) {
      if (action === actions.DRAWING || action === actions.RESIZING) {
        const elementToUpdate = elements[selectedElementIndex];
        if (elementToUpdate) {
          if (adjustmentRequired(elementToUpdate.type)) {
            const { x1, y1, x2, y2 } = adjustElementCoordinates(elementToUpdate);
            updateElement(
              {
                id: selectedElement.id,
                index: selectedElementIndex,
                x1,
                x2,
                y1,
                y2,
                type: elementToUpdate.type,
              },
              elements
            );
          }
        }
      }
    }

    setAction(null);
    setSelectedElement(null);
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const { clientX, clientY } = event;

    lastCursorPosition = { x: clientX, y: clientY };

    if (emitCursor) {
      emitCursorPosition({ x: clientX, y: clientY });
      emitCursor = false;

      console.log("sending-position");

      setTimeout(() => {
        emitCursor = true;
        emitCursorPosition(lastCursorPosition);
      }, 50);
    }

    if (action === actions.DRAWING) {
      const updatedElements = [...elements];
      const index = updatedElements.findIndex(
        (el) => el.id === (selectedElement?.id ?? "") as string
      );
      if (index !== -1) {
        updateElement(
          {
            index,
            id: updatedElements[index].id,
            x1: updatedElements[index].x1,
            y1: updatedElements[index].y1,
            x2: clientX,
            y2: clientY,
            type: updatedElements[index].type,
          },
          updatedElements
        );
      }
    }

    if (toolType === toolTypes.SELECTION) {
      const element = getElementAtPosition(clientX, clientY, elements);

      const cursorPosition = element
        ? (element.position ? getCursorForPosition(element.position) : "default")
        : "default";

      (event.target as HTMLElement).style.cursor = cursorPosition;
    }

    if (
      selectedElement &&
      toolType === toolTypes.SELECTION &&
      action === actions.MOVING &&
      selectedElement.type === toolTypes.PENCIL &&
      selectedElement.points !== undefined
    ) {
      const newPoints = selectedElement.points.map((_, index) => ({
        x: clientX - selectedElement.xOffsets![index],
        y: clientY - selectedElement.yOffsets![index],
      }));
    
      const index = elements.findIndex((el) => el.id === selectedElement.id);
    
      if (index !== -1) {
        updatePencilElementWhenMoving({ index, newPoints }, elements);
      }
    
      return;
    }

    if (
      toolType === toolTypes.SELECTION &&
      action === actions.MOVING &&
      selectedElement
    ) {
      const { id, x1, x2, y1, y2, type, offsetX, offsetY, text } = selectedElement;

      const width = (x2 || 0) - (x1 || 0);
      const height = (y2 || 0) - (y1 || 0);

      const newX1 = clientX - (offsetX || 0);
      const newY1 = clientY - (offsetY || 0);

      const index = elements.findIndex((el) => el.id === selectedElement.id);

      if (index !== -1) {
        updateElement(
          {
            id,
            x1: newX1,
            y1: newY1,
            x2: newX1 + width,
            y2: newY1 + height,
            type,
            index,
            text
          },
          elements
        );
      }
    }

    if (
      toolType === toolTypes.SELECTION &&
      action === actions.RESIZING &&
      selectedElement
    ) {
      const { id, type, position = cursorPositions.START, ...coordinates } = selectedElement;
      const { x1 = 0, y1 = 0, x2 = 0, y2 = 0 } = coordinates;
      const resizedCoordinates = getResizedCoordinates(
        clientX,
        clientY,
        position,
        { x1, y1, x2, y2 }
      );

      if (resizedCoordinates !== null) {
        const selectedElementIndex = elements.findIndex(
          (el) => el.id === selectedElement.id
        );

        if (selectedElementIndex !== -1) {
          const { x1: newX1 = 0, y1: newY1 = 0, x2: newX2 = 0, y2: newY2 = 0 } = resizedCoordinates;
          updateElement(
            {
              x1: newX1,
              y1: newY1,
              x2: newX2,
              y2: newY2,
              type: selectedElement.type,
              id: selectedElement.id,
              index: selectedElementIndex,
            },
            elements
          );
        }
      }
    }
  };

  const handleTextareaBlur = (event: React.FocusEvent<HTMLTextAreaElement>): void => {
    const { id, x1, y1, type } = selectedElement as Element;

    const index = elements.findIndex((el) => el.id === selectedElement!.id);

    if (index !== -1) {
      updateElement(
        { id, x1, y1, type, text: event.target.value, index },
        elements
      );

      setAction(null);
      setSelectedElement(null);
    }
  };

  return (
    <>
      <Menu />
      {action === actions.WRITING ? (
        <textarea
          ref={textAreaRef}
          onBlur={handleTextareaBlur}
          style={{
            position: "absolute",
            top: (selectedElement?.y1 ?? 0) - 3,
            left: (selectedElement?.x1 ?? 0),
            font: "24px sans-serif",
            margin: 0,
            padding: 0,
            border: 0,
            outline: 0,
            resize: "both",
            overflow: "hidden",
            whiteSpace: "pre",
            background: "transparent",
          }}
        />
      ) : null}
      <canvas
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
      />
    </>
  );
};

export default Whiteboard;
