import React, { useEffect, useState, useRef } from 'react';

import "./params.css"

function Params() {
  const [leftWidth, setLeftWidth] = useState(300); // 좌측 패널의 초기 너비
  const resizerRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const startResizing = (event: React.MouseEvent) => {
    document.addEventListener("mousemove", resizePanels);
    document.addEventListener("mouseup", stopResizing);
  };

  const resizePanels = (event: MouseEvent) => {
    if (containerRef.current && resizerRef.current) {
      const containerOffsetLeft = containerRef.current.offsetLeft;
      const newWidth = event.clientX - containerOffsetLeft;
      setLeftWidth(newWidth);
    }
  };

  const stopResizing = () => {
    document.removeEventListener("mousemove", resizePanels);
    document.removeEventListener("mouseup", stopResizing);
  };

  return (
    <div className="container" ref={containerRef}>
      <div className="panel left-panel" style={{ flexBasis: `${leftWidth}px` }} />
      <div
        className="resizer"
        onMouseDown={startResizing}
        ref={resizerRef}
      />
      <div className="panel right-panel" />
    </div>
  );
};

export default Params;