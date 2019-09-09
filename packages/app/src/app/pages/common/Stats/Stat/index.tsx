import React from 'react';

import { CenteredText } from './elements';

interface Props {
  Icon: any;
  count: number;
}

export const Stat = ({ Icon, count }: Props) => (
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
