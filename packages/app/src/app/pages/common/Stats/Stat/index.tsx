import React from 'react';

import { CenteredText } from './elements';

const Stat = ({ Icon, count }: { Icon: any; count: number }) => {
  return (
    <CenteredText>
      {Icon}
      <span
        css={{
          marginLeft: '0.5em',
          fontWeight: 300,
        }}
      >
        {count.toLocaleString()}
      </span>
    </CenteredText>
  );
};

export default Stat;
