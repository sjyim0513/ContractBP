import React, { useState } from "react";

import { functionList } from "../../../../functionList";

//function list를 리스트에 추가하고, 마지막에는 create custom function 추가하기 -> 검색할 때는 마지막꺼는 안 되게

// ContextMenu 컴포넌트
const ContextMenu: React.FC<{ x: number; y: number }> = ({ x, y }) => {
  return (
    <div
      style={{
        position: "absolute",
        top: y,
        left: x,
        backgroundColor: "white",
        border: "1px solid #ccc",
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
        padding: "10px",
        zIndex: 1000,
      }}
    >
      <ul style={{ margin: 0, padding: 0, listStyleType: "none" }}>
        <li style={{ padding: "5px 10px" }}>Option 1</li>
        <li style={{ padding: "5px 10px" }}>Option 2</li>
        <li style={{ padding: "5px 10px" }}>Option 3</li>
      </ul>
    </div>
  );
};

const BP: React.FC = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault(); // 기본 우클릭 메뉴 방지
    setMenuPosition({ x: event.pageX, y: event.pageY });
    setShowMenu(true);
  };

  const handleClick = () => {
    setShowMenu(false);
  };

  return (
    <div
      style={{
        width: "500px",
        height: "500px",
        backgroundColor: "#f0f0f0",
      }}
      onContextMenu={handleContextMenu}
      onClick={handleClick}
    >
      {showMenu && <ContextMenu x={menuPosition.x} y={menuPosition.y} />}
    </div>
  );
};

export default BP;
