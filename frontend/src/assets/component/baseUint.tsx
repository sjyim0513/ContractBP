import React, { useState } from "react";

import Circle from "./baseCircle";
// 동그라미에 작대기도 만들기

function Uint(name: string, init: number) {
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

export default Uint;
