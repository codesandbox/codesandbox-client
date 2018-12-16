import React from 'react';
import theme from 'common/theme';

import { Container, Name, Points, CheckBox, CheckBoxWrapper } from './elements';

/* eslint-disable react/no-array-index-key) */
export default ({ name, points, selected }) => (
  <Container selected={selected}>
    <Name>{name}</Name>
    <Points>
      {points.map((point, i) => (
        <CheckBoxWrapper key={i}>
          <CheckBox
            selected
            color={selected ? theme.shySecondary : theme.background2}
          />
          <div> {point}</div>
        </CheckBoxWrapper>
      ))}
    </Points>
  </Container>
);
