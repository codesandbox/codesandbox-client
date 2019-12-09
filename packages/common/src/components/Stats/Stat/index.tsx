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

function Stat({ Icon, text, textOne, count, vertical }) {
  return (
    <CenteredText text={text} disableCenter={vertical}>
      {Icon}
      <span
        style={{
          marginLeft: '0.5em',
        }}
      >
        {format(count)} {text && (count === 1 ? textOne || text : text)}
      </span>
    </CenteredText>
  );
}

export default Stat;
