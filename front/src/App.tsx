import React, { useEffect } from 'react';
import Whiteboard from 'src/features/whiteboard/Whiteboard';
import { connectWithSocketServer } from 'src/socketConn/socketConn';
import CursorOverlay from 'src/features/cursorOverlay/CursorOverlay';

function App() {
  useEffect(() => {
    connectWithSocketServer();
  }, []);
  return (
    <div className="App">
        <Whiteboard/>
        <CursorOverlay />
    </div>
  );
}

export default App;
