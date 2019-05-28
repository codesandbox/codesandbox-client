import React from 'react';
import theme from '@codesandbox/common/lib/theme';

import { Container, Name, Points, CheckBox } from './elements';

/* eslint-disable react/no-array-index-key) */
export default ({ name, points, selected }) => (
  <Container selected={selected}>
    <Name>{name}</Name>
    <Points>
      {points.map((point, i) => (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginTop: '.25rem',
          }}
          // eslint-disable-next-line
          key={i}
        >
          <CheckBox
            selected
            color={selected ? theme.shySecondary : theme.background2}
          />
          <div> {point}</div>
        </div>
      ))}
    </Points>
  </Container>
);
