import Margin from '@codesandbox/common/lib/components/spacing/Margin';
import React from 'react';

import { Title, SubTitle } from './elements';

const ThankYou = ({ color, price }) => (
  <Margin bottom={2}>
    <Title color={color}>Awesome!</Title>

    <SubTitle>
      Thank you <strong>so</strong> much for your support of ${price}!
    </SubTitle>
  </Margin>
);

export default ThankYou;
