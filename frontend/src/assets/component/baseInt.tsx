import React, { useState } from "react";

import Circle from "./baseCircle";
// 동그라미에 작대기도 만들기

function Int(name: string, type: any, init: any) {
  const { value, setValue } = useState<number>();

  if (!Number.isInteger(init)) {
    return;
  }

  return (
    <span>
      <Circle />
    </span>
  );
}

export default Int;
