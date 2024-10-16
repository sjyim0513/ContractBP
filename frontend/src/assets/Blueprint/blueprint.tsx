import React, { useState, useRef } from "react";

import Circle from "../component/baseCircle";

import baseBP from "../component/baseAsset";

import classes from "./blueprint.module.css";

//function list를 리스트에 추가하고, 마지막에는 create custom function 추가하기 -> 검색할 때는 마지막꺼는 안 되게
const ContextMenu: React.FC<{ x: number; y: number }> = ({ x, y }) => {
  return (
    <div
      id="menu"
      style={{
        position: "fixed",
        left: x,
        top: y,
        backgroundColor: "#515151",
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
        padding: "5px",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          backgroundColor: "#181818",
          color: "#d7d7d7",
        }}
      >
        검색
      </div>
      <div
        style={{
          backgroundColor: "#181818",
          marginTop: "5px",
        }}
      >
        <div
          style={{
            color: "#d7d7d7",
            padding: "2px",
          }}
        >
          함수
        </div>
        <hr
          style={{
            border: "1px solid #d7d7d7",
            margin: "1px 8px 1px 8px", // 쉼표 대신 공백 사용
          }}
        />
        <div
          style={{
            color: "#d7d7d7",
            padding: "2px",
          }}
        >
          함수리스트
        </div>
      </div>
    </div>
  );
};

const BP: React.FC = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // 줌(휠) 핸들러
  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const mouseX = event.clientX - containerRect.left;
    const mouseY = event.clientY - containerRect.top;
    const zoomSpeed = 0.1;
    const zoomDirection = event.deltaY < 0 ? 1 : -1;

    const newScale = Math.max(
      0.4,
      Math.min(scale + zoomSpeed * zoomDirection, 1)
    );
    const scaleRatio = newScale / scale;

    setTranslate({
      x: translate.x - (mouseX / scale - mouseX / newScale),
      y: translate.y - (mouseY / scale - mouseY / newScale),
    });
    setScale(newScale);
  };

  // 마우스 다운 핸들러
  const handleMouseDown = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    setShowMenu(false);
    if (event.button === 2) {
      setStartPos({ x: event.clientX, y: event.clientY });
      setIsDragging(true);
    }
  };

  // 마우스 이동 핸들러 (드래그)
  const handleMouseMove = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (isDragging) {
      setTranslate({
        x: event.clientX - startPos.x,
        y: event.clientY - startPos.y,
      });
    }
  };

  // 마우스 업 핸들러 (우클릭 메뉴 표시)
  const handleMouseUp = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (isDragging) setIsDragging(false);

    if (
      e.button === 2 &&
      startPos.x === e.clientX &&
      startPos.y === e.clientY
    ) {
      setMenuPosition({ x: e.clientX, y: e.clientY });
      setShowMenu(true);
    }
  };

  // 기본 우클릭 메뉴 방지
  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
  };

  return (
    <div
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onContextMenu={handleContextMenu}
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        backgroundColor: "#262626",
        overflow: "hidden",
      }}
    >
      <div
        style={{ backgroundColor: "green", width: "100px", height: "100px" }}
      ></div>
      <div
        ref={containerRef}
        style={{
          transform: `translate(${translate.x}px, ${translate.y}px) scale(${scale})`,
          transformOrigin: "0 0",
        }}
      >
        <div className={classes.blueprintPlace}></div>
      </div>
      <Circle />
      {showMenu && <ContextMenu x={menuPosition.x} y={menuPosition.y} />}
    </div>
  );
};

export default BP;
