import React, { useState, useRef } from "react";
import BP from "../Blueprint/blueprint.tsx";
import Code from "../code/code.tsx";
import classes from "./bpMain.module.css";

import Params from "../params/params.tsx";

function BPbase() {
  const [paramswidth, setParamsWidth] = useState(300); // 좌측 패널의 초기 너비
  const [codeWidth, setCodeWidth] = useState(300);
  const resizerRightRef = useRef<HTMLDivElement | null>(null);
  const resizerLeftRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const startParamsResizing = (event: React.MouseEvent) => {
    document.addEventListener("mousemove", resizeParamsPanels);
    document.addEventListener("mouseup", stopresizing);
  };

  const startCodeResizing = (event: React.MouseEvent) => {
    document.addEventListener("mousemove", resizeCodePanels);
    document.addEventListener("mouseup", stopresizing);
  };

  const resizeParamsPanels = (event: MouseEvent) => {
    if (containerRef.current && resizerLeftRef.current) {
      const containerOffsetLeft = containerRef.current.offsetLeft;
      const newWidth = event.clientX - containerOffsetLeft;

      if (newWidth > 150 && newWidth < 500) {
        setParamsWidth(newWidth);
      }
    }
  };

  const resizeCodePanels = (event: MouseEvent) => {
    if (containerRef.current && resizerRightRef.current) {
      const containerOffsetRight =
        containerRef.current.offsetLeft + containerRef.current.offsetWidth;
      const newWidth = containerOffsetRight - event.clientX;

      // 최소 및 최대 너비 설정 (최소 200px, 최대 600px)
      if (newWidth > 200 && newWidth < 500) {
        setCodeWidth(newWidth);
      }
    }
  };

  const stopresizing = () => {
    document.removeEventListener("mousemove", resizeCodePanels);
    document.removeEventListener("mousemove", resizeParamsPanels);
    document.removeEventListener("mouseup", stopresizing);
  };

  return (
    <div
      className={classes.BlueprintContainer}
      ref={containerRef}
      onMouseMove={(e) => e.preventDefault()}
    >
      {/* PARAM */}
      <div className={classes.STATUS} style={{ flexBasis: `${paramswidth}px` }}>
        <Params />
      </div>
      <div
        className={classes.resizer}
        onMouseDown={startParamsResizing}
        ref={resizerRightRef}
      />

      {/* BP */}
      <div className={classes.BP}>
        <BP />
      </div>

      {/* CODE */}
      <div
        className={classes.resizer}
        onMouseDown={startCodeResizing}
        ref={resizerLeftRef}
      />
      <div className={classes.CODE} style={{ flexBasis: `${codeWidth}px` }}>
        <Code />
      </div>
    </div>
  );
}

export default BPbase;
