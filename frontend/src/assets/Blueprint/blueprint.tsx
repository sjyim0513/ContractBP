import React, { useState, useRef } from "react";

import { functionList } from "../../../../functionList";

import Circle from "../component/baseCircle";

import baseBP from "../component/baseAsset";

import classes from "./blueprint.module.css";

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
  const [scale, setScale] = useState<number>(1);
  const [translateX, setTranslateX] = useState<number>(0);
  const [translateY, setTranslateY] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [startX, setStartX] = useState<number>(0);
  const [startY, setStartY] = useState<number>(0);

  const containerRef = useRef<HTMLDivElement>(null);

  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (!containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();

    const mouseX = event.clientX - containerRect.left; // 마우스 커서의 X 위치
    const mouseY = event.clientY - containerRect.top; // 마우스 커서의 Y 위치

    const zoomSpeed = 0.1;

    const zoomDirection = event.deltaY < 0 ? 1 : -1;

    const previousScale = scale;
    let newScale = scale + zoomSpeed * zoomDirection;

    // 최소, 최대 확대/축소 비율 설정
    newScale = Math.max(0.2, Math.min(newScale, 3));

    const newTranslateX =
      translateX - (mouseX / previousScale - mouseX / newScale);
    const newTranslateY =
      translateY - (mouseY / previousScale - mouseY / newScale);

    console.log("previous", previousScale);
    console.log("translateX", mouseX, translateX);
    console.log("translateY", mouseY, translateY);

    // 상태 업데이트
    setScale(newScale);
    setTranslateX(newTranslateX);
    setTranslateY(newTranslateY);
  };

  // 드래그 시작
  const handleMouseDown = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.preventDefault();
    setIsDragging(true);
    setStartX(event.clientX - translateX);
    setStartY(event.clientY - translateY);
  };

  // 드래그 이동
  const handleMouseMove = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (!isDragging) return;

    // 마우스가 움직일 때 이동값 계산
    const newTranslateX = event.clientX - startX;
    const newTranslateY = event.clientY - startY;

    setTranslateX(newTranslateX);
    setTranslateY(newTranslateY);
  };

  // 드래그 종료
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    setMenuPosition({ x: event.pageX, y: event.pageY });
    setShowMenu(true);
  };

  const handleDragScrollPrevent = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (isDragging) {
      event.preventDefault();
    }
  };

  const handleClick = () => {
    setShowMenu(false);
  };

  return (
    <div
      ref={containerRef}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp} // 마우스가 컨테이너를 벗어나면 드래그 중지
      onMouseOver={handleDragScrollPrevent}
      style={{
        width: "100%",
        height: "100%",
        overflow: "hidden",
        position: "relative",
        backgroundColor: "#262626",
      }}
    >
      <div
        style={{
          transform: `translate(${translateX}px, ${translateY}px) scale(${scale})`,
          transformOrigin: "0 0", // 좌상단을 기준으로 크기와 위치 조정
        }}
      >
        <div
          className={classes.blueprintPlace}
          onContextMenu={handleContextMenu}
          onClick={handleClick}
        >
          {showMenu && <ContextMenu x={menuPosition.x} y={menuPosition.y} />}
          <Circle></Circle>
          <baseBP name="he" param="hee" return="heeee"></baseBP>
        </div>
      </div>
    </div>
  );
};

export default BP;
