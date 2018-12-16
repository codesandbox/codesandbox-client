import React from 'react';

import { CenteredText, Count } from './elements';

function Stat({ Icon, count }) {
  return (
    <CenteredText>
      {Icon}
      <Count>{count.toLocaleString()}</Count>
    </CenteredText>
  );
}

export default Stat;
