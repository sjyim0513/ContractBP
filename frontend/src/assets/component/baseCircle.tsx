import React from "react";

const Circle = () => {
  const radius = 50;
  const strokeWidth = 15;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * 0.25; // 채워진 부분의 비율 (0.25 = 25%)

  return (
    <svg width="10" height="10" viewBox="0 0 150 150">
      {/* 배경 원 */}
      <circle
        cx="75"
        cy="75"
        r={radius}
        fill="transparent"
        stroke="#ff0000"
        strokeWidth={strokeWidth}
      />
      <div></div>
    </svg>
  );
};

export default Circle;
