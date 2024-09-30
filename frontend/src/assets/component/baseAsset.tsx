import React, { useState } from "react";

import classes from "./baseAsset.css"

function baseBP ({ name, param, return }) {
    const [funname, setFunName] = useState<string>(name) 

    return (
        <div>
            <div>
                name
            </div>
            <span>
                <div> 
                   {/* 매개변수를 담을 수 있는 리스트 생성 / 매개변수 타입에 따른 컴포넌트를 추가  */}
                </div>
                <div>

                </div>
            </span>
        </div>
    ) 
};

export default baseBP;
