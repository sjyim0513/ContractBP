
import React, { useEffect, useState } from 'react';

import Params from '../Params/params.tsx';
import BP from '../Blueprint/blueprint.tsx';
import Code from '../Code/code.tsx';

import classes from '../ssSwap.module.css'



function BPbase() {
    return (
        <div className={classes.BlueprintContainer}>
            <div className={`${classes.BlueprintPlace} ${classes.STATUS}`}>
            <Params/>
            </div>
            <div className={`${classes.BlueprintPlace} ${classes.BP}`}>
            <BP/>
            </div>
            <div className={`${classes.BlueprintPlace} ${classes.CODE}`}>
            <Code/>
            </div>
        </div>
    )
}

export default BPbase;