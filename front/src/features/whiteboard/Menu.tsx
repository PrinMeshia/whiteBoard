import React from "react";
import rectangleIcon from "src/resources/icons/rectangle.svg";
import lineIcon from "src/resources/icons/line.svg";
import rubberIcon from "src/resources/icons/rubber.svg";
import pencilIcon from "src/resources/icons/pencil.svg";
import textIcon from "src/resources/icons/text.svg";
import selectionIcon from "src/resources/icons/selection.svg";

import { useDispatch, useSelector } from "react-redux";
import { setElements, setToolType } from "./whiteboardSlice";
import "./menu.css";
import { RootState } from "src/app/store";
import { toolTypes } from "src/constants";
import { emitClearWhiteboard } from "src/socketConn/socketConn";

interface IconButtonProps {
  src: string;
  type?: string;
  isRubber?: boolean;
}

const IconButton: React.FC<IconButtonProps> = ({ src, type, isRubber }) => {
  const dispatch = useDispatch();
  const selectedToolType = useSelector(
    (state: RootState) => state.whiteboard.tool
  );

  const handleToolChange = () => {
    if (type) {
      dispatch(setToolType(type));
    }
  };

  const handleClearCanvas = () => {
    dispatch(setElements([]));
    // Ajouter la définition pour emitClearWhiteboard()
    emitClearWhiteboard();
  };

  const handleClick = isRubber ? handleClearCanvas : handleToolChange;

  return (
    <button
      onClick={handleClick}
      className={
        type && selectedToolType === type
          ? "menu_button_active"
          : "menu_button"
      }
    >
      <img width="80%" height="80%" src={src} alt={type} />
    </button>
  );
};

const menuItems = [
  { src: rectangleIcon, type: toolTypes.RECTANGLE },
  { src: lineIcon, type: toolTypes.LINE },
  { src: pencilIcon, type: toolTypes.PENCIL },
  { src: textIcon, type: toolTypes.TEXT },
  { src: selectionIcon, type: toolTypes.SELECTION },
  { src: rubberIcon, isRubber: true },
  
];

const Menu: React.FC = () => {
  return (
    <div className="menu_container">
      {menuItems.map((item, index) => (
        <IconButton
          key={index}
          src={item.src}
          type={item.type}
          isRubber={item.isRubber}
        />
      ))}
    </div>
  );
};


export default Menu;
