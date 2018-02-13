import React from 'react';

import { CenteredText } from './elements';

function Stat({ Icon, count }) {
  return (
    <CenteredText>
      {Icon}
      <span
        style={{
          marginLeft: '0.5em',
          fontWeight: 300,
        }}
      >
        {count.toLocaleString()}
      </span>
    </CenteredText>
  );
}

export default Stat;
