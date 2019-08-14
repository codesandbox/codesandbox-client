import React from 'react';
import { format } from 'date-fns';

import { Info, Tooltip, Circle } from './elements';

const TooltipComponent = ({ show }) => {
  return (
    <Tooltip>
      {show ? (
        <>
          <Info>{format(show.started_at, 'dddd D MMMM')}</Info>
          <Info bold>Down for {Math.floor(show.duration / 60)}m</Info>
        </>
      ) : (
        <Info>
          <Circle />
          100% Online
        </Info>
      )}
    </Tooltip>
  );
};

export default TooltipComponent;
