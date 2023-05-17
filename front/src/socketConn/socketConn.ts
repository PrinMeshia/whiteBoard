import { io, Socket } from "socket.io-client";
import { store } from "src/app/store";
import { updateCursorPosition, removeCursorPosition } from "src/features/cursorOverlay/cursorSlice";
import { setUserId } from "src/features/user/userSlice";
import { setElements, updateElement } from "src/features/whiteboard/whiteboardSlice";

let socket: Socket;
type Point = {
  x: number;
  y: number;
};

export const connectWithSocketServer = (): void => {
  socket = io("http://localhost:3003");

  socket.on("connect", () => {
    console.log("connected to socket.io server");
  });
  socket.on("socket-id", (socketId) => {
    store.dispatch(setUserId(socketId));
  });
  socket.on("whiteboard-state", (elements: any) => {
    store.dispatch(setElements(elements));
  });
   socket.on("whiteboard-clear", () => {
    store.dispatch(setElements([]));
  });
  socket.on("element-update", (elementData: any) => {
    store.dispatch(updateElement(elementData));
  });
  socket.on("cursor-position", (cursorData: any) => {
    store.dispatch(updateCursorPosition(cursorData));
  });

  socket.on("user-disconnected", (disconnectedUserId: any) => {
    store.dispatch(removeCursorPosition(disconnectedUserId));
  });
};

export const emitElementUpdate = (elementData: any): void => {
  if (socket) {
    socket.emit("element-update", elementData);
  } else {
    console.error("Socket is not defined");
  }
};

export const emitClearWhiteboard = () => {
  if (socket) {
    socket.emit("whiteboard-clear");
  } else {
    console.error("Socket is not defined");
  }
};

export const emitCursorPosition = (cursorData: Point) => {
  if (socket) {
    socket.emit("cursor-position", cursorData);
  } else {
    console.error("Socket is not defined");
  }
  
};
