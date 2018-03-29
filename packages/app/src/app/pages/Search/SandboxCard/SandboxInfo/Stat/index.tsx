import * as React from 'react';

import { CenteredText } from './elements';

type Props = {
  Icon: React.ComponentClass
  count: number
}

const Stat: React.SFC<Props> = ({ Icon, count }) => {
  return (
    <CenteredText style={{ fontSize: '.875rem' }}>
      <Icon />
      <span
        style={{
          marginLeft: '0.5rem',
          marginRight: '1rem',
          fontWeight: 300,
        }}
      >
        {count.toLocaleString()}
      </span>
    </CenteredText>
  );
}

export default Stat;
