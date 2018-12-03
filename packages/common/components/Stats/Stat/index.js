import React from 'react';

import { CenteredText } from './elements';

function format(count: number): string {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  }

  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k`;
  }

  return `${count}`;
}

function Stat({ Icon, count }) {
  return (
    <CenteredText>
      {Icon}
      <span
        style={{
          marginLeft: '0.5em',
        }}
      >
        {format(count)}
      </span>
    </CenteredText>
  );
}

export default Stat;
