import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "src/app/store";
import cursor from "src/resources/icons/selection.svg";

const CursorOverlay: React.FC = () => {
  const userId = useSelector((state: RootState) => state.User.id);
  const cursors = useSelector((state: RootState) => state.Cursor.cursors);

  return (
    <>
      {cursors.map((c) => (
        userId !== c.userId && (
          <img
            key={c.userId}
            className="cursor"
            style={{ position: "absolute", left: c.x, top: c.y, width: "30px" }}
            src={cursor}
            alt="Cursor"
          />
        )
      ))}
    </>
  );
};

export default CursorOverlay;
