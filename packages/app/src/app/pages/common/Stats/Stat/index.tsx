import * as React from 'react';

import { CenteredText } from './elements';

export type Props = {
  count: number;
  Icon: React.ReactNode;
};

const Stat: React.SFC<Props> = ({ Icon, count }) => (
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

export default Stat;
